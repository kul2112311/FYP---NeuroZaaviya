function CommunityPost({ post }) {
  return (
    <div className="community-post">
      <div className="post-header">
        <div className="post-author-info">
          {/* If Initials are there so use them if not then use the profile URL */}
          {post.avatar_url ? (
            <img 
              src={post.avatar_url} 
              alt={post.author} 
              className="post-avatar-img" 
              style={{
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                marginRight: '12px',
                objectFit: 'cover'
              }} 
            />
          ) : (
            <div className="post-avatar">{post.initials}</div>
          )}
          
          <div className="post-author-details">
            <h4 className="post-author-name">{post.author}</h4>
            <span className="post-timestamp">{post.timeAgo}</span>
          </div>
        </div>
      </div>

      <p className="post-content">
        {post.content}
      </p>

      <div className="post-tags">
        {post.tags.map((tag, index) => (
          <span key={index} className="post-tag">{tag}</span>
        ))}
      </div>
    </div>
  );
}

export default CommunityPost;