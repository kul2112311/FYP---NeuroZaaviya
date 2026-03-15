// kulsoom_index.js
const express = require('express');
const router = express.Router();
const pool = require('./db'); // Ensure db.js is in the same folder

// 1. GET all students for the directory
// Path will be: /api/students
router.get('/students', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                sp.student_id AS id,
                u.full_name AS name,
                u.email,
                sp.major,
                sp.batch,
                adv.full_name AS advisor,
                u.avatar_url AS avatar,
                (SELECT COUNT(*) FROM accommodations acc WHERE acc.student_id = sp.id) AS accommodations
            FROM users u
            JOIN student_profiles sp ON u.id = sp.user_id
            LEFT JOIN users adv ON sp.oap_advisor_id = adv.id
        `);
        res.json(result.rows); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
//student - accomodation query
// GET /api/student-accommodations
router.get('/student-accommodations', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        sp.id,
        u.full_name AS name,
        u.email,
        sp.student_id,
        COALESCE(
          json_agg(
            json_build_object(
              'id',       a.id,
              'type',     a.accommodation_type,
              'details',  a.description,
              'granted',  a.granted_date,
              'expires',  a.expiry_date
            ) ORDER BY a.granted_date DESC
          ) FILTER (WHERE a.id IS NOT NULL),
          '[]'
        ) AS accommodations
      FROM student_profiles sp
      JOIN users u ON sp.user_id = u.id
      LEFT JOIN accommodations a ON a.student_id = sp.id
      GROUP BY sp.id, u.full_name, u.email, sp.student_id
      ORDER BY u.full_name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch accommodations' });
  }
});

//focus-peer query
router.get('/focus-peers-oap', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                fs.id,
                u_student.full_name AS "studentName",
                u_student.email AS "studentEmail",
                sp.student_id AS "studentId",
                u_peer.full_name AS "focusPeer",
                fs.scheduled_date AS "date",
                fs.start_time AS "time",
                fs.end_time AS "endTime",
                fs.status,
                fs.student_notes AS "notes",
                fs.session_notes AS "sessionNotes"
            FROM focus_sessions fs
            JOIN student_profiles sp ON fs.student_id = sp.id
            JOIN users u_student ON sp.user_id = u_student.id
            JOIN focus_peer_profiles fpp ON fs.peer_id = fpp.id
            JOIN users u_peer ON fpp.user_id = u_peer.id
            ORDER BY fs.scheduled_date DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


// 2. Your Friend's Feature Route
// Path will be: /api/friend-feature
router.get('/friend-feature', async (req, res) => {
    try {
        res.json({ message: "Hello from the new file!" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Finally, export the router ONCE at the end
console.log('✅ kulsoom routes loaded');
router.stack.forEach(r => {
    if (r.route) console.log('Route:', r.route.path);
});
module.exports = router;