import React, { useState, useEffect } from 'react'

export default function ReviewModal({ milestone, onApprove, onReturn, onClose }) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(null)

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const validate = (requireRating = true) => {
    const errs = {}
    if (requireRating && rating === 0) errs.rating = 'Please provide a rating between 1 and 5.'
    if (!comment.trim()) errs.comment = 'A comment is required before submitting.'
    return errs
  }

  const handleApprove = async () => {
    const errs = validate(true)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading('approve')
    try {
      await onApprove({ rating, comment: comment.trim() })
    } finally {
      setLoading(null)
    }
  }

  const handleReturn = async () => {
    const errs = validate(false)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading('return')
    try {
      await onReturn({ rating, comment: comment.trim() })
    } finally {
      setLoading(null)
    }
  }

  const displayRating = hovered || rating

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 space-y-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Review and Rate Work</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {milestone?.title ?? `Week ${milestone?.target_week} Milestone`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-medium leading-none mt-0.5"
            aria-label="Close modal"
          >
            Close
          </button>
        </div>

        {milestone?.submission_notes && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <p className="text-xs font-semibold text-slate-500 mb-1">Apprentice Submission</p>
            <p className="text-sm text-slate-700 leading-relaxed">{milestone.submission_notes}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Rating <span className="text-red-500">*</span>
          </label>
          <div
            className="flex gap-2"
            role="group"
            aria-label="Star rating"
            onMouseLeave={() => setHovered(0)}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => { setRating(star); setErrors((e) => ({ ...e, rating: undefined })) }}
                onMouseEnter={() => setHovered(star)}
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                className={`text-3xl transition-transform duration-100 hover:scale-110 focus:outline-none ${
                  star <= displayRating ? 'text-amber-400' : 'text-slate-200'
                }`}
              >
                &#9733;
              </button>
            ))}
            {rating > 0 && (
              <span className="self-center text-sm text-slate-500 ml-1">
                {ratingLabel(rating)}
              </span>
            )}
          </div>
          {errors.rating && (
            <p className="mt-1.5 text-xs text-red-500">{errors.rating}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="review-comment"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Comment <span className="text-red-500">*</span>
          </label>
          <textarea
            id="review-comment"
            rows={4}
            value={comment}
            onChange={(e) => {
              setComment(e.target.value)
              if (errors.comment) setErrors((err) => ({ ...err, comment: undefined }))
            }}
            placeholder="Provide constructive feedback on what was done well and what needs improvement."
            className={`
              w-full rounded-xl border px-4 py-3 text-sm text-slate-800 placeholder-slate-400
              focus:outline-none focus:ring-2 resize-none leading-relaxed
              ${errors.comment
                ? 'border-red-400 focus:ring-red-300'
                : 'border-slate-300 focus:ring-orange-300 focus:border-orange-400'
              }
            `}
          />
          {errors.comment && (
            <p className="mt-1.5 text-xs text-red-500">{errors.comment}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
            <p className="font-semibold text-emerald-700">Approve and Mark Complete</p>
            <p className="text-emerald-600 mt-0.5">Unlocks payment. Status changes to Due (UGX 100,000).</p>
          </div>
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
            <p className="font-semibold text-rose-700">Return for Changes</p>
            <p className="text-rose-600 mt-0.5">Payment stays Not yet due. The apprentice can resubmit.</p>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            disabled={!!loading}
            className="flex-1 border border-slate-300 text-slate-700 text-sm font-medium py-2.5 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleReturn}
            disabled={!!loading}
            className="flex-1 border border-rose-300 text-rose-600 text-sm font-medium py-2.5 rounded-xl hover:bg-rose-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {loading === 'return' ? <><Spinner /> Returning...</> : 'Return'}
          </button>
          <button
            onClick={handleApprove}
            disabled={!!loading}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
          >
            {loading === 'approve' ? <><Spinner /> Approving...</> : 'Approve'}
          </button>
        </div>
      </div>
    </Overlay>
  )
}

function ratingLabel(r) {
  return ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][r] ?? ''
}

function Overlay({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}
