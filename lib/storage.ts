import { Part, StockLog } from './types'

const PARTS_KEY = 'inventory_parts'
const LOGS_KEY = 'inventory_logs'

export function getParts(): Part[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(PARTS_KEY)
  return raw ? JSON.parse(raw) : []
}

export function saveParts(parts: Part[]): void {
  localStorage.setItem(PARTS_KEY, JSON.stringify(parts))
}

export function getLogs(): StockLog[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(LOGS_KEY)
  return raw ? JSON.parse(raw) : []
}

export function saveLogs(logs: StockLog[]): void {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs))
}
