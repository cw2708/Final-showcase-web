import express from 'express'

import * as db from '../products.ts'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const product = await db.getProducts()

    res.json({ product })
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong')
  }
})
router.get('/:id', async (req, res) => {
  try {
    const productId = Number(req.params.id)
    const product = await db.getProductById(productId)
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json(product)
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong')
  }
})

export default router
