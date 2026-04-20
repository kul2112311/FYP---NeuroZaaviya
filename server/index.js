// ==========================================
// THE SILENT KILLER TRAP
// ==========================================
const originalExit = process.exit;
process.exit = function(code) {
    console.error(`\n🚨🚨🚨 CAUGHT THE GHOST! process.exit(${code}) was called! 🚨🚨🚨`);
    console.trace('Look at the trace below to see EXACTLY which file and line killed the server:');
    originalExit(code);
};
// ==========================================



const express = require('express');
const cors = require('cors');
const pool = require('./db');
const multer = require('multer'); 
// const pdfParse = require('pdf-parse'); 
require('dotenv').config();

// AI Imports
// ENSURE THESE PATHS MATCH YOUR FOLDER STRUCTURE
// If your files are in server/ai/, keep './ai/...'
// If in server/services/ai/, change to './services/ai/...'
const geminiAgent = require('./services/ai/geminiAgent'); 
const contextService = require('./services/ai/contextService'); 

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });
const kulsoom_index = require('./kulsoom_index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
app.use('/api', kulsoom_index);


// --- TRAP SILENT CRASHES ---
process.on('uncaughtException', (err) => {
    console.error('🚨 CRITICAL CRASH (Uncaught Exception):', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 CRITICAL CRASH (Unhandled Rejection):', reason);
});
// ---------------------------
    
// ==========================================
// AUTHENTICATION & APPROVAL ROUTES
// ==========================================

// 1. REGISTER NEW USER (SENDS TO WAITING ROOM)
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role, cgpa, reason } = req.body;
        
        // Check if user already exists in the VIP users table
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "Email is already registered." });
        }

        // Check if they are currently pending
        const reqExists = await pool.query("SELECT * FROM access_requests WHERE email = $1 AND status = 'pending'", [email]);
        if (reqExists.rows.length > 0) {
            return res.status(400).json({ error: "A pending request already exists for this email. Please wait for OAP approval." });
        }

        // 🔥 THE FIX: Delete any old REJECTED requests for this email so they can try again! 🔥
        await pool.query("DELETE FROM access_requests WHERE email = $1 AND status = 'rejected'", [email]);

        // Hash the password safely while they wait
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Put them in the waiting room!
        await pool.query(
            "INSERT INTO access_requests (full_name, email, password, role, cgpa, reason, status) VALUES ($1, $2, $3, $4, $5, $6, 'pending')",
            [name, email, hashedPassword, role, cgpa || null, reason || null]
        );

        res.json({ success: true, message: "Application submitted successfully." });

    } catch (err) {
        console.error("❌ Registration Error:", err.message);
        res.status(500).json({ error: "Server Error during registration" });
    }
});

// 2. FETCH PENDING REQUESTS (FOR OAP & EHSAS)
app.get('/api/requests', async (req, res) => {
    try {
        // Fetch all pending requests. We alias columns to match your frontend expectations
        const result = await pool.query(`
            SELECT id, full_name as name, email, role, cgpa, reason, created_at as "appliedAt", status 
            FROM access_requests 
            ORDER BY created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error("❌ Fetch Requests Error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

// ==========================================
// OAP DIRECTORY ROUTES
// ==========================================

// GET ALL REGISTERED STUDENTS
app.get('/api/oap/all-students', async (req, res) => {
    try {
        const query = `
            SELECT 
                u.id, 
                u.full_name as name, 
                u.email, 
                sp.major
            FROM users u
            JOIN student_profiles sp ON u.id = sp.user_id
            WHERE u.role = 'student'
            ORDER BY u.full_name ASC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error("❌ Error fetching directory students:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
});



// 3. APPROVE A REQUEST
app.post('/api/requests/approve/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Start a transaction so if one step fails, they all fail safely
        await pool.query('BEGIN');

        // Get the user from the waiting room
        const request = await pool.query("SELECT * FROM access_requests WHERE id = $1", [id]);
        if (request.rows.length === 0) throw new Error("Request not found");
        const pendingUser = request.rows[0];

        // 1. Move them to the main VIP users table
        const newUser = await pool.query(
            "INSERT INTO users (id, full_name, email, password, role) VALUES (gen_random_uuid(), $1, $2, $3, $4) RETURNING id",
            [pendingUser.full_name, pendingUser.email, pendingUser.password, pendingUser.role]
        );
        const newUserId = newUser.rows[0].id;

        // 2. Create their specific profile based on their role
        if (pendingUser.role === 'student') {
            // Extracts "al07412" from "al07412@st.habib.edu.pk"
            const habibId = pendingUser.email.split('@')[0]; 

            await pool.query(
                "INSERT INTO student_profiles (id, user_id, student_id) VALUES (gen_random_uuid(), $1, $2)", 
                [newUserId, habibId]
            );
        } else if (pendingUser.role === 'focus-peer') {
            // I'm changing this to student_id as well, assuming your focus_peer_profiles uses the same naming convention!
            await pool.query(
                "INSERT INTO focus_peer_profiles (id, student_id, is_available) VALUES (gen_random_uuid(), $1, true)", 
                [newUserId]
            );
        } else if (['oap', 'wellness-counsellor', 'ehsas-counsellor'].includes(pendingUser.role)) {
            // Staff profiles usually use user_id, but if this throws an error too, we will know it needs changing!
            await pool.query(
                "INSERT INTO staff_profiles (id, user_id, department, role) VALUES (gen_random_uuid(), $1, $2, $3)", 
                [newUserId, pendingUser.role === 'oap' ? 'OAP' : 'Wellness/Ehsas', pendingUser.role]
            );
        }

        // 3. Mark the request as approved
        await pool.query("UPDATE access_requests SET status = 'approved' WHERE id = $1", [id]);

        await pool.query('COMMIT');
        res.json({ success: true, message: "User approved and created!" });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error("❌ Approval Error:", err.message);
        res.status(500).json({ error: "Server Error during approval" });
    }
});

// 4. REJECT A REQUEST
app.post('/api/requests/reject/:id', async (req, res) => {
    try {
        await pool.query("UPDATE access_requests SET status = 'rejected' WHERE id = $1", [req.params.id]);
        res.json({ success: true, message: "User rejected." });
    } catch (err) {
        res.status(500).json({ error: "Server Error during rejection" });
    }
});

// 2. LOGIN USER
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        const user = userResult.rows[0];

        // Compare entered password with the hashed password in DB
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        // Create the JSON Web Token (The digital ID Card)
        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.full_name },
            process.env.JWT_SECRET || "neurozaviya_super_secret_key_2026", 
            { expiresIn: "24h" }
        );

        // Send back the token and the clean user profile
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.full_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error("❌ Login Error:", err.message);
        res.status(500).json({ error: "Server Error during login" });
    }
});



