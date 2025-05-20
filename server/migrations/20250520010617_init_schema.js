export async function up(knex) {
  await knex.schema.createTable('csr_users', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.string('email').unique().notNullable();
    table.string('passwordHash').notNullable();
    table.string('role').defaultTo('csr');
  });

  await knex.schema.createTable('customers', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.string('email');
    table.string('phone');
    table.boolean('isOverdue').defaultTo(false);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('vehicles', (table) => {
    table.increments('id').primary();
    table.integer('customer_id').references('id').inTable('customers').onDelete('CASCADE');
    table.string('plateNumber');
    table.string('make');
    table.string('model');
    table.integer('year');
  });

  await knex.schema.createTable('subscriptions', (table) => {
    table.increments('id').primary();
    table.integer('customer_id').references('id').inTable('customers').onDelete('CASCADE');
    table.integer('vehicle_id').references('id').inTable('vehicles').onDelete('CASCADE');
    table.string('planType');
    table.string('status');
    table.date('startDate');
    table.date('endDate');
  });

  await knex.schema.createTable('orders', (table) => {
    table.increments('id').primary();
    table.integer('customer_id').references('id').inTable('customers').onDelete('CASCADE');
    table.decimal('amount', 10, 2);
    table.date('date');
    table.string('type'); // single / monthly
    table.string('status');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('orders');
  await knex.schema.dropTableIfExists('subscriptions');
  await knex.schema.dropTableIfExists('vehicles');
  await knex.schema.dropTableIfExists('customers');
  await knex.schema.dropTableIfExists('csr_users');
}
