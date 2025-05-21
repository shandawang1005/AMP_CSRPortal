import bcrypt from 'bcrypt';

/** @param {import('knex').Knex} knex */
export async function seed(knex) {
  // Delete all
  await knex('orders').del();
  await knex('subscriptions').del();
  await knex('vehicles').del();
  await knex('customers').del();
  await knex('csr_users').del();

  const passwordHash = await bcrypt.hash('password123', 10);

  // Insert csr_users
  const [adminId, csrId] = await knex('csr_users')
    .insert([
      { name: 'Admin User', email: 'admin@amp.com', passwordHash, role: 'admin' },
      { name: 'CSR User', email: 'csr@amp.com', passwordHash, role: 'csr' },
    ])
    .returning('id');

  // Insert customers
  const [customer1Id, customer2Id] = await knex('customers')
    .insert([
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-1234',
        isOverdue: false,
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '555-5678',
        isOverdue: true,
      },
    ])
    .returning('id');

  // Insert vehicles
  const [vehicle1Id] = await knex('vehicles')
    .insert({
      customer_id: customer1Id.id || customer1Id, // handles SQLite or PG
      plateNumber: 'ABC123',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
    })
    .returning('id');

  const [vehicle2Id] = await knex('vehicles')
    .insert({
      customer_id: customer2Id.id || customer2Id,
      plateNumber: 'XYZ789',
      make: 'Honda',
      model: 'Civic',
      year: 2021,
    })
    .returning('id');

  // Insert subscriptions
  await knex('subscriptions').insert([
    {
      customer_id: customer1Id.id || customer1Id,
      vehicle_id: vehicle1Id.id || vehicle1Id,
      planType: 'monthly',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    },
    {
      customer_id: customer2Id.id || customer2Id,
      vehicle_id: vehicle2Id.id || vehicle2Id,
      planType: 'single',
      status: 'expired',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
    },
  ]);

  // Insert orders
  await knex('orders').insert([
    {
      customer_id: customer1Id.id || customer1Id,
      amount: 99.99,
      date: '2024-04-01',
      type: 'monthly',
      status: 'paid',
    },
    {
      customer_id: customer1Id.id || customer1Id,
      amount: 99.99,
      date: '2024-05-01',
      type: 'monthly',
      status: 'pending',
    },
    {
      customer_id: customer2Id.id || customer2Id,
      amount: 199.99,
      date: '2023-06-15',
      type: 'single',
      status: 'failed',
    },
  ]);
}
