import { useState } from "react";
import { Search, FileText, Users, CheckCircle2, AlertTriangle } from "lucide-react";
import GrantAccommodationModal from "./Components/AccommodationMod.jsx";
import StudentAccommodationCard from "./Components/StudentAccommodationCard.jsx";
import { useEffect } from "react";
function Accommodations() {
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [cardFilter, setCardFilter] = useState(null);
  const [students, setStudents] = useState([]);
  // const [students, setStudents] = useState([
  //   {
  //     id: '04521',
  //     name: 'Ushna Batool',
  //     email: 'ub04521@st.habibuniversity.edu.pk',
  //     accommodations: [
  //       {
  //         id: 'a1',
  //         type: 'Extra Time on Exams',
  //         details: '1.5x time on all exams',
  //         granted: '2024-09-01',
  //         expires: '2026-05-31' // active
  //       },
  //       {
  //         id: 'a2',
  //         type: 'Additional Absences',
  //         details: '3 additional absences per semester',
  //         granted: '2024-09-01',
  //         expires: '2026-05-31' // active
  //       }
  //     ]
  //   },
  //   {
  //     id: '03267',
  //     name: 'Ahmed Hassan',
  //     email: 'ah03267@st.habibuniversity.edu.pk',
  //     accommodations: [
  //       {
  //         id: 'a3',
  //         type: 'Quiet Testing Room',
  //         details: 'Quiet testing environment',
  //         granted: '2023-09-01',
  //         expires: '2024-01-15' // expired
  //       }
  //     ]
  //   },
  //   {
  //     id: '05892',
  //     name: 'Zainab Mirza',
  //     email: 'zm05892@st.habibuniversity.edu.pk',
  //     accommodations: [
  //       {
  //         id: 'a4',
  //         type: 'Note-Taker Support',
  //         details: 'Assigned note-taker for all lectures',
  //         granted: '2024-09-01',
  //         expires: '2026-05-31' // active
  //       },
  //       {
  //         id: 'a5',
  //         type: 'Flexible Deadlines',
  //         details: '48-hour extension on assignments',
  //         granted: '2023-09-01',
  //         expires: '2024-03-10' // expired
  //       }
  //     ]
  //   },
  //   {
  //     id: '04108',
  //     name: 'Ali Raza',
  //     email: 'ar04108@st.habibuniversity.edu.pk',
  //     accommodations: [
  //       {
  //         id: 'a6',
  //         type: 'Extra Time on Exams',
  //         details: '2x time on all exams',
  //         granted: '2024-09-01',
  //         expires: '2026-05-31' // active
  //       }
  //     ]
  //   },
  //   {
  //     id: '06344',
  //     name: 'Sara Qureshi',
  //     email: 'sq06344@st.habibuniversity.edu.pk',
  //     accommodations: [
  //       {
  //         id: 'a7',
  //         type: 'Audio Recording Permission',
  //         details: 'Permitted to record all lectures',
  //         granted: '2023-02-01',
  //         expires: '2024-02-01' // expired
  //       },
  //       {
  //         id: 'a8',
  //         type: 'Additional Absences',
  //         details: '5 additional absences per semester',
  //         granted: '2023-02-01',
  //         expires: '2024-02-01' // expired
  //       }
  //     ]
  //   },
  //   {
  //     id: '03791',
  //     name: 'Omar Farooq',
  //     email: 'of03791@st.habibuniversity.edu.pk',
  //     accommodations: [
  //       {
  //         id: 'a9',
  //         type: 'Quiet Testing Room',
  //         details: 'Separate quiet room for all assessments',
  //         granted: '2024-09-01',
  //         expires: '2026-05-31' // active
  //       }
  //     ]
  //   }
  // ]);
    useEffect(() => {
    // Now fetching from the specialized route
    fetch('http://localhost:5000/api/student-accommodations')
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(err => console.error("Error:", err));
  }, []);

  const now = new Date();

  const totalStudents = students.length;
  const totalActive = students.reduce((acc, s) =>
    acc + s.accommodations.filter(a => !a.expires || new Date(a.expires) >= now).length, 0
  );
  const expiredCount = students.reduce((acc, s) =>
    acc + s.accommodations.filter(a => a.expires && new Date(a.expires) < now).length, 0
  );

  const handleCardFilter = (type) => {
    setCardFilter(prev => prev === type ? null : type);
  };

  const filtered = students.filter(s => {
    const q = query.toLowerCase();
    const matchesQuery = !q || (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q)
    );

    const matchesCard =
      !cardFilter ||
      cardFilter === 'all' ||
      (cardFilter === 'active' && s.accommodations.some(a => !a.expires || new Date(a.expires) >= now)) ||
      (cardFilter === 'expired' && s.accommodations.some(a => a.expires && new Date(a.expires) < now));

    return matchesQuery && matchesCard;
  });

  const handleOpenModal = (student = null) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleGrant = (studentId, newAccommodation) => {
    setStudents(prev =>
      prev.map(s =>
        s.id === studentId
          ? { ...s, accommodations: [...s.accommodations, { id: Date.now().toString(), ...newAccommodation }] }
          : s
      )
    );
    setIsModalOpen(false);
  };

  const handleRemoveAccommodation = (studentId, accommodationId) => {
    setStudents(prev =>
      prev.map(s =>
        s.id === studentId
          ? { ...s, accommodations: s.accommodations.filter(a => a.id !== accommodationId) }
          : s
      )
    );
  };

  const cardBase = "rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md";
  const activeRing = "ring-2 ring-offset-1";

  return (
    <div className="p-6 pl-12 space-y-6" style={{ width: '80vw' }}>

      {/* Header */}
      <div className="rounded-3xl p-5 bg-white flex items-center gap-4">
        <FileText size={26} style={{ color: '#B39DDB' }} />
        <div>
          <h4 className="text-2xl font-semibold" style={{ color: '#B39DDB' }}>
            Accommodation Manager
          </h4>
          <p className="text-sm" style={{ color: '#B39DDB' }}>
            Manage student accommodations and support services
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">

        <div
          onClick={() => handleCardFilter('all')}
          className={`${cardBase} border border-purple-100 ${cardFilter === 'all' ? `${activeRing} ring-purple-300` : ''}`}
          style={{ background: 'linear-gradient(135deg, #ede7f6 0%, #e8eaf6 100%)' }}
        >
          <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#B39DDB' }}>
            <Users size={20} color="white" />
          </div>
          <div>
            <div className="text-2xl font-bold" style={{ color: '#5e35b1' }}>{totalStudents}</div>
            <div className="text-sm" style={{ color: '#7e57c2' }}>Students with Accommodations</div>
          </div>
        </div>

        <div
          onClick={() => handleCardFilter('active')}
          className={`${cardBase} border border-pink-100 ${cardFilter === 'active' ? `${activeRing} ring-pink-300` : ''}`}
          style={{ background: 'linear-gradient(135deg, #fce4ec 0%, #fce4f4 100%)' }}
        >
          <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f48fb1' }}>
            <CheckCircle2 size={20} color="white" />
          </div>
          <div>
            <div className="text-2xl font-bold" style={{ color: '#c2185b' }}>{totalActive}</div>
            <div className="text-sm" style={{ color: '#e91e8c' }}>Active Accommodations</div>
          </div>
        </div>

        <div
          onClick={() => handleCardFilter('expired')}
          className={`${cardBase} border border-orange-100 ${cardFilter === 'expired' ? `${activeRing} ring-orange-300` : ''}`}
          style={{ background: 'linear-gradient(135deg, #fff3e0 0%, #fce4ec 100%)' }}
        >
          <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#ffb74d' }}>
            <AlertTriangle size={20} color="white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">{expiredCount}</div>
            <div className="text-sm text-gray-500">Expired/Review Needed</div>
          </div>
        </div>

      </div>

      {/* Active filter indicator */}
      {cardFilter && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Filtering by: <span className="font-medium" style={{ color: '#B39DDB' }}>
            {cardFilter === 'all' ? 'All Students' : cardFilter === 'active' ? 'Active Accommodations' : 'Expired/Review Needed'}
          </span></span>
          <button onClick={() => setCardFilter(null)} className="text-xs px-2 py-0.5 rounded-full border border-gray-200 hover:bg-gray-100">
            Clear ✕
          </button>
        </div>
      )}

      {/* Search bar */}
      <div className="bg-white rounded-2xl px-5 py-4 border border-gray-100">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or student ID..."
            className="pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-100"
          />
        </div>
      </div>

      {/* Student cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-400 border border-gray-100">
            No students found matching your search.
          </div>
        ) : (
          filtered.map(student => (
            <StudentAccommodationCard
              key={student.id}
              student={student}
              onAdd={handleOpenModal}
              onRemove={handleRemoveAccommodation}
            />
          ))
        )}
      </div>

      {isModalOpen && (
        <GrantAccommodationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          student={selectedStudent}
          onGrant={handleGrant}
        />
      )}
    </div>
  );
}

export default Accommodations;