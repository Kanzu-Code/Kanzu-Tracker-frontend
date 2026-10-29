import React from 'react'

export default function Navbar({ currentRole, onRoleToggle }) {
  const isApprentice = currentRole === 'apprentice'

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold text-sm select-none">
            K
          </div>
          <span className="text-xl font-bold tracking-tight">
            Kanzu<span className="text-orange-400">Tracker</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400 hidden sm:block">Viewing as:</span>
          <button
            onClick={onRoleToggle}
            className={`
              relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium
              transition-all duration-200 border
              ${isApprentice
                ? 'bg-blue-600 border-blue-500 text-white hover:bg-blue-500'
                : 'bg-orange-500 border-orange-400 text-white hover:bg-orange-400'
              }
            `}
            aria-label={`Switch to ${isApprentice ? 'Mentor' : 'Apprentice'} role`}
          >
            <span>{isApprentice ? 'Apprentice' : 'Mentor'}</span>
            <span className="text-xs opacity-70">Switch</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
