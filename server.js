const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

const tasks = require('./taskRepository');

app.get('/', (req, res) => {
  res.json({
    name: "Task API",
    version : "1.0",
    endpoints:  ["/tasks"]
   });
});

app.get('/tasks', async(req, res) => {
  const allTasks = await tasks.getAllTasks();
  res.json(allTasks);
});

app.get('/tasks/:id', async(req, res) => {
  const id = parseInt(req.params.id);
  const task = await tasks.getTaskById(id);

  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  res.json(task);
});

app.post('/tasks', async(req, res) => {
  const {title} = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTask = await tasks.createTask(title);
  res.status(201).json(newTask);
});

app.put('/tasks/:id', async(req, res) => {
  const id = parseInt(req.params.id);
  const { title, done } = req.body;

  if (title !== undefined && title.trim() === "") {
    return res.status(400).json({error: 'Title cannot be empty'})
  }

  const updatedTask = await tasks.updateTask(id, { title, done });

  if (!updatedTask) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  res.json(updatedTask);
});

app.delete('/tasks/:id', async(req, res) => {
  const id = parseInt(req.params.id);
  const deleted = await tasks.deleteTask(id);

  if (!deleted) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  res.status(204).send();
});

app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task= tasks.find(t => t.id === id);

    if (!task) {
      return res.status(404).json({ error: `Task ${id} not found` });
    }

    const { title, done } = req.body;

    if (title !== undefined && title.trim() === "") {
      return res.status(400).json({error: 'Title cannot be empty'})
    }

    if (title != undefined) task.title = title;
    if (done != undefined) task.done = done;

    res.json(task);
  });

  app.delete('/tasks/:id', async(req,res) => {
    const id = parseInt(req.params.id);
    const deleted = await tasks.deleteTask(id);

    if (!deleted) {
      return res.status(404).json({ error: `Task ${id} not found` });
    }
    res.status(204).send();

  });

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/time', (req, res) => {
  res.json({ currentTime: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});