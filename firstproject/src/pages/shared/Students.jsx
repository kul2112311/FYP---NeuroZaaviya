// import { Users, Search, ChevronDown } from 'lucide-react';
// import { useState } from 'react';
// import StudentDirectoryCard from '../../components/CommunityComponents/StudentDirectoryCard.jsx';

// function Student() {
//     const [advisors, setAdvisors] = useState('');
//     const [majors, setMajors] = useState('');
//     const [years, setYears] = useState('');
//     const [search, setSearch] = useState('');
//     // New state to toggle accommodation filter
//     const [showOnlyAccommodations, setShowOnlyAccommodations] = useState(false);

//     const allStudents = [
//         {
//             id: '512345',
//             name: 'Ushna Batool',
//             major: 'CS',
//             batch: 'Batch 2022',
//             year: 'Junior',
//             email: 'ushna.batool@university.edu',
//             advisor: 'Dr. Fatima Khan',
//             accommodations: 2,
//             avatar: '' // Testing initial fallback
//         },
//         {
//             id: '512346',
//             name: 'Ahmed Hassan',
//             major: 'EE',
//             batch: 'Batch 2021',
//             year: 'Senior',
//             email: 'ahmed.hassan@university.edu',
//             advisor: 'Dr. Asifa Khan',
//             accommodations: 1,
//             avatar: ''
//         },
//         {
//             id: '512347',
//             name: 'Sara Khan',
//             major: 'CND',
//             batch: 'Batch 2023',
//             year: 'Sophomore',
//             email: 'sara.khan@university.edu',
//             advisor: 'Dr. Fatima Khan',
//             accommodations: 0,
//             avatar: ''
//         }
//     ];

//     // Calculate counts dynamically
//     const totalActive = allStudents.length;
//     const totalWithAcc = allStudents.filter(s => s.accommodations > 0).length;

//     const filteredStudents = allStudents.filter((student) => {
//         const searchMatch = search === '' || 
//             student.name.toLowerCase().includes(search.toLowerCase()) || 
//             student.email.toLowerCase().includes(search.toLowerCase()) || 
//             student.id.includes(search) || 
//             student.major.toLowerCase().includes(search.toLowerCase());
        
//         const advisorMatch = advisors === '' || student.advisor === advisors;
//         const majorMatch = majors === '' || student.major === majors;
//         const yearMatch = years === '' || student.batch.includes(years);
        
//         // New filter logic: if toggle is on, only show students with acc > 0
//         const accMatch = !showOnlyAccommodations || student.accommodations > 0;

//         return searchMatch && advisorMatch && majorMatch && yearMatch && accMatch;
//     });

//     function Student() {
//     // 1. Start with an empty list and a loading state
//     const [allStudents, setAllStudents] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Filter states (keep these as they were)
//     const [advisors, setAdvisors] = useState('');
//     const [majors, setMajors] = useState('');
//     const [years, setYears] = useState('');
//     const [search, setSearch] = useState('');
//     const [showOnlyAccommodations, setShowOnlyAccommodations] = useState(false);

//     // 2. The Fetch Hook
//     useEffect(() => {
//         const getStudents = async () => {
//             try {
//                 // This points to your Node.js server address
//                 const response = await fetch('http://localhost:5000/api/students');
                
//                 if (!response.ok) throw new Error('Failed to fetch data');
                
//                 const data = await response.json();
//                 setAllStudents(data); // This fills the array with your DB rows
//                 setLoading(false);
//             } catch (err) {
//                 setError(err.message);
//                 setLoading(false);
//             }
//         };

//         getStudents();
//     }, []); // Empty array ensures this only runs once

//     return (
//         <div className="p-6 pl-12 space-y-6" style={{ width: '80vw' }}>
//             {/* Header */}
//             <div className="rounded-3xl p-4 bg-white flex items-center gap-5">
//                 <Users size={24} style={{ color: '#B39DDB' }} />
//                 <div className="flex flex-col">
//                   <h4 className="text-2xl font-semibold" style={{ color: '#5A4A61' }}>
//                       Student Directory
//                   </h4>
//                   <p style={{ color: '#B39DDB' }}>All students across OAP advisors</p>
//                 </div>
//             </div>

