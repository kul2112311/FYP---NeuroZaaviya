// src/pages/Accommodations/Accommodations.jsx
import { useState } from 'react';
import { Search, Plus, X } from 'lucide-react';
import GrantAccommodationModal from '../../components/Accommodations/GrantAccommodationModal.jsx';
import StudentAccommodationCard from '../../components/Accommodations/StudentAccommodationCard.jsx';

function Accommodations() {
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Sample data matching your screenshots
  const [students, setStudents] = useState([
    {
      id: 'S12345',
      name: 'Ushna Batool',
      email: 'ushna.batool@university.edu',
      accommodations: [
        {
          id: 'a1',
          type: 'Extra Time on Exams',
          details: '1.5x time on all exams',
          granted: '2024-09-01',
          expires: '2025-05-31'
        },
        {
          id: 'a2',
          type: 'Additional Absences',
          details: '3 additional absences per semester',
          granted: '2024-09-01',
          expires: '2025-05-31'
        }
      ]
    },
    {
      id: 'S12346',
      name: 'Ahmed Hassan',
      email: 'ahmed.hassan@university.edu',
      accommodations: [
        {
          id: 'a3',
          type: 'Quiet Testing Room',
          details: 'Quiet testing environment',
          granted: '2024-09-01',
          expires: '2025-05-31'
        }
      ]
    }
  ]);

  // Derived counts
  const totalStudents = students.length;
  const totalActive = students.reduce((acc, s) => acc + s.accommodations.length, 0);
  const expiredCount = students.reduce((acc, s) => {
    const now = new Date();
    const expiredForStudent = s.accommodations.filter(a => a.expires && new Date(a.expires) < now).length;
    return acc + expiredForStudent;
  }, 0);

  const filtered = students.filter(s => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q)
    );
  });

  const handleOpenModal = (student = null) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleGrant = (studentId, newAccommodation) => {
    // Replace with API call in production
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
    // Replace with API call in production
    setStudents(prev =>
      prev.map(s =>
        s.id === studentId
          ? { ...s, accommodations: s.accommodations.filter(a => a.id !== accommodationId) }
          : s
      )
    );
  };

  return (
    <div className="p-6 pl-12 space-y-6" style={{ width: '80vw' }}>
      {/* Header */}
      <div className="rounded-3xl p-4 bg-white flex items-center gap-5">
        <div className="flex flex-col">
          <h4 className="text-2xl font-semibold" style={{ color: '#B39DDB' }}>
            Accommodation Management
          </h4>
          <p style={{ color: '#B39DDB' }}>Manage student accommodations</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl p-4 bg-white border border-gray-100">
          <div className="text-sm text-gray-500">Students with accommodations</div>
          <div className="text-2xl font-bold mt-2">{totalStudents}</div>
        </div>
        <div className="rounded-2xl p-4 bg-white border border-gray-100">
          <div className="text-sm text-gray-500">Active accommodations</div>
          <div className="text-2xl font-bold mt-2">{totalActive}</div>
        </div>
        <div className="rounded-2xl p-4 bg-white border border-gray-100">
          <div className="text-sm text-gray-500">Expired / Review needed</div>
          <div className="text-2xl font-bold mt-2 text-red-500">{expiredCount}</div>
        </div>
      </div>

      {/* Search and Add */}
      <div className="bg-white rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 w-1/2">
            <div className="relative w-full">
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name"
                className="pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenModal(null)}
              className="flex items-center gap-2 bg-[#B39DDB] text-white px-4 py-2 rounded-lg hover:bg-[#9575CD] transition-colors"
            >
              <Plus size={16} />
              <span>+ Add Accommodation</span>
            </button>
          </div>
        </div>

        {/* Students list */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No students found matching your filters.</p>
          ) : (
            filtered.map(student => (
              <div key={student.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center text-purple-800 font-semibold">
                        {student.name.split(' ').map(n => n[0]).slice(0,2).join('')}
                      </div>
                      <div>
                        <div className="font-semibold">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email} • ID: {student.id}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleOpenModal(student)}
                      className="text-sm px-3 py-1 rounded-md bg-white border border-gray-200 hover:bg-gray-100"
                    >
                      + Add Accommodation
                    </button>
                  </div>
                </div>

                {/* Accommodations */}
                <div className="mt-4 space-y-3">
                  {student.accommodations.map(acc => (
                    <div key={acc.id} className="flex items-start justify-between bg-white p-3 rounded-lg border border-gray-100">
                      <div>
                        <div className="font-medium">{acc.type}</div>
                        <div className="text-sm text-gray-600">{acc.details}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Granted: {new Date(acc.granted).toLocaleDateString()} {acc.expires ? `• Expires: ${new Date(acc.expires).toLocaleDateString()}` : ''}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRemoveAccommodation(student.id, acc.id)}
                          className="text-red-500 hover:text-red-600"
                          aria-label="Remove accommodation"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
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
