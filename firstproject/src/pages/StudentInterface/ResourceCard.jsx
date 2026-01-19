import React from "react";
import "./resources.css";

// Helper function to clamp values between a min and max
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export default function ResourceCard({
  icon,
  title,
  durationText,       // "12 min"
  progress = null,    // number 0..100 or null
  openUrl,
  downloadUrl,
  isStarred = false,
  onToggleStar,
}) {
  // Clamp the progress value between 0 and 100
  const safeProgress = progress === null ? null : clamp(progress, 0, 100);

  return (
    <div className="rc-card">
      <div className="rc-top">
        <div className="rc-iconWrap">{icon}</div>

        <button
          className={`rc-star ${isStarred ? "isStarred" : ""}`}
          type="button"
          onClick={onToggleStar}
          aria-label={isStarred ? "Unstar resource" : "Star resource"}
          title={isStarred ? "Starred" : "Star"}
        >
          ★
        </button>
      </div>

      <h3 className="rc-title">{title}</h3>

      <div className="rc-meta">
        {durationText && <span className="rc-time">{durationText}</span>}
      </div>

      {safeProgress !== null ? (
        <div className="rc-progressBlock">
          <div className="rc-progressLabelRow">
            <span className="rc-progressLabel">Progress</span>
            <span className="rc-progressValue">{safeProgress}%</span>
          </div>

          <div
            className="rc-progressTrack"
            role="progressbar"
            aria-valuenow={safeProgress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="rc-progressFill" style={{ width: `${safeProgress}%` }} />
          </div>
        </div>
      ) : (
        <div className="rc-progressSpacer" />
      )}

      <div className="rc-actions">
        <a className="rc-openBtn" href={openUrl} target="_blank" rel="noreferrer">
          <span className="rc-openIcon">↗</span>
          Open
        </a>

        <a
          className="rc-downloadBtn"
          href={downloadUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Download"
          title="Download"
        >
          ⬇
        </a>
      </div>
    </div>
  );
}
