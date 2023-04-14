const express = require('express');
const bodyParser = require('body-parser');

// Create Express app
const app = express();

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// In-memory storage for tickets
let tickets = [];

// GET endpoint to get all tickets
app.get('/rest/list', (req, res) => {
  res.json(tickets);
});

// GET endpoint to get a single ticket by ID
app.get('/rest/ticket/:id', (req, res) => {
  const ticketId = req.params.id;
  const ticket = tickets.find(ticket => ticket.id === ticketId);

  if (ticket) {
    res.json(ticket);
  } else {
    res.status(404).json({ error: 'Ticket not found' });
  }
});

// POST endpoint to create a new ticket
app.post('/rest/ticket', (req, res) => {
  const newTicket = req.body;
  newTicket.id = Date.now().toString(); // Assign a unique ID to the new ticket
  tickets.push(newTicket);
  res.json(newTicket);
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
