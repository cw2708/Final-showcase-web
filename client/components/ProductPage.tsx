import Navbar from './Navbar'
import { useParams } from 'react-router-dom'
import { useProductById } from '../hooks/hooks'

export default function ProductPage() {
  const { id } = useParams()
  const productId = Number(id)

  const { data, isLoading, isError, error } = useProductById(
    productId.toString(),
  )

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

  if (!data) {
    return <div>No product available</div>
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div id="Product-Display-Div">
          <div id="Product-Display-Nav"></div>
          <div id="Product-Display-Image-Div">
            <img id="Product-Image" alt="Product"></img>
          </div>
          <div id="Product-Display-Info-Div">
            <div>
              <h1 id="Product-Heading">{data.product.product_name}</h1>
              <h2 id="Product-Price">{data.product.product_price}</h2>
              <h4>Description:</h4>
              <p></p>
            </div>
            <button id="Buy-Button">
              <h2>Buy Now</h2>
            </button>
          </div>
          <div id="Product-Display-Footer">
            <h3 id="Product-Footer-Text">Powered By Visvine</h3>
          </div>
        </div>
      </div>
    </>
  )
}
