export interface Part {
  id: string
  name: string
  category: string
  quantity: number
  minQuantity: number
  unit: string
  createdAt: string
  updatedAt: string
}

export interface StockLog {
  id: string
  partId: string
  type: 'in' | 'out'
  quantity: number
  memo: string
  createdAt: string
}
