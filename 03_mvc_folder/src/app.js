const express    = require('express');
const userRoutes = require('./routes/user.routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);

app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found.' });
});

module.exports = app;