//             {/* Clickable Stat Cards */}
//             <div className='grid grid-cols-2 gap-4'>
//                 {/* Active Students Card */}
//                 <button 
//                     onClick={() => setShowOnlyAccommodations(false)}
//                     className={`p-6 text-left transition-all rounded-3xl border ${!showOnlyAccommodations ? 'bg-[#B39DDB]/20 border-[#B39DDB] shadow-md' : 'bg-white border-gray-100 opacity-70'}`}
//                 >
//                     <div className="flex flex-row justify-start items-center gap-4">
//                         <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm">
//                             <Users size={20} style={{ color: '#B39DDB' }} />
//                         </div>
//                         <div className="flex flex-col">
//                             <h4 className="text-2xl font-bold" style={{ color: '#5A4A61' }}>{totalActive}</h4>
//                             <p style={{ color: '#B39DDB' }} className="font-semibold"> Active Students </p>
//                         </div>
//                     </div>
//                 </button>      
                    
//                 {/* Accommodations Card */}
//                 <button 
//                     onClick={() => setShowOnlyAccommodations(true)}
//                     className={`p-6 text-left transition-all rounded-3xl border ${showOnlyAccommodations ? 'bg-[#B39DDB]/20 border-[#B39DDB] shadow-md' : 'bg-white border-gray-100 opacity-70'}`}
//                 >
//                     <div className="flex flex-row justify-start items-center gap-4">
//                         <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm">
//                             <Users size={20} style={{ color: '#B39DDB' }} />
//                         </div>
//                         <div className="flex flex-col">
//                             <h4 className="text-2xl font-bold" style={{ color: '#5A4A61' }}>{totalWithAcc}</h4>
//                             <p style={{ color: '#B39DDB' }} className="font-semibold"> Students with Accommodations </p>
//                         </div>
//                     </div>
//                 </button>
//             </div>

//             <div className='bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50'>
//                 <form className='space-y-4' onSubmit={(e) => e.preventDefault()}>
//                     {/* Search Bar */}
//                     <div className='flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 transition-focus-within focus-within:border-[#B39DDB]'>
//                         <Search size={20} className='text-gray-400' />
//                         <input
//                             type='text'
//                             placeholder='Search by name, email, ID, major...'
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                             className='flex-1 bg-transparent outline-none text-[#5A4A61] placeholder-gray-400 rounded-2xl border-[#B39DDB]/0 focus:border-[#B39DDB] transition-colors'
//                         />
//                     </div>

//                     {/* Filters */}
//                     <div className='flex gap-4 items-center'>
//                         <select
//                             value={advisors}
//                             onChange={(e) => setAdvisors(e.target.value)}
//                             className='bg-white border border-gray-200 rounded-xl px-4 py-2 text-[#5A4A61] outline-none hover:border-[#B39DDB] transition-colors'
//                         >
//                             <option value=''>All Advisors</option>
//                             <option value='Dr. Fatima Khan'>Dr. Fatima Khan</option>
//                             <option value='Dr. Asifa Khan'>Dr. Asifa Khan</option>
//                         </select>

//                         <select
//                             value={majors}
//                             onChange={(e) => setMajors(e.target.value)}
//                             className='bg-white border border-gray-200 rounded-xl px-4 py-2 text-[#5A4A61] outline-none hover:border-[#B39DDB] transition-colors'
//                         >
//                             <option value=''>All Majors</option>
//                             <option value='CS'>CS</option>
//                             <option value='EE'>EE</option>
//                             <option value='CND'>CND</option>
//                         </select>

//                         <select
//                             value={years}
//                             onChange={(e) => setYears(e.target.value)}
//                             className='bg-white border border-gray-200 rounded-xl px-4 py-2 text-[#5A4A61] outline-none hover:border-[#B39DDB] transition-colors'
//                         >
//                             <option value=''>All Years</option>
//                             <option value='Batch 2021'>Batch 2021</option>
//                             <option value='Batch 2022'>Batch 2022</option>
//                             <option value='Batch 2023'>Batch 2023</option>
//                         </select>
                        
//                         {showOnlyAccommodations && (
//                             <button 
//                                 onClick={() => setShowOnlyAccommodations(false)}
//                                 className="text-xs font-bold text-[white] bg-[#e91e8c]/50 px-3 py-1 rounded-full"
//                             >
//                                 Clear Acc. Filter ✕
//                             </button>
//                         )}
//                     </div>
//                 </form>

