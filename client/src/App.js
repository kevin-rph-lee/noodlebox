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

function App() {

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
