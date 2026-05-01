import express from 'express';
import pool from '../../config/db.js';
import { protect } from '../../middleware/auth.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;

  const result = await pool.query(
    'INSERT INTO todos (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
    [userId, title, description]
  );

  res.status(201).json(result.rows[0]);
});

router.get('/', protect, async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC',
    [req.user.id]
  );

  res.json(result.rows);
});

router.put('/:id', protect, async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  const result = await pool.query(
    `UPDATE todos
     SET title = $1, description = $2, completed = $3
     WHERE id = $4 AND user_id = $5
     RETURNING *`,
    [title, description, completed, id, req.user.id]
  );

  res.json(result.rows[0]);
});

router.delete('/:id', protect, async (req, res) => {
  const { id } = req.params;

  await pool.query(
    'DELETE FROM todos WHERE id = $1 AND user_id = $2',
    [id, req.user.id]
  );

  res.json({ message: 'Todo deleted' });
});

export default router