import React from 'react'
import { statusBadgeClasses, paymentStatusClasses, formatUGX, isOverdue } from '../utils/helpers'

export default function MilestoneCard({ milestone, currentRole, onSubmit, onReview }) {
  const overdue = isOverdue(milestone.due_date, milestone.status)

  const displayStatus = overdue && milestone.status !== 'Completed'
    ? 'Overdue'
    : milestone.status

  const canSubmit =
    currentRole === 'apprentice' &&
    ['In Progress', 'Returned', 'Not Started'].includes(milestone.status)

  const canReview =
    currentRole === 'mentor' &&
    milestone.status === 'Awaiting Review'

  return (
    <div
      className={`
        bg-white rounded-2xl border p-5 shadow-sm flex flex-col gap-3
        transition-all duration-200
        ${overdue ? 'border-red-300 shadow-red-100' : 'border-slate-200 hover:shadow-md'}
      `}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            {milestone.label ?? `Week ${milestone.target_week}`}
          </p>
          <h4 className="font-semibold text-slate-800 text-sm mt-0.5">
            {milestone.title ?? `Milestone ${milestone.week}`}
          </h4>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadgeClasses(displayStatus)}`}>
          {displayStatus}
        </span>
      </div>

      {milestone.due_date && (
        <p className={`text-xs ${overdue ? 'text-red-500 font-semibold' : 'text-slate-400'}`}>
          Due: {new Date(milestone.due_date).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
          {overdue && <span className="ml-2 italic">(overdue)</span>}
        </p>
      )}

      {milestone.submission_notes && (
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
          <p className="text-xs font-semibold text-slate-500 mb-1">Submission Notes</p>
          <p className="text-sm text-slate-700 leading-relaxed">{milestone.submission_notes}</p>
        </div>
      )}

      {(milestone.mentor_rating || milestone.mentor_comment) && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
          <p className="text-xs font-semibold text-amber-600 mb-1">Mentor Feedback</p>
          {milestone.mentor_rating && (
            <div className="flex items-center gap-1 mb-1">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={`text-base ${i < milestone.mentor_rating ? 'text-amber-400' : 'text-slate-200'}`}
                >
                  &#9733;
                </span>
              ))}
              <span className="text-xs text-slate-500 ml-1">{milestone.mentor_rating}/5</span>
            </div>
          )}
          {milestone.mentor_comment && (
            <p className="text-sm text-slate-700 leading-relaxed">{milestone.mentor_comment}</p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div>
          <p className="text-xs text-slate-400">Payment</p>
          <p className={`text-sm mt-0.5 ${paymentStatusClasses(milestone.payment_status ?? 'Not yet due')}`}>
            {milestone.payment_status ?? 'Not yet due'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Amount</p>
          <p className="text-sm font-semibold text-slate-700">{formatUGX(100000)}</p>
        </div>
      </div>

      {canSubmit && (
        <button
          onClick={() => onSubmit(milestone)}
          className="mt-1 w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2 rounded-xl transition-colors"
        >
          Submit Work
        </button>
      )}

      {canReview && (
        <button
          onClick={() => onReview(milestone)}
          className="mt-1 w-full bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium py-2 rounded-xl transition-colors"
        >
          Review and Rate
        </button>
      )}
    </div>
  )
}
