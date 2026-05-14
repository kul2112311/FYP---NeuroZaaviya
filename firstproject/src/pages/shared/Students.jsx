import { Users, Search, Calendar, X, CheckCircle, ClipboardList } from 'lucide-react';
import { useState, useEffect } from 'react';
import StudentDirectoryCard from '../../components/CommunityComponents/StudentDirectoryCard.jsx';
import { useUser } from '../../styles/SignInLandingPage/usercontext.jsx';

function Student() {
    const { user } = useUser();
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [showOnlyAccommodations, setShowOnlyAccommodations] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // --- Modal States ---
    const [selectedStudent, setSelectedStudent] = useState(null);
    
    // Scheduling Modal
    const [isScheduling, setIsScheduling] = useState(false);
    const [scheduleSuccess, setScheduleSuccess] = useState(false);
    const [formData, setFormData] = useState({ subject: '', description: '', datetime: '' });

    // ✨ NEW: Advisors Modal
    const [staffList, setStaffList] = useState([]);
    const [isAdvisorsOpen, setIsAdvisorsOpen] = useState(false);
    const [advisorSuccess, setAdvisorSuccess] = useState(false);
    const [advisorsForm, setAdvisorsForm] = useState({ oapId: '', wellnessId: '' });

    const fetchStudents = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/oap/all-students`);
            if (response.ok) {
                const data = await response.json();
                const mappedStudents = data.map(s => ({
                        id: s.id,
                        name: s.name || 'Unknown Student',
                        major: s.major || 'CS',
                        batch: 'Batch 2026',
                        year: 'Sophomore',
                        email: s.email,
                        advisor: s.advisor_name || 'Not Assigned', 
                        accommodations: 0,
                        avatar: '',
                        oapId: s.oap_advisor_id || '',
                        // ✨ FIXED: Double 'L' spelling
                        wellnessId: s.wellness_counsellor_id || ''
                    }));
                setStudents(mappedStudents);
            }
        } catch (error) {
            console.error("Failed to fetch students:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial Load
    useEffect(() => {
        fetchStudents();
        // Fetch the staff list for the dropdown menus!
        fetch(`${import.meta.env.VITE_API_URL}/api/support-staff`)
            .then(res => res.json())
            .then(data => setStaffList(data))
            .catch(console.error);
    }, []);

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase()) || 
                              student.email.toLowerCase().includes(search.toLowerCase());
        const matchesAcc = showOnlyAccommodations ? student.accommodations > 0 : true;
        return matchesSearch && matchesAcc;
    });

    // Handle Schedule
    const handleScheduleSubmit = async () => {
        if (!formData.subject || !formData.datetime) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/appointments/staff-to-student`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    staffUserId: user.id,          
                    studentUserId: selectedStudent.id, 
                    subject: formData.subject,
                    description: formData.description || "Routine check-in",
                    datetime: formData.datetime
                })
            });

            if (response.ok) {
                setScheduleSuccess(true);
                setTimeout(() => {
                    setIsScheduling(false);
                    setScheduleSuccess(false);
                    setFormData({ subject: '', description: '', datetime: '' });
                }, 2000);
            }
        } catch (error) {
            console.error("Failed to schedule:", error);
        }
    };

    // ✨ NEW: Handle Advisors Save
    const handleAdvisorsSubmit = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/student/${selectedStudent.id}/advisors`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(advisorsForm)
            });

            if (response.ok) {
                setAdvisorSuccess(true);
                fetchStudents(); // Refresh the grid data
                setTimeout(() => {
                    setIsAdvisorsOpen(false);
                    setAdvisorSuccess(false);
                }, 2000);
            }
        } catch (error) {
            console.error("Failed to update advisors:", error);
        }
    };

    const oapStaff = staffList.filter(s => s.role === 'oap');
    const wellnessStaff = staffList.filter(s => s.role === 'wellness' || s.role === 'wellness-counsellor');

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 w-[80vw]"> 
            <div className="flex items-center gap-4 mb-8">
                <Users size={24} style={{ color: '#B39DDB' }} />
                <h4 className="text-2xl font-semibold" style={{ color: '#5a4a61' }}>Student Directory</h4>
            </div>

            <div className='grid grid-cols-2 gap-4'>
                <button 
                    onClick={() => setShowOnlyAccommodations(false)} 
                    className="p-6 bg-white rounded-3xl border transition-all text-left"
                    style={{ borderColor: !showOnlyAccommodations ? '#B39DDB' : '#e5e7eb' }}>
                    <h4 className="text-2xl font-bold" style={{ color: '#5a4a61' }}>{students.length}</h4>
                    <p style={{ color: '#9575a3' }}>Active Students</p>
                </button>
                <button 
                    onClick={() => setShowOnlyAccommodations(true)} 
                    className="p-6 bg-white rounded-3xl border transition-all text-left"
                    style={{ borderColor: showOnlyAccommodations ? '#B39DDB' : '#e5e7eb' }}>
                    <h4 className="text-2xl font-bold" style={{ color: '#5a4a61' }}>
                        {students.filter(s => s.accommodations > 0).length}
                    </h4>
                    <p style={{ color: '#9575a3' }}>With Accommodations</p>
                </button>
            </div>

            <div className='bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100'>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl mb-8">
                    <Search size={20} className="text-gray-400" />
                    <input 
                        type='text' placeholder='Search by name or email...' 
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent outline-none text-[#5a4a61] placeholder-gray-400"
                    />
                </div>

                <div className='mt-8'>
                    {isLoading ? (
                        <div className="text-center py-12" style={{ color: '#9575a3' }}>Loading student directory...</div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="text-center py-12" style={{ color: '#9575a3' }}>
                            <Users size={48} className="mx-auto mb-4 opacity-30" />
                            <p>No students found.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {filteredStudents.map(student => (
                                <StudentDirectoryCard 
                                    key={student.id} 
                                    student={student} 
                                    onSchedule={() => {
                                        setSelectedStudent(student);
                                        setIsScheduling(true);
                                    }}
                                    // ✨ Pass the Advisors click handler!
                                    onAdvisors={() => {
                                        setSelectedStudent(student);
                                        setAdvisorsForm({ oapId: student.oapId, wellnessId: student.wellnessId });
                                        setIsAdvisorsOpen(true);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* --- SCHEDULING MODAL --- */}
            {isScheduling && selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.45)" }}>
                    <div className="bg-white rounded-3xl w-full max-w-md p-7 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(179,157,219,0.15)", color: "#b39ddb" }}>
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg" style={{ color: "#5a4a61" }}>Schedule Meeting</h3>
                                    <p className="text-xs" style={{ color: "#9575a3" }}>with {selectedStudent.name}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsScheduling(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                        </div>

                        {scheduleSuccess ? (
                            <div className="py-8 flex flex-col items-center justify-center text-center">
                                <CheckCircle size={48} className="text-green-500 mb-4" />
                                <h4 className="text-lg font-bold text-gray-800">Meeting Scheduled!</h4>
                                <p className="text-sm text-gray-500 mt-2">It has been added to both calendars.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold mb-2" style={{ color: "#5a4a61" }}>Meeting Subject *</label>
                                    <input 
                                        type="text" placeholder="e.g., Routine Check-in"
                                        value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
                                        className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-2" style={{ color: "#5a4a61" }}>Date & Time *</label>
                                    <input 
                                        type="datetime-local" 
                                        value={formData.datetime} onChange={e => setFormData({...formData, datetime: e.target.value})}
                                        className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-2" style={{ color: "#5a4a61" }}>Internal Notes</label>
                                    <textarea 
                                        rows="2" placeholder="Brief notes for context..."
                                        value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                                        className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-400 resize-none"
                                    />
                                </div>
                                
                                <button 
                                    onClick={handleScheduleSubmit}
                                    disabled={!formData.subject || !formData.datetime}
                                    className="w-full py-4 mt-2 rounded-xl text-white font-bold transition-opacity disabled:opacity-50"
                                    style={{ background: "linear-gradient(90deg, #b39ddb 0%, #f8bbd0 100%)" }}>
                                    Confirm Appointment
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- ✨ NEW: ADVISORS MODAL --- */}
            {isAdvisorsOpen && selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.45)" }}>
                    <div className="bg-white rounded-3xl w-full max-w-md p-7 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(179,157,219,0.15)", color: "#b39ddb" }}>
                                    <ClipboardList size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg" style={{ color: "#5a4a61" }}>Assign Advisors</h3>
                                    <p className="text-xs" style={{ color: "#9575a3" }}>for {selectedStudent.name}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsAdvisorsOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                        </div>

                        {advisorSuccess ? (
                            <div className="py-8 flex flex-col items-center justify-center text-center">
                                <CheckCircle size={48} className="text-green-500 mb-4" />
                                <h4 className="text-lg font-bold text-gray-800">Assignments Saved!</h4>
                                <p className="text-sm text-gray-500 mt-2">The student's dashboard has been updated.</p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold mb-2" style={{ color: "#5a4a61" }}>OAP Advisor</label>
                                    <select 
                                        value={advisorsForm.oapId}
                                        onChange={e => setAdvisorsForm({...advisorsForm, oapId: e.target.value})}
                                        className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-400 bg-white"
                                        style={{ color: "#5a4a61" }}>
                                        <option value="">-- Unassigned --</option>
                                        {oapStaff.map(s => (
                                            /* ✨ FIXED: Now uses user_id to satisfy the DB constraint */
                                            <option key={s.user_id} value={s.user_id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2" style={{ color: "#5a4a61" }}>Wellness Counselor</label>
                                    <select 
                                        value={advisorsForm.wellnessId}
                                        onChange={e => setAdvisorsForm({...advisorsForm, wellnessId: e.target.value})}
                                        className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-400 bg-white"
                                        style={{ color: "#5a4a61" }}>
                                        <option value="">-- Unassigned --</option>
                                        {wellnessStaff.map(s => (
                                            /* ✨ FIXED: Now uses user_id to satisfy the DB constraint */
                                            <option key={s.user_id} value={s.user_id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <button 
                                    onClick={handleAdvisorsSubmit}
                                    className="w-full py-4 mt-2 rounded-xl text-white font-bold transition-opacity hover:opacity-90 cursor-pointer"
                                    style={{ background: "linear-gradient(90deg, #b39ddb 0%, #f8bbd0 100%)" }}>
                                    Save Assignments
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Student;