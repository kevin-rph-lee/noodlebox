import './App.css';
import RequireAuth from './components/RequireAuth';
import Unauthorized from './components/Unauthorized';
import {Route, Routes } from 'react-router-dom';
import Layout from "./components/Layout";
import Profile from './components/Profile';
import Admin from './components/Admin';
import Landing from './components/Landing';
import NotFound from './components/NotFound';
import PersistLogin from './components/PersistLogin';
import Orders from './components/Orders';
import { w3cwebsocket as W3CWebSocket } from "websocket";

const wsClient = new W3CWebSocket('wss://noodlebox.herokuapp.com/:5000');

function App() {

  //Test function to send a dummy websocket message to the server
  const testSend = () => {
    wsClient.send(`{"test1":"test1", "test2":"test2"}`)
  }

  //Console logging out any recieved websocket messages
  wsClient.onmessage = (msg) => {
    console.log(msg.data)
 }

  return (
    <Routes>

      <Route element = {<PersistLogin />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing testSend={testSend}/>} />
        <Route path="unauthorized" element={<Unauthorized />} />

          <Route element ={<RequireAuth allowedRoles={['user', 'admin']}/>}>
            <Route path="/users">
              <Route index element={<Profile />} />
            </Route>
            <Route path="/orders">
              <Route index element={<Orders />} />
            </Route>
          </Route>

          <Route element ={<RequireAuth allowedRoles={['admin']}/>}>
            <Route path="/admin">
              <Route index element={<Admin />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
      </Route>

        
      </Route>
    </Routes>
  );
}

export default App;
