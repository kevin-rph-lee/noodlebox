import './App.css';
import RequireAuth from './components/RequireAuth';
import Unauthorized from './components/Unauthorized';
import {Route, Routes} from 'react-router-dom';
import Layout from "./components/Layout";
import Profile from './components/Profile';
import UsersAdmin from './components/UsersAdmin';
import Landing from './components/Landing';
import NotFound from './components/NotFound';
import PersistLogin from './components/PersistLogin';
import Orders from './components/Orders';
import OrdersAdmin from './components/OrdersAdmin';
import {useContext, useState, useEffect, useRef} from 'react'
// import {io} from "socket.io-client";
import useAuth from './hooks/useAuth'


function App({}) {

  // const { setAuth, auth } = useAuth()

  // const [socket, setSocket] = useState(null);
  // useEffect(() => {
  //   const newSocket = io('/')
  //   setSocket(newSocket)
  // }, [])




  return (
    <Routes>
      
      <Route element = {<PersistLogin />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
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
            <Route path="/users/admin">
              <Route index element={<UsersAdmin />} />
            </Route>
            <Route path="/orders/Admin">
              <Route index element={<OrdersAdmin />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
      </Route>

        
      </Route>
    </Routes>
  );
}

export default App;
