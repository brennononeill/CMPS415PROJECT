const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

let tickets = [
  {
    "id": 35436,
    "created_at": "2015-07-20T22:55:29Z",
    "updated_at": "2016-05-05T10:38:52Z",
    "type": "incident",
    "subject": "MFP not working right",
    "description": "PC Load Letter? What does that even mean???",
    "priority": "med",
    "status": "open",
    "recipient": "support_example@selu.edu",
    "submitter": "Michael_bolton@selu.edu",
    "assignee_id": 235323,
    "follower_ids": [
        235323,
        234
    ],
    "tags": [
        "enterprise",
        "printers"
    ]
  }
];

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
  res.send(ticket);
});

// Endpoint to update a ticket by id
app.put('/rest/ticket/:id', express.json(), (req, res) => {
  const id = parseInt(req.params.id);
  const index = tickets.findIndex((t) => t.id === id);

  if (index === -1) {
    res.status(404).send('Ticket not found');
  } else {
    tickets[index] = req.body;
    tickets[index].id = id;
    console.log(`Updated ticket with id ${id}`);
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
    tickets.splice(index, 1);
    console.log(`Deleted ticket with id ${id}`);
    res.sendStatus(204);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
