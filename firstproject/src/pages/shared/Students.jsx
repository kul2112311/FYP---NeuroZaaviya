import { Users, Search, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import StudentDirectoryCard from '../../components/CommunityComponents/StudentDirectoryCard.jsx';

function Student(){
    const [advisors, setAdvisors] = useState('');
    const [majors, setMajors] = useState('');
    const [years, setYears] = useState('');
    const [search, setSearch] = useState('');
     const allStudents = [
        {
            id: '512345',
            name: 'Ushna Batool',
            major: 'CS',
            batch: 'Batch 2022',
            year: 'Junior',
            email: 'ushna.batool@university.edu',
            advisor: 'Dr. Fatima Khan',
            accommodations: 2,
            avatar: 'https://via.placeholder.com/60'
        },
        {
            id: '512346',
            name: 'Ahmed Hassan',
            major: 'EE',
            batch: 'Batch 2021',
            year: 'Senior',
            email: 'ahmed.hassan@university.edu',
            advisor: 'Dr. Asifa Khan',
            accommodations: 1,
            avatar: 'https://via.placeholder.com/60'
        },
        {
            id: '512347',
            name: 'Sara Khan',
            major: 'CND',
            batch: 'Batch 2023',
            year: 'Sophomore',
            email: 'sara.khan@university.edu',
            advisor: 'Dr. Fatima Khan',
            accommodations: 0,
            avatar: 'https://via.placeholder.com/60'
        }
    ];
    const filteredStudents=allStudents.filter((students)=>{
        const searchMatch = search === '' || students.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) || students.email.toLocaleLowerCase().includes(search.toLocaleLowerCase()) || students.id.includes(search) || students.major.toLocaleLowerCase().includes(search.toLocaleLowerCase()) || students.batch.toLocaleLowerCase().includes(search.toLocaleLowerCase());
        const advisorMatch = advisors === '' || students.advisor === advisors;
        const majorMatch = majors === '' || students.major === majors;
        const yearMatch = years === '' || students.batch.includes(years);
        return searchMatch && advisorMatch && majorMatch && yearMatch;
    })
    return(
        <div className="p-6 pl-12 space-y-6" style={{ width: '80vw' }}>
            <div className="rounded-3xl p-4 bg-white flex items-center gap-5">
                <Users size={24} style={{ color: '#B39DDB' }} />
                <div className="flex flex-col">
                  <h4 className="text-2xl font-semibold" style={{ color: '#B39DDB' }}>
                      Student Directory
                  </h4>
                  <p style={{ color: '#B39DDB' }}>All students across OAP advisors</p>
                </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
                <div className='p-6 space-y-6 bg-[#B39DDB] border-white rounded-3xl'>
                    <div className="flex flex-row justify-start items-center gap-4">
                        <Users size={24} style={{ color: 'white' }} />
                        <div className="flex flex-col">
                            <h4 className="text-2xl font-semibold" style={{ color: 'white' }}>  8 </h4>
                            <p style={{ color: 'white' }}> Active Students </p>
                        </div>
                    </div>
                </div>
                    
                <div className='p-6 space-y-6 bg-[#B39DDB] border-white rounded-3xl'>
                    <div className="flex flex-row justify-start items-center gap-4">
                        <Users size={24} style={{ color: 'white' }} />
                        <div className="flex flex-col">
                            <h4 className="text-2xl font-semibold" style={{ color: 'white' }}>  8 </h4>
                            <p style={{ color: 'white' }}> Students with Accomodations </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='bg-white rounded-3xl p-6'>
                <form className='space-y-4'>
                    {/* Search Bar */}
                    <div className='flex items-center gap-3 pb-4 border-b border-gray-200 rounded-2xl px-4 py-3 bg-gray-50'>
                        <Search size={20} className='text-gray-400' />
                        <input
                            type='text'
                            placeholder='Search by name, email, ID, major, or batch year...'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className='flex-1 border border-gray-300 text-gray-700 placeholder-gray-400 bg-transparent rounded-2xl'
                        />
                    </div>

                    {/* Filters */}
                    <div className='flex gap-4 items-center pt-4'>
                        {/* All Advisors Dropdown */}
                        <div className='relative'>
                            <select
                                value={advisors}
                                onChange={(e) => setAdvisors(e.target.value)}
                                className='appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-gray-700 cursor-pointer outline-none hover:border-gray-400'
                                style={{ paddingRight: '40px' }}
                            >
                                <option value=''>All Advisors</option>
                                <option value='Dr. Fatima Khan'>Dr. Fatima Khan</option>
                                <option value='Dr. Asifa Khan'>Dr. Asifa Khan</option>
                            </select>
                            
                        </div>

                        {/* All Majors Dropdown */}
                        <div className='relative'>
                            <select
                                value={majors}
                                onChange={(e) => setMajors(e.target.value)}
                                className='appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-gray-700 cursor-pointer outline-none hover:border-gray-400'
                                style={{ paddingRight: '40px' }}
                            >
                                <option value=''>All Majors</option>
                                <option value='CS'>CS</option>
                                <option value='EE'>EE</option>
                                <option value='CND'>CND</option>
                            </select>
                            
                        </div>

                        {/* All Years Dropdown */}
                        <div className='relative'>
                            <select
                                value={years}
                                onChange={(e) => setYears(e.target.value)}
                                className='appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-gray-700 cursor-pointer outline-none hover:border-gray-400'
                                style={{ paddingRight: '40px' }}
                            >
                                <option value=''>All Years</option>
                                <option value='Batch 2021'>Batch 2021</option>
                                <option value='Batch 2022'>Batch 2022</option>
                                <option value='Batch 2023'>Batch 2023</option>
                            </select>

                            
                        </div>
                    </div>
                </form>
                 <div className='mt-6'>
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map(student => (
                            <StudentDirectoryCard key={student.id} student={student} />
                        ))
                    ) : (
                        <p className='text-gray-500 text-center py-8'>
                            No students found matching your filters.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Student;