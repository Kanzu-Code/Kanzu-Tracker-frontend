import React, { useMemo } from 'react'
import { isOverdue } from '../utils/helpers'

export default function SummaryCards({ apprentices }) {
  const stats = useMemo(() => {
    let completed = 0
    let remaining = 0
    let overdue = 0
    let paymentsDue = 0
    const now = new Date()

    apprentices.forEach((a) => {
      ;(a.milestones ?? []).forEach((m) => {
        if (m.status === 'Completed') {
          completed++
        } else {
          remaining++
          if (m.due_date && isOverdue(m.due_date, m.status)) overdue++
        }
        if (m.payment_status === 'Due') paymentsDue++
      })
    })

    return { completed, remaining, overdue, paymentsDue }
  }, [apprentices])

  const cards = [
    {
      label: 'Milestones Completed',
      value: stats.completed,
      sub: `across ${apprentices.length} apprentice${apprentices.length !== 1 ? 's' : ''}`,
      valueColor: 'text-[#85C441]',
      border: 'border-[#85C441]/25',
      dot: 'bg-[#85C441]',
    },
    {
      label: 'Milestones Remaining',
      value: stats.remaining,
      sub: 'still in progress',
      valueColor: 'text-blue-400',
      border: 'border-blue-400/25',
      dot: 'bg-blue-400',
    },
    {
      label: 'Overdue Milestones',
      value: stats.overdue,
      sub: 'more than 2 weeks late',
      valueColor: 'text-red-400',
      border: 'border-red-400/25',
      dot: 'bg-red-400',
    },
    {
      label: 'Payments Due',
      value: stats.paymentsDue,
      sub: 'awaiting disbursement',
      valueColor: 'text-amber-400',
      border: 'border-amber-400/25',
      dot: 'bg-amber-400',
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">
        Apprentice <span className="text-[#85C441]">Dashboard</span>
      </h1>
      <p className="text-sm text-[#94A3B8] mb-6">
        Live programme overview
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`bg-[#061424] rounded-2xl border ${card.border} p-5 flex flex-col gap-3`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full shrink-0 ${card.dot}`} />
              <span className="text-xs font-medium text-[#94A3B8]">{card.label}</span>
            </div>
            <span className={`text-4xl font-extrabold ${card.valueColor}`}>
              {card.value}
            </span>
            <span className="text-xs text-[#94A3B8]/70">{card.sub}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
