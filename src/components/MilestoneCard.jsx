import React from 'react'
import { statusBadgeClasses, paymentStatusClasses, formatUGX, isOverdue } from '../utils/helpers'

export default function MilestoneCard({ milestone, currentRole, onSubmit, onReview }) {
  const overdue = isOverdue(milestone.due_date, milestone.status)
  const displayStatus = overdue && milestone.status !== 'Completed' ? 'Overdue' : milestone.status

  const canSubmit =
    currentRole === 'apprentice' &&
    ['In Progress', 'Returned', 'Not Started'].includes(milestone.status)

  const canReview =
    currentRole === 'mentor' &&
    milestone.status === 'Awaiting Review'

  return (
    <div
      className={`
        bg-[#061424] rounded-2xl border p-5 flex flex-col gap-3.5 transition-all duration-200
        ${overdue ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          {milestone.label && (
            <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-0.5">
              {milestone.label}
            </p>
          )}
          {milestone.title && (
            <h4 className="font-bold text-white text-sm">{milestone.title}</h4>
          )}
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${statusBadgeClasses(displayStatus)}`}>
          {displayStatus}
        </span>
      </div>

      {/* Due date */}
      {milestone.due_date && (
        <p className={`text-xs ${overdue ? 'text-red-400 font-semibold' : 'text-[#94A3B8]'}`}>
          Due {new Date(milestone.due_date).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
          {overdue && <span className="ml-2 italic text-red-400/80">overdue</span>}
        </p>
      )}

      {/* Submission notes */}
      {milestone.submission_notes && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <p className="text-xs font-semibold text-[#94A3B8] mb-1.5">Submission</p>
          <p className="text-sm text-white/80 leading-relaxed">{milestone.submission_notes}</p>
        </div>
      )}

      {/* Mentor feedback */}
      {(milestone.mentor_rating || milestone.mentor_comment) && (
        <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-3">
          <p className="text-xs font-semibold text-amber-400 mb-1.5">Mentor Feedback</p>
          {milestone.mentor_rating && (
            <div className="flex items-center gap-0.5 mb-1.5">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={`text-sm ${i < milestone.mentor_rating ? 'text-amber-400' : 'text-white/20'}`}>
                  &#9733;
                </span>
              ))}
              <span className="text-xs text-[#94A3B8] ml-1.5">{milestone.mentor_rating}/5</span>
            </div>
          )}
          {milestone.mentor_comment && (
            <p className="text-sm text-white/80 leading-relaxed">{milestone.mentor_comment}</p>
          )}
        </div>
      )}

      {/* Payment row — only render if the API sends payment data */}
      {(milestone.payment_status !== undefined || milestone.payment_amount !== undefined) && (
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div>
            <p className="text-xs text-[#94A3B8]">Payment status</p>
            {milestone.payment_status && (
              <p className={`text-sm font-semibold mt-0.5 ${paymentStatusClasses(milestone.payment_status)}`}>
                {milestone.payment_status}
              </p>
            )}
          </div>
          {milestone.payment_amount !== undefined && (
            <div className="text-right">
              <p className="text-xs text-[#94A3B8]">Amount</p>
              <p className="text-sm font-bold text-white">{formatUGX(milestone.payment_amount)}</p>
            </div>
          )}
        </div>
      )}

      {canSubmit && (
        <button
          onClick={() => onSubmit(milestone)}
          className="w-full border border-white/20 hover:bg-[#85C441] hover:border-[#85C441] hover:text-[#0B2239] text-white text-sm font-bold py-2.5 rounded-full transition-all duration-200"
        >
          Submit Work
        </button>
      )}

      {canReview && (
        <button
          onClick={() => onReview(milestone)}
          className="w-full bg-[#85C441] hover:bg-[#72AB35] text-[#0B2239] text-sm font-bold py-2.5 rounded-full transition-colors"
        >
          Review and Rate
        </button>
      )}
    </div>
  )
}
