'use client'

import { Part } from '@/lib/types'

interface Props {
  part: Part
  onStockIn: () => void
  onStockOut: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function PartCard({ part, onStockIn, onStockOut, onEdit, onDelete }: Props) {
  const isLow = part.quantity <= part.minQuantity
  const isEmpty = part.quantity === 0

  return (
    <div className={`bg-white rounded-2xl shadow-sm border-2 p-4 flex flex-col gap-3 ${isEmpty ? 'border-red-400' : isLow ? 'border-yellow-400' : 'border-transparent'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="text-xs text-gray-400 font-medium">{part.category}</span>
          <h3 className="font-semibold text-gray-900 truncate">{part.name}</h3>
        </div>
        {(isLow || isEmpty) && (
          <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${isEmpty ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>
            {isEmpty ? '在庫なし' : '在庫不足'}
          </span>
        )}
      </div>

      <div className="flex items-end gap-1">
        <span className={`text-4xl font-bold tabular-nums ${isEmpty ? 'text-red-500' : isLow ? 'text-yellow-600' : 'text-gray-900'}`}>
          {part.quantity}
        </span>
        <span className="text-sm text-gray-400 mb-1">{part.unit}</span>
        <span className="text-xs text-gray-300 mb-1 ml-auto">下限 {part.minQuantity}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onStockIn}
          className="flex-1 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-medium rounded-lg transition-colors"
        >
          + 入庫
        </button>
        <button
          onClick={onStockOut}
          disabled={part.quantity === 0}
          className="flex-1 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          - 出庫
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 py-1 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          編集
        </button>
        <button
          onClick={onDelete}
          className="flex-1 py-1 text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          削除
        </button>
      </div>
    </div>
  )
}
