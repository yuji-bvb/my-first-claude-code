'use client'

import { useState, useEffect, useCallback } from 'react'
import { Part, StockLog } from '@/lib/types'
import { getParts, saveParts, getLogs, saveLogs } from '@/lib/storage'

function generateId() {
  return crypto.randomUUID()
}

export function useInventory() {
  const [parts, setParts] = useState<Part[]>([])
  const [logs, setLogs] = useState<StockLog[]>([])

  useEffect(() => {
    setParts(getParts())
    setLogs(getLogs())
  }, [])

  const addPart = useCallback((data: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString()
    const newPart: Part = { ...data, id: generateId(), createdAt: now, updatedAt: now }
    const updated = [...parts, newPart]
    setParts(updated)
    saveParts(updated)
  }, [parts])

  const updatePart = useCallback((id: string, data: Partial<Omit<Part, 'id' | 'createdAt'>>) => {
    const updated = parts.map(p =>
      p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
    )
    setParts(updated)
    saveParts(updated)
  }, [parts])

  const deletePart = useCallback((id: string) => {
    const updated = parts.filter(p => p.id !== id)
    setParts(updated)
    saveParts(updated)
  }, [parts])

  const stockIn = useCallback((partId: string, quantity: number, memo: string) => {
    const log: StockLog = {
      id: generateId(),
      partId,
      type: 'in',
      quantity,
      memo,
      createdAt: new Date().toISOString(),
    }
    const updatedLogs = [log, ...logs]
    setLogs(updatedLogs)
    saveLogs(updatedLogs)

    const updated = parts.map(p =>
      p.id === partId
        ? { ...p, quantity: p.quantity + quantity, updatedAt: new Date().toISOString() }
        : p
    )
    setParts(updated)
    saveParts(updated)
  }, [parts, logs])

  const stockOut = useCallback((partId: string, quantity: number, memo: string) => {
    const log: StockLog = {
      id: generateId(),
      partId,
      type: 'out',
      quantity,
      memo,
      createdAt: new Date().toISOString(),
    }
    const updatedLogs = [log, ...logs]
    setLogs(updatedLogs)
    saveLogs(updatedLogs)

    const updated = parts.map(p =>
      p.id === partId
        ? { ...p, quantity: Math.max(0, p.quantity - quantity), updatedAt: new Date().toISOString() }
        : p
    )
    setParts(updated)
    saveParts(updated)
  }, [parts, logs])

  const bulkAddParts = useCallback((items: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    const now = new Date().toISOString()
    const newParts: Part[] = items.map(item => ({
      ...item,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }))
    const updated = [...parts, ...newParts]
    setParts(updated)
    saveParts(updated)
  }, [parts])

  const categories = Array.from(new Set(parts.map(p => p.category))).filter(Boolean)

  return { parts, logs, categories, addPart, updatePart, deletePart, stockIn, stockOut, bulkAddParts }
}
