import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ACCOMMODATION_TYPES = [
  { id: 'extra_time', label: 'Extra Time on Exams', options: ['1.5x', '2x'] },
  { id: 'additional_absences', label: 'Additional Absences' },
  { id: 'note_taker', label: 'Note-Taker Support' },
  { id: 'quiet_room', label: 'Quiet Testing Room' },
  { id: 'flex_deadlines', label: 'Flexible Deadlines' },
  { id: 'audio_recording', label: 'Audio Recording Permission' },
  { id: 'custom', label: 'Custom Accommodation' }
];

function GrantAccommodationModal({ isOpen, onClose, student, onGrant }) {
  const [selectedType, setSelectedType] = useState('audio_recording');
  const [customDetails, setCustomDetails] = useState('');
  const [expiry, setExpiry] = useState('');
  const [optionValue, setOptionValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedType('audio_recording');
      setCustomDetails('');
      setExpiry('');
      setOptionValue('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      type: ACCOMMODATION_TYPES.find(t => t.id === selectedType)?.label || 'Custom',
      details: selectedType === 'custom' ? customDetails : (optionValue || ''),
      granted: new Date().toISOString().split('T')[0],
      expires: expiry || null
    };

    if (student) {
      onGrant(student.id, payload);
    } else {

      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">Grant Accommodation</h3>
            <div className="text-sm text-gray-500">For {student ? student.name : 'Select a student'}</div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {ACCOMMODATION_TYPES.map(t => (
              <label
                key={t.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                  selectedType === t.id ? 'bg-[#F3E8FF] border-[#B39DDB]' : 'bg-white border-gray-100'
                }`}
              >
                <input
                  type="radio"
                  name="accType"
                  value={t.id}
                  checked={selectedType === t.id}
                  onChange={() => setSelectedType(t.id)}
                  className="hidden"
                />
                <div className="flex-1">
                  <div className="font-medium">{t.label}</div>
                  {t.options && <div className="text-xs text-gray-500 mt-1">Options: {t.options.join(', ')}</div>}
                </div>
              </label>
            ))}
          </div>

          {selectedType === 'extra_time' && (
            <div>
              <label className="block text-sm text-gray-700 mb-1">Select multiplier</label>
              <select
                value={optionValue}
                onChange={(e) => setOptionValue(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
              >
                <option value="">Select</option>
                <option value="1.5x time on all exams">1.5x</option>
                <option value="2x time on all exams">2x</option>
              </select>
            </div>
          )}

          {selectedType === 'custom' && (
            <div>
              <label className="block text-sm text-gray-700 mb-1">Custom description</label>
              <textarea
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                placeholder="Add specific details about this accommodation..."
                className="w-full rounded-lg border px-3 py-2 min-h-[80px]"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-700 mb-1">Expiry date (optional)</label>
            <input
              type="date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="rounded-lg border px-3 py-2"
            />
            <div className="text-xs text-gray-400 mt-1">Leave empty for no expiration date</div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#B39DDB] text-white hover:bg-[#9575CD]"
            >
              + Grant Accommodation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GrantAccommodationModal;
