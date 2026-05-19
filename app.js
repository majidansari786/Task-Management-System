const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./config/db');

const auth_route = require('./routers/user_auth');
const task_route = require('./routers/task');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Server is running', version: '1.0.0', timestamp: new Date() });
});

app.use('/api/v1/auth', auth_route);
app.use('/api/v1/tasks', task_route);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});