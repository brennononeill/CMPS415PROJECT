const express = require('express');
const bodyParser = require('body-parser');

// Create Express app
const app = express();

const express = require('express');
const bodyParser=require('body-parser');
const app = express();
const port = 3000;
var fs = require("fs");

app.listen(port);
console.log('Server started at http://localhost:' + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes will go here

app.get('/', function(req, res) {
  const myquery = req.query;
  var outstring = 'Starting... ';
  res.send(outstring);
});


// Write to a file 

app.get('/wfile', function(req, res) {
  const myquery = req.query;
  
  var outstring = '';
  for(var key in myquery) { outstring += "--" + key + ">" + myquery[key]; }
  fs.appendFile("mydata.txt", outstring+'\n', (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
      console.log("Contents of file now:\n");
      console.log(fs.readFileSync("mydata.txt", "utf8"));
    }
  });
 
  res.send(outstring);

});


// Simple cascade
app.param('name', function(req, res, next, name) {
  const modified = name.toUpperCase();

  req.name = modified;
  next();
});

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
