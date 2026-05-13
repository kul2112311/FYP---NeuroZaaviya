import { Search, Bell, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import AlertCard from '../../components/CommunityComponents/AlertCard.jsx';

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
  pink:      "#f8bbd0",
  pinkText:  "#c0608a",
  teal:      "#6b9e9a",
  tealBg:    "rgba(107,158,154,0.1)",
  ehsas:     "#9b7fbd",
  ehsasBg:   "rgba(155,127,189,0.1)",
  green:     "#22c55e",
  greenBg:   "rgba(34,197,94,0.1)",
  red:       "#ef4444",
  redBg:     "rgba(239,68,68,0.06)",
  amber:     "#f59e0b",
  amberBg:   "rgba(245,158,11,0.1)",
  white:     "#FFFFFF",
  pageBg:    "#f5eef8",
  btnGrad:   "linear-gradient(90deg, #b39ddb 0%, #f8bbd0 100%)",
};

const STATUS_CONFIG = {
  open:          { label: 'Open',        color: C.red,   bg: C.redBg,   border: `1px solid ${C.red}33`   },
  'in-progress': { label: 'In Progress', color: C.amber, bg: C.amberBg, border: `1px solid ${C.amber}44` },
  resolved:      { label: 'Resolved',    color: C.green, bg: C.greenBg, border: `1px solid ${C.green}44` },
};

// ── Status Filter Card ────────────────────────────────────────────────────────
function StatusCard({ count, label, statusKey, isActive, onClick }) {
  const cfg = statusKey ? STATUS_CONFIG[statusKey] : null;
  const activeColor = cfg ? cfg.color : C.purple500;
  const activeBg    = cfg ? cfg.bg   : C.purple100;

  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        borderRadius: 16,
        padding: '16px 12px',
        textAlign: 'center',
        cursor: 'pointer',
        border: isActive ? `2px solid ${activeColor}` : `2px solid ${C.purple300}`,
        background: isActive ? activeBg : C.white,
        transition: 'all 0.18s',
        outline: 'none',
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 700, color: isActive ? activeColor : C.purple800 }}>
        {count}
      </div>
      <div style={{ fontSize: 13, color: C.purple600, marginTop: 2 }}>{label}</div>
    </button>
  );
}

