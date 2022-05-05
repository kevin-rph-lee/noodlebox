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

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing/>} />
      <Route path="unauthorized" element={<Unauthorized />} />



        <Route element = {<PersistLogin />}>
          <Route element ={<RequireAuth allowedRoles={['user', 'admin']}/>}>
            <Route path="/users">
              <Route index element={<Profile />} />
            </Route>
          </Route>

          <Route element ={<RequireAuth allowedRoles={['admin']}/>}>
            <Route path="/admin">
              <Route index element={<Admin />} />
            </Route>
          </Route>
        </Route>


        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
