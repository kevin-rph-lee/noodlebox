import { useState, useEffect } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useNavigate, useLocation } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { ToastContainer, toast } from 'react-toastify'


const OrdersAdmin = () => {
    const [pendingOrders, setPendingOrders] = useState([])
    const [completedOrders, setCompletedOrders] = useState([])

    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    const location = useLocation()
    
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        //Get the orders and ordered items from the server
        const getOrders = async () => {
            try {
                const pendingOrdersResponse = await axiosPrivate.get('/orders/pending/all', {
                    signal: controller.signal
                });
                const completedOrdersReponse = await axiosPrivate.get('/orders/completed/all')

                setCompletedOrders(completedOrdersReponse.data)


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

    const completeOrder = async (orderID) =>{
        try{
            await axiosPrivate.post('/orders/complete', {orderID});
            toast.success('Order completed for OrderID :' + orderID)
        } catch (err)  {
            toast.error(`Error! ${err.response.data}`, {theme: 'colored'})
        }
        
    }

    return (
        <>
            <div className='main'>
            <h1>Pending Orders</h1>
            {(pendingOrders.length > 0) ?
                pendingOrders.map((order, i) =>(
                    <div className= 'order' key={order.id}>
                        <span className='order-title'>Order Submitted: {order.order_created_datetime}</span>
                        <div>Order Owner Username: {order.user_name}</div>
                        <div>Order Owner ID: {order.user_id}</div>
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
                        <div>Order total: <b>${calculateTotal(order.orderedItems)}</b> </div>
                        <Button id={order.id} className = 'complete-order-button' onClick={(e)=>{
                                    completeOrder(e.target.id)
                                    }}>Complete Order</Button>
                    </div>
                    )
                )   :
            <p className='empty-orders'>No pending orders</p>}
            <h1>Completed Orders</h1>
            {(completedOrders.length > 0) ?
                completedOrders.map((order, i) =>(
                    <div className= 'order' key={order.id}>
                        <span className='order-title'>Order Submitted: {order.order_created_datetime}</span>
                        <div>Order Owner Username: {order.user_name}</div>
                        <div>Order Owner ID: {order.user_id}</div>
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
            <ToastContainer position='top-left' />
        </>
    );
};

export default OrdersAdmin;