import express from 'express'
import * as Path from 'node:path'
import productRoutes from '../server/db/routes/products'
const server = express()

server.use(express.json())

server.use('/api/v1/products', productRoutes)

server.get('/api/v1/products/:id', productRoutes)

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server
