import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {AuthProvider} from './context/AuthProvider';
import io from 'socket.io-client'

//Creating socket
let socket = io("/");

//Recieving a new message from server
socket.on('message to client', function(msg){
  console.log('recieved message ', msg)
}); 


ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/*" element={<App socket={socket} />} />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
