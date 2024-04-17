export async function seed(knex) {
  await knex('products').del()

  // Inserts seed entries
  await knex('products').insert([
    {
      product_id: 0,
      product_name: 'Nike',
      product_price: 231,
      product_image: '/product-images/Nike.png',
    },
    {
      product_id: 1,
      product_name: 'Vans',
      product_price: 180,
      product_image: '/product-images/Vans.png',
    },
    {
      product_id: 2,
      product_name: 'Dave',
      product_price: 10000,
      product_image: '',
    },
  ])
}
