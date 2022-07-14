import { useState, useEffect } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useNavigate, useLocation } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { ToastContainer, toast } from 'react-toastify'

const OrdersAdmin = () => {
    const [orders, setOrders] = useState([])
    const [pendingOrders, setPendingOrders] = useState([])
    const [finishedOrders, setFinishedOrders] = useState([])

    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    const location = useLocation()
    
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        //Get the orders and ordered items from the server
        const getOrders = async () => {
            try {
                const responseFinishedOrders = await axiosPrivate.get('/orders/finished', {
                    signal: controller.signal
                });
                const responsePendingOrders = await axiosPrivate.get('/orders/pending', {
                    signal: controller.signal
                });
                setPendingOrders(responsePendingOrders.data)
                setFinishedOrders(responseFinishedOrders.data)

                isMounted = true;
                // isMounted && setPendingOrders(getPendingOrders(responsePendingOrders.data))

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

    const completeOrder = async (id) => {
        await axiosPrivate.post('/orders/complete', {orderID: id});
        toast.success(`Order completed!`, {theme: 'colored'})
    }

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
            <h1>Admin</h1>
            <h1>Pending Orders</h1>
            {(pendingOrders.length > 0) ?
                pendingOrders.map((order, i) =>(
                    !order.order_completed ? 
                    <div className= 'order' key={order.id}>
                        <span className='order-title'>Order Submitted: {order.order_created_datetime}</span>
                        <p>Ordered by: {order.user_name}</p>
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
                        <span>Order total: <b>${calculateTotal(order.orderedItems)}</b></span>
                        <div className='complete-order-button'>
                            <Button onClick={()=>completeOrder(order.id)} variant="primary">Complete Order</Button>
                        </div>
                    </div>
                    : null)
                )   :
            <p className='empty-orders'>No pending orders</p>}
            <h1>Finished Orders</h1>
            {(finishedOrders.length > 0) ?
                finishedOrders.map((order, i) =>(
                    !order.order_completed ? 
                    <div className= 'order' key={order.id}>
                        <span className='order-title'>Order Submitted: {order.order_created_datetime}</span>
                        <p>Ordered by: {order.user_name}</p>
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
                        <span>Order total: <b>${calculateTotal(order.orderedItems)}</b></span>
                    </div>
                    : null)
                )   :
            <p className='empty-orders'>No finished orders</p>}
            </div>
        </>
    );
};

export default OrdersAdmin;