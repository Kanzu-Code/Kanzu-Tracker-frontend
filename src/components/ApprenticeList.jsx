import React from 'react'

export default function ApprenticeList({ apprentices, onSelectApprentice }) {
  if (!apprentices.length) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-lg font-medium">No apprentices found.</p>
        <p className="text-sm mt-1">Make sure the API server is running at localhost:8000.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-700 mb-4">
        All Apprentices
        <span className="ml-2 text-sm font-normal text-slate-400">
          ({apprentices.length} enrolled)
        </span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {apprentices.map((apprentice) => (
          <ApprenticeCard
            key={apprentice.id}
            apprentice={apprentice}
            onSelect={onSelectApprentice}
          />
        ))}
      </div>
    </div>
  )
}

function ApprenticeCard({ apprentice, onSelect }) {
  const milestones = apprentice.milestones ?? []
  const completed = milestones.filter((m) => m.status === 'Completed').length
  const total = milestones.length
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0

  const hasOverdue = milestones.some((m) => {
    if (m.status === 'Completed') return false
    if (!m.due_date) return false
    const diffDays = (new Date() - new Date(m.due_date)) / (1000 * 60 * 60 * 24)
    return diffDays > 14
  })

  const overallStatus = hasOverdue
    ? { label: 'Overdue', cls: 'bg-red-100 text-red-600' }
    : completed === total && total > 0
    ? { label: 'Complete', cls: 'bg-emerald-100 text-emerald-700' }
    : { label: 'In Progress', cls: 'bg-blue-100 text-blue-700' }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-800 text-base leading-tight">
            {apprentice.name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{apprentice.track ?? 'General Track'}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${overallStatus.cls}`}>
          {overallStatus.label}
        </span>
      </div>

      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Progress</span>
          <span>{completed}/{total} milestones</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-orange-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-1 text-right">{progressPct}% complete</p>
      </div>

      <button
        onClick={() => onSelect(apprentice)}
        className="w-full mt-auto bg-slate-900 hover:bg-slate-700 text-white text-sm font-medium py-2 px-4 rounded-xl transition-colors"
      >
        View Progress and Milestones
      </button>
    </div>
  )
}
