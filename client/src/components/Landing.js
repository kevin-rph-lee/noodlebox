import { useState, useEffect } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer, toast } from 'react-toastify'
import Modal from 'react-bootstrap/Modal'
import useAuth from '../hooks/useAuth'
import Table from 'react-bootstrap/Table'
import { useNavigate } from 'react-router-dom'

const Landing = (test) => {
    const [showSubmitOrderModal, setSubmitOrderModal] = useState(false);
    const navigate = useNavigate()
    const [menuItems, setMenuItems] = useState({})
    const axiosPrivate = useAxiosPrivate()    
    const handleSubmitOrderModalShow = () => setSubmitOrderModal(true);
    const handleSubmitOrderModalClose = () => setSubmitOrderModal(false);
    const {auth } = useAuth()

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        //Get the menu items from the server when the page initially loads
        const getMenuItems = async () => {
            try {
                const response = await axiosPrivate.get('/menuItems', {
                    signal: controller.signal
                });
                let newMenuItems = {}
                //Iterate through all of the menu items and create the cart, defaulting the quantity of each item to 0
                for(let i =0; i < response.data.length; i++){
                    newMenuItems[response.data[i].id] = {
                        itemID: response.data[i].id,
                        itemName : response.data[i].item_name,
                        itemDescription: response.data[i].item_description,
                        itemType : response.data[i].item_type,
                        itemPrice: response.data[i].item_price,
                        itemQuantity: 0
                    }
                }
                isMounted && setMenuItems(newMenuItems)
            } catch (err) {
                console.log(err)
            }
        }
        getMenuItems();
        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    //Generates the cards taht contain the menu items
    const createCard = (menuItem) =>{

        //Create image file path
        let itemImg = `/${menuItem.itemID}.jpg`

        let id = menuItem.itemID

        return (
            <Card style={{ width: '18rem' }} className='menu-item' key={menuItem.itemID} >
                <Card.Img variant="top" src= {itemImg} />
                <Card.Body>
                    <Card.Title>{menuItem.itemName}</Card.Title>
                    <Card.Text>
                        <b>Price: ${menuItem.itemPrice}</b> 
                        <br/>
                        {menuItem.itemDescription}
                    </Card.Text>
                    <div className='order-counter'>
                        <Button className='plus-minus-button' name= {menuItem.itemID} onClick={() => increaseQuantity(id)}><FontAwesomeIcon icon={faArrowUp} name= {menuItem.id} /></Button>
                        <span className='counter'>{menuItem.itemQuantity}</span>
                        <Button className='plus-minus-button' name= {menuItem.itemID} onClick={() => decreaseQuantity(id)}><FontAwesomeIcon icon={faArrowDown} name= {menuItem.id} /></Button>
                    </div>
                </Card.Body>
            </Card>
        )
    }

    //Takes the ID of the menu item we want to increase the quantity of in the cart, and then increments it up by one. 
    const increaseQuantity = (id) =>{
        //Maximum quantity of items ordered is 9
        if(menuItems[id].itemQuantity < 9){
            const newMenuItem = menuItems[id]
            newMenuItem.itemQuantity ++
            setMenuItems(prevInputs => Object.assign({}, prevInputs, {[id]: newMenuItem }));
        }
    }

    //Takes the ID of the menu item we want to decrease the quantity of in the cart, and then decrease it up by one. 
    const decreaseQuantity = (id) =>{
        //Minimum quantityi of items ordered is 0
        if(menuItems[id].itemQuantity > 0){
            const newMenuItem = menuItems[id]
            newMenuItem.itemQuantity --
            setMenuItems(prevInputs => Object.assign({}, prevInputs, {[id]: newMenuItem }));
        }
    }

    //Opens the cart modal when the Order button is clicked
    const openCart = () => {
        //Check if there are any menu items with a quantity over 0
        for (const menuItemID in menuItems) {
            if(menuItems[menuItemID].itemQuantity > 0){
                //Throw error if the user is not logged in
                if(!auth.role){
                    toast.error(`Must be logged in`, {theme: 'colored'})
                    return
                } else {
                    //Open modal once we find at least one item with items in the cart
                    handleSubmitOrderModalShow()
                    return
                }
            }
        }

        //Throw error message if there are no menu items with any quantity over 0
        toast.error(`No items in cart!`, {theme: 'colored'})
        
    }

    //Opens the cart modal when the Order button is clicked
    const navigateToOrders = () => {
        //Throw error if the user is not logged in
        if(!auth.role){
            toast.error(`Must be logged in`, {theme: 'colored'})
            return
        } else {
            navigate('/orders')
        }
        
    }
    

    //Calculate the total price of the order
    const calculateTotalPrice = () => {
        let totalPrice = 0
        for (const menuItemID in menuItems) {
            totalPrice = totalPrice + (menuItems[menuItemID].itemQuantity * menuItems[menuItemID].itemPrice)
        }
        return totalPrice
    }

    //Submit the order to the back end
    const submitOrder = async () => {

        await axiosPrivate.post('/orders', {menuItems});
        toast.success(`Order Submitted!`, {theme: 'colored'})

        //Clear the item quantities from the cart
        for (const menuItemID in menuItems) {
            const newMenuItem = menuItems[menuItemID]
            newMenuItem.itemQuantity = 0
            setMenuItems(prevInputs => Object.assign({}, prevInputs, {[menuItemID]: newMenuItem }));
        }
    }

    //Render the table within the cart showing menu items in the cart
    const renderCart = (menuItems) => {
        return  Object.keys(menuItems).map((menuID,i) => {
            if(menuItems[menuID].itemQuantity > 0){
                return(
                    <tr key={menuID}>
                        <td>{menuItems[menuID].itemName}</td>
                        <td>{menuItems[menuID].itemQuantity}</td>
                        <td>${menuItems[menuID].itemPrice}</td>
                        <td>${menuItems[menuID].itemPrice * menuItems[menuID].itemQuantity}</td>
                    </tr>
                    )
            }
        })
    }

    return (
        <>
            <div className='main'>
                <div className='page-title'>
                    <h1>Menu</h1>
                    <Button className='title-button' variant='primary' onClick={openCart}>Submit order!</Button>
                    <Button className='title-button' variant='primary' onClick={navigateToOrders}>See orders</Button>
                    <Button className='title-button' variant='primary' onClick={test}>Test</Button>
                </div>
                <h2>Noodles</h2>
                <Container fluid>
                    <Row>
                    {Object.keys(menuItems).map(function(itemID, keyIndex) {
                            return menuItems[itemID].itemType === 'noodle' ?
                                createCard(menuItems[itemID]) : null
                    })}
                    </Row>
                </Container>
                <h2>Snacks</h2>
                <Container fluid>
                    <Row>
                    {Object.keys(menuItems).map(function(itemID, keyIndex) {
                            return menuItems[itemID].itemType === 'snack' ?
                                createCard(menuItems[itemID]) : null
                    })}
                    </Row>
                </Container>
                <h2>Drinks</h2>
                <Container fluid>
                    <Row>
                    {Object.keys(menuItems).map(function(itemID, keyIndex) {
                            return menuItems[itemID].itemType === 'drink' ?
                                createCard(menuItems[itemID]) : null
                    })}
                    </Row>
                </Container>
                <ToastContainer position='top-left' />
            </div>


            <Modal show={showSubmitOrderModal} onHide={handleSubmitOrderModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm your order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr key='Title'>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Item Price</th>
                            <th>Item Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderCart(menuItems)}
                    </tbody>
                </Table>
                <span>Total Price: ${calculateTotalPrice()}</span>
                
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleSubmitOrderModalClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={()=>{handleSubmitOrderModalClose(); submitOrder()}}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
  };
  
  export default Landing