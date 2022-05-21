import { useState, useEffect } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer, toast } from 'react-toastify'

const Landing = () => {
    const [menuItems, setMenuItems] = useState([])
    const [itemCart, setItemCart] = useState({})
    const axiosPrivate = useAxiosPrivate()    

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        //Get the menu items from the server when the page initially loads
        const getMenuItems = async () => {
            try {
                const response = await axiosPrivate.get('/menuItems', {
                    signal: controller.signal
                });
                let newItemCart = itemCart
                //Iterate through all of the menu items and create the cart, defaulting the quantity of each item to 0
                for(let i =0; i < response.data.length; i++){
                    newItemCart[response.data[i].id] = 0
                }
                setItemCart(newItemCart)
                isMounted && setMenuItems(response.data)
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
        let itemImg = `/${menuItem.id}.jpg`
        let id = menuItem.id
        // let numberInCart = 

        return (
            <Card style={{ width: '18rem' }} className='menu-item' key={menuItem.id} >
                <Card.Img variant="top" src= {itemImg} />
                <Card.Body>
                    <Card.Title>{menuItem.item_name}</Card.Title>
                    <Card.Text>
                        <b>Price: ${menuItem.item_price}</b> 
                        <br/>
                        {menuItem.item_description}
                    </Card.Text>
                    <div className='order-counter'>
                        <Button className='plus-minus-button' name= {menuItem.id} onClick={() => increaseQuantity(id)}><FontAwesomeIcon icon={faArrowUp} name= {menuItem.id} /></Button>
                        <Form.Control value={itemCart[menuItem.id]} />
                        <Button className='plus-minus-button' name= {menuItem.id} onClick={() => decreaseQuantity(id)}><FontAwesomeIcon icon={faArrowDown} name= {menuItem.id} /></Button>
                    </div>
                </Card.Body>
            </Card>
        )
    }

    //Takes the ID of the menu item we want to increase the quantity of in the cart, and then increments it up by one. 
    const increaseQuantity = (id) =>{
        if(itemCart[id] < 9){
            setItemCart(prevCart => ({ ...prevCart, [id]: prevCart[id] + 1 }))
        }
    }

    const decreaseQuantity = (id) =>{
        if(itemCart[id] > 0){
            setItemCart(prevCart => ({ ...prevCart, [id]: prevCart[id] - 1 }))
        }
    }

    const submitOrder = () => {
        toast.error(`Must be logged in`, {theme: 'colored'})
    }

    return (
        <div className='main'>
            <div className='page-title'>
                <h1>Menu</h1>
                <Button variant='success' onClick={submitOrder}>Order!</Button>
            </div>
            <h2>Noodles</h2>
            <Container fluid>
                <Row>
                    {menuItems.map( menuItem =>{
                        return menuItem.item_type === 'noodle' ?
                            createCard(menuItem) : null 
                        } 
                    )}
                </Row>
            </Container>
            <h2>Snacks</h2>
            <Container fluid>
                <Row>
                    {menuItems.map( menuItem =>{
                        return menuItem.item_type === 'snack' ?
                            createCard(menuItem) : null
                        } 
                    )}
                </Row>
            </Container>
            <h2>Drinks</h2>
            <Container fluid>
                <Row>
                    {menuItems.map( menuItem =>{
                        return menuItem.item_type === 'drink' ?
                            createCard(menuItem) : null
                        } 
                    )}
                </Row>
            </Container>
            <ToastContainer position='top-left' />
        </div>
    );
  };
  
  export default Landing