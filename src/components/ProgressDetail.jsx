import React from 'react'
import MilestoneCard from './MilestoneCard'

export default function ProgressDetail({
  apprentice,
  currentRole,
  onBack,
  onSubmit,
  onReview,
}) {
  const milestones = apprentice.milestones ?? []

  const completed = milestones.filter((m) => m.status === 'Completed').length
  const total = milestones.length
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0

  const sorted = [...milestones].sort(
    (a, b) => (a.target_week ?? 0) - (b.target_week ?? 0)
  )

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        aria-label="Back to apprentice list"
      >
        Back to All Apprentices
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl font-bold select-none shrink-0">
              {apprentice.name?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{apprentice.name}</h2>
              <p className="text-sm text-slate-500">
                {apprentice.track ?? 'General Track'}
                {apprentice.email && (
                  <span className="ml-3 text-slate-400">{apprentice.email}</span>
                )}
              </p>
            </div>
          </div>

          <div className="sm:text-right">
            <p className="text-sm text-slate-500 mb-1">
              {completed}/{total} milestones completed
            </p>
            <div className="w-full sm:w-48 bg-slate-100 rounded-full h-2.5">
              <div
                className="bg-orange-400 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">{progressPct}% complete</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-700 mb-4">
          Structured Milestones
          <span className="ml-2 text-sm font-normal text-slate-400">
            (4 checkpoints — Weeks 1, 3, 6, 8)
          </span>
        </h3>

        {sorted.length === 0 ? (
          <p className="text-slate-400 text-sm py-8 text-center">
            No milestones have been set up for this apprentice yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sorted.map((milestone) => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                currentRole={currentRole}
                onSubmit={onSubmit}
                onReview={onReview}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
