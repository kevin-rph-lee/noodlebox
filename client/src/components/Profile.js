import { useState, useEffect } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useNavigate, useLocation } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { ToastContainer, toast } from 'react-toastify'


const Profile = () => {
    const [userInfo, setUserInfo] = useState({})

    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)

    const [userOldPassword, setUserOldPassword] = useState([])
    const [newUserPassword, setNewUserPassword] = useState([])
    const [newUserPasswordConfirm, setNewUserPasswordConfirm] = useState([])

    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    const location = useLocation()

    //Closes both he modal and clears the form in the modal
    const handleResetPasswordModalClose = () => {
        setShowResetPasswordModal(false);
        clearForms();
    }
    const handleResetPasswordModalShow = () => setShowResetPasswordModal(true);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController()
        //Get the users from the server
        const getUserInfo = async () => {
            try {
                const response = await axiosPrivate.get('/users/', {
                    signal: controller.signal
                });
                isMounted && setUserInfo({'userName': response.data.user_name , 'role':response.data.role});
            } catch (err) {
                navigate('/', { state: { from: location }, replace: true });
            }
        }

        getUserInfo();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    //Clears all the forms
    const clearForms = () => {
        Array.from(document.querySelectorAll('input')).forEach(
          input => (input.value = '')
        );
        userOldPassword([])
        setNewUserPassword([])
        setNewUserPasswordConfirm([])
      }
    
    //Post request to edit the password of a user
    const handleUpdatePasswordSubmit = async (e) => {
        e.preventDefault()
        try {
            await axiosPrivate.post('/users/update/user', {newUserPassword:newUserPassword, newUserPasswordConfirm:newUserPasswordConfirm, userOldPassword:userOldPassword });
            toast.success('Password updated successfully', {theme:'colored'})
            handleResetPasswordModalClose();
            clearForms();
        } catch (err) {
            toast.error(`Error! ${err.response.data}`, {theme: 'colored'})
            clearForms();
        }
    }
    
    return (
        <>
            <div className='main'>
                <h1>Your Profile: </h1>
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title><b>Username: </b>{userInfo.userName}</Card.Title>
                        <Card.Text>
                        <b>Role: </b>{userInfo.role}
                        </Card.Text>
                        <Button variant='primary' onClick={handleResetPasswordModalShow}>Reset Password</Button>
                    </Card.Body>
                </Card>
                <ToastContainer position='top-left' />  
            </div>

            <Modal show={showResetPasswordModal} onHide={handleResetPasswordModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Reset password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group className='mb-3' >
                        <Form.Label>Your Password</Form.Label>
                        <Form.Control type='password' placeholder='Your password' onChange = {(e) => setUserOldPassword(e.target.value)}/>
                    <Form.Text className='text-muted'>
                        Enter your own password for security purpooses
                    </Form.Text>
                    </Form.Group>
                    <Form.Group className='mb-3' >
                        <Form.Label>Enter new password</Form.Label>
                        <Form.Control type='password' placeholder='Password' onChange = {(e) => setNewUserPassword(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className='mb-3' >
                        <Form.Label>Confirm new password</Form.Label>
                        <Form.Control type='password' placeholder='Password' onChange = {(e) => setNewUserPasswordConfirm(e.target.value)}/>
                    </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleResetPasswordModalClose}>
                    Close
                    </Button>
                    <Button variant='primary' onClick={handleUpdatePasswordSubmit}>
                    Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        
        </>
    );
};

export default Profile;