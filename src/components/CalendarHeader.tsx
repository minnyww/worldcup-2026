import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { getUniqueDates, formatDate } from '@/data'
import { useEffect, useRef } from 'react'

interface CalendarHeaderProps {
  selectedDate: string
  onDateSelect: (date: string) => void
}

export function CalendarHeader({ selectedDate, onDateSelect }: CalendarHeaderProps) {
  const dates = getUniqueDates()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const selectedEl = el.querySelector('[data-selected="true"]')
    if (selectedEl) {
      selectedEl.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
    }
  }, [selectedDate])

  const dayName = new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' })
  const dayNum = new Date(selectedDate + 'T12:00:00').getDate()

  return (
    <div className="relative">
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="text-xs text-muted-foreground">Sun</span>
        <span className="text-xs font-bold text-green-400">{dayName} {dayNum}</span>
        <span className="text-xs text-muted-foreground">Sat</span>
      </div>
      <div ref={scrollRef} className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 px-2 pb-2">
          {dates.map(date => {
            const d = new Date(date + 'T12:00:00')
            const isSelected = date === selectedDate
            const isToday = date === '2026-06-12'
            return (
              <button
                key={date}
                data-selected={isSelected}
                onClick={() => onDateSelect(date)}
                className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs transition-all ${
                  isSelected
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                    : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                }`}
              >
                <span className="font-medium">
                  {d.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className={`text-lg font-bold ${isSelected ? 'text-white' : ''}`}>
                  {d.getDate()}
                </span>
                {isToday && !isSelected && (
                  <span className="size-1.5 rounded-full bg-green-400" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
