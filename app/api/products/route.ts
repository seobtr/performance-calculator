import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dbPath = path.join(process.cwd(), 'db.json')

export async function GET() {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
  return NextResponse.json(data.products)
}

export async function POST(request: Request) {
  const newProduct = await request.json()
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
  newProduct.id = (Math.max(...data.products.map((product: any) => parseInt(product.id))) + 1).toString()
  data.products.push(newProduct)
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
  return NextResponse.json(newProduct, { status: 201 })
}