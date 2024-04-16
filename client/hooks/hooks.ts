import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../apis/api'
import { Product } from '../../models/product'
import { getProductById } from '../apis/api'
export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => getProducts(),
  })
}

export function useProductById(id: string) {
  return useQuery<Product>({
    queryKey: ['products', id],
    queryFn: () => getProductById(id),
  })
}
