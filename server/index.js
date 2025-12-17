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

// ==========================================
// FOCUS PEER SCHEDULE MANAGEMENT
// ==========================================

// 7. GET PEER'S OWN SCHEDULE (For Schedule Management Page)
app.get('/api/peer-schedule/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Get peer profile ID from user ID
        const peerQuery = "SELECT id FROM focus_peer_profiles WHERE user_id = $1";
        const peerResult = await pool.query(peerQuery, [userId]);
        
        if (peerResult.rows.length === 0) {
            return res.status(404).json({ error: "Focus peer profile not found" });
        }
        
        const peerId = peerResult.rows[0].id;
        
        // Get all availability slots
        const scheduleQuery = `
            SELECT 
                id,
                day_of_week,
                TO_CHAR(start_time, 'HH24:MI') as start_time,
                TO_CHAR(end_time, 'HH24:MI') as end_time,
                is_active
            FROM peer_availability 
            WHERE peer_id = $1 AND is_active = true
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
        
        // Check for overlapping slots
        const overlapQuery = `
            SELECT id FROM peer_availability 
            WHERE peer_id = $1 
            AND day_of_week = $2
            AND is_active = true
            AND (
                (start_time, end_time) OVERLAPS ($3::time, $4::time)
            )
        `;
        
        const overlapResult = await pool.query(overlapQuery, [peerId, day_of_week, start_time, end_time]);
        
        if (overlapResult.rows.length > 0) {
            return res.status(409).json({ error: "This time slot overlaps with existing availability" });
        }
        
        // Insert new slot
        const insertQuery = `
            INSERT INTO peer_availability (peer_id, day_of_week, start_time, end_time, is_active)
            VALUES ($1, $2, $3::time, $4::time, true)
            RETURNING 
                id,
                day_of_week,
                TO_CHAR(start_time, 'HH24:MI') as start_time,
                TO_CHAR(end_time, 'HH24:MI') as end_time,
                is_active
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

// Start the Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
});