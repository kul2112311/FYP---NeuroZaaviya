const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

// Start the Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
});