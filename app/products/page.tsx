"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AftermarketProduct } from '@/types/aftermarket-product'
import { CarModel } from '@/types/car-model'

export default function Products() {
  const [products, setProducts] = useState<AftermarketProduct[]>([])
  const [filteredProducts, setFilteredProducts] = useState<AftermarketProduct[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [carModels, setCarModels] = useState<CarModel[]>([])
  const [newProduct, setNewProduct] = useState<AftermarketProduct>({
    id: '',
    name: '',
    category: '',
    compatibleModels: [],
    performanceGains: { hp: 0, torque: 0 },
    price: 0,
    vendor: ''
  })

  useEffect(() => {
    fetchProducts()
    fetchCarModels()
  }, [])

  useEffect(() => {
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.vendor.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredProducts(filtered)
  }, [searchTerm, products])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data)
      setFilteredProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewProduct(prev => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setNewProduct(prev => ({ ...prev, category: value }))
  }

  const handleCompatibleModelChange = (value: string) => {
    setNewProduct(prev => ({
      ...prev,
      compatibleModels: prev.compatibleModels.includes(value)
        ? prev.compatibleModels.filter(id => id !== value)
        : [...prev.compatibleModels, value]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      })
      if (!response.ok) throw new Error('Failed to add product')
      fetchProducts()
      setNewProduct({
        id: '',
        name: '',
        category: '',
        compatibleModels: [],
        performanceGains: { hp: 0, torque: 0 },
        price: 0,
        vendor: ''
      })
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Aftermarket Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                placeholder="Product Name"
                required
              />
              <Select onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Performance">Performance</SelectItem>
                  <SelectItem value="Off-Road">Off-Road</SelectItem>
                  <SelectItem value="Aesthetic">Aesthetic</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                name="price"
                value={newProduct.price || ''}
                onChange={handleInputChange}
                placeholder="Price"
                required
              />
              <Input
                type="text"
                name="vendor"
                value={newProduct.vendor}
                onChange={handleInputChange}
                placeholder="Vendor"
                required
              />
              <Input
                type="number"
                name="hp"
                value={newProduct.performanceGains.hp || ''}
                onChange={(e) => setNewProduct(prev => ({ ...prev, performanceGains: { ...prev.performanceGains, hp: Number(e.target.value) } }))}
                placeholder="Horsepower Gain"
                required
              />
              <Input
                type="number"
                name="torque"
                value={newProduct.performanceGains.torque || ''}
                onChange={(e) => setNewProduct(prev => ({ ...prev, performanceGains: { ...prev.performanceGains, torque: Number(e.target.value) } }))}
                placeholder="Torque Gain"
                required
              />
              <div>
                <h3 className="text-lg font-semibold mb-2">Compatible Models:</h3>
                {carModels.map((car) => (
                  <label key={car.id} className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      checked={newProduct.compatibleModels.includes(car.id)}
                      onChange={() => handleCompatibleModelChange(car.id)}
                    />
                    <span>{car.make} {car.model} ({car.year})</span>
                  </label>
                ))}
              </div>
              <Button type="submit">Add Product</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Products List</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>HP Gain</TableHead>
                  <TableHead>Torque Gain</TableHead>
                  <TableHead>Compatible Models</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.vendor}</TableCell>
                    <TableCell>{product.performanceGains.hp} HP</TableCell>
                    <TableCell>{product.performanceGains.torque} lb-ft</TableCell>
                    <TableCell>
                      {product.compatibleModels.map(modelId => {
                        const car = carModels.find(c => c.id === modelId)
                        return car ? `${car.make} ${car.model}, ` : ''
                      })}
                    </TableCell>
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