// ==========================================
// AI AGENT ROUTE (Gemini)
// ==========================================
app.post('/api/ai/generate', upload.single('rubricFile'), async (req, res) => {
    try {
        console.log("📨 Received /api/ai/generate request");
        let { userPrompt, userId } = req.body;
        
        // Robust Fallback for Missing or Object User IDs
        if (!userId || userId === 'undefined' || userId === '[object Object]') {
            console.log("⚠️ Invalid userId string. Using Ushna Batool's ID.");
            userId = "a1111111-1111-1111-1111-111111111111"; // Ushna Batool
        } else if (typeof userId === 'object') {
            userId = "a1111111-1111-1111-1111-111111111111";
        }

        let filePart = null;

        // ✅ NO MORE PDF-PARSE! We just package the raw file for Gemini to read natively.
        if (req.file) {
            console.log("📂 File attached:", req.file.originalname, "| Type:", req.file.mimetype);
            filePart = {
                inlineData: {
                    data: req.file.buffer.toString("base64"),
                    mimeType: req.file.mimetype
                }
            };
        }

        console.log(`🤖 Fetching Context for User ID: ${userId}`);
        const { contextString } = await contextService.getStudentContext(userId);
        
        console.log("✨ Calling Google Gemini...");
        const breakdown = await geminiAgent.generateBreakdown(userPrompt, filePart, contextString);

        console.log("\n✅ AI BREAKDOWN GENERATED SUCCESSFULLY");

        res.json({ success: true, data: breakdown });

    } catch (err) {
        console.error("❌ AI Error:", err.message);
        res.status(500).json({ error: "AI Generation Failed", details: err.message });
    }
});




// ==========================================
// ROUTES
// ==========================================

