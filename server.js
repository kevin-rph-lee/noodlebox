require('dotenv').config();

const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const cookieParser = require('cookie-parser');

// Websocket
// Importing the required modules
const WebSocketServer = require('ws');

// Creating a new websocket server
const wss = new WebSocketServer.Server({ port: 3002 })


// PG database client/connection setup

const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.use(credentials);

app.use(cors(corsOptions));
app.use(express.json()); // => allows us to access the req.body

//middleware for cookies
app.use(cookieParser());

if (process.env.NODE_ENV === 'production') {
  //server static content
  //npm run build
  app.use(express.static(path.join(__dirname, 'client/build')));
}

console.log(__dirname);
console.log(path.join(__dirname, 'client/build'));

// Separated Routes for each Resource
const usersRoutes = require('./routes/users');
const refreshRoutes = require('./routes/refresh');
const menuItemsRoutes = require('./routes/menuItems');
const ordersRoutes = require('./routes/orders');


// Resource routes
app.use('/users', usersRoutes());
app.use('/refresh', refreshRoutes());
app.use('/menuItems', menuItemsRoutes());
app.use('/orders', ordersRoutes());

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});


// Creating connection using websocket
wss.on("connection", (ws) => {
  //Tracking how many users have connected to the system
  console.log('Client connected, current # of clients', wss.clients.size);
  
  //function used to transmitt a message to all connected clients
  sendMessageToOpenClients =(messageObj) => {
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(JSON.stringify(messageObj));
      }
    });
  }

  //Recieving a websocket message from client and resending it to all connected clients
  ws.on('message', function incoming(data) {
    const message = JSON.parse(data);
    //Logging out the message
    console.log(message);
    //Running function message to all clients
    sendMessageToOpenClients(message);
  });
  

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', function(){
    console.log('Client disconnected, current # of clients', wss.clients.size);

  });
});
console.log("The WebSocket server is running on port 3002");


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});