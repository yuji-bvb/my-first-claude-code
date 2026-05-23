'use client'

import { useState, useEffect } from 'react'
import { Part } from '@/lib/types'

interface Props {
  part?: Part
  categories: string[]
  onSave: (data: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>) => void
  onClose: () => void
}

export default function PartModal({ part, categories, onSave, onClose }: Props) {
  const [name, setName] = useState(part?.name ?? '')
  const [category, setCategory] = useState(part?.category ?? '')
  const [categoryInput, setCategoryInput] = useState(part?.category ?? '')
  const [quantity, setQuantity] = useState(part?.quantity ?? 0)
  const [minQuantity, setMinQuantity] = useState(part?.minQuantity ?? 5)
  const [unit, setUnit] = useState(part?.unit ?? '個')

  useEffect(() => {
    setCategoryInput(category)
  }, [category])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSave({
      name: name.trim(),
      category: categoryInput.trim() || 'その他',
      quantity,
      minQuantity,
      unit,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-lg font-bold mb-4">{part ? '部品を編集' : '部品を追加'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">部品名</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="例: M6ボルト"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
              {categories.length > 0 && (
                <select
                  value={category}
                  onChange={e => { setCategory(e.target.value); setCategoryInput(e.target.value) }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">新しいカテゴリを入力...</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              )}
              <input
                type="text"
                value={categoryInput}
                onChange={e => setCategoryInput(e.target.value)}
                placeholder="例: ボルト・ナット"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">現在庫数</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                  min={0}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">下限アラート</label>
                <input
                  type="number"
                  value={minQuantity}
                  onChange={e => setMinQuantity(Number(e.target.value))}
                  min={0}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">単位</label>
                <input
                  type="text"
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  placeholder="個"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                {part ? '保存' : '追加'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
