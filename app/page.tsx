import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Car Performance Tracker</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Car Models</CardTitle>
            <CardDescription>Manage your car database</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Add, edit, and view car models with their specifications.</p>
          </CardContent>
          <CardFooter>
            <Link href="/car-models">
              <Button>View Car Models</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Aftermarket Products</CardTitle>
            <CardDescription>Explore performance upgrades</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Browse and manage aftermarket products for various car models.</p>
          </CardContent>
          <CardFooter>
            <Link href="/products">
              <Button>View Products</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>HP Calculator</CardTitle>
            <CardDescription>Estimate your car's performance</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Calculate theoretical horsepower based on upgrades and modifications.</p>
          </CardContent>
          <CardFooter>
            <Link href="/hp-calculator">
              <Button>Calculate HP</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}