export async function up(knex) {
  await knex.schema.createTable('products', (table) => {
    table.increments('product_id').primary()
    table.string('product_name')
    table.integer('product_price')
  })
}

export async function down(knex) {
  await knex.schema.dropTable('products')
}
