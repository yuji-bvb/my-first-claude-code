'use client'

import { useState } from 'react'
import { Part } from '@/lib/types'

interface Props {
  part: Part
  type: 'in' | 'out'
  onSave: (quantity: number, memo: string) => void
  onClose: () => void
}

export default function StockModal({ part, type, onSave, onClose }: Props) {
  const [quantity, setQuantity] = useState(1)
  const [memo, setMemo] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (quantity <= 0) return
    onSave(quantity, memo)
    onClose()
  }

  const isOut = type === 'out'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-block w-2 h-2 rounded-full ${isOut ? 'bg-red-500' : 'bg-green-500'}`} />
            <h2 className="text-lg font-bold">{isOut ? '出庫' : '入庫'}</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">{part.name}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                数量 <span className="text-gray-400">（{part.unit}）</span>
              </label>
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                min={1}
                max={isOut ? part.quantity : undefined}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                required
              />
              {isOut && (
                <p className="text-xs text-gray-400 mt-1">現在庫: {part.quantity} {part.unit}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">メモ（任意）</label>
              <input
                type="text"
                value={memo}
                onChange={e => setMemo(e.target.value)}
                placeholder="例: 発注番号 #123"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className={`flex-1 py-2 rounded-lg text-sm font-medium text-white ${isOut ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {isOut ? '出庫する' : '入庫する'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
