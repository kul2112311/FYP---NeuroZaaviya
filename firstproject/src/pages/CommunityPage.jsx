import { useState, useEffect } from 'react';
import CommunityPost from '../components/CommunityComponents/CommunityPost.jsx';
import CreatePostModal from '../components/CommunityComponents/CreatePostModal.jsx';

function Community() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // bringin in the posts from backend
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/community-posts');
      const data = await response.json();
      
      const formattedPosts = data.map(post => ({
        id: post.id,
        author: post.full_name,
        // getting initial letters form the name bruh
        initials: post.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        avatar_url: post.avatar_url, // Using data from the backend jo itni mehnat se banai lol
        timeAgo: calculateTimeAgo(post.created_at),
        content: post.content,
        tags: post.tags || []
      }));

      setPosts(formattedPosts);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setIsLoading(false);
    }
  };

  // 2. Create Post function connecting to Z backend
  const handleCreatePost = async (newPostData) => {
    try {
      // hard coded for right now , kuch to karna tha na jab tak ban jae login system
      const currentUserId = "a1111111-1111-1111-1111-111111111111"; // Ushna's ID here (thank you for letting me use it :prayinghands:)

      const response = await fetch('http://localhost:5000/api/community-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_id: currentUserId,
          content: newPostData.content,
          is_anonymous: newPostData.isAnonymous,
          tags: newPostData.tags
        })
      });

      if (response.ok) {
        fetchPosts(); // gotta reload to show the new post made
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // calculating time ago from date like 2 hours or so
  const calculateTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    // Handle future dates
    if (seconds < 0) return "Just now";

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
  };

  return (
    <div className="container">
      <div className="community-header">
        <div className="community-title-section">
          <h1 className="section-header">💬 Forum</h1>
          <p className="community-subtitle">Share your concerns, announcements and tag support services to get help</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="share-button"
        >
          + Create a Post
        </button>
      </div>

      <div className="community-filters">
        <button className="filter-btn active">New</button>
        <button className="filter-btn">Top</button>
      </div>

      <div className="posts-list">
        {isLoading ? (
          <p style={{textAlign: 'center', padding: '20px'}}>Loading discussions...</p>
        ) : (
          posts.map(post => (
            <CommunityPost key={post.id} post={post} />
          ))
        )}
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}

export default Community;