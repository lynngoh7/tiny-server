const pool = require('./db');

async function getAllTasks() {
  const result = await pool.query('SELECT * FROM tasks ORDER BY id');
  return result.rows;
}

async function getTaskById(id) {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    return result.rows[0];
}

async function createTask(title) {
    const result = await pool.query('INSERT INTO tasks (title, done) VALUES ($1, false) RETURNING *', [title]);
    return result.rows[0];
}

async function updateTask(id, { title, done }) {
  const existing = await getTaskById(id);
  if (!existing) return null;

  const newTitle = title !== undefined ? title : existing.title;
  const newDone = done !== undefined ? done : existing.done;

  const result = await pool.query(
    'UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *',
    [newTitle, newDone, id]
  );
  return result.rows[0];
}

async function deleteTask(id) {
  const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  return result.rowCount > 0; // true if a row was actually deleted
}

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};