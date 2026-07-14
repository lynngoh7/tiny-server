const express = require('express');
const app = express();
const PORT = 3000;

let tasks = [ 
  { id: 1, title: "Do homework", completed: false },
  { id: 2, title: "Walk the dog", completed: true },
  { id: 3, title: "Read a book", completed: false }
];

app.get('/', (req, res) => {
  res.json({
    name: "Task API",
    version : "1.0",
    endpoints:  ["/tasks"]
   });
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
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