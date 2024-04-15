import connection from './connection.ts'
import { Product } from '../../models/product.ts'

const columns = ['product_id', 'product_name']

export async function getProducts(db = connection): Promise<Product[]> {
  return db('products')
    .select(...columns)
    .orderBy('product_id')
}
