
import { useState } from 'react';
import CommunityPost from '../components/CommunityComponents/CommunityPost.jsx'
import CreatePostModal from '../components/CommunityComponents/CreatePostModal.jsx';

function Community() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Ushna Bansal",
      initials: "UB",
      timeAgo: "2 hours ago",
      content: "I've been struggling with managing my group project deadlines. Does anyone know if OAP offers time management workshops this semester?",
      tags: ["OAP", "Help"]
    },
    {
      id: 2,
      author: "Anonymous",
      initials: "AN",
      timeAgo: "5 hours ago",
      content: "I'm experiencing overwhelming with midterms approaching. I have accommodations but I'm anxious about asking my professors for extensions. Any advice?",
      tags: ["Anxiety", "Exams"]
    },
    {
      id: 3,
      author: "Sarah M.",
      initials: "SM",
      timeAgo: "1 day ago",
      content: "Just wanted to share - I had my first session with Ensso consulting and it was so helpful! They really understood my concerns about sensory method used in the library.",
      tags: ["Positive"]
    },
    {
      id: 4,
      author: "Jordan Lee",
      initials: "JL",
      timeAgo: "2 days ago",
      content: "Looking for study buddies for PSYCH 201. Anyone interested in forming a study group? We could meet at the library or online.",
      tags: ["Study Group", "PSYCH 201"]
    }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreatePost = (newPost) => {
    const post = {
      id: posts.length + 1,
      author: newPost.isAnonymous ? "Anonymous" : "Current User",
      initials: newPost.isAnonymous ? "AN" : "CU",
      timeAgo: "Just now",
      content: newPost.content,
      tags: newPost.tags
    };
    setPosts([post, ...posts]);
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
        {posts.map(post => (
          <CommunityPost key={post.id} post={post} />
        ))}
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