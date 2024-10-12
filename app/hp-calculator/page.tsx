"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CarModel } from '@/types/car-model'
import { AftermarketProduct } from '@/types/aftermarket-product'

export default function HPCalculator() {
  const [carModels, setCarModels] = useState<CarModel[]>([])
  const [products, setProducts] = useState<AftermarketProduct[]>([])
  const [selectedCar, setSelectedCar] = useState<CarModel | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<AftermarketProduct[]>([])
  const [theoreticalHP, setTheoreticalHP] = useState<number | null>(null)

  useEffect(() => {
    fetchCarModels()
    fetchProducts()
  }, [])

  const fetchCarModels = async () => {
    try {
      const response = await fetch('/api/car-models')
      if (!response.ok) throw new Error('Failed to fetch car models')
      const data = await response.json()
      setCarModels(data)
    } catch (error) {
      console.error('Error fetching car models:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleCarSelect = (carId: string) => {
    const car = carModels.find(c => c.id === carId)
    setSelectedCar(car || null)
  }

  const handleProductSelect = (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (product && !selectedProducts.some(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product])
    }
  }

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId))
  }

  const calculateHP = () => {
    if (selectedCar) {
      const baseHP = selectedCar.baseHorsepower
      const additionalHP = selectedProducts.reduce((sum, product) => sum + (product.performanceGains?.hp || 0), 0)
      setTheoreticalHP(baseHP + additionalHP)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Horsepower Calculator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Car and Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={handleCarSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a car model" />
              </SelectTrigger>
              <SelectContent>
                {carModels.map((car) => (
                  <SelectItem key={car.id} value={car.id}>
                    {car.make} {car.model} ({car.year})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={handleProductSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Add aftermarket product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div>
              <h2 className="text-xl font-semibold mb-2">Selected Products:</h2>
              <ul className="list-disc pl-5">
                {selectedProducts.map((product) => (
                  <li key={product.id} className="flex justify-between items-center">
                    <span>{product.name} (+{product.performanceGains.hp} HP)</span>
                    <Button variant="destructive" size="sm" onClick={() => removeProduct(product.id)}>Remove</Button>
                  </li>
                ))}
              </ul>
            </div>
            <Button onClick={calculateHP}>Calculate Theoretical HP</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCar && (
              <div>
                <p className="text-lg">Base Car: {selectedCar.make} {selectedCar.model} ({selectedCar.year})</p>
                <p className="text-lg">Base Horsepower: {selectedCar.baseHorsepower} HP</p>
              </div>
            )}
            {theoreticalHP !== null && (
              <div className="mt-4">
                <h2 className="text-2xl font-bold">Theoretical Horsepower: {theoreticalHP} HP</h2>
                <p className="text-lg">Horsepower Gain: {theoreticalHP - (selectedCar?.baseHorsepower || 0)} HP</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}