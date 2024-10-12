import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dbPath = path.join(process.cwd(), 'db.json')

export async function GET() {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
  return NextResponse.json(data.carModels)
}

export async function POST(request: Request) {
  const newCarModel = await request.json()
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
  newCarModel.id = (Math.max(...data.carModels.map((car: any) => parseInt(car.id))) + 1).toString()
  data.carModels.push(newCarModel)
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
  return NextResponse.json(newCarModel, { status: 201 })
}