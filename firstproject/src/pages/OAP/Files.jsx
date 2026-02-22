import { useState, useRef } from 'react';
import { Search, Upload, Folder, FileText, Download, ChevronRight, ClipboardList, Calendar, UserPlus, Stethoscope, GraduationCap, Heart, BookOpen, ArrowLeft, File, Trash2 } from 'lucide-react';

const CATEGORY_ICONS = {
  accommodation: { Icon: ClipboardList, bg: '#ede7f6', color: '#7e57c2' },
  leave:         { Icon: Calendar,      bg: '#e8f5e9', color: '#43a047' },
  adddrop:       { Icon: UserPlus,      bg: '#e8eaf6', color: '#5c6bc0' },
  medical:       { Icon: Stethoscope,   bg: '#fce4ec', color: '#e91e63' },
  transcript:    { Icon: GraduationCap, bg: '#fff3e0', color: '#fb8c00' },
  wellness:      { Icon: Heart,         bg: '#fce4ec', color: '#e91e63' },
  focuspeer:     { Icon: BookOpen,      bg: '#e0f7fa', color: '#00acc1' },
};

const INITIAL_CATEGORIES = [
  {
    id: 'accommodation', title: 'Accommodation Forms', desc: 'Academic accommodation request forms and documentation',
    files: [
      { id: 'f1', name: 'Accommodation Request Form.pdf',   size: '245 KB', uploaded: '2024-09-01' },
      { id: 'f2', name: 'Medical Documentation Template.docx', size: '118 KB', uploaded: '2024-09-01' },
      { id: 'f3', name: 'Renewal Application Form.pdf',    size: '198 KB', uploaded: '2024-10-15' },
    ]
  },
  {
    id: 'leave', title: 'Leave Forms', desc: 'Leave application forms for various circumstances',
    files: [
      { id: 'f4', name: 'General Leave Application.pdf',   size: '210 KB', uploaded: '2024-09-01' },
      { id: 'f5', name: 'Emergency Leave Request.docx',    size: '134 KB', uploaded: '2024-09-01' },
      { id: 'f6', name: 'Parental Leave Form.pdf',         size: '176 KB', uploaded: '2024-11-01' },
    ]
  },
  {
    id: 'adddrop', title: 'Add/Drop Forms', desc: 'Course add/drop and withdrawal forms',
    files: [
      { id: 'f7',  name: 'Course Add Form.pdf',            size: '189 KB', uploaded: '2024-09-01' },
      { id: 'f8',  name: 'Course Drop Form.pdf',           size: '192 KB', uploaded: '2024-09-01' },
      { id: 'f9',  name: 'Late Withdrawal Request.docx',   size: '145 KB', uploaded: '2024-09-01' },
      { id: 'f10', name: 'Course Substitution Form.pdf',   size: '201 KB', uploaded: '2024-10-20' },
    ]
  },
  {
    id: 'medical', title: 'Medical Leave Forms', desc: 'Medical leave and health-related documentation',
    files: [
      { id: 'f11', name: 'Medical Leave Application.pdf',  size: '223 KB', uploaded: '2024-09-01' },
      { id: 'f12', name: 'Doctor Certificate Template.docx', size: '109 KB', uploaded: '2024-09-01' },
      { id: 'f13', name: 'Health Clearance Form.pdf',      size: '167 KB', uploaded: '2024-11-10' },
    ]
  },
  {
    id: 'transcript', title: 'Transcript Requests', desc: 'Official and provisional transcript request forms',
    files: [
      { id: 'f14', name: 'Official Transcript Request.pdf',      size: '215 KB', uploaded: '2024-09-01' },
      { id: 'f15', name: 'Provisional Transcript Form.pdf',      size: '198 KB', uploaded: '2024-09-01' },
      { id: 'f16', name: 'Transcript Attestation Request.docx',  size: '132 KB', uploaded: '2024-10-05' },
    ]
  },
  {
    id: 'wellness', title: 'Wellness & Counseling', desc: 'Wellness center and counseling service forms',
    files: [
      { id: 'f17', name: 'Counseling Intake Form.pdf',     size: '241 KB', uploaded: '2024-09-01' },
      { id: 'f18', name: 'Wellness Assessment Form.docx',  size: '156 KB', uploaded: '2024-09-01' },
      { id: 'f19', name: 'Crisis Support Request.pdf',     size: '188 KB', uploaded: '2024-11-20' },
    ]
  },
  {
    id: 'focuspeer', title: 'FocusPeer Documents', desc: 'FocusPeer session booking and feedback forms',
    files: [
      { id: 'f20', name: 'Session Booking Form.pdf',       size: '172 KB', uploaded: '2024-09-01' },
      { id: 'f21', name: 'Session Feedback Form.docx',     size: '128 KB', uploaded: '2024-09-01' },
      { id: 'f22', name: 'FocusPeer Agreement Form.pdf',   size: '204 KB', uploaded: '2024-10-01' },
    ]
  },
];

function getFileIcon(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const colors = { pdf: '#ef5350', docx: '#42a5f5', xlsx: '#66bb6a', pptx: '#ffa726', txt: '#78909c' };
  return colors[ext] || '#B39DDB';
}

