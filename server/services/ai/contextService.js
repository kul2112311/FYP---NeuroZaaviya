const pool = require('../../db'); // Go up 2 levels to find db.js

/**
 * RAG SERVICE: Fetches Student Context & ID
 * connects to: student_profiles, accommodations
 */
exports.getStudentContext = async (userId) => {
  try {
    // 1. Fetch Profile (Needed for student_id foreign key)
    const profileQuery = `
      SELECT id, major, level, year_of_study 
      FROM student_profiles 
      WHERE user_id = $1
    `;
    const profileRes = await pool.query(profileQuery, [userId]);

    if (profileRes.rows.length === 0) {
      return { 
        profileId: null, 
        contextString: "Student Profile: Standard (No context found)." 
      };
    }

    const profile = profileRes.rows[0];

    // 2. Fetch Accommodations (From separate table)
    const accomQuery = `
      SELECT accommodation_type, description 
      FROM accommodations 
      WHERE student_id = $1
    `;
    const accomRes = await pool.query(accomQuery, [profile.id]);

    const accomList = accomRes.rows.length > 0
      ? accomRes.rows.map(a => `- ${a.accommodation_type}: ${a.description}`).join('\n')
      : "None listed";

    // 3. Return both the ID (for DB saves) and Context (for AI)
    return {
      profileId: profile.id, // <--- CRITICAL: This is the ID 'tasks' table needs
      contextString: `
      STUDENT CONTEXT:
      - Major: ${profile.major} (Year ${profile.year_of_study})
      - Level: ${profile.level}
      - Active Accommodations:
      ${accomList}
      `
    };

  } catch (error) {
    console.error("Context Fetch Error:", error);
    throw new Error("Failed to retrieve student profile.");
  }
};