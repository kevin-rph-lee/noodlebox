import Navbar from 'react-bootstrap/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import {useState, useContext, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axios from 'axios'
import useAuth from '../hooks/useAuth'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import Nav from 'react-bootstrap/Nav'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { SocketContext} from './../context/SocketProvider'

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

  const socket = useContext(SocketContext); 

  //When the auth changes (either through a login or a token refresh), join or leave the room
  useEffect(() => {

    //Logout leaves the rooms
    if(!auth.userName){
      leaveSocketRoom(auth.userID)
      leaveSocketRoom('admin')
     } else if(auth.role === 'admin') {
      joinSocketRoom('admin')
    } else {
      joinSocketRoom(auth.userID)
    }
  }, [auth.userName])

  //Joins the socket room based off userID
  const joinSocketRoom = (userID) => {
    socket.emit("join", userID);
  }
  
  //Leaves the socket room based off userID
  const leaveSocketRoom = (userID) => {
    socket.emit("leave", userID);
  }


  useEffect(() => {
    //Sending notification that a pending order is now complete (only the owner of the order should get this)
    const sendPickupNotification =  (orderID) =>{
      toast.info(`Order Number ${orderID} is ready for pickup!`, {theme:'colored', autoClose: false})
    }
    
    //Sending notification of new order (only admins should get it)
    const sendNewOrderNotification =  (newOrder) =>{
      if(auth.role === 'admin'){
        toast.info(`New Order ${newOrder.id}`, {theme:'colored', autoClose: false})
      }
    }

    socket.on('complete order', sendPickupNotification)
    socket.on('new order', sendNewOrderNotification)
  
    return () => {
      socket.off('complete order', sendPickupNotification)
      socket.off('new order', sendNewOrderNotification)
    }
  }, [socket])   

  //Clear all forms in the modal
  const clearForms = () => {
    Array.from(document.querySelectorAll('input')).forEach(
      input => (input.value = '')
    );
    setRegisterUsername([])
    setRegisterPassword([])
    setRegisterConfirmPassword([])
    setLoginUsername([])
    setLoginPassword([])
  }

  //Closes the login modal and clears the forms
  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
    clearForms();
  }

  //Closes the register modal and clears the forms
  const handleCloseRegistrationModal = () => {
    setShowRegistrationModal(false);
    clearForms();
  }

  //Handles new registration of a user
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

  //Logs the user into the system
  const handleLoginSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post('/users/login', {username: loginUsername, password: loginPassword}, {withCredentials: true})
      const responseData= response.data
      //Sets user info within the auth state
      setAuth(responseData)
      toast.success('Logged in successfully', {theme:'colored'})
      handleCloseLoginModal() 
      navigate('/')

    } catch (err) {
      clearForms()
      toast.error(`Error! ${err.response.data}`, {theme: 'colored'})
    }
  }

  //Logs a user out
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
      toast.error(`Error! ${err.response.data}`, {theme: 'colored'})
    }
  }
  

  //Builds the navbar based off the role of the user or if it's a guest
  let navBarItems= []
  if(auth.role === undefined){
    navBarItems = [
      <Dropdown.Item key={'home'} onClick={()=>{navigate('/')}}>Home</Dropdown.Item>,
      <Dropdown.Item key={'login'} onClick={handleShowLoginModal}>Login</Dropdown.Item>,
      <Dropdown.Item key={'registration'} onClick={handleShowRegistrationModal}>Registration</Dropdown.Item>,
    ]
  }else if(auth.role === 'admin'){
    navBarItems = [
      <Dropdown.Item key={'home'} onClick={()=>{navigate('/')}}>Home</Dropdown.Item>,
      <Dropdown.Item key={'orders'} onClick={()=>{navigate('/orders')}}>Orders</Dropdown.Item>,
      <Dropdown.Item key={'profile'} onClick={()=>{navigate('/users')}}>Profile</Dropdown.Item>,
      <Dropdown.Item key={'admin'} onClick={()=>{navigate('/users/admin')}}>User Admin</Dropdown.Item>,
      <Dropdown.Item key={'ordersAdmin'} onClick={()=>{navigate('/orders/admin')}}>Orders Admin</Dropdown.Item>,
      <Dropdown.Item key={'logout'} onClick={handleLogout}>Logout</Dropdown.Item>
    ]
  } else if(auth.role === 'user'){
    navBarItems = [
      <Dropdown.Item key={'home'} onClick={()=>{navigate('/')}}>Home</Dropdown.Item>,
      <Dropdown.Item key={'orders'} onClick={()=>{navigate('/orders')}}>Orders</Dropdown.Item>,
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
    <Navbar variant='dark' bg='dark' fixed='top'>
      <Container fluid>
        <Navbar.Brand onClick={()=>{navigate('/')}} className='app-title'>🍜 The Noodle Box</Navbar.Brand>
        <Nav>
          {auth.userName ? 
                    <Navbar.Text onClick={()=>{navigate('/users')}}>
                      User: <a className='username-span'>{auth.userName}</a>
                    </Navbar.Text> :
                    <Navbar.Text>
                     User: <a className='username-span'>Guest</a>
                    </Navbar.Text> }
          <DropdownButton align='end' title={<FontAwesomeIcon icon={faGear} />} id='dropdown-menu-align-end' variant= 'secondary' >
            {navBarItems}
          </DropdownButton>
        </Nav>
      </Container>
    </Navbar>

    <Modal show={showRegistrationModal} onHide={handleCloseRegistrationModal}>
      <Modal.Header closeButton>
        <Modal.Title>Register User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form>
          <Form.Group className='mb-3' >
            <Form.Label>Username (Email address)</Form.Label>
            <Form.Control type='email' placeholder='Enter email' onChange = {(e) => setRegisterUsername(e.target.value)} />
            <Form.Text className='text-muted'>
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>
          <Form.Group className='mb-3' >
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' placeholder='Password' onChange = {(e) => setRegisterPassword(e.target.value)}/>
          </Form.Group>
          <Form.Group className='mb-3' >
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type='password' placeholder='Confirm password' onChange = {(e) => setRegisterConfirmPassword(e.target.value)}/>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleCloseRegistrationModal}>
          Close
        </Button>
        <Button variant='primary' onClick={handleRegistrationSubmit}>
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
          <Form.Group className='mb-3' >
            <Form.Label>Username (Email address)</Form.Label>
            <Form.Control type='email' placeholder='Enter email' onChange = {(e) => setLoginUsername(e.target.value)} />
            <Form.Text className='text-muted'>
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>
          <Form.Group className='mb-3' >
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' placeholder='Password' onChange = {(e) => setLoginPassword(e.target.value)}/>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
      <Button variant='secondary' onClick={handleCloseLoginModal}>
          Close
        </Button>
        <Button variant='primary' onClick={handleLoginSubmit}>
          Login!
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  )
}

export default AppNavBar