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

const Landing = () => {
    const [showSubmitOrderModal, setSubmitOrderModal] = useState(false);

    const [menuItems, setMenuItems] = useState({})
    const [itemCart, setItemCart] = useState({})
    const axiosPrivate = useAxiosPrivate()    
    const handleSubmitOrderModalShow = () => setSubmitOrderModal(true);
    const handleSubmitOrderModalClose = () => setSubmitOrderModal(false);
    const { setAuth, auth } = useAuth()

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
                console.log(response.data)
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

    const createCard = (menuItem) =>{
        let itemImg = `/${menuItem.itemID}.jpg`
        let id = menuItem.itemID
        // let numberInCart = 

        return (
            <Card style={{ width: '18rem' }} className='menu-item' key={menuItem.id} >
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
        if(menuItems[id].itemQuantity < 9){



            // setMenuItems(prevMenuItems => ({ ...prevMenuItems, [id]: prevMenuItems[id].itemQuantity + 1 }))

            // this.setState(prevState => ({
            //     food: {
            //       ...prevState.food,           // copy all other key-value pairs of food object
            //       pizza: {                     // specific object of food object
            //         ...prevState.food.pizza,   // copy all pizza key-value pairs
            //         extraCheese: true          // update value of specific key
            //       }
            //     }
            //   }))

        }
    }

    const decreaseQuantity = (id) =>{
        if(itemCart[id] > 0){
            setItemCart(prevCart => ({ ...prevCart, [id]: prevCart[id] - 1 }))
        }
    }

    const submitOrder = () => {

        if(auth.role !== 'user' ){
            toast.error(`Must be logged in`, {theme: 'colored'})
        } else {
            handleSubmitOrderModalShow()
        }
        
    }

    const renderCart = (itemCart) => {

        return  Object.keys(itemCart).map((itemCartID,i) => {

            return(
            <tr key={i}>
                <td></td>
                <td>{itemCart[itemCartID]}</td>
                <td>test</td>
            </tr>
            )
        })
    }

    return (
        <>
            <div className='main'>
                <div className='page-title'>
                    <h1>Menu</h1>
                    <Button variant='success' onClick={submitOrder}>Order!</Button>
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
                        {/* {menuItems.map( menuItem =>{
                            return menuItem.item_type === 'snack' ?
                                createCard(menuItem) : null
                            } 
                        )} */}
                    </Row>
                </Container>
                <h2>Drinks</h2>
                <Container fluid>
                    <Row>
                        {/* {menuItems.map( menuItem =>{
                            return menuItem.item_type === 'drink' ?
                                createCard(menuItem) : null
                            } 
                        )} */}
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
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderCart(itemCart)}
                    </tbody>
                </Table>

                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleSubmitOrderModalClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmitOrderModalClose}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
  };
  
  export default Landing