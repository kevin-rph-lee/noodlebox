import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {AuthProvider} from './context/AuthProvider';
import { socket, SocketContext } from './context/SocketProvider';

ReactDOM.render(
  <React.StrictMode>
    <SocketContext.Provider value={socket}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/*" element={<App/>} />
          </Routes>
        </Router>
      </AuthProvider>
    </SocketContext.Provider>
    <h1>test</h1>
  </React.StrictMode>,
  document.getElementById('root')
);