function Files() {
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [openFolder, setOpenFolder] = useState(null); // category id
  const [uploadTarget, setUploadTarget] = useState(null); // category id for folder upload, null = root
  const fileInputRef = useRef(null);

  const totalFolders = categories.length;
  const totalFiles = categories.reduce((acc, c) => acc + c.files.length, 0);
  const recentUpdates = 12;

  const filtered = categories.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  const currentFolder = categories.find(c => c.id === openFolder);

  const handleUploadClick = (catId = null) => {
    setUploadTarget(catId);
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach(file => {
      const newFile = {
        id: `f_${Date.now()}_${Math.random()}`,
        name: file.name,
        size: file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`,
        uploaded: new Date().toISOString().split('T')[0],
      };

      if (uploadTarget) {
        // Upload into a specific folder
        setCategories(prev =>
          prev.map(c => c.id === uploadTarget
            ? { ...c, files: [...c.files, newFile] }
            : c
          )
        );
      } else {
        // Root upload — add to first folder as default (or could prompt)
        setCategories(prev =>
          prev.map((c, i) => i === 0 ? { ...c, files: [...c.files, newFile] } : c)
        );
      }
    });

    // Reset input so same file can be re-uploaded
    e.target.value = '';
  };

  const handleDeleteFile = (catId, fileId) => {
    setCategories(prev =>
      prev.map(c => c.id === catId
        ? { ...c, files: c.files.filter(f => f.id !== fileId) }
        : c
      )
    );
  };

  return (
    <div className="p-6 pl-12 space-y-6" style={{ width: '80vw' }}>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="*/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* ── FOLDER VIEW ── */}
      {openFolder ? (
        <>
          {/* Back header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setOpenFolder(null)}
              className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ color: '#B39DDB' }}
            >
              <ArrowLeft size={18} />
              Back to Files & Forms
            </button>
            <button
              onClick={() => handleUploadClick(openFolder)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#B39DDB' }}
            >
              <Upload size={16} />
              Upload to Folder
            </button>
          </div>

          {/* Folder title card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
            {(() => {
              const { Icon, bg, color } = CATEGORY_ICONS[currentFolder.id];
              return (
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                  <Icon size={22} style={{ color }} />
                </div>
              );
            })()}
            <div>
              <h4 className="text-xl font-semibold text-gray-800">{currentFolder.title}</h4>
              <p className="text-sm text-gray-500">{currentFolder.desc}</p>
            </div>
          </div>

          {/* Files list */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-gray-700">{currentFolder.files.length} file{currentFolder.files.length !== 1 ? 's' : ''}</span>
            </div>

            {currentFolder.files.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-300">
                <Folder size={48} />
                <p className="mt-3 text-sm">No files in this folder yet</p>
                <button
                  onClick={() => handleUploadClick(openFolder)}
                  className="mt-4 px-4 py-2 rounded-xl text-white text-sm hover:opacity-90"
                  style={{ backgroundColor: '#B39DDB' }}
                >
                  Upload a file
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {currentFolder.files.map(file => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                        style={{ backgroundColor: getFileIcon(file.name) }}
                      >
                        {file.name.split('.').pop().toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{file.name}</div>
                        <div className="text-xs text-gray-400">{file.size} • Uploaded {file.uploaded}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                        <Download size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteFile(currentFolder.id, file.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (

        /* ── MAIN FILES VIEW ── */
        <>
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-2xl font-semibold" style={{ color: '#B39DDB' }}>Files & Forms</h4>
              <p className="text-sm text-gray-500 mt-0.5">Access important forms, documents, and resources</p>
            </div>
            <button
              onClick={() => handleUploadClick(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#B39DDB' }}
            >
              <Upload size={16} />
              Upload File
            </button>
          </div>

          {/* Search */}
          <div className="bg-white rounded-2xl px-5 py-4 border border-gray-100">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search folders and files..."
                className="pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl p-5 bg-white border border-gray-100 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#ede7f6' }}>
                <Folder size={20} style={{ color: '#7e57c2' }} />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Folders</div>
                <div className="text-2xl font-bold text-gray-800">{totalFolders}</div>
              </div>
            </div>
            <div className="rounded-2xl p-5 bg-white border border-gray-100 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#ede7f6' }}>
                <FileText size={20} style={{ color: '#7e57c2' }} />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Files</div>
                <div className="text-2xl font-bold text-gray-800">{totalFiles}</div>
              </div>
            </div>
            <div className="rounded-2xl p-5 bg-white border border-gray-100 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#ede7f6' }}>
                <Download size={20} style={{ color: '#7e57c2' }} />
              </div>
              <div>
                <div className="text-sm text-gray-500">Recent Updates</div>
                <div className="text-2xl font-bold" style={{ color: '#7e57c2' }}>{recentUpdates}</div>
              </div>
            </div>
          </div>

          {/* Form Categories */}
          <div>
            <h5 className="text-base font-semibold text-gray-700 mb-4">Form Categories</h5>
            <div className="grid grid-cols-3 gap-5">
              {filtered.map(cat => {
                const { Icon, bg, color } = CATEGORY_ICONS[cat.id] || { Icon: FileText, bg: '#f3f4f6', color: '#6b7280' };
                return (
                  <div
                    key={cat.id}
                    onClick={() => setOpenFolder(cat.id)}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer relative"
                  >
                    <ChevronRight size={16} className="absolute top-4 right-4 text-gray-300" />
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: bg }}>
                      <Icon size={22} style={{ color }} />
                    </div>
                    <div className="font-semibold text-gray-800 text-sm mb-1">{cat.title}</div>
                    <div className="text-xs text-gray-500 mb-3 leading-relaxed">{cat.desc}</div>
                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <FileText size={12} />
                        {cat.files.length} files
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Files;