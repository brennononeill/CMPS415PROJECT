const express = require('express');
const { json } = require('body-parser');
const { TicketsController } = require('./controllers/tickets');

const app = express();

app.use(json());
app.use('/', TicketsController);

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