// 1. GET ALL FORUM POSTS (For the Feed)
app.get('/api/community-posts', async (req, res) => {
    try {
        const query = `
            SELECT 
                cp.id, 
                cp.content, 
                cp.tags, 
                cp.is_anonymous, 
                cp.created_at, 
                cp.likes_count, 
                cp.reply_count,
                u.full_name, 
                u.avatar_url
            FROM community_posts cp
            JOIN users u ON cp.author_id = u.id
            ORDER BY cp.created_at DESC
        `;
        
        const result = await pool.query(query);
        
        const safePosts = result.rows.map(post => ({
            ...post,
            full_name: post.is_anonymous ? "Anonymous" : post.full_name,
            avatar_url: post.is_anonymous ? null : post.avatar_url
        }));

        res.json(safePosts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 2. CREATE A NEW POST (For the Modal)
app.post('/api/community-posts', async (req, res) => {
    try {
        const { author_id, content, is_anonymous, tags } = req.body;

        const newPost = await pool.query(
            "INSERT INTO community_posts (author_id, content, is_anonymous, tags) VALUES ($1, $2, $3, $4) RETURNING *",
            [author_id, content, is_anonymous, tags]
        );

        res.json(newPost.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 3. GET ALL FOCUS PEERS (For the Booking Page)
app.get('/api/focus-peers', async (req, res) => {
    try {
        const query = `
            SELECT 
                fpp.id, 
                u.full_name, 
                fpp.major, 
                fpp.rating, 
                fpp.bio, 
                fpp.total_sessions
            FROM focus_peer_profiles fpp
            JOIN users u ON fpp.user_id = u.id
            WHERE fpp.is_available = true
        `;
        
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 4. GET MY SESSIONS (For Session.jsx)
app.get('/api/my-sessions/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const query = `
            SELECT 
                fs.id,
                u.full_name as peer_name,
                fs.scheduled_date,
                fs.start_time,
                fs.status
            FROM focus_sessions fs
            JOIN focus_peer_profiles fpp ON fs.peer_id = fpp.id
            JOIN users u ON fpp.user_id = u.id
            WHERE fs.student_id = (SELECT id FROM student_profiles WHERE user_id = $1)
            ORDER BY fs.scheduled_date DESC
        `;
        
        const result = await pool.query(query, [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 5. GET PEER AVAILABILITY (FIXED: Returns dates without timezone issues)
app.get('/api/peer-availability/:peerId', async (req, res) => {
    try {
        const { peerId } = req.params;
        
        // 1. Get General Availability (e.g. Mon 9am-5pm)
        const availQuery = "SELECT day_of_week, start_time, end_time FROM peer_availability WHERE peer_id = $1";
        const availResult = await pool.query(availQuery, [peerId]);
        
        // 2. Get EXISTING Bookings - Format as plain strings to avoid timezone issues
        const bookingQuery = `
            SELECT 
                TO_CHAR(scheduled_date, 'YYYY-MM-DD') as scheduled_date,
                TO_CHAR(start_time, 'HH24:MI') as start_time
            FROM focus_sessions 
            WHERE peer_id = $1 
            AND status IN ('confirmed', 'pending')
            AND scheduled_date >= CURRENT_DATE
        `;
        const bookingResult = await pool.query(bookingQuery, [peerId]);
        
        console.log('🔍 Booked slots being returned:', bookingResult.rows);
        
        res.json({
            schedule: availResult.rows,
            bookedSlots: bookingResult.rows
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 6. BOOK A SESSION (FIXED: Handles dates correctly)
app.post('/api/book-session', async (req, res) => {
    try {
        const { user_id, peer_id, scheduled_date, start_time, end_time, student_notes } = req.body;

        console.log('📥 Received booking request:', { 
            scheduled_date, 
            start_time, 
            end_time,
            peer_id 
        });

        // STEP 1: Look up the Student Profile ID
        const profileQuery = "SELECT id FROM student_profiles WHERE user_id = $1";
        const profileResult = await pool.query(profileQuery, [user_id]);

        if (profileResult.rows.length === 0) {
            return res.status(404).json({ error: "Student profile not found for this user" });
        }

        const studentProfileId = profileResult.rows[0].id;

        // STEP 2: Check for conflicts using string comparison
        const conflictQuery = `
            SELECT id FROM focus_sessions 
            WHERE peer_id = $1 
            AND TO_CHAR(scheduled_date, 'YYYY-MM-DD') = $2
            AND TO_CHAR(start_time, 'HH24:MI') = $3
            AND status IN ('confirmed', 'pending')
        `;
        const conflictResult = await pool.query(conflictQuery, [peer_id, scheduled_date, start_time]);
        
        if (conflictResult.rows.length > 0) {
            console.log('⚠️ Booking conflict detected!');
            return res.status(409).json({ error: "This time slot is already booked" });
        }

        // STEP 3: Insert booking - Use TO_DATE to avoid timezone conversion
        const insertQuery = `
            INSERT INTO focus_sessions 
            (student_id, peer_id, scheduled_date, start_time, end_time, status, student_notes)
            VALUES ($1, $2, TO_DATE($3, 'YYYY-MM-DD'), $4::time, $5::time, 'confirmed', $6)
            RETURNING 
                id,
                student_id,
                peer_id,
                TO_CHAR(scheduled_date, 'YYYY-MM-DD') as scheduled_date,
                TO_CHAR(start_time, 'HH24:MI') as start_time,
                TO_CHAR(end_time, 'HH24:MI') as end_time,
                status,
                student_notes,
                created_at,
                updated_at
        `;

        const values = [studentProfileId, peer_id, scheduled_date, start_time, end_time, student_notes];
        const newSession = await pool.query(insertQuery, values);
        
        console.log("✅ Booking Created:", newSession.rows[0]); 
        res.json(newSession.rows[0]);

    } catch (err) {
        console.error("❌ Booking Error:", err.message);
        res.status(500).json({ error: "Server Error: " + err.message });
    }
});

// ==========================================
// FOCUS PEER SCHEDULE MANAGEMENT
// ==========================================

// 7. GET PEER'S OWN SCHEDULE (For Schedule Management Page)
app.get('/api/peer-schedule/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // FIXED: Relaxed regex to accept dummy seed data UUIDs (like b111...)
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!regex.test(userId)) return res.json([]);
        
        // Get peer profile ID from user ID
        const peerQuery = "SELECT id FROM focus_peer_profiles WHERE user_id = $1";
        const peerResult = await pool.query(peerQuery, [userId]);
        
        if (peerResult.rows.length === 0) {
            return res.status(404).json({ error: "Focus peer profile not found" });
        }
        
        const peerId = peerResult.rows[0].id;
        
        // Get all availability slots (FIXED: Removed is_active)
        const scheduleQuery = `
            SELECT 
                id,
                day_of_week,
                TO_CHAR(start_time, 'HH24:MI') as start_time,
                TO_CHAR(end_time, 'HH24:MI') as end_time
            FROM peer_availability 
            WHERE peer_id = $1
            ORDER BY day_of_week, start_time
        `;
        
        const scheduleResult = await pool.query(scheduleQuery, [peerId]);
        
        console.log('📅 Retrieved schedule for peer:', scheduleResult.rows);
        
        res.json(scheduleResult.rows);
    } catch (err) {
        console.error("Error fetching peer schedule:", err.message);
        res.status(500).send("Server Error");
    }
});

// 8. ADD AVAILABILITY SLOT
app.post('/api/peer-schedule', async (req, res) => {
    try {
        const { user_id, day_of_week, start_time, end_time } = req.body;
        
        console.log('📥 Adding availability slot:', { day_of_week, start_time, end_time });
        
        // Get peer profile ID
        const peerQuery = "SELECT id FROM focus_peer_profiles WHERE user_id = $1";
        const peerResult = await pool.query(peerQuery, [user_id]);
        
        if (peerResult.rows.length === 0) {
            return res.status(404).json({ error: "Focus peer profile not found" });
        }
        
        const peerId = peerResult.rows[0].id;
        
        // Check for overlapping slots (FIXED: Removed is_active)
        const overlapQuery = `
            SELECT id FROM peer_availability 
            WHERE peer_id = $1 
            AND day_of_week = $2
            AND (
                (start_time, end_time) OVERLAPS ($3::time, $4::time)
            )
        `;
        
        const overlapResult = await pool.query(overlapQuery, [peerId, day_of_week, start_time, end_time]);
        
        if (overlapResult.rows.length > 0) {
            return res.status(409).json({ error: "This time slot overlaps with existing availability" });
        }
        
        // Insert new slot (FIXED: Removed is_active)
        const insertQuery = `
            INSERT INTO peer_availability (peer_id, day_of_week, start_time, end_time)
            VALUES ($1, $2, $3::time, $4::time)
            RETURNING 
                id,
                day_of_week,
                TO_CHAR(start_time, 'HH24:MI') as start_time,
                TO_CHAR(end_time, 'HH24:MI') as end_time
        `;
        
        const result = await pool.query(insertQuery, [peerId, day_of_week, start_time, end_time]);
        
        console.log('✅ Availability slot added:', result.rows[0]);
        res.json(result.rows[0]);
        
    } catch (err) {
        console.error("❌ Error adding availability:", err.message);
        res.status(500).json({ error: "Server Error: " + err.message });
    }
});

// 9. DELETE AVAILABILITY SLOT (With booking conflict check)
app.delete('/api/peer-schedule/:availabilityId', async (req, res) => {
    try {
        const { availabilityId } = req.params;
        
        console.log('🗑️ Attempting to delete availability slot:', availabilityId);
        
        // First, get the slot details
        const slotQuery = `
            SELECT peer_id, day_of_week, start_time, end_time 
            FROM peer_availability 
            WHERE id = $1
        `;
        const slotResult = await pool.query(slotQuery, [availabilityId]);
        
        if (slotResult.rows.length === 0) {
            return res.status(404).json({ error: "Availability slot not found" });
        }
        
        const slot = slotResult.rows[0];
        
        // Check if any future bookings exist for this time slot
        // We need to check all future dates that fall on this day_of_week
        const bookingCheckQuery = `
            SELECT COUNT(*) as booking_count
            FROM focus_sessions
            WHERE peer_id = $1
            AND EXTRACT(DOW FROM scheduled_date) = $2
            AND start_time = $3
            AND scheduled_date >= CURRENT_DATE
            AND status IN ('confirmed', 'pending')
        `;
        
        const bookingCheck = await pool.query(bookingCheckQuery, [
            slot.peer_id, 
            slot.day_of_week, 
            slot.start_time
        ]);
        
        const bookingCount = parseInt(bookingCheck.rows[0].booking_count);
        
        if (bookingCount > 0) {
            console.log(`⚠️ Cannot delete: ${bookingCount} future booking(s) exist`);
            return res.status(409).json({ 
                error: `Cannot delete this slot. ${bookingCount} student(s) have booked sessions during this time.` 
            });
        }
        
        // Safe to delete
        const deleteQuery = "DELETE FROM peer_availability WHERE id = $1 RETURNING id";
        const deleteResult = await pool.query(deleteQuery, [availabilityId]);
        
        console.log('✅ Availability slot deleted successfully');
        res.json({ success: true, id: availabilityId });
        
    } catch (err) {
        console.error("❌ Error deleting availability:", err.message);
        res.status(500).json({ error: "Server Error: " + err.message });
    }
});

// 10. GET PEER'S BOOKED SESSIONS (For Peer's Session View)
app.get('/api/peer-sessions/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Get peer profile ID
        const peerQuery = "SELECT id FROM focus_peer_profiles WHERE user_id = $1";
        const peerResult = await pool.query(peerQuery, [userId]);
        
        if (peerResult.rows.length === 0) {
            return res.status(404).json({ error: "Focus peer profile not found" });
        }
        
        const peerId = peerResult.rows[0].id;
        
        // Get all sessions booked with this peer
        const sessionsQuery = `
            SELECT 
                fs.id,
                u.full_name as student_name,
                TO_CHAR(fs.scheduled_date, 'YYYY-MM-DD') as scheduled_date,
                TO_CHAR(fs.start_time, 'HH24:MI') as start_time,
                fs.status,
                fs.student_notes
            FROM focus_sessions fs
            JOIN student_profiles sp ON fs.student_id = sp.id
            JOIN users u ON sp.user_id = u.id
            WHERE fs.peer_id = $1
            ORDER BY fs.scheduled_date DESC, fs.start_time DESC
        `;
        
        const result = await pool.query(sessionsQuery, [peerId]);
        
        console.log('📋 Retrieved sessions for peer:', result.rows.length);
        res.json(result.rows);
        
    } catch (err) {
        console.error("Error fetching peer sessions:", err.message);
        res.status(500).send("Server Error");
    }
});
// 10b. UPDATE SESSION STATUS (Mark as Complete)
app.patch('/api/sessions/:sessionId/status', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { status } = req.body;
        
        const updateQuery = `
            UPDATE focus_sessions 
            SET status = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2 
            RETURNING id, status
        `;
        const result = await pool.query(updateQuery, [status, sessionId]);
        
        if (result.rows.length === 0) return res.status(404).json({ error: "Session not found" });
        
        res.json({ success: true, session: result.rows[0] });
    } catch (err) {
        console.error("❌ Error updating session status:", err.message);
        res.status(500).json({ error: "Server Error: " + err.message });
    }
});


// ==========================================
// OAP / STAFF APPOINTMENTS
// ==========================================

// 1. GET ALL SUPPORT STAFF (For Student "Support" Tab)
app.get('/api/support-staff', async (req, res) => {
    try {
        const query = `
            SELECT 
                sp.id as staff_id, 
                u.full_name as name, 
                u.email, 
                sp.department, 
                sp.role
            FROM staff_profiles sp
            JOIN users u ON sp.user_id = u.id
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error("❌ Error fetching staff:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

// 2. CREATE A NEW APPOINTMENT REQUEST (Student -> Staff)
app.post('/api/appointments', async (req, res) => {
    try {
        const { userId, staffId, subject, description, slot } = req.body;

        // Extract the real student_profile id
        const profileQuery = "SELECT id FROM student_profiles WHERE user_id = $1";
        const profileResult = await pool.query(profileQuery, [userId]);

        if (profileResult.rows.length === 0) {
            return res.status(404).json({ error: "Student profile not found" });
        }
        const studentId = profileResult.rows[0].id;

        // Insert into the new appointments table
        const insertQuery = `
            INSERT INTO appointments (student_id, staff_id, subject, description, preferred_slot, status)
            VALUES ($1, $2, $3, $4, $5, 'pending')
            RETURNING id
        `;
        const result = await pool.query(insertQuery, [studentId, staffId, subject, description, slot]);

        res.json({ success: true, appointmentId: result.rows[0].id });
    } catch (err) {
        console.error("❌ Error creating appointment:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

// 3. GET APPOINTMENTS FOR SPECIFIC STAFF MEMBER (For OAP Scheduling Tab)
app.get('/api/appointments/staff/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Extract the real staff_profile id
        const staffQuery = "SELECT id FROM staff_profiles WHERE user_id = $1";
        const staffResult = await pool.query(staffQuery, [userId]);

        if (staffResult.rows.length === 0) return res.json([]);
        const staffId = staffResult.rows[0].id;

        // Fetch requests and join with users table to get the student's real name
        const aptQuery = `
            SELECT 
                a.id, 
                a.subject, 
                a.description, 
                a.preferred_slot, 
                a.status, 
                a.created_at,
                u.full_name as student_name
            FROM appointments a
            JOIN student_profiles sp ON a.student_id = sp.id
            JOIN users u ON sp.user_id = u.id
            WHERE a.staff_id = $1
            ORDER BY a.created_at ASC
        `;
        const result = await pool.query(aptQuery, [staffId]);
        res.json(result.rows);
    } catch (err) {
        console.error("❌ Error fetching appointments:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

// 4. UPDATE APPOINTMENT STATUS (Approve/Decline)
app.patch('/api/appointments/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'confirmed' or 'declined'

        await pool.query("UPDATE appointments SET status = $1 WHERE id = $2", [status, id]);
        res.json({ success: true });
    } catch (err) {
        console.error("❌ Error updating appointment:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
});


// ==========================================
// FEEDBACK SYSTEM
// ==========================================

// 11. GET PENDING FEEDBACK SESSIONS (Completed sessions without feedback)
app.get('/api/pending-feedback/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Get peer profile ID
        const peerQuery = "SELECT id FROM focus_peer_profiles WHERE user_id = $1";
        const peerResult = await pool.query(peerQuery, [userId]);
        
        if (peerResult.rows.length === 0) {
            return res.status(404).json({ error: "Focus peer profile not found" });
        }
        
        const peerId = peerResult.rows[0].id;
        
        // Get completed sessions without feedback
        const pendingQuery = `
            SELECT 
                fs.id,
                u.full_name as student_name,
                sp.major,
                TO_CHAR(fs.scheduled_date, 'YYYY-MM-DD') as scheduled_date,
                TO_CHAR(fs.start_time, 'HH24:MI') as start_time,
                TO_CHAR(fs.end_time, 'HH24:MI') as end_time
            FROM focus_sessions fs
            JOIN student_profiles sp ON fs.student_id = sp.id
            JOIN users u ON sp.user_id = u.id
            LEFT JOIN session_feedback sf ON fs.id = sf.session_id
            WHERE fs.peer_id = $1
            AND fs.status = 'completed'
            AND sf.id IS NULL
            ORDER BY fs.scheduled_date DESC, fs.start_time DESC
        `;
        
        const result = await pool.query(pendingQuery, [peerId]);
        
        console.log('⏳ Pending feedback sessions:', result.rows.length);
        res.json(result.rows);
        
    } catch (err) {
        console.error("Error fetching pending feedback:", err.message);
        res.status(500).send("Server Error");
    }
});

// 12. GET ALL AVAILABLE BADGES
app.get('/api/badges', async (req, res) => {
    try {
        const query = `
            SELECT id, name, description, icon, color, is_special
            FROM badge_definitions
            ORDER BY name
        `;
        
        const result = await pool.query(query);
        res.json(result.rows);
        
    } catch (err) {
        console.error("Error fetching badges:", err.message);
        res.status(500).send("Server Error");
    }
});

// 13. SUBMIT SESSION FEEDBACK
app.post('/api/session-feedback', async (req, res) => {
    try {
        const { 
            session_id, 
            feedback_text, 
            badge_ids = [],
            raise_alert = false,
            alert_description = ''
        } = req.body;
        
        console.log('📝 Submitting feedback for session:', session_id);
        
        // Start a transaction
        await pool.query('BEGIN');
        
        try {
            // 1. Get session details to find student
            const sessionQuery = `
                SELECT student_id, peer_id, scheduled_date, start_time
                FROM focus_sessions 
                WHERE id = $1
            `;
            const sessionResult = await pool.query(sessionQuery, [session_id]);
            
            if (sessionResult.rows.length === 0) {
                await pool.query('ROLLBACK');
                return res.status(404).json({ error: "Session not found" });
            }
            
            const session = sessionResult.rows[0];
            const studentId = session.student_id;
            
            // Get student's user_id for badge awarding
            const studentUserQuery = "SELECT user_id FROM student_profiles WHERE id = $1";
            const studentUserResult = await pool.query(studentUserQuery, [studentId]);
            const studentUserId = studentUserResult.rows[0].user_id;
            
            // Get peer's user_id for badge awarding
            const peerUserQuery = "SELECT user_id FROM focus_peer_profiles WHERE id = $1";
            const peerUserResult = await pool.query(peerUserQuery, [session.peer_id]);
            const peerUserId = peerUserResult.rows[0].user_id;
            
            // 2. Insert feedback
            const feedbackQuery = `
                INSERT INTO session_feedback 
                (session_id, rating, feedback_text, badges_awarded)
                VALUES ($1, 5, $2, $3)
                RETURNING id
            `;
            
            const badgeUUIDs = badge_ids.length > 0 ? `{${badge_ids.join(',')}}` : '{}';
            const feedbackResult = await pool.query(feedbackQuery, [
                session_id,
                feedback_text,
                badgeUUIDs
            ]);
            
            // 3. Award badges to student
            if (badge_ids.length > 0) {
                for (const badgeId of badge_ids) {
                    await pool.query(`
                        INSERT INTO user_badges 
                        (user_id, badge_id, awarded_by, feedback_text)
                        VALUES ($1, $2, $3, $4)
                        ON CONFLICT (user_id, badge_id) DO NOTHING
                    `, [studentUserId, badgeId, peerUserId, feedback_text]);
                }
                
                // Update student XP (10 points per badge)
                const xpBonus = badge_ids.length * 10;
                await pool.query(`
                    UPDATE student_profiles
                    SET experience_points = experience_points + $1
                    WHERE id = $2
                `, [xpBonus, studentId]);
            }
            
            // 4. If alert raised, create notification for OAP/Wellness
            if (raise_alert && alert_description) {
                // Get OAP advisor and wellness counselor for this student
                const advisorQuery = `
                    SELECT oap_advisor_id, wellness_counsellor_id
                    FROM student_profiles
                    WHERE id = $1
                `;
                const advisorResult = await pool.query(advisorQuery, [studentId]);
                
                if (advisorResult.rows.length > 0) {
                    const { oap_advisor_id, wellness_counsellor_id } = advisorResult.rows[0];
                    
                    // Notify OAP Advisor
                    if (oap_advisor_id) {
                        await pool.query(`
                            INSERT INTO notifications 
                            (user_id, title, message, notification_type, related_entity_type, related_entity_id)
                            VALUES ($1, $2, $3, 'alert', 'focus_session', $4)
                        `, [
                            oap_advisor_id,
                            'Student Alert from FocusPeer',
                            alert_description,
                            session_id
                        ]);
                    }
                    
                    // Notify Wellness Counselor
                    if (wellness_counsellor_id) {
                        await pool.query(`
                            INSERT INTO notifications 
                            (user_id, title, message, notification_type, related_entity_type, related_entity_id)
                            VALUES ($1, $2, $3, 'alert', 'focus_session', $4)
                        `, [
                            wellness_counsellor_id,
                            'Student Alert from FocusPeer',
                            alert_description,
                            session_id
                        ]);
                    }
                }
            }
            
            // 5. Mark session as having feedback (optional: update status)
            await pool.query(`
                UPDATE focus_sessions
                SET session_notes = $1
                WHERE id = $2
            `, ['Feedback provided', session_id]);
            
            // Commit transaction
            await pool.query('COMMIT');
            
            console.log('✅ Feedback submitted successfully');
            res.json({ 
                success: true, 
                feedback_id: feedbackResult.rows[0].id,
                badges_awarded: badge_ids.length
            });
            
        } catch (err) {
            await pool.query('ROLLBACK');
            throw err;
        }
        
    } catch (err) {
        console.error("❌ Error submitting feedback:", err.message);
        res.status(500).json({ error: "Server Error: " + err.message });
    }
});

// 14. GET STUDENT'S FEEDBACK HISTORY
app.get('/api/student-feedback/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Get student profile ID
        const studentQuery = "SELECT id FROM student_profiles WHERE user_id = $1";
        const studentResult = await pool.query(studentQuery, [userId]);
        
        if (studentResult.rows.length === 0) {
            return res.status(404).json({ error: "Student profile not found" });
        }
        
        const studentId = studentResult.rows[0].id;
        
        // Get all feedback with peer info and badges
        const feedbackQuery = `
            SELECT 
                sf.id,
                sf.feedback_text,
                sf.badges_awarded,
                sf.rating,
                sf.created_at,
                TO_CHAR(fs.scheduled_date, 'YYYY-MM-DD') as session_date,
                u.full_name as peer_name
            FROM session_feedback sf
            JOIN focus_sessions fs ON sf.session_id = fs.id
            JOIN focus_peer_profiles fpp ON fs.peer_id = fpp.id
            JOIN users u ON fpp.user_id = u.id
            WHERE fs.student_id = $1
            ORDER BY sf.created_at DESC
        `;
        
        const result = await pool.query(feedbackQuery, [studentId]);
        
        // For each feedback, get the badge names
        const feedbackWithBadges = await Promise.all(
            result.rows.map(async (feedback) => {
                if (feedback.badges_awarded && feedback.badges_awarded.length > 0) {
                    const badgeQuery = `
                        SELECT name, icon
                        FROM badge_definitions
                        WHERE id = ANY($1)
                    `;
                    const badgeResult = await pool.query(badgeQuery, [feedback.badges_awarded]);
                    feedback.badge_details = badgeResult.rows;
                } else {
                    feedback.badge_details = [];
                }
                return feedback;
            })
        );
        
        console.log('📋 Retrieved feedback for student:', feedbackWithBadges.length);
        res.json(feedbackWithBadges);
        
    } catch (err) {
        console.error("Error fetching student feedback:", err.message);
        res.status(500).send("Server Error");
    }
});

// 15. GET WEEKLY PROGRESS (Last 7 days)
app.get('/api/weekly-progress/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        
        const progressQuery = `
            SELECT 
                date,
                progress_percentage,
                tasks_completed,
                tasks_total,
                study_time_minutes
            FROM daily_progress
            WHERE student_id = $1
            AND date >= CURRENT_DATE - INTERVAL '6 days'
            AND date <= CURRENT_DATE
            ORDER BY date ASC
        `;
        
        const result = await pool.query(progressQuery, [studentId]);
        
        const tasksQuery = `
            SELECT 
                id,
                title,
                status,
                quadrant,
                due_date
            FROM tasks
            WHERE student_id = $1
            AND due_date >= CURRENT_DATE - INTERVAL '6 days'
            AND due_date <= CURRENT_DATE + INTERVAL '1 day'
            ORDER BY due_date DESC
        `;
        
        const tasksResult = await pool.query(tasksQuery, [studentId]);
        
        res.json({
            dailyProgress: result.rows,
            tasks: tasksResult.rows
        });
        
    } catch (err) {
        console.error("Error fetching weekly progress:", err.message);
        res.status(500).send("Server Error");
    }
});

// ==========================================
// FOCUS PEER CHECK-INS
// ==========================================

// 1. CREATE A CHECK-IN
app.post('/api/checkups', async (req, res) => {
    try {
        const { title, description, scheduled_datetime, studentId, studentName, peerUserId } = req.body;
        console.log('📝 Creating check-in for student:', studentName);

        // FIXED: Translate the incoming user_id into the actual student_profile id!
        const studentProfileQuery = "SELECT id FROM student_profiles WHERE user_id = $1";
        const studentProfileResult = await pool.query(studentProfileQuery, [studentId]);
        
        if (studentProfileResult.rows.length === 0) {
            return res.status(404).json({ error: "Student profile not found" });
        }
        const realStudentProfileId = studentProfileResult.rows[0].id;

        const peerQuery = `
            SELECT fpp.id as peer_id, u.full_name as peer_name 
            FROM focus_peer_profiles fpp JOIN users u ON fpp.user_id = u.id WHERE fpp.user_id = $1
        `;
        const peerResult = await pool.query(peerQuery, [peerUserId]);
        if (peerResult.rows.length === 0) return res.status(404).json({ error: "Focus peer profile not found" });
        
        const { peer_id, peer_name } = peerResult.rows[0];

        // Insert using the translated realStudentProfileId
        const insertQuery = `
            INSERT INTO checkups (student_id, student_name, peer_id, peer_name, title, description, scheduled_datetime)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
        `;
        const checkupResult = await pool.query(insertQuery, [realStudentProfileId, studentName, peer_id, peer_name, title, description, scheduled_datetime]);

        // Trigger notification (Notifications table uses user_id, so we use the original studentId here)
        await pool.query(`
            INSERT INTO notifications (user_id, title, message, notification_type, related_entity_type, related_entity_id)
            VALUES ($1, $2, $3, 'event', 'checkup', $4)
        `, [studentId, `New Check-in Scheduled`, `${peer_name} has scheduled a check-in with you: ${title}`, checkupResult.rows[0].id]);

        console.log('✅ Check-in created successfully!');
        res.json({ success: true, checkupId: checkupResult.rows[0].id });
    } catch (err) {
        console.error("❌ Error creating check-in:", err.message);
        res.status(500).json({ error: "Server Error: " + err.message });
    }
});

// 2. GET ALL CHECK-INS FOR PEER DASHBOARD
app.get('/api/checkups/peer/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const peerResult = await pool.query("SELECT id FROM focus_peer_profiles WHERE user_id = $1", [userId]);
        if (peerResult.rows.length === 0) return res.json([]);
        
        const peerId = peerResult.rows[0].id;
        const checkupsQuery = `
            SELECT id, title, description, scheduled_datetime as date, student_name as "studentName", status
            FROM checkups WHERE peer_id = $1 AND scheduled_datetime >= CURRENT_DATE ORDER BY scheduled_datetime ASC
        `;
        const result = await pool.query(checkupsQuery, [peerId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// 3. GET SPECIFIC CHECK-INS FOR STUDENT DETAIL PAGE
app.get('/api/checkups/peer/:userId/student/:studentId', async (req, res) => {
    try {
        const { userId, studentId } = req.params;
        const peerResult = await pool.query("SELECT id FROM focus_peer_profiles WHERE user_id = $1", [userId]);
        if (peerResult.rows.length === 0) return res.json([]);
        
        const peerId = peerResult.rows[0].id;
        const checkupsQuery = `
            SELECT id, title, description, scheduled_datetime as date, student_name as "studentName", status
            FROM checkups WHERE peer_id = $1 AND student_id = $2 AND scheduled_datetime >= CURRENT_DATE ORDER BY scheduled_datetime ASC
        `;
        const result = await pool.query(checkupsQuery, [peerId, studentId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// 4. GET CHECK-INS FOR STUDENT DASHBOARD
app.get('/api/checkups/student/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const studentResult = await pool.query("SELECT id FROM student_profiles WHERE user_id = $1", [userId]);
        if (studentResult.rows.length === 0) return res.json([]);
        
        const studentId = studentResult.rows[0].id;
        const checkupsQuery = `
            SELECT id, title, description, scheduled_datetime as date, peer_name as "peerName", status
            FROM checkups WHERE student_id = $1 AND scheduled_datetime >= CURRENT_DATE ORDER BY scheduled_datetime ASC
        `;
        const result = await pool.query(checkupsQuery, [studentId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

// ==========================================
// TASKS & AI BREAKDOWN SAVING
// ==========================================

app.post('/api/tasks/ai-breakdown', async (req, res) => {
    try {
        const { studentId, title, description, dueDate, quadrant, subtasks } = req.body;
        console.log(`📥 Saving AI Task Breakdown for user: ${studentId}`);

        // 1. Get the actual student_profile ID using the user_id (Ushna's ID)
        const profileQuery = "SELECT id FROM student_profiles WHERE user_id = $1";
        const profileResult = await pool.query(profileQuery, [studentId]);
        
        if (profileResult.rows.length === 0) {
            return res.status(404).json({ error: "Student profile not found" });
        }
        const realStudentId = profileResult.rows[0].id;

        // Start a database transaction
        await pool.query('BEGIN');

        // 2. Insert the Parent Task into the `tasks` table
        const taskInsertQuery = `
            INSERT INTO tasks 
            (student_id, title, description, due_date, quadrant, status, category, is_ai_generated, ai_input_prompt)
            VALUES ($1, $2, $3, $4, $5, 'pending', 'assignment', true, $6)
            RETURNING id
        `;
        const taskValues = [realStudentId, title, "Generated via AI Agent", dueDate, quadrant, description];
        const taskResult = await pool.query(taskInsertQuery, taskValues);
        const newTaskId = taskResult.rows[0].id;

        // 3. Insert all Subtasks into the `subtasks` table
        if (subtasks && subtasks.length > 0) {
            for (let i = 0; i < subtasks.length; i++) {
                const st = subtasks[i];
                const subtaskInsertQuery = `
                    INSERT INTO subtasks 
                    (task_id, title, description, ai_detail, estimated_time_minutes, step_number, is_completed, scheduled_date, scheduled_start_time)
                    VALUES ($1, $2, $3, $4, $5, $6, false, $7, $8)
                `;
                
                // Format time for Postgres (e.g., "14:00" -> "14:00:00")
                const formattedTime = st.scheduled_start_time ? `${st.scheduled_start_time}:00` : null;

                const subtaskValues = [
                    newTaskId, 
                    st.title, 
                    st.description, 
                    st.description, // using description as ai_detail fallback
                    st.estimated_time_minutes, 
                    i + 1, 
                    st.scheduled_date || null, 
                    formattedTime
                ];
                await pool.query(subtaskInsertQuery, subtaskValues);
            }
        }

        // Commit transaction to save permanently
        await pool.query('COMMIT');
        console.log(`✅ Task ${newTaskId} and ${subtasks.length} subtasks saved successfully!`);
        
        res.json({ success: true, taskId: newTaskId });

    } catch (err) {
        // If anything breaks, undo the database inserts
        await pool.query('ROLLBACK');
        console.error("❌ Error saving AI breakdown:", err.message);
        res.status(500).json({ error: "Server Error: " + err.message });
    }
});


// ==========================================
// GET UPCOMING TASKS (For Dashboard & Calendar)
// ==========================================
app.get('/api/tasks/upcoming/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // 1. Get student profile ID
        const profileQuery = "SELECT id FROM student_profiles WHERE user_id = $1";
        const profileResult = await pool.query(profileQuery, [userId]);
        
        if (profileResult.rows.length === 0) {
            return res.json([]);
        }
        const studentId = profileResult.rows[0].id;

        // 2. Fetch tasks and dynamically calculate progress % from subtasks!
        const tasksQuery = `
            SELECT 
                t.id, 
                t.title, 
                TO_CHAR(t.due_date, 'YYYY-MM-DD') as "dueDate", 
                t.status,
                CASE 
                    WHEN t.quadrant = 'do-now' THEN 'High Priority'
                    WHEN t.quadrant = 'schedule' THEN 'Medium Priority'
                    WHEN t.quadrant = 'delegate' THEN 'Medium Priority'
                    ELSE 'Low Priority'
                END as priority,
                COALESCE(
                    ROUND(
                        (SELECT COUNT(*) FROM subtasks WHERE task_id = t.id AND is_completed = true)::numeric / 
                        NULLIF((SELECT COUNT(*) FROM subtasks WHERE task_id = t.id), 0) * 100
                    ), 0
                ) as progress
            FROM tasks t
            -- 🔥 FIX: Changed to capital 'Completed' to match the new DB logic!
            WHERE t.student_id = $1 AND t.status != 'Completed'
            ORDER BY t.due_date ASC
        `;
        
        const result = await pool.query(tasksQuery, [studentId]);
        
        // Ensure progress is a number
        const mapped = result.rows.map(r => ({...r, progress: Number(r.progress)}));
        res.json(mapped);

    } catch (err) {
        console.error("❌ Error fetching upcoming tasks:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
});


// ==========================================
// GET CALENDAR EVENTS (Tasks & Subtasks)
// ==========================================
app.get('/api/calendar/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const profileResult = await pool.query("SELECT id FROM student_profiles WHERE user_id = $1", [userId]);
        
        if (profileResult.rows.length === 0) return res.json([]);
        const studentId = profileResult.rows[0].id;

        // 1. Fetch Parent Tasks (For the "Upcoming" strip and "All Day" slots)
        const tasksQuery = `
            SELECT 
                t.id::text, 
                t.title, 
                t.description as notes,
                TO_CHAR(t.due_date, 'YYYY-MM-DD') as "dueDate", 
                null as time,
                null as duration,
                t.status,
                CASE 
                    WHEN t.quadrant = 'do_now' THEN 'High Priority'
                    WHEN t.quadrant = 'schedule' THEN 'Medium Priority'
                    WHEN t.quadrant = 'delegate' THEN 'Medium Priority'
                    ELSE 'Low Priority'
                END as priority,
                COALESCE(ROUND((SELECT COUNT(*) FROM subtasks WHERE task_id = t.id AND is_completed = true)::numeric / NULLIF((SELECT COUNT(*) FROM subtasks WHERE task_id = t.id), 0) * 100), 0) as progress
            FROM tasks t
            WHERE t.student_id = $1 AND t.status != 'completed'
        `;
        const tasksResult = await pool.query(tasksQuery, [studentId]);

        // 2. Fetch Scheduled Subtasks (For the specific hourly calendar slots)
        const subtasksQuery = `
            SELECT 
                'sub-' || s.id as id,
                s.title,
                s.description as notes,
                TO_CHAR(s.scheduled_date, 'YYYY-MM-DD') as "dueDate",
                TO_CHAR(s.scheduled_start_time, 'HH24:MI') as time,
                s.estimated_time_minutes || 'min' as duration,
                CASE WHEN s.is_completed THEN 'Completed' ELSE 'In Progress' END as status,
                'Medium Priority' as priority,
                CASE WHEN s.is_completed THEN 100 ELSE 0 END as progress
            FROM subtasks s
            JOIN tasks t ON s.task_id = t.id
            WHERE t.student_id = $1 AND s.scheduled_date IS NOT NULL
        `;
        const subtasksResult = await pool.query(subtasksQuery, [studentId]);

        // Combine both into one array for the frontend
        const allEvents = [...tasksResult.rows, ...subtasksResult.rows];
        
        // Ensure progress is a clean number
        const mapped = allEvents.map(r => ({...r, progress: Number(r.progress)}));
        res.json(mapped);

    } catch (err) {
        console.error("❌ Error fetching calendar:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

// ==========================================
// GET DEEP WORK SESSION DATA
// ==========================================
app.get('/api/session/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let taskId = id;

        // If clicked from a subtask slot (e.g., "sub-12"), extract the parent task ID
        if (id.startsWith('sub-')) {
            const subId = id.replace('sub-', '');
            const subRes = await pool.query("SELECT task_id FROM subtasks WHERE id = $1", [subId]);
            if (subRes.rows.length === 0) return res.status(404).json({ error: "Subtask not found" });
            taskId = subRes.rows[0].task_id;
        }

        // 1. Get Parent Task
        const taskQuery = `
            SELECT 
                id, title, description as notes, 
                LEFT(due_date::text, 10) as "dueDate", 
                CASE 
                    WHEN quadrant = 'do_now' THEN 'High Priority'
                    WHEN quadrant = 'schedule' THEN 'Medium Priority'
                    WHEN quadrant = 'delegate' THEN 'Medium Priority'
                    ELSE 'Low Priority'
                END as priority
            FROM tasks WHERE id = $1
        `;
        const taskRes = await pool.query(taskQuery, [taskId]);
        if (taskRes.rows.length === 0) return res.status(404).json({ error: "Task not found" });
        const parentTask = taskRes.rows[0];

        // 2. Get All Subtasks for this Parent
        const subQuery = `
            SELECT 
                id, title, description as notes, 
                estimated_time_minutes || 'min' as duration,
                LEFT(scheduled_date::text, 10) as "dueDate",
                CASE WHEN is_completed THEN 100 ELSE 0 END as progress,
                is_completed as "isCompleted"
            FROM subtasks WHERE task_id = $1 ORDER BY id ASC
        `;
        const subRes = await pool.query(subQuery, [taskId]);
        
        let subtasks = subRes.rows;
        
        // 3. Fallback: If no subtasks exist yet, make a 1-step list out of the main task
        if (subtasks.length === 0) {
            subtasks = [{
                id: parentTask.id, title: parentTask.title, notes: parentTask.notes,
                duration: "—", dueDate: parentTask.dueDate, progress: 0, isCompleted: false
            }];
        }

        res.json({ parentTask, subtasks });
    } catch (err) {
        console.error("❌ Session Error:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

// ==========================================
// MARK SUBTASK AS COMPLETE & UPDATE PARENT PROGRESS
// ==========================================
app.put('/api/subtasks/:id/complete', async (req, res) => {
    try {
        const { id } = req.params;
        
        // 1. Try to update it as a subtask first (and stamp the completed_at date!)
        const subRes = await pool.query(
            "UPDATE subtasks SET is_completed = true, completed_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING task_id", 
            [id]
        );
        
        // 2. If it WAS a subtask, check if the parent task is now fully finished
        if (subRes.rowCount > 0) {
            const taskId = subRes.rows[0].task_id;
            
            // Count total subtasks vs completed subtasks
            const calc = await pool.query(`
                SELECT 
                    COUNT(*) as total, 
                    COUNT(CASE WHEN is_completed THEN 1 END) as done 
                FROM subtasks WHERE task_id = $1
            `, [taskId]);
            
            const total = parseInt(calc.rows[0].total);
            const done = parseInt(calc.rows[0].done);
            
            // If every single subtask is done, mark parent 'Completed', else 'In Progress'
            const isAllDone = (total > 0 && total === done);
            const status = isAllDone ? 'Completed' : 'In Progress';
            
            await pool.query(
                "UPDATE tasks SET status = $1 WHERE id = $2", 
                [status, taskId]
            );
        } 
        // 3. Fallback: If it was a main task, just mark it completed
        else {
            await pool.query(
                "UPDATE tasks SET status = 'Completed' WHERE id = $1", 
                [id]
            );
        }
        
        res.json({ success: true });
    } catch (err) {
        console.error("❌ Completion Error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

// ==========================================
// AI CHAT ASSISTANT (DEEP WORK SESSION)
// ==========================================
const { GoogleGenerativeAI } = require("@google/generative-ai");

app.post('/api/ai/chat', async (req, res) => {
    try {
        const { messages, systemPrompt } = req.body;
        
        // ✨ THE FIX: We explicitly define and initialize the AI right here!
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Compile the chat history into a single prompt for Gemini
        let fullPrompt = `${systemPrompt}\n\n--- CHAT HISTORY ---\n`;
        messages.forEach(m => {
            fullPrompt += `${m.role === 'user' ? 'Student' : 'AI Guide'}: ${m.text}\n`;
        });
        fullPrompt += "AI Guide:"; // Prompt it to answer next

        const result = await model.generateContent(fullPrompt);
        const responseText = result.response.text();

        res.json({ reply: responseText });
    } catch (err) {
        console.error("❌ AI Chat Error:", err);
        res.status(500).json({ error: "Failed to get AI response" });
    }
});

// DB Test
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('❌ DB CONNECTION FAILED:', err.message);
  else console.log('✅ DATABASE CONNECTED SUCCESSFULLY:', res.rows[0].now);
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});