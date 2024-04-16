import request from 'superagent'
import { Product } from '../../models/product'

const rootUrl = '/api/v1'

export async function getProducts(): Promise<Product[]> {
  return request.get(rootUrl + `/products`).then((res) => {
    return res.body
  })
}

export async function getProductById(id: string): Promise<Product> {
  return request.get(`${rootUrl}/products/${id}`).then((res) => res.body)
}
