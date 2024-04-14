import connection from './connection.ts'
import { product } from '../../models/product.ts'

const columns = ['id', 'name']

export async function getProducts(db = connection): Promise<product[]> {
  return db('products')
    .select(...columns)
    .orderBy('id')
}
