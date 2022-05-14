import Navbar from 'react-bootstrap/Navbar'
import "bootstrap/dist/css/bootstrap.min.css"
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axios from 'axios'
import useAuth from '../hooks/useAuth'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import Nav from 'react-bootstrap/Nav'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

const AppNavBar = () => {
  
  const { setAuth, auth } = useAuth()

  const [registerUsername, setRegisterUsername] = useState([])
  const [registerPassword, setRegisterPassword] = useState([])
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState([])
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const handleShowRegistrationModal = () => setShowRegistrationModal(true);

  const [loginUsername, setLoginUsername] = useState([])
  const [loginPassword, setLoginPassword] = useState([])
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleShowLoginModal = () => setShowLoginModal(true);

  const navigate = useNavigate()

  //Clear all forms in the modal
  const clearForms = () => {
    Array.from(document.querySelectorAll("input")).forEach(
      input => (input.value = "")
    );
    setRegisterUsername([])
    setRegisterPassword([])
    setRegisterConfirmPassword([])
    setLoginUsername([])
    setLoginPassword([])
  }


  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
    clearForms();
  }
  const handleCloseRegistrationModal = () => {
    setShowRegistrationModal(false);
    clearForms();
  }

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault()

    try {
      if (registerPassword !== registerConfirmPassword){
        clearForms()
        toast.error('Passwords do not match', {theme: 'colored'})
        return
      }

      const response = await axios.post('/users/register', {username: registerUsername, password: registerPassword}, {withCredentials: true})
      const responseData= response.data
      setAuth(responseData)
      toast.success('Registered successfully', {theme:'colored'})
      handleCloseRegistrationModal()
      
    } catch (err) {
      clearForms()
      toast.error(`Error! ${err.response.data}`, {theme: 'colored'})
    }
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post('/users/login', {username: loginUsername, password: loginPassword}, {withCredentials: true})
      const responseData= response.data
      console.log('Response data ' + responseData.role)
      console.log('Response data ' + responseData.userName)
      setAuth(responseData)
      toast.success('Logged in successfully', {theme:"colored"})
      handleCloseLoginModal() 
    } catch (err) {
      clearForms()
      toast.error(`Error! ${err.response.data}`, {theme: "colored"})
    }
  }


  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      
      await axios.post(
        '/users/logout',
        { params: { userId: null }, headers: { 'Content-Type': 'application/json'  }, withCredentials: true  }
      )
      await navigate('/')
      setAuth({})
      toast.success('Logout successful!', {theme:'colored'})

    } catch (err) {
      console.log('Error! ' + err)
    }
  }

  let navBarItems= []
  if(auth.role === undefined){
    navBarItems = [
      <Dropdown.Item key={'login'} onClick={handleShowLoginModal}>Login</Dropdown.Item>,
      <Dropdown.Item key={'registration'} onClick={handleShowRegistrationModal}>Registration</Dropdown.Item>,
    ]
  }else if(auth.role === 'admin'){
    navBarItems = [
      <Dropdown.Item key={'profile'} onClick={()=>{navigate('/users')}}>Profile</Dropdown.Item>,
      <Dropdown.Item key={'admin'} onClick={()=>{navigate('/admin')}}>Admin</Dropdown.Item>,
      <Dropdown.Item key={'logout'} onClick={handleLogout}>Logout</Dropdown.Item>
    ]
  } else if(auth.role === 'user'){
    navBarItems = [
      <Dropdown.Item key={'profile'} onClick={()=>{navigate('/users')}}>Profile</Dropdown.Item>,
      <Dropdown.Item key={'logout'} onClick={handleLogout}>Logout</Dropdown.Item>
    ]
  } else {
    navBarItems = [
      <Dropdown.Item key={'error'}>ERROR!</Dropdown.Item>
    ]
  }

  return (
    <>
    <Navbar variant='dark' bg="dark">
      <Container fluid>
        <Navbar.Brand>React Node Express Template</Navbar.Brand>
        <Nav>
          <Navbar.Text>
            User: <a className='username-span'>{auth.userName ? auth.userName : 'Guest'}</a>
          </Navbar.Text>
          <DropdownButton align='end' title={<FontAwesomeIcon icon={faGear} />} id="dropdown-menu-align-end" variant= 'secondary' >
            {navBarItems}
          </DropdownButton>
        </Nav>
      </Container>
      <ToastContainer position="top-left" />
    </Navbar>

    <Modal show={showRegistrationModal} onHide={handleCloseRegistrationModal}>
      <Modal.Header closeButton>
        <Modal.Title>Register User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form>
          <Form.Group className="mb-3" >
            <Form.Label>Username (Email address)</Form.Label>
            <Form.Control type="email" placeholder="Enter email" onChange = {(e) => setRegisterUsername(e.target.value)} />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" >
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" onChange = {(e) => setRegisterPassword(e.target.value)}/>
          </Form.Group>
          <Form.Group className="mb-3" >
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" placeholder="Confirm password" onChange = {(e) => setRegisterConfirmPassword(e.target.value)}/>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseRegistrationModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleRegistrationSubmit}>
          Register!
        </Button>
      </Modal.Footer>
    </Modal>

    <Modal show={showLoginModal} onHide={handleCloseLoginModal}>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" >
            <Form.Label>Username (Email address)</Form.Label>
            <Form.Control type="email" placeholder="Enter email" onChange = {(e) => setLoginUsername(e.target.value)} />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" >
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" onChange = {(e) => setLoginPassword(e.target.value)}/>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
      <Button variant="secondary" onClick={handleCloseLoginModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleLoginSubmit}>
          Login!
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  )
}

export default AppNavBar