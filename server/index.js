const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to read JSON data sent from frontend

// ==========================================
// ROUTES
// ==========================================

// 1. GET ALL FORUM POSTS (For the Feed)
app.get('/api/community-posts', async (req, res) => {
    try {
        // We join with the users table to get the author's name and avatar
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
        
        // Optional: Filter anonymous data before sending to frontend
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
        // destructure the data sent from your React modal
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

// Start the Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
});
