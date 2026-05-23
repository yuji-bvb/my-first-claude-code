'use client'

import { useState } from 'react'
import { StockLog, Part } from '@/lib/types'

interface Props {
  logs: StockLog[]
  parts: Part[]
  onClose: () => void
}

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  return { firstDay, daysInMonth }
}

function formatDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

export default function CalendarView({ logs, parts, onClose }: Props) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const { firstDay, daysInMonth } = getMonthDays(year, month)

  const logsByDate: Record<string, StockLog[]> = {}
  logs.forEach(log => {
    const date = log.createdAt.slice(0, 10)
    if (!logsByDate[date]) logsByDate[date] = []
    logsByDate[date].push(log)
  })

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
    setSelectedDate(null)
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
    setSelectedDate(null)
  }

  const selectedLogs = selectedDate ? (logsByDate[selectedDate] ?? []) : []

  const partMap = Object.fromEntries(parts.map(p => [p.id, p]))

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">◀</button>
            <h2 className="text-base font-bold w-28 text-center">{year}年 {month + 1}月</h2>
            <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">▶</button>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS.map((d, i) => (
              <div key={d} className={`text-center text-xs font-medium py-1 ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'}`}>
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const dayLogs = logsByDate[dateStr] ?? []
              const inCount = dayLogs.filter(l => l.type === 'in').length
              const outCount = dayLogs.filter(l => l.type === 'out').length
              const isToday = dateStr === formatDate(today)
              const isSelected = dateStr === selectedDate
              const weekDay = (firstDay + i) % 7

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`rounded-lg p-1 text-center transition-colors min-h-[52px] flex flex-col items-center gap-0.5
                    ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}
                    ${isToday && !isSelected ? 'ring-2 ring-blue-400' : ''}
                  `}
                >
                  <span className={`text-xs font-medium ${isSelected ? 'text-white' : weekDay === 0 ? 'text-red-400' : weekDay === 6 ? 'text-blue-400' : 'text-gray-700'}`}>
                    {day}
                  </span>
                  {(inCount > 0 || outCount > 0) && (
                    <div className="flex gap-0.5 flex-wrap justify-center">
                      {inCount > 0 && (
                        <span className={`text-xs px-1 rounded-full font-medium ${isSelected ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'}`}>
                          +{inCount}
                        </span>
                      )}
                      {outCount > 0 && (
                        <span className={`text-xs px-1 rounded-full font-medium ${isSelected ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}>
                          -{outCount}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {selectedDate && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                {parseInt(selectedDate.slice(5, 7))}月{parseInt(selectedDate.slice(8, 10))}日 の入出庫
              </h3>
              {selectedLogs.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">この日の記録はありません</p>
              ) : (
                <div className="space-y-2">
                  {selectedLogs.map(log => {
                    const part = partMap[log.partId]
                    return (
                      <div key={log.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${log.type === 'in' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          {log.type === 'in' ? '入庫' : '出庫'}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {part?.name ?? '削除済み部品'}
                          </p>
                          {log.memo && <p className="text-xs text-gray-400 truncate">{log.memo}</p>}
                        </div>
                        <span className="shrink-0 text-sm font-semibold text-gray-700">
                          {log.quantity} {part?.unit ?? ''}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
