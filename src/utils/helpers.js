/**
 * Format a number as UGX currency.
 * e.g. 100000 → "UGX 100,000"
 */
export function formatUGX(amount) {
  return `UGX ${Number(amount).toLocaleString('en-UG')}`
}

/**
 * Return Tailwind badge classes for a given milestone status.
 */
export function statusBadgeClasses(status) {
  const map = {
    Completed:       'bg-emerald-100 text-emerald-700 border border-emerald-300',
    'Awaiting Review': 'bg-amber-100 text-amber-700 border border-amber-300',
    'In Progress':   'bg-blue-100 text-blue-700 border border-blue-300',
    Returned:        'bg-rose-100 text-rose-700 border border-rose-300',
    Overdue:         'bg-red-100 text-red-700 border border-red-400',
    'Not Started':   'bg-slate-100 text-slate-500 border border-slate-300',
  }
  return map[status] ?? 'bg-slate-100 text-slate-500 border border-slate-300'
}

/**
 * Return Tailwind classes for payment status text.
 */
export function paymentStatusClasses(paymentStatus) {
  const map = {
    Paid:          'text-emerald-600 font-semibold',
    Due:           'text-amber-600 font-semibold',
    'Not yet due': 'text-slate-400',
  }
  return map[paymentStatus] ?? 'text-slate-400'
}

/**
 * Returns true if a milestone is overdue (due date > 14 days ago and not Completed).
 * @param {string} dueDate  ISO date string
 * @param {string} status
 */
export function isOverdue(dueDate, status) {
  if (!dueDate || status === 'Completed') return false
  const due = new Date(dueDate)
  const now = new Date()
  const diffDays = (now - due) / (1000 * 60 * 60 * 24)
  return diffDays > 14
}
