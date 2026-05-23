'use client'

import { useState } from 'react'
import { useInventory } from './hooks/useInventory'
import PartCard from './components/PartCard'
import PartModal from './components/PartModal'
import StockModal from './components/StockModal'
import { Part } from '@/lib/types'

type ModalState =
  | { type: 'none' }
  | { type: 'add' }
  | { type: 'edit'; part: Part }
  | { type: 'stockIn'; part: Part }
  | { type: 'stockOut'; part: Part }

export default function Home() {
  const { parts, categories, addPart, updatePart, deletePart, stockIn, stockOut } = useInventory()
  const [modal, setModal] = useState<ModalState>({ type: 'none' })
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [search, setSearch] = useState('')

  const lowStockCount = parts.filter(p => p.quantity <= p.minQuantity).length

  const filtered = parts.filter(p => {
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  function handleDelete(id: string) {
    if (confirm('この部品を削除しますか？')) deletePart(id)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">部品在庫管理</h1>
            {lowStockCount > 0 && (
              <p className="text-xs text-yellow-600 font-medium">{lowStockCount}件 在庫不足</p>
            )}
          </div>
          <button
            onClick={() => setModal({ type: 'add' })}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + 部品追加
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="部品名で検索..."
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />

        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            すべて ({parts.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              {cat} ({parts.filter(p => p.category === cat).length})
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            {parts.length === 0 ? (
              <div>
                <p className="text-lg mb-2">部品がまだありません</p>
                <p className="text-sm">「+ 部品追加」から最初の部品を登録してください</p>
              </div>
            ) : (
              <p>条件に一致する部品がありません</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(part => (
              <PartCard
                key={part.id}
                part={part}
                onStockIn={() => setModal({ type: 'stockIn', part })}
                onStockOut={() => setModal({ type: 'stockOut', part })}
                onEdit={() => setModal({ type: 'edit', part })}
                onDelete={() => handleDelete(part.id)}
              />
            ))}
          </div>
        )}
      </main>

      {modal.type === 'add' && (
        <PartModal
          categories={categories}
          onSave={addPart}
          onClose={() => setModal({ type: 'none' })}
        />
      )}
      {modal.type === 'edit' && (
        <PartModal
          part={modal.part}
          categories={categories}
          onSave={data => updatePart(modal.part.id, data)}
          onClose={() => setModal({ type: 'none' })}
        />
      )}
      {modal.type === 'stockIn' && (
        <StockModal
          part={modal.part}
          type="in"
          onSave={(qty, memo) => stockIn(modal.part.id, qty, memo)}
          onClose={() => setModal({ type: 'none' })}
        />
      )}
      {modal.type === 'stockOut' && (
        <StockModal
          part={modal.part}
          type="out"
          onSave={(qty, memo) => stockOut(modal.part.id, qty, memo)}
          onClose={() => setModal({ type: 'none' })}
        />
      )}
    </div>
  )
}
