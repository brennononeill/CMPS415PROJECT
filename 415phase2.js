const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

const uri = "mongodb+srv://brennononeill:CMPS415@bomdb.g5uygmr.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }
}
connect();

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/home', (req, res) => {
  fs.readFile('./main.html', 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read file:', err);
      res.status(500).send('Failed to read file');
    } else {
      res.send(data);
    }
  });
});

app.get('/rest/list', async (req, res) => {
  const tickets = client.db('CMPS415PROJECT').collection('Phase2');
  const result = await tickets.find().toArray();
  res.send(result);
});

app.get('/rest/ticket/:id', async (req, res) => {
  const ticketId = parseFloat(req.params.id); 
  const tickets = client.db('CMPS415PROJECT').collection('Phase2');

  const ticket = await tickets.findOne({ id: ticketId });

  if (ticket) {
    console.log(`Retrieved ticket with id ${ticketId}`);
    res.send(ticket);
  } else {
    console.log(`Ticket with id ${ticketId} not found`);
    res.status(404).send(`Ticket with id ${ticketId} not found`);
  }
});

app.post('/rest/ticket', async (req, res) => {
  if (typeof req.body.body === 'object' && !Array.isArray(req.body.body)) {
    const { type, subject, description, priority, status, recipient, submitter, assignee_id, followers_ids } = req.body.body;

    if (type && subject && description && priority && status && recipient && submitter && assignee_id && followers_ids) {
      const ticket = {
        id: Date.now(), 
        created_at: new Date(), 
        updated_at: new Date(), 
        type, 
        subject, 
        description, 
        priority, 
        status, 
        recipient, 
        submitter, 
        assignee_id, 
        followers_ids, 
      };

      if (typeof ticket === 'object' && !Array.isArray(ticket)) {
        const tickets = client.db('CMPS415PROJECT').collection('Phase2');
        await tickets.insertOne(ticket);
        console.log(`Created ticket with id ${ticket.id}`);

        const response = { ...ticket };

        res.send(response);
      } else {
        console.log('Ticket data is not a valid object');
        res.status(400).send('Ticket data is not a valid object');
      }
    } else {
      console.log('Required fields are missing in the request body');
      res.status(400).send('Required fields are missing in the request body');
    }
  } else {
    console.log('Request body is not a valid object');
    res.status(400).send('Request body is not a valid object');
  }
}); 

app.put('/rest/ticket/:id', async (req, res) => {
  try {
    const ticketId = parseInt(req.params.id);
    const updatedTicket = req.body;
    delete updatedTicket._id; 
    const tickets = client.db('CMPS415PROJECT').collection('Phase2');
    const result = await tickets.updateOne({ id: ticketId }, { $set: updatedTicket });
    console.log(`Updated ticket with id ${ticketId}`);
    res.send(result);
  } catch (err) {
    console.error('Failed to update ticket:', err);
    res.status(500).send('Failed to update ticket');
  }
});

app.delete('/rest/ticket/:id', async (req, res) => {
   const ticketId = parseInt(req.params.id); 
  const tickets = client.db('CMPS415PROJECT').collection('Phase2');

  const result = await tickets.deleteOne({ id: ticketId });

  if (result.deletedCount === 1) {
    console.log(`Deleted ticket with id ${ticketId}`);
    res.send(`Deleted ticket with id ${ticketId}`);
  } else {
    console.log(`Ticket with id ${ticketId} not found`);
    res.status(404).send(`Ticket with id ${ticketId} not found`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
