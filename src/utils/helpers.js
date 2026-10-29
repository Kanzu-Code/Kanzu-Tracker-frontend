/**
 * Format a number as UGX currency.
 * The amount comes from the API (milestone.payment_amount).
 */
export function formatUGX(amount) {
  return `UGX ${Number(amount).toLocaleString('en-UG')}`
}

/**
 * Return Tailwind badge classes for a given milestone status.
 * Uses the Kanzu brand palette.
 */
export function statusBadgeClasses(status) {
  const map = {
    'Completed':        'bg-[#85C441]/20 text-[#85C441] border border-[#85C441]/40',
    'Awaiting Review':  'bg-amber-400/20 text-amber-400 border border-amber-400/40',
    'In Progress':      'bg-blue-400/20 text-blue-400 border border-blue-400/40',
    'Returned':         'bg-rose-400/20 text-rose-400 border border-rose-400/40',
    'Overdue':          'bg-red-500/20 text-red-400 border border-red-500/50',
    'Not Started':      'bg-white/10 text-[#94A3B8] border border-white/20',
  }
  return map[status] ?? 'bg-white/10 text-[#94A3B8] border border-white/20'
}

/**
 * Return Tailwind classes for payment status text.
 */
export function paymentStatusClasses(paymentStatus) {
  const map = {
    'Paid':          'text-[#85C441] font-semibold',
    'Due':           'text-amber-400 font-semibold',
    'Not yet due':   'text-[#94A3B8]',
  }
  return map[paymentStatus] ?? 'text-[#94A3B8]'
}

/**
 * Returns true if a milestone is overdue (due date > 14 days ago and not Completed).
 */
export function isOverdue(dueDate, status) {
  if (!dueDate || status === 'Completed') return false
  const due = new Date(dueDate)
  const now = new Date()
  const diffDays = (now - due) / (1000 * 60 * 60 * 24)
  return diffDays > 14
}