// ── Status Section (accordion) ────────────────────────────────────────────────
function StatusSection({ statusKey, alerts, onStatusChange }) {
  const [open, setOpen] = useState(true);
  const cfg = STATUS_CONFIG[statusKey];

  return (
    <div style={{
      borderRadius: 16,
      border: cfg.border,
      background: cfg.bg,
      overflow: 'hidden',
      marginBottom: 12,
    }}>
      {/* Section header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            background: cfg.color,
            color: C.white,
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            padding: '2px 12px',
          }}>
            {cfg.label}
          </span>
          <span style={{ fontSize: 13, color: cfg.color, fontWeight: 500 }}>
            {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
          </span>
        </div>
        {open
          ? <ChevronUp size={16} style={{ color: cfg.color }} />
          : <ChevronDown size={16} style={{ color: cfg.color }} />}
      </button>

      {/* Student name pills */}
      {open && (
        <div style={{ padding: '0 20px 10px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {alerts.map(a => (
            <span key={a.id} style={{
              background: C.white,
              border: `1px solid ${cfg.color}55`,
              borderRadius: 20,
              fontSize: 12,
              color: cfg.color,
              padding: '3px 12px',
              fontWeight: 500,
            }}>
              {a.studentName}
            </span>
          ))}
        </div>
      )}

      {/* Alert Cards */}
      {open && (
        <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {alerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // ✨ NEW: Fetch the alerts from the database when the page loads!
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('${import.meta.env.VITE_API_URL}/api/alerts');
        if (res.ok) {
          const data = await res.json();
          setAlerts(data);
        }
      } catch (err) {
        console.error("Failed to load alerts:", err);
      }
    };
    fetchAlerts();
  }, []);

  const filtered = alerts.filter(alert => {
    const q = search.toLowerCase();
    const searchMatch =
      !search ||
      (alert.studentName && alert.studentName.toLowerCase().includes(q)) ||
      (alert.title && alert.title.toLowerCase().includes(q)) ||
      (alert.raisedBy && alert.raisedBy.toLowerCase().includes(q));
    const statusMatch = !statusFilter || alert.status === statusFilter;
    return searchMatch && statusMatch;
  });

  // ✨ FIXED: The function to update the status dropdown on the cards
  const handleStatusChange = (id, newStatus) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const byStatus = s => filtered.filter(a => a.status === s);

  const counts = {
    total:      alerts.length,
    open:       alerts.filter(a => a.status === 'open').length,
    inProgress: alerts.filter(a => a.status === 'in-progress').length,
    resolved:   alerts.filter(a => a.status === 'resolved').length,
  };

  const visibleStatuses = ['open', 'in-progress', 'resolved'].filter(
    s => byStatus(s).length > 0
  );

  return (
    <div style={{ padding: '24px 24px 24px 48px', width: '80vw', boxSizing: 'border-box' }}>

      {/* Header */}
      <div style={{
        borderRadius: 24,
        padding: '16px 24px',
        background: C.white,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 20,
        border: `1px solid ${C.purple300}`,
      }}>
        <Bell size={24} style={{ color: C.purple500 }} />
        <div>
          <h4 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: C.purple500 }}>
            Focus Peer Alerts
          </h4>
          <p style={{ margin: 0, fontSize: 13, color: C.purple600 }}>
            Monitor and respond to alerts raised by focus peers for their students
          </p>
        </div>
      </div>

      {/* Status Filter Cards */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <StatusCard count={counts.total}      label="Total Alerts" statusKey={null}         isActive={statusFilter === ''}            onClick={() => setStatusFilter('')} />
        <StatusCard count={counts.open}       label="Open"         statusKey="open"         isActive={statusFilter === 'open'}        onClick={() => setStatusFilter(statusFilter === 'open' ? '' : 'open')} />
        <StatusCard count={counts.inProgress} label="In Progress"  statusKey="in-progress"  isActive={statusFilter === 'in-progress'} onClick={() => setStatusFilter(statusFilter === 'in-progress' ? '' : 'in-progress')} />
        <StatusCard count={counts.resolved}   label="Resolved"     statusKey="resolved"     isActive={statusFilter === 'resolved'}    onClick={() => setStatusFilter(statusFilter === 'resolved' ? '' : 'resolved')} />
      </div>

      {/* Search + grouped alerts */}
      <div style={{
        background: C.white,
        borderRadius: 24,
        padding: 24,
        border: `1px solid ${C.purple300}`,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 16px',
          background: C.purple50,
          borderRadius: 16,
          border: `1px solid ${C.purple300}`,
          marginBottom: 24,
        }}>
          <Search size={18} style={{ color: C.purple400, flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search by student name, alert title, or focus peer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, border: 'none', background: 'transparent',
              outline: 'none', fontSize: 14, color: C.purple800,
            }}
          />
        </div>

        {alerts.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', border: `2px dashed ${C.purple300}`, borderRadius: 16 }}>
            <ShieldCheck size={48} style={{ color: C.green, opacity: 0.6, marginBottom: 12 }} />
            <h3 style={{ margin: 0, color: C.purple800, fontSize: 18, fontWeight: 600 }}>All Clear!</h3>
            <p style={{ margin: '8px 0 0', color: C.purple600, fontSize: 14 }}>There are no active alerts in the system right now.</p>
          </div>
        ) : filtered.length === 0 ? (
           <p style={{ textAlign: 'center', color: C.purple400, padding: '32px 0' }}>
            No alerts found matching your filters.
          </p>
        ) : (
          visibleStatuses.map(s => (
            <StatusSection
              key={s}
              statusKey={s}
              alerts={byStatus(s)}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Alerts;