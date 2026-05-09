import { Users, Search, Calendar, X, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import StudentDirectoryCard from '../../components/CommunityComponents/StudentDirectoryCard.jsx';
// Double check this path matches your folder structure!
import { useUser } from '../../styles/SignInLandingPage/usercontext.jsx';

function Student() {
    const { user } = useUser(); // Get the logged-in staff member!
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [showOnlyAccommodations, setShowOnlyAccommodations] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Modal State
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isScheduling, setIsScheduling] = useState(false);
    const [scheduleSuccess, setScheduleSuccess] = useState(false);
    const [formData, setFormData] = useState({ subject: '', description: '', datetime: '' });

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/oap/all-students');
                if (response.ok) {
                    const data = await response.json();
                    const mappedStudents = data.map(s => ({
                        id: s.id,
                        name: s.name || 'Unknown Student',
                        major: s.major || 'CS',
                        batch: 'Batch 2026',
                        year: 'Sophomore',
                        email: s.email,
                        advisor: 'Dr. Fatima Khan', 
                        accommodations: 0,
                        avatar: ''
                    }));
                    setStudents(mappedStudents);
                }
            } catch (error) {
                console.error("Failed to fetch students:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase()) || 
                              student.email.toLowerCase().includes(search.toLowerCase());
        const matchesAcc = showOnlyAccommodations ? student.accommodations > 0 : true;
        return matchesSearch && matchesAcc;
    });

    // Handle the schedule submission
    const handleScheduleSubmit = async () => {
        if (!formData.subject || !formData.datetime) return;
        
        try {
            const response = await fetch('http://localhost:5000/api/appointments/staff-to-student', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    staffUserId: user.id,          // The logged-in staff
                    studentUserId: selectedStudent.id, // The target student
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
                                    // ✨ Pass the click handler down to the card!
                                    onSchedule={() => {
                                        setSelectedStudent(student);
                                        setIsScheduling(true);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ✨ The Scheduling Modal ✨ */}
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
                                        type="text" placeholder="e.g., Routine Check-in, Accommodation Review"
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
        </div>
    );
}

export default Student;