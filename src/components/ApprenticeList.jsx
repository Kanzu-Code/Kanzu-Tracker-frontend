import React from 'react'
import { isOverdue } from '../utils/helpers'

export default function ApprenticeList({ apprentices, onSelectApprentice }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            All <span className="text-[#85C441]">Apprentices</span>
          </h2>
          <p className="text-sm text-[#94A3B8] mt-1">{apprentices.length} enrolled in current cohort</p>
        </div>
      </div>

      {apprentices.length === 0 ? (
        <div className="bg-[#061424] rounded-2xl border border-white/10 py-16 text-center">
          <p className="text-white font-semibold">No apprentices found</p>
          <p className="text-sm text-[#94A3B8] mt-1">Records will appear here once the cohort is registered.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {apprentices.map((apprentice) => (
            <ApprenticeCard
              key={apprentice.id}
              apprentice={apprentice}
              onSelect={onSelectApprentice}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ApprenticeCard({ apprentice, onSelect }) {
  const milestones = apprentice.milestones ?? []
  const completed = milestones.filter((m) => m.status === 'Completed').length
  const total = milestones.length
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0

  const hasOverdue = milestones.some((m) => isOverdue(m.due_date, m.status))

  const statusConfig = hasOverdue
    ? { label: 'Overdue', bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30' }
    : completed === total && total > 0
    ? { label: 'Complete', bg: 'bg-[#85C441]/15', text: 'text-[#85C441]', border: 'border-[#85C441]/30' }
    : { label: 'In Progress', bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' }

  // Initials from name
  const initials = apprentice.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="bg-[#061424] rounded-2xl border border-white/10 p-5 flex flex-col gap-4 hover:border-[#85C441]/40 transition-colors group">

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-[#85C441]/20 border border-[#85C441]/30 flex items-center justify-center text-sm font-extrabold text-[#85C441] select-none shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-white text-sm leading-tight truncate">{apprentice.name}</h3>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
              {statusConfig.label}
            </span>
          </div>
          {apprentice.track && (
            <p className="text-xs text-[#94A3B8] mt-0.5 truncate">{apprentice.track}</p>
          )}
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-[#94A3B8] mb-1.5">
          <span>Progress</span>
          <span>{completed}/{total} milestones</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div
            className="bg-[#85C441] h-1.5 rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-xs text-[#94A3B8]/70 mt-1 text-right">{progressPct}%</p>
      </div>

      {/* CTA */}
      <button
        onClick={() => onSelect(apprentice)}
        className="w-full mt-auto bg-[#85C441] hover:bg-[#72AB35] text-[#0B2239] text-sm font-bold py-2.5 rounded-full transition-colors"
      >
        View Milestones
      </button>
    </div>
  )
}
