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

export default router
