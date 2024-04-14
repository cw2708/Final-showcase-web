import express from 'express'

import * as db from '../products'
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const products = await db.getProducts()

    res.json({ products })
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong')
  }
})

export default router
