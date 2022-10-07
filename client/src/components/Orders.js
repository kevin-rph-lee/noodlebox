import { useState, useEffect, useContext } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useNavigate, useLocation } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import { SocketContext} from './../context/SocketProvider'

const Orders = () => {
    const [pendingOrders, setPendingOrders] = useState([])
    const [completedOrders, setCompletedOrders] = useState([])

    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    const location = useLocation()
    const socket = useContext(SocketContext); 


    useEffect(() => {

        let isMounted = true;
        const controller = new AbortController();
        //Get the orders and ordered items from the server
        const getOrders = async () => {
            try {
                const pendingOrdersResponse = await axiosPrivate.get('/orders/pending', {
                    signal: controller.signal
                });
                const completedOrdersReponse = await axiosPrivate.get('/orders/completed')

                await setCompletedOrders(completedOrdersReponse.data)
                
                isMounted && setPendingOrders(pendingOrdersResponse.data);

            } catch (err) {
                navigate('/', { state: { from: location }, replace: true });
            }
        }

        getOrders();

        return () => {
            isMounted = false;
            controller.abort();
        }

        
    }, [])

    useEffect(() => {

        //Removes an order from pending state and adds it to the completed orders
        const completeOrderState =  (orderID) =>{
            //Converts the OrderID into an int
            const orderIDInt = Number(orderID)

            //Grabbing the order from pending orders to be put into the completedOrders state
            const order = (pendingOrders.filter(order => order.id === orderIDInt)[0])
            
            //Removing order that is being completed from pendingOrders
            setPendingOrders(pendingOrder =>
                pendingOrder.filter(pendingOrder => {
                    return pendingOrder.id !== orderIDInt;
                }),
            );

            //Adding the formally pending order to completed orders
            setCompletedOrders(completedOrders => [...completedOrders, order])

        }
        
        socket.on('complete order', completeOrderState)
      
        return () => {
          socket.off('complete order', completeOrderState)
        }
      }, [socket, pendingOrders])   

    //Render the ordered items within the order cart
    const renderOrderedItems = (orderedItems) => {
        return orderedItems.map((orderedItem, i) =>
                <tr key={orderedItem.ordered_item_id}>
                    <td>{orderedItem.item_name}</td>
                    <td>{orderedItem.quantity}</td>
                    <td>${orderedItem.item_price}</td>
                    <td>${orderedItem.item_price * orderedItem.quantity}</td>
                </tr>
        )
    }

    //Calculate the total cost of an order
    const calculateTotal = (orderedItems) => {
        let total = 0
        for(let i = 0; i < orderedItems.length; i++){
            total = total + (orderedItems[i].item_price * orderedItems[i].quantity)
        }
        return total
    }

    return (
        <>
            <div className='main'>
            <h1>Pending Orders</h1>
            {(pendingOrders.length > 0) ?
                pendingOrders.map((order, i) =>(
                    <div className= 'order' key={order.id}>
                        <span className='order-title'>Order Submitted: {order.order_created_datetime}</span>
                        <div>Order ID: {order.id}</div>
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
                                {renderOrderedItems(order.orderedItems)}
                            </tbody>
                        </Table>
                        <span>Order total: <b>${calculateTotal(order.orderedItems)}</b> </span>
                    </div>
                    )
                )   :
            <p className='empty-orders'>No pending orders</p>}
            <h1>Completed Orders</h1>
            {(completedOrders.length > 0) ?
                completedOrders.map((order, i) =>(
                    <div className= 'order' key={order.id}>
                        <span className='order-title'>Order Submitted: {order.order_created_datetime}</span>
                        <div>Order ID: {order.id}</div>
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
                                {renderOrderedItems(order.orderedItems)}
                            </tbody>
                        </Table>
                        <span>Order total: <b>${calculateTotal(order.orderedItems)}</b> </span>
                    </div>
                    )
                )   :
            <p className='empty-orders'>No Completed orders</p>}
            </div>
        </>
    );
};

export default Orders;