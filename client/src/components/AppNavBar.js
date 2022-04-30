import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Modal from 'react-bootstrap/Modal'
import { useState } from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axios from 'axios'
import useAuth from '../hooks/useAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppNavBar = () => {

  //Store auth state and store it in the global context
  const { setAuth } = useAuth()
  
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const handleCloseRegistrationForm = () => setShowRegistrationForm(false);
  const handleShowRegistrationForm = () => setShowRegistrationForm(true);

  const [loginUsername, setLoginUsername] = useState([])
  const [loginPassword, setLoginPassword] = useState([])
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleCloseLoginForm = () => setShowLoginForm(false);
  const handleShowLoginForm = () => setShowLoginForm(true);

  


  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();

    try {

      const resp = await axios.post(
        '/refresh',
        { params: { userId: null }, headers: { 'Content-Type': 'application/json'  }, withCredentials: true  }
      )
      return resp.data

    } catch (err) {
    }
  }



  const handleLoginSubmit = async (e) => {
    e.preventDefault()

    try {
      const response =await axios.post('/users/login', {username: loginUsername, password: loginPassword}, {withCredentials: true})
      const responseData= response.data
      setAuth(responseData)
    } catch (err) {
      Array.from(document.querySelectorAll("input")).forEach(
        input => (input.value = "")
      );
      setLoginUsername([])
      setLoginPassword([])
      toast.error(`Error! ${err.response.data}`, {theme: "colored"})
    }

  }


  const handleLogoutSubmit = async (e) => {
    e.preventDefault()

  }




    return (
      <>
      <Navbar bg="dark" variant="dark" expand={false}>
        <Container fluid>
          <Navbar.Brand href="#">React Node Express Tempalate</Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar" />
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end"
          >
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link onClick={handleShowRegistrationForm}>Register</Nav.Link>
              </Nav>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link onClick={handleShowLoginForm}>Login</Nav.Link>
              </Nav>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link onClick={handleLogoutSubmit}>Logout</Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
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
          <ToastContainer />  
        </Modal.Footer>
      </Modal>

      </>
    )



}

export default AppNavBar