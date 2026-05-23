'use client'

import { useState, useRef } from 'react'
import { Part } from '@/lib/types'

type PreviewRow = Omit<Part, 'id' | 'createdAt' | 'updatedAt'> & { error?: string }

interface Props {
  onImport: (rows: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>[]) => void
  onClose: () => void
}

const SAMPLE_CSV = `部品名,カテゴリ,在庫数,下限値,単位
M6ボルト,ボルト・ナット,100,20,個
M8ボルト,ボルト・ナット,50,10,個
SUS304プレート,板材,30,5,枚
φ10丸棒,丸棒,20,3,本`

function parseCSV(text: string): PreviewRow[] {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return []

  // ヘッダー行をスキップ
  const dataLines = lines[0].includes('部品名') ? lines.slice(1) : lines

  return dataLines.map(line => {
    const cols = line.split(',').map(c => c.trim())
    const [name, category, quantityStr, minQuantityStr, unit] = cols
    const quantity = parseInt(quantityStr ?? '0', 10)
    const minQuantity = parseInt(minQuantityStr ?? '0', 10)

    const error =
      !name ? '部品名が空です' :
      isNaN(quantity) ? '在庫数が数値ではありません' :
      isNaN(minQuantity) ? '下限値が数値ではありません' :
      undefined

    return {
      name: name ?? '',
      category: category || 'その他',
      quantity: isNaN(quantity) ? 0 : quantity,
      minQuantity: isNaN(minQuantity) ? 0 : minQuantity,
      unit: unit || '個',
      error,
    }
  }).filter(r => r.name !== '')
}

function downloadSample() {
  const blob = new Blob(['﻿' + SAMPLE_CSV], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'parts_sample.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export default function CsvImportModal({ onImport, onClose }: Props) {
  const [rows, setRows] = useState<PreviewRow[]>([])
  const [fileName, setFileName] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = ev => {
      const text = ev.target?.result as string
      setRows(parseCSV(text))
    }
    reader.readAsText(file, 'UTF-8')
  }

  const validRows = rows.filter(r => !r.error)
  const errorRows = rows.filter(r => r.error)

  function handleImport() {
    onImport(validRows.map(({ error: _e, ...rest }) => rest))
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold">CSVで一括追加</h2>
          <p className="text-sm text-gray-500 mt-1">
            列の順番: <code className="bg-gray-100 px-1 rounded text-xs">部品名, カテゴリ, 在庫数, 下限値, 単位</code>
          </p>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="flex gap-2">
            <button
              onClick={downloadSample}
              className="text-sm text-blue-600 hover:underline"
            >
              サンプルCSVをダウンロード
            </button>
          </div>

          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl p-8 text-center cursor-pointer transition-colors"
          >
            <p className="text-gray-500 text-sm">
              {fileName ? (
                <span className="font-medium text-gray-800">{fileName}</span>
              ) : (
                <>クリックしてCSVファイルを選択</>
              )}
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFile}
              className="hidden"
            />
          </div>

          {rows.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">
                  プレビュー ({validRows.length}件 インポート予定
                  {errorRows.length > 0 && <span className="text-red-500">、{errorRows.length}件 エラー</span>}
                  )
                </p>
              </div>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-3 py-2 text-gray-500 font-medium">部品名</th>
                      <th className="text-left px-3 py-2 text-gray-500 font-medium">カテゴリ</th>
                      <th className="text-right px-3 py-2 text-gray-500 font-medium">在庫数</th>
                      <th className="text-right px-3 py-2 text-gray-500 font-medium">下限値</th>
                      <th className="text-left px-3 py-2 text-gray-500 font-medium">単位</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i} className={`border-t border-gray-100 ${row.error ? 'bg-red-50' : ''}`}>
                        <td className="px-3 py-2">
                          {row.name || <span className="text-red-400">（空）</span>}
                          {row.error && <p className="text-red-500 text-xs">{row.error}</p>}
                        </td>
                        <td className="px-3 py-2 text-gray-500">{row.category}</td>
                        <td className="px-3 py-2 text-right">{row.quantity}</td>
                        <td className="px-3 py-2 text-right">{row.minQuantity}</td>
                        <td className="px-3 py-2 text-gray-500">{row.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            onClick={handleImport}
            disabled={validRows.length === 0}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {validRows.length > 0 ? `${validRows.length}件を追加` : 'CSVを選択してください'}
          </button>
        </div>
      </div>
    </div>
  )
}
