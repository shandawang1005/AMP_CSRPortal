import express from 'express';
import db from '../db/db.js';

const router = express.Router();
// get All customer list with offset
router.get('/', async (req, res) => {
  const { search = '', page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let query = db('customers');

  if (search) {
    query = query.where(builder => {
      builder
        .where('first_name', 'like', `%${search}%`)
        .orWhere('last_name', 'like', `%${search}%`)
        .orWhere('email', 'like', `%${search}%`);
    });
  }

  const results = await query.limit(limit).offset(offset);
  res.json(results);
});

//GET    /customers/:id

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await db('customers').where({ id }).first();
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const questions = await db('questions')
      .where({ customer_id: id })
      .leftJoin('staff', 'questions.staff_id', 'staff.id')
      .select('questions.*', 'staff.name as staff_name');

    res.json({ ...customer, questions });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching customer detail' });
  }
});

//POST /api/customers/:id/questions
router.post('/customers/:id/questions', async (req, res) => {
  const { message, staff_id } = req.body;
  const customer_id = req.params.id;

  try {
    const [id] = await db('questions').insert({ customer_id, message, staff_id });
    res.status(201).json({ message: 'Submitted', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error submitting question' });
  }
});













export default router;
