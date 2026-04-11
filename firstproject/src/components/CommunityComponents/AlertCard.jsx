import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  purple800: "#5a4a61",
  purple600: "#9575a3",
  purple500: "#b39ddb",
  purple400: "#c0b4cc",
  purple300: "#d8cfe0",
  purple200: "#e8e0f0",
  purple100: "rgba(179,157,219,0.15)",
  purple50:  "rgba(179,157,219,0.08)",
  green:     "#22c55e",
  greenBg:   "rgba(34,197,94,0.1)",
  red:       "#ef4444",
  redBg:     "rgba(239,68,68,0.06)",
  amber:     "#f59e0b",
  amberBg:   "rgba(245,158,11,0.1)",
  white:     "#FFFFFF",
};

const STATUS_CONFIG = {
  open:          { label: 'Open',        color: C.red,   bg: C.redBg   },
  'in-progress': { label: 'In Progress', color: C.amber, bg: C.amberBg },
  resolved:      { label: 'Resolved',    color: C.green, bg: C.greenBg },
};

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.open;
  return (
    <span style={{
      fontSize: 11,
      fontWeight: 600,
      padding: '3px 10px',
      borderRadius: 20,
      background: cfg.bg,
      color: cfg.color,
      border: `1px solid ${cfg.color}44`,
      whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  );
}

// ── Action Button ─────────────────────────────────────────────────────────────
function ActionButton({ label, color, bg, border, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: bg,
        color: color,
        border: border || `1.5px solid ${color}55`,
        borderRadius: 10,
        padding: '7px 14px',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'opacity 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
    >
      {label}
    </button>
  );
}

// ── Alert Card ────────────────────────────────────────────────────────────────
function AlertCard({ alert, onStatusChange }) {
  const [showDetails, setShowDetails] = useState(false);

  const canMarkInProgress = alert.status !== 'in-progress' && alert.status !== 'resolved';
  const canMarkResolved   = alert.status !== 'resolved';

  const cardStyle = {
    background: C.white,
    borderRadius: 16,
    border: `1px solid ${C.purple300}`,
    overflow: 'hidden',
  };

  if (showDetails) {
    return (
      <div style={cardStyle}>
        {/* Expanded header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '20px 20px 16px',
          borderBottom: `1px solid ${C.purple200}`,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 17, fontWeight: 600, color: C.purple800 }}>
                {alert.studentName}
              </span>
              <StatusBadge status={alert.status} />
            </div>
            <p style={{ margin: 0, fontSize: 13, color: C.purple600 }}>{alert.title}</p>
            <p style={{ margin: '6px 0 0', fontSize: 12, color: C.purple400 }}>
              by {alert.raisedBy} · {alert.date} · Assigned to: {alert.assignedTo}
            </p>
          </div>
          <button
            onClick={() => setShowDetails(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.purple400, padding: 4 }}
          >
            <ChevronUp size={22} />
          </button>
        </div>

        {/* Description */}
        <div style={{ padding: '16px 20px' }}>
          <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 600, color: C.purple800 }}>
            Description
          </p>
          <p style={{ margin: 0, fontSize: 13, color: C.purple600, lineHeight: 1.6 }}>
            {alert.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{
          padding: '12px 20px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
        }}>
          {canMarkInProgress && (
            <ActionButton
              label="Mark In Progress"
              color={C.amber}
              bg={C.amberBg}
              onClick={() => onStatusChange(alert.id, 'in-progress')}
            />
          )}
          {canMarkResolved && (
            <ActionButton
              label="Mark Resolved"
              color={C.green}
              bg={C.greenBg}
              onClick={() => onStatusChange(alert.id, 'resolved')}
            />
          )}
          <ActionButton
            label="Contact Focus Peer"
            color={C.purple600}
            bg={C.purple100}
          />
          <ActionButton
            label="View Student Profile"
            color={C.purple500}
            bg={C.purple50}
          />
        </div>
      </div>
    );
  }

  // ── Collapsed view ──────────────────────────────────────────────────────────
  return (
    <div style={{ ...cardStyle, display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 20px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: C.purple800 }}>
            {alert.studentName}
          </span>
          <StatusBadge status={alert.status} />
        </div>
        <p style={{ margin: 0, fontSize: 13, color: C.purple600 }}>{alert.title}</p>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: C.purple400 }}>
          by {alert.raisedBy} · {alert.date} · Assigned to: {alert.assignedTo}
        </p>
      </div>

      <button
        onClick={() => setShowDetails(true)}
        style={{
          background: C.purple50,
          border: `1px solid ${C.purple300}`,
          borderRadius: 8,
          padding: '5px 10px',
          cursor: 'pointer',
          color: C.purple600,
          fontSize: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        Details <ChevronDown size={14} />
      </button>
    </div>
  );
}

export default AlertCard;