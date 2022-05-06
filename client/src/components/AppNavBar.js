import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import { useState } from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axios from 'axios'
import useAuth from '../hooks/useAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Link, useNavigate} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import NavDropdown from 'react-bootstrap/NavDropdown'

const AppNavBar = () => {


  //Store auth state and store it in the global context
  const { setAuth, auth } = useAuth()
  
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const handleCloseRegistrationForm = () => setShowRegistrationForm(false);
  const handleShowRegistrationForm = () => setShowRegistrationForm(true);

  const [loginUsername, setLoginUsername] = useState([])
  const [loginPassword, setLoginPassword] = useState([])
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleCloseLoginForm = () => setShowLoginForm(false);
  const handleShowLoginForm = () => setShowLoginForm(true);

  const navigate = useNavigate()



  const handleRegistrationSubmit = async (e) => {

    e.preventDefault();

    try {

      const resp = await axios.get(
        '/refresh',
        { params: { userId: null }, headers: { 'Content-Type': 'application/json'  }, withCredentials: true  }
      )
      console.log(resp.data)
      return resp.data

    } catch (err) {
      
    }
  }

  const handleLogout = async (e) => {
    e.preventDefault();

    try {

      const resp = await axios.post(
        '/users/logout',
        { params: { userId: null }, headers: { 'Content-Type': 'application/json'  }, withCredentials: true  }
      )
      setAuth({})
      navigate('/')

    } catch (err) {
      console.log('Error! ' + err)
    }
  }


  const handleLoginSubmit = async (e) => {
    e.preventDefault()

    try {
      const response =await axios.post('/users/login', {username: loginUsername, password: loginPassword}, {withCredentials: true})
      const responseData= response.data
      setAuth(responseData)
      toast.success('Logged in successfully', {theme:"colored"})
      setShowLoginForm(false)
      
    } catch (err) {
      Array.from(document.querySelectorAll("input")).forEach(
        input => (input.value = "")
      );
      setLoginUsername([])
      setLoginPassword([])
      toast.error(`Error! ${err.response.data}`, {theme: "colored"})
    }

  }


    return (
      <>
      <Navbar bg="dark" variant="dark" expand={false}>
        <Container fluid>
          <Navbar.Brand href="#">React Node Express Tempalate</Navbar.Brand>
          <NavDropdown align="end" title={<FontAwesomeIcon icon={faGear} />} id="basic-nav-dropdown" flip="true">
            <NavDropdown.Item onClick={handleShowRegistrationForm}>Registration</NavDropdown.Item>
            <NavDropdown.Item onClick={handleShowLoginForm}>Login</NavDropdown.Item>
            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>{navigate('/admin')}}>Admin</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
          </NavDropdown>
        </Container>
        <ToastContainer />  
      </Navbar>

      <Modal show={showRegistrationForm} onHide={handleCloseRegistrationForm}>
        <Modal.Header closeButton>
          <Modal.Title>Register User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
          </Form>
          <Button variant="secondary" onClick={handleCloseRegistrationForm}>
            Close
          </Button>
          <Button variant="primary" onClick={handleRegistrationSubmit}>
            Register!
          </Button>
        </Modal.Body>
      </Modal>

      <Modal show={showLoginForm} onHide={handleCloseLoginForm}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" onChange = {(e) => setLoginUsername(e.target.value)} />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange = {(e) => setLoginPassword(e.target.value)}/>
            </Form.Group>
          </Form>
          <Button variant="secondary" onClick={handleCloseLoginForm}>
            Close
          </Button>
          <Button variant="primary" onClick={handleLoginSubmit}>
            Login!
          </Button>
        </Modal.Body>
        <Modal.Footer>
          
        </Modal.Footer>
      </Modal>

      </>
    )



}

export default AppNavBar