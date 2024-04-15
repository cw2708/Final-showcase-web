import Navbar from './Navbar'
import { useProducts } from '../hooks/hooks'
import { Product } from '../../models/product' // Import the Product interface

export default function ProductPage() {
  const { data, isLoading, isError, error } = useProducts()

  console.log('isLoading:', isLoading)
  console.log('isError:', isError)
  console.log('error:', error)
  console.log('data:', data)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error: {error ? error.message : 'An error occurred'}</div>
  }

  if (!data || !('product' in data)) {
    return <div>No products available</div>
  }

  const products = data.product as Product[]

  return (
    <>
      <Navbar />
      <div className="container">
        <div id="Product-Display-Div">
          <div id="Product-Display-Nav"></div>
          <div id="Product-Display-Image-Div">
            <img id="Product-Image"></img>
          </div>
          <div id="Product-Display-Info-Div"></div>
          <div id="Product-Display-Footer"></div>
        </div>
      </div>
    </>
  )
}

// {products.map((detected: Product) => (
//   <ul key={detected.product_id}>
//     <li>{detected.product_name}</li>
//   </ul>
// ))}
