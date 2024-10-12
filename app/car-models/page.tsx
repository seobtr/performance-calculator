"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CarModel } from '@/types/car-model'

export default function CarModels() {
  const [carModels, setCarModels] = useState<CarModel[]>([])
  const [filteredCarModels, setFilteredCarModels] = useState<CarModel[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [newCarModel, setNewCarModel] = useState<CarModel>({
    id: '',
    make: '',
    model: '',
    year: 0,
    baseHorsepower: 0,
    engineSpecs: ''
  })

  useEffect(() => {
    fetchCarModels()
  }, [])

  useEffect(() => {
    const filtered = carModels.filter(car => 
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.year.toString().includes(searchTerm)
    )
    setFilteredCarModels(filtered)
  }, [searchTerm, carModels])

  const fetchCarModels = async () => {
    try {
      const response = await fetch('/api/car-models')
      if (!response.ok) throw new Error('Failed to fetch car models')
      const data = await response.json()
      setCarModels(data)
      setFilteredCarModels(data)
    } catch (error) {
      console.error('Error fetching car models:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewCarModel(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/car-models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCarModel),
      })
      if (!response.ok) throw new Error('Failed to add car model')
      fetchCarModels()
      setNewCarModel({
        id: '',
        make: '',
        model: '',
        year: 0,
        baseHorsepower: 0,
        engineSpecs: ''
      })
    } catch (error) {
      console.error('Error adding car model:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Car Models</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Car Model</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                name="make"
                value={newCarModel.make}
                onChange={handleInputChange}
                placeholder="Make"
                required
              />
              <Input
                type="text"
                name="model"
                value={newCarModel.model}
                onChange={handleInputChange}
                placeholder="Model"
                required
              />
              <Input
                type="number"
                name="year"
                value={newCarModel.year || ''}
                onChange={handleInputChange}
                placeholder="Year"
                required
              />
              <Input
                type="number"
                name="baseHorsepower"
                value={newCarModel.baseHorsepower || ''}
                onChange={handleInputChange}
                placeholder="Base Horsepower"
                required
              />
              <Input
                type="text"
                name="engineSpecs"
                value={newCarModel.engineSpecs}
                onChange={handleInputChange}
                placeholder="Engine Specifications"
                required
              />
              <Button type="submit">Add Car Model</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Car Models List</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Search car models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Make</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Base HP</TableHead>
                  <TableHead>Engine Specs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCarModels.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>{car.make}</TableCell>
                    <TableCell>{car.model}</TableCell>
                    <TableCell>{car.year}</TableCell>
                    <TableCell>{car.baseHorsepower}</TableCell>
                    <TableCell>{car.engineSpecs}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}