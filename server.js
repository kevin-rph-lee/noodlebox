require('dotenv').config();

const WebSocketServer = require("ws").Server
var http = require("http")

const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const cookieParser = require('cookie-parser');

// Creating a new socketio server
const server = require('http').createServer(app);
const io = require('socket.io')(server);

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

// app.listen(PORT, () => {
//   console.log(`Server listening on ${PORT}`);
// });

io.on('connection', function(socket){
  io.emit('message from server', 'message from server - it works!')
  })
server.listen(PORT);