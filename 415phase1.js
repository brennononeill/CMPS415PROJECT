const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const FILE_PATH = __dirname + '/mydata.json';

// Read the initial data from file
let tickets = JSON.parse(fs.readFileSync(FILE_PATH));

// Endpoint to get all tickets
app.get('/rest/list', (req, res) => {
  res.send(tickets);
});

// Endpoint to get a single ticket by id
app.get('/rest/ticket/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const ticket = tickets.find((t) => t.id === id);

  if (!ticket) {
    res.status(404).send('Ticket not found');
  } else {
    res.send(ticket);
  }
});

// Endpoint to create a new ticket
app.post('/rest/ticket', express.json(), (req, res) => {
  const ticket = req.body;
  ticket.id = Date.now(); // Assign a unique id
  tickets.push(ticket);
  console.log(`Created ticket with id ${ticket.id}`);

  // Write the updated data back to the file
  fs.writeFileSync(FILE_PATH, JSON.stringify(tickets));

  res.send(ticket);
});

// Endpoint to update an existing ticket by id
app.put('/rest/ticket/:id', express.json(), (req, res) => {
  const id = parseInt(req.params.id);
  const index = tickets.findIndex((t) => t.id === id);

  if (index === -1) {
    res.status(404).send('Ticket not found');
  } else {
    tickets[index] = req.body;

    // Write the updated data back to the file
    fs.writeFileSync(FILE_PATH, JSON.stringify(tickets));

    res.send(tickets[index]);
  }
});

// Endpoint to delete a ticket by id
app.delete('/rest/ticket/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tickets.findIndex((t) => t.id === id);

  if (index === -1) {
    res.status(404).send('Ticket not found');
  } else {
    const deletedTicket = tickets.splice(index, 1)[0];

    // Write the updated data back to the file
    fs.writeFileSync(FILE_PATH, JSON.stringify(tickets));

    res.send(deletedTicket);
  }
});

// Error handling middleware
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
