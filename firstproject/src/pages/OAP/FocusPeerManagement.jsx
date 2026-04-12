// import { useState } from 'react';
// import { UserPlus, Mail } from 'lucide-react';

// export default function FocusPeerManagement() {
//   const [email, setEmail] = useState('');
//   const [assignedStudents, setAssignedStudents] = useState([]);
//   const [invitedPeers, setInvitedPeers] = useState([]);

//   const students = [
//     { id: 'st1', name: 'Sarah Ahmed',   studentId: '04231', email: 'sa04231@st.habibuniversity.edu.pk' },
//     { id: 'st2', name: 'Fatima Khan',   studentId: '03876', email: 'fk03876@st.habibuniversity.edu.pk' },
//     { id: 'st3', name: 'Zainab Malik',  studentId: '05102', email: 'zm05102@st.habibuniversity.edu.pk' },
//     { id: 'st4', name: 'Ali Hassan',    studentId: '04589', email: 'ah04589@st.habibuniversity.edu.pk' },
//     { id: 'st5', name: 'Omar Ibrahim',  studentId: '03654', email: 'oi03654@st.habibuniversity.edu.pk' },
//     { id: 'st6', name: 'Hassan Ali',    studentId: '05378', email: 'ha05378@st.habibuniversity.edu.pk' },
//   ];

//   const toggleStudent = (id) => {
//     setAssignedStudents(prev =>
//       prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
//     );
//   };

//   const handleInvite = () => {
//     if (!email.trim()) {
//       alert('Please enter an email address');
//       return;
//     }
//     const newPeer = {
//       id: Date.now().toString(),
//       email,
//       students: students.filter(s => assignedStudents.includes(s.id)),
//     };
//     setInvitedPeers(prev => [...prev, newPeer]);
//     setEmail('');
//     setAssignedStudents([]);
//   };

//   return (
//     <div className="p-6 pl-12 space-y-6" style={{ width: '80vw' }}>

//       {/* Header */}
//       <div className="rounded-3xl p-5 bg-white flex items-center gap-4">
//         <UserPlus size={26} style={{ color: '#B39DDB' }} />
//         <div>
//           <h4 className="text-2xl font-semibold" style={{ color: '#B39DDB' }}>
//             Focus Peer Management
//           </h4>
//           <p className="text-sm" style={{ color: '#B39DDB' }}>
//             Invite students to become Focus Peers and assign neurodivergent students to them
//           </p>
//         </div>
//       </div>

//       {/* Invite form */}
//       <div className="bg-white rounded-3xl p-6 space-y-5">

//         <div className="flex items-center gap-2">
//           <Mail size={18} style={{ color: '#B39DDB' }} />
//           <h5 className="text-lg font-semibold text-gray-800">Invite New Focus Peer</h5>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Focus Peer Email Address *
//           </label>
//           <input
//             type="email"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//             placeholder="xx00000@st.habibuniversity.edu.pk"
//             className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-100"
//           />
//           <p className="text-xs text-gray-400 mt-1">
//             The student will receive an invitation email to register as a Focus Peer
//           </p>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-0.5">
//             Assign ND Students *
//           </label>
//           <p className="text-xs text-gray-400 mb-3">
//             Select neurodivergent students to assign to this Focus Peer
//           </p>

//           <div className="grid grid-cols-2 gap-3">
//             {students.map(s => {
//               const checked = assignedStudents.includes(s.id);
//               return (
//                 <label
//                   key={s.id}
//                   className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
//                   style={{
//                     borderColor: checked ? '#B39DDB' : '#e5e7eb',
//                     backgroundColor: checked ? '#f5f0ff' : 'white',
//                   }}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={checked}
//                     onChange={() => toggleStudent(s.id)}
//                     className="hidden"
//                   />
//                   <div
//                     className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border"
//                     style={{
//                       borderColor: checked ? '#B39DDB' : '#d1d5db',
//                       backgroundColor: checked ? '#B39DDB' : 'white',
//                     }}
//                   >
//                     {checked && (
//                       <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
//                         <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//                       </svg>
//                     )}
//                   </div>
//                   <div>
//                     <div className="text-sm font-medium text-gray-800">{s.name}</div>
//                     <div className="text-xs text-gray-400">{s.email}</div>
//                   </div>
//                 </label>
//               );
//             })}
//           </div>
//         </div>

//         <button
//           onClick={handleInvite}
//           className="w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-2"
//           style={{ backgroundColor: '#B39DDB' }}
//         >
//           <UserPlus size={18} />
//           Send Invitation
//         </button>
//       </div>

//       {/* Invited peers list */}
//       <div className="bg-white rounded-3xl p-6">
//         <h5 className="text-lg font-semibold mb-3 text-gray-800">Invited Focus Peers</h5>
//         {invitedPeers.length === 0 ? (
//           <p className="text-gray-400 text-sm">No Focus Peers invited yet. Use the form above to invite students.</p>
//         ) : (
//           <ul className="space-y-3">
//             {invitedPeers.map(peer => (
//               <li key={peer.id} className="border border-gray-200 rounded-xl p-4">
//                 <div className="font-medium text-gray-800">{peer.email}</div>
//                 <div className="text-sm text-gray-500 mt-1">
//                   Assigned Students: {peer.students.map(s => `${s.name} (${s.studentId})`).join(', ') || 'None'}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//     </div>
//   );
// }