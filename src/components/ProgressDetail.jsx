import React from "react"
import MilestoneCard from "./MilestoneCard"

export default function ProgressDetail({ apprentice, currentRole, onBack, onSubmit, onReview }) {
  const milestones = apprentice.milestones ?? []
  const completed = milestones.filter((m) => m.status === "Completed").length
  const total = milestones.length
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0

  const sorted = [...milestones].sort((a, b) => (a.target_week ?? 0) - (b.target_week ?? 0))

  const initials = apprentice.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#94A3B8] hover:text-white border border-white/10 hover:border-white/30 px-4 py-2 rounded-full transition-colors"
      >
        Back to All Apprentices
      </button>

      <div className="bg-[#061424] rounded-2xl border border-white/10 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#85C441]/20 border border-[#85C441]/30 flex items-center justify-center text-lg font-extrabold text-[#85C441] select-none shrink-0">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">{apprentice.name}</h2>
              {apprentice.track && (
                <p className="text-sm text-[#94A3B8] mt-0.5">{apprentice.track}</p>
              )}
              {apprentice.email && (
                <p className="text-xs text-[#94A3B8] mt-0.5 opacity-60">{apprentice.email}</p>
              )}
            </div>
          </div>
          <div className="sm:text-right min-w-[160px]">
            <p className="text-sm text-[#94A3B8] mb-2">{completed} of {total} milestones complete</p>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-[#85C441] h-2 rounded-full transition-all duration-700"
                style={{ width: progressPct + "%" }}
              />
            </div>
            <p className="text-xs text-[#94A3B8] mt-1.5 font-semibold">{progressPct}% complete</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-extrabold text-white tracking-tight mb-1">
          Programme <span className="text-[#85C441]">Milestones</span>
        </h3>
        <p className="text-sm text-[#94A3B8] mb-5">
          {total} structured checkpoint{total !== 1 ? "s" : ""}
        </p>
        {sorted.length === 0 ? (
          <p className="text-[#94A3B8] text-sm py-10 text-center">
            No milestones have been configured for this apprentice yet.
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
