import { Users, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import StudentDirectoryCard from '../../components/CommunityComponents/StudentDirectoryCard.jsx';

function Student() {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [showOnlyAccommodations, setShowOnlyAccommodations] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch the live students from our new backend route!
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/oap/all-students');
                if (response.ok) {
                    const data = await response.json();
                    
                    // Map the backend data to guarantee it fits your Card component perfectly
                    const mappedStudents = data.map(s => ({
                        id: s.id,
                        name: s.name || 'Unknown Student',
                        major: s.major || 'CS', // Fallback if major isn't set yet
                        batch: 'Batch 2026',    // Default filler until you add to DB
                        year: 'Sophomore',      // Default filler until you add to DB
                        email: s.email,
                        advisor: 'Dr. Fatima Khan', 
                        accommodations: 0,      // Default to 0 until accommodations DB is linked
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

    const totalActive = students.length;
    const totalWithAcc = students.filter(s => s.accommodations > 0).length;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 w-[80vw]"> 
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Users size={24} style={{ color: '#B39DDB' }} />
                <h4 className="text-2xl font-semibold" style={{ color: '#5a4a61' }}>Student Directory</h4>
            </div>

            {/* Stat Cards */}
            <div className='grid grid-cols-2 gap-4'>
                <button 
                    onClick={() => setShowOnlyAccommodations(false)} 
                    className="p-6 bg-white rounded-3xl border transition-all text-left"
                    style={{ borderColor: !showOnlyAccommodations ? '#B39DDB' : '#e5e7eb' }}
                >
                    <h4 className="text-2xl font-bold" style={{ color: '#5a4a61' }}>{totalActive}</h4>
                    <p style={{ color: '#9575a3' }}>Active Students</p>
                </button>
                <button 
                    onClick={() => setShowOnlyAccommodations(true)} 
                    className="p-6 bg-white rounded-3xl border transition-all text-left"
                    style={{ borderColor: showOnlyAccommodations ? '#B39DDB' : '#e5e7eb' }}
                >
                    <h4 className="text-2xl font-bold" style={{ color: '#5a4a61' }}>{totalWithAcc}</h4>
                    <p style={{ color: '#9575a3' }}>With Accommodations</p>
                </button>
            </div>

            {/* Search Bar & Directory List */}
            <div className='bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100'>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl mb-8">
                    <Search size={20} className="text-gray-400" />
                    <input 
                        type='text' 
                        placeholder='Search by name or email...' 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent outline-none text-[#5a4a61] placeholder-gray-400"
                    />
                </div>

                <div className='mt-8'>
                    {isLoading ? (
                        <div className="text-center py-12" style={{ color: '#9575a3' }}>Loading student directory...</div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="text-center py-12" style={{ color: '#9575a3' }}>
                            <Users size={48} className="mx-auto mb-4 opacity-30" />
                            <p>No students found in the database.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {filteredStudents.map(student => (
                                <StudentDirectoryCard key={student.id} student={student} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Student;