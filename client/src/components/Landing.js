import { useState, useEffect } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

const Landing = () => {
    const [menuItems, setMenuItems] = useState([])
    const axiosPrivate = useAxiosPrivate()    

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        //Get the menu items from the server
        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/menuItems', {
                    signal: controller.signal
                });
                isMounted && setMenuItems(response.data);
                console.log(response.data)
            } catch (err) {
                console.log(err)
            }
        }

        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])


    return (
        <div className='main'>
            <h1 className='page-title'>Menu</h1>
            <h2>Noodles</h2>
            <Container fluid>
                <Row>
                    {menuItems.map( menuItem =>{
                        let itemImg = `/${menuItem.id}.jpg`

                        return menuItem.item_type === 'noodle' ?
                            <Card style={{ width: '18rem' }} className='menu-item'>
                                <Card.Img variant="top" src= {itemImg} />
                                <Card.Body>
                                    <Card.Title>{menuItem.item_name}</Card.Title>
                                    <Card.Text>
                                        <b>Price: ${menuItem.item_price}</b> 
                                        <br/>
                                        {menuItem.item_description}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        :
                        null
                    } 

                    )}
                </Row>
            </Container>
            <h2>Snacks</h2>
            <Container fluid>
                <Row>
                    {menuItems.map( menuItem =>{
                        let itemImg = `/${menuItem.id}.jpg`

                        return menuItem.item_type === 'snack' ?
                            <Card style={{ width: '18rem' }} className='menu-item'>
                                <Card.Img variant="top" src= {itemImg} />
                                <Card.Body>
                                    <Card.Title>{menuItem.item_name}</Card.Title>
                                    <Card.Text>
                                        <b>Price: ${menuItem.item_price}</b> 
                                        <br/>
                                        {menuItem.item_description}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        :
                        null
                    } 

                    )}
                </Row>
            </Container>
            <h2>Drinks</h2>
            <Container fluid>
                <Row>
                    {menuItems.map( menuItem =>{
                        let itemImg = `/${menuItem.id}.jpg`

                        return menuItem.item_type === 'drink' ?
                            <Card style={{ width: '18rem' }} className='menu-item'>
                                <Card.Img variant="top" src= {itemImg} />
                                <Card.Body>
                                    <Card.Title>{menuItem.item_name}</Card.Title>
                                    <Card.Text>
                                        <b>Price: ${menuItem.item_price}</b> 
                                        <br/>
                                        {menuItem.item_description}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        :
                        null
                    } 

                    )}
                </Row>
            </Container>
        </div>
    );
  };
  
  export default Landing