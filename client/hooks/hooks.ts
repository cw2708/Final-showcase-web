import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../apis/api'
import { Product } from '../../models/product'

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => getProducts(),
  })
}
