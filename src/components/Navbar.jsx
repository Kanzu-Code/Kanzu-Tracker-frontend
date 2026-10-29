import React from 'react'
import kanzuLogo from '../logo/kanzu-logo.png'

export default function Navbar({ currentRole, onRoleToggle }) {
  const isApprentice = currentRole === 'apprentice'

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Kanzu Finance logo */}
        <img
          src={kanzuLogo}
          alt="Kanzu Finance"
          className="h-9 w-auto object-contain"
        />

        {/* Role switcher — no label, just the two pills */}
        <div className="bg-gray-100 rounded-full p-1 flex items-center">
          <button
            onClick={() => currentRole !== 'apprentice' && onRoleToggle()}
            className={`rounded-full py-1.5 px-5 text-sm font-semibold transition-all duration-200 ${
              isApprentice
                ? 'bg-[#0B2239] text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-[#0B2239]'
            }`}
          >
            Apprentice
          </button>
          <button
            onClick={() => currentRole !== 'mentor' && onRoleToggle()}
            className={`rounded-full py-1.5 px-5 text-sm font-semibold transition-all duration-200 ${
              !isApprentice
                ? 'bg-[#85C441] text-[#0B2239] shadow-sm'
                : 'text-[#94A3B8] hover:text-[#0B2239]'
            }`}
          >
            Mentor
          </button>
        </div>

      </div>
    </nav>
  )
}