//                 <div className='mt-8'>
//                     {filteredStudents.length > 0 ? (
//                         filteredStudents.map(student => (
//                             <StudentDirectoryCard key={student.id} student={student} />
//                         ))
//                     ) : (
//                         <div className='text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200'>
//                             <p className='text-[#5A4A61] font-medium'>No students found matching your criteria.</p>
//                             <button onClick={() => {setSearch(''); setAdvisors(''); setMajors(''); setShowOnlyAccommodations(false);}} className="mt-2 text-[#B39DDB] underline">Reset all filters</button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }
// }

// export default Student;

import { Users, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import StudentDirectoryCard from '../../components/CommunityComponents/StudentDirectoryCard.jsx';

function Student() {
    // --- STATE (Memory) ---
    const [allStudents, setAllStudents] = useState([]); // Starts as empty box []
    const [loading, setLoading] = useState(true);      // Starts as "loading"
    
    // Filter states
    const [advisors, setAdvisors] = useState('');
    const [majors, setMajors] = useState('');
    const [years, setYears] = useState('');
    const [search, setSearch] = useState('');
    const [showOnlyAccommodations, setShowOnlyAccommodations] = useState(false);

    // --- EFFECT (The Connection) ---
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                // We ask the backend for the data
                const response = await fetch('http://localhost:5000/api/students');
                const data = await response.json();
                
                // We put the data into the "allStudents" memory
                setAllStudents(data);
                setLoading(false);
            } catch (error) {
                console.error("Connection failed:", error);
                setLoading(false);
            }
        };

        fetchStudents();
    }, []); // Run once when page loads

    // --- LOGIC (Filtering) ---
    // This stays the same! It works on 'allStudents' whether it's dummy data or real data.
    const filteredStudents = allStudents.filter((student) => {
    // 1. Search Bar Match
    const searchMatch = search === '' || 
        student.name.toLowerCase().includes(search.toLowerCase()) || 
        student.email.toLowerCase().includes(search.toLowerCase()) || 
        student.id.includes(search) || 
        student.major.toLowerCase().includes(search.toLowerCase());
    
    // 2. Advisor Dropdown Match
    // If dropdown is empty, everyone matches. Otherwise, check if advisor name matches.
    const advisorMatch = advisors === '' || student.advisor === advisors;

    // 3. Major Dropdown Match
    const majorMatch = majors === '' || student.major === majors;

    // 4. Year/Batch Match
    // Note: student.batch comes from DB as "2022", years state is "Batch 2022"
    // We check if the dropdown string contains the DB string (or vice versa)
    const yearMatch = years === '' || 
        (student.batch && years.includes(student.batch));
    
    // 5. Accommodations Toggle Match
    const accMatch = !showOnlyAccommodations || student.accommodations > 0;

    // Only return TRUE if the student passes ALL 5 tests
    return searchMatch && advisorMatch && majorMatch && yearMatch && accMatch;
  });

    const totalActive = allStudents.length;
    const totalWithAcc = allStudents.filter(s => s.accommodations > 0).length;

    // --- RENDER (The View) ---
    if (loading) return <div className="p-20 text-center">Connecting to Backend...</div>;

    return (
        <div className="p-6 pl-12 space-y-6" style={{ width: '80vw' }}>
            {/* Header and Stats */}
            <div className="rounded-3xl p-4 bg-white flex items-center gap-5">
                <Users size={24} style={{ color: '#B39DDB' }} />
                <h4 className="text-2xl font-semibold">Student Directory</h4>
            </div>

            {/* Stat Cards */}
            <div className='grid grid-cols-2 gap-4'>
                <button onClick={() => setShowOnlyAccommodations(false)} className="p-6 bg-white rounded-3xl border">
                    <h4 className="text-2xl font-bold">{totalActive}</h4>
                    <p>Active Students</p>
                </button>
                <button onClick={() => setShowOnlyAccommodations(true)} className="p-6 bg-white rounded-3xl border">
                    <h4 className="text-2xl font-bold">{totalWithAcc}</h4>
                    <p>With Accommodations</p>
                </button>
            </div>

            {/* Search Bar */}
            <div className='bg-white rounded-[2rem] p-6 shadow-sm border'>
                <input 
                    type='text' 
                    placeholder='Search...' 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none"
                />

                <div className='mt-8'>
                    {filteredStudents.map(student => (
                        <StudentDirectoryCard key={student.id} student={student} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Student;