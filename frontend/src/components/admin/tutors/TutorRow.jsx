import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
const TutorRow = ({ tutor, onToggleBlock }) => {
  const navigate = useNavigate();
  // 🧠 Function to get initials if no profile image
  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((n) => n[0]?.toUpperCase())
      .join('');

  // 🟢 Status badge styling
  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-medium";
    if (status === 'Active') return `${base} bg-green-100 text-green-700`;
    if (status === 'Blocked') return `${base} bg-red-100 text-red-700`;
    if (status === 'Inactive') return `${base} bg-yellow-50 text-yellow-700`;
    return `${base} bg-gray-100 text-gray-700`;
  };

  // 🔵 Verification badge styling
  const getVerificationBadge = (verification) => {
    const base = "px-3 py-1 rounded-full text-xs font-medium";
    if (verification === 'Verified') return `${base} bg-blue-100 text-blue-700`;
    return `${base} bg-yellow-100 text-yellow-700`;
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* 🧩 Tutor Info */}
      <td className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {/* Avatar (image or initials fallback) */}
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-cyan-500 text-white font-semibold text-sm">
            {tutor.profileImage ? (
              <img
                src={tutor.profileImage}
                alt={tutor.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              getInitials(tutor.fullName || '')
            )}
          </div>

          {/* Name + ID */}
          <div>
            <div className="font-medium text-gray-800">
              {tutor.fullName || "_"}
            </div>
            <div className="text-xs text-gray-500">
              ID: {tutor._id?.slice(-6).toUpperCase()}
            </div>
          </div>
        </div>
      </td>

      {/* 📞 Contact */}
      <td className="p-4 border-b border-gray-100">
        <div>
          <div className="text-sm text-gray-800">{tutor.email || '—'}</div>
          <div className="text-xs text-gray-500">{tutor.phone || '—'}</div>
        </div>
      </td>

      {/* 🟡 Status */}
      <td className="p-4 border-b border-gray-100">
        <span className={getStatusBadge(tutor.status)}>{tutor.status}</span>
      </td>

      {/* 🔵 Verification */}
      <td className="p-4 border-b border-gray-100">
        {tutor.isVerified ? (
          <span className={getVerificationBadge('Verified')}>Verified</span>
        ) : (
          <span className={getVerificationBadge('Pending')}>Pending</span>
        )}
      </td>

      {/* 🔴 Actions */}
      <td className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {/* View Button */}
          <button
            onClick={() =>  navigate(`/admin/tutors/${tutor._id}/details`)}
            className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-blue-600 transition-colors"
          >
            View Details
          </button>
          
          {/* Block/Unblock Button */}
          {tutor.status === 'Blocked' ? (
            <button
              onClick={() => onToggleBlock(tutor._id, tutor.fullName, tutor.status)}
              className="bg-green-500 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-green-600 transition-colors"
            >
              Unblock
            </button>
          ) : (
            <button
              onClick={() => onToggleBlock(tutor._id, tutor.fullName, tutor.status)}
              className="bg-red-500 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-red-600 transition-colors"
            >
              Block
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default TutorRow;