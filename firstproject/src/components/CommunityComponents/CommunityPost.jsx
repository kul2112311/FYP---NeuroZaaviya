function CommunityPost({ post }) {
  return (
    <div className="community-post">
      <div className="post-header">
        <div className="post-author-info">
          <div className="post-avatar">{post.initials}</div>
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

export default CommunityPost