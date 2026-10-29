import React, { useMemo } from 'react'

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
          if (m.due_date) {
            const diffDays = (now - new Date(m.due_date)) / (1000 * 60 * 60 * 24)
            if (diffDays > 14) overdue++
          }
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
      color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      valueColor: 'text-emerald-600',
    },
    {
      label: 'Milestones Remaining',
      value: stats.remaining,
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      valueColor: 'text-blue-600',
    },
    {
      label: 'Overdue Milestones',
      value: stats.overdue,
      color: 'bg-red-50 border-red-200 text-red-700',
      valueColor: 'text-red-600',
    },
    {
      label: 'Payments Due',
      value: stats.paymentsDue,
      color: 'bg-amber-50 border-amber-200 text-amber-700',
      valueColor: 'text-amber-600',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-xl border p-4 flex flex-col gap-2 shadow-sm ${card.color}`}
        >
          <span className="text-sm font-medium opacity-80">{card.label}</span>
          <span className={`text-3xl font-bold ${card.valueColor}`}>
            {card.value}
          </span>
        </div>
      ))}
    </div>
  )
}
