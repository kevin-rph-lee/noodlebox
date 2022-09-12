import { useState, useEffect } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useNavigate, useLocation } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { ToastContainer, toast } from 'react-toastify'


const Admin = () => {



    const [users, setUsers] = useState([])    
    const [editPasswordUserName, setEditPasswordUserName] = useState()

    const [adminPassword, setAdminPassword] = useState([])
    const [newUserPassword, setNewUserPassword] = useState([])
    const [newUserPasswordConfirm, setNewUserPasswordConfirm] = useState([])

    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    const location = useLocation()

    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
    //Closes both he modal and clears the form in the modal
    const handleResetPasswordModalClose = () => {
        setShowResetPasswordModal(false);
        clearForms();
    }
    const handleResetPasswordModalShow = () => setShowResetPasswordModal(true);
    
    
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        //Get the users from the server
        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users/all', {
                    signal: controller.signal
                });
                isMounted && setUsers(response.data);
            } catch (err) {
                navigate('/', { state: { from: location }, replace: true });
            }
        }

        getUsers();

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
        setAdminPassword([])
        setNewUserPassword([])
        setNewUserPasswordConfirm([])
      }
    
    //Post request to edit the password of a user
    const handleUpdatePasswordSubmit = async (e) => {
        e.preventDefault()
        try {
            await axiosPrivate.post('/users/update/admin', {userToUpdate: editPasswordUserName, newUserPassword:newUserPassword, newUserPasswordConfirm:newUserPasswordConfirm, adminPassword:adminPassword });
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
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Username (Email)</th>
                        <th>Role</th>
                        <th>Reset Password</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, i) =>                   
                            <tr key={i}>
                                <td>{user.id}</td>
                                <td>{user.user_name}</td>
                                <td>{user.role}</td>
                                <td><Button id={user.user_name} onClick={(e)=>{
                                    setEditPasswordUserName(e.target.id)
                                    handleResetPasswordModalShow()
                                    }}>Reset</Button></td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                <ToastContainer position='top-left' />  
            </div>

            <Modal show={showResetPasswordModal} onHide={handleResetPasswordModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Reset password for {editPasswordUserName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group className='mb-3' >
                        <Form.Label>Your Password</Form.Label>
                        <Form.Control type='password' placeholder='Your password' onChange = {(e) => setAdminPassword(e.target.value)}/>
                    <Form.Text className='text-muted'>
                        Enter your own password for security purpooses
                    </Form.Text>
                    </Form.Group>
                    <Form.Group className='mb-3' >
                        <Form.Label>Enter new password for {editPasswordUserName}</Form.Label>
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

export default Admin;