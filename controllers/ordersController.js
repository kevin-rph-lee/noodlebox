const db = require('../lib/dbConnect')
const io = require("../utils/socketio.js").getIO();

//Get orders owned by a single user
const getOrders = async (req, res) => {
    //Find the userID
    let SQLStringGetUserID = `SELECT id FROM USERS WHERE user_name = $1;`
    let valuesGetUserID = [req.user]
    const userID = await db.query(SQLStringGetUserID, valuesGetUserID)
    
    //Throw error if we don't get only a single user back
    if(userID['rows'].length !== 1){
        return res.status(500).send('Database Error!')
    }

    //SQL strings for getting the orders and ordered items
    let SQLStringGetOrder = `SELECT * FROM orders WHERE user_id = $1;`
    let valuesGetOrder = [userID['rows'][0].id]
    let SQLStringGetOrderedItems = `SELECT * FROM orders AS o INNER JOIN ordered_items AS oi ON o.id = oi.order_id INNER JOIN menu_items AS mi ON mi.id = oi.menu_item_id WHERE o.user_id = $1 ORDER BY 1 DESC;`
    let valuesGetOrderedItems = [userID['rows'][0].id]
    
    //Getting the orders and ordered items
    const ordersData= await db.query(SQLStringGetOrder, valuesGetOrder)
    const orderedItems = await db.query(SQLStringGetOrderedItems, valuesGetOrderedItems)

    //Reversing the orders to get the newest order first
    const orders = ordersData['rows']
    orders.reverse()

    //Creating an array in the orders object and adding in all of the ordered items
    for(let i in orders){
        orders[i]['orderedItems'] = []
        for(let y in orderedItems['rows']){
            if(orderedItems['rows'][y].order_id === orders[i]['id']){
                orders[i]['orderedItems'].push(orderedItems['rows'][y])
            }
        }
        orders[i].order_created_datetime = orders[i].order_created_datetime.toLocaleString('en-GB', { hour: 'numeric', minute:'numeric', hour12: true, day: 'numeric', weekday: 'short', month: 'short' })
    }
    res.json(orders)
}

//Get orders owned by a single user
const getPendingOrders = async (req, res) => {
    //Find the userID
    let SQLStringGetUserID = `SELECT id FROM USERS WHERE user_name = $1;`
    let valuesGetUserID = [req.user]
    const userID = await db.query(SQLStringGetUserID, valuesGetUserID)
    
    //Throw error if we don't get only a single user back
    if(userID['rows'].length !== 1){
        return res.status(500).send('Database Error!')
    }

    //SQL strings for getting the orders and ordered items
    let SQLStringGetOrder = `SELECT * FROM orders WHERE user_id = $1 AND order_status = 'pending';`
    let valuesGetOrder = [userID['rows'][0].id]
    let SQLStringGetOrderedItems = `SELECT * FROM orders AS o INNER JOIN ordered_items AS oi ON o.id = oi.order_id INNER JOIN menu_items AS mi ON mi.id = oi.menu_item_id WHERE o.user_id = $1 ORDER BY 1 DESC;`
    let valuesGetOrderedItems = [userID['rows'][0].id]
    
    //Getting the orders and ordered items
    const ordersData= await db.query(SQLStringGetOrder, valuesGetOrder)
    const orderedItems = await db.query(SQLStringGetOrderedItems, valuesGetOrderedItems)

    //Reversing the orders to get the newest order first
    const orders = ordersData['rows']
    orders.reverse()

    //Creating an array in the orders object and adding in all of the ordered items
    for(let i in orders){
        orders[i]['orderedItems'] = []
        for(let y in orderedItems['rows']){
            if(orderedItems['rows'][y].order_id === orders[i]['id']){
                orders[i]['orderedItems'].push(orderedItems['rows'][y])
            }
        }
        orders[i].order_created_datetime = orders[i].order_created_datetime.toLocaleString('en-GB', { hour: 'numeric', minute:'numeric', hour12: true, day: 'numeric', weekday: 'short', month: 'short' })
    }
    res.json(orders)
}

//Get orders owned by a single user
const getCompletedOrders = async (req, res) => {
    //Find the userID
    let SQLStringGetUserID = `SELECT id FROM USERS WHERE user_name = $1;`
    let valuesGetUserID = [req.user]
    const userID = await db.query(SQLStringGetUserID, valuesGetUserID)
    
    //Throw error if we don't get only a single user back
    if(userID['rows'].length !== 1){
        return res.status(500).send('Database Error!')
    }

    //SQL strings for getting the orders and ordered items
    let SQLStringGetOrder = `SELECT * FROM orders WHERE user_id = $1 AND order_status = 'completed';`
    let valuesGetOrder = [userID['rows'][0].id]
    let SQLStringGetOrderedItems = `SELECT * FROM orders AS o INNER JOIN ordered_items AS oi ON o.id = oi.order_id INNER JOIN menu_items AS mi ON mi.id = oi.menu_item_id WHERE o.user_id = $1 ORDER BY 1 DESC;`
    let valuesGetOrderedItems = [userID['rows'][0].id]
    
    //Getting the orders and ordered items
    const ordersData= await db.query(SQLStringGetOrder, valuesGetOrder)
    const orderedItems = await db.query(SQLStringGetOrderedItems, valuesGetOrderedItems)

    //Reversing the orders to get the newest order first
    const orders = ordersData['rows']
    orders.reverse()

    //Creating an array in the orders object and adding in all of the ordered items
    for(let i in orders){
        orders[i]['orderedItems'] = []
        for(let y in orderedItems['rows']){
            if(orderedItems['rows'][y].order_id === orders[i]['id']){
                orders[i]['orderedItems'].push(orderedItems['rows'][y])
            }
        }
        orders[i].order_created_datetime = orders[i].order_created_datetime.toLocaleString('en-GB', { hour: 'numeric', minute:'numeric', hour12: true, day: 'numeric', weekday: 'short', month: 'short' })
    }
    res.json(orders)
}


//Create a new order
const createOrder = async (req, res) => {

    //Getting the menu items that are submitted
    const menuItems = req.body.menuItems
    
    //Find the userID
    let SQLStringGetUserID = `SELECT id FROM USERS WHERE user_name = $1;`
    let valuesGetUserID = [req.user]
    const userID = await db.query(SQLStringGetUserID, valuesGetUserID)
    
    //Throw error if we don't get only a single user back
    if(userID['rows'].length !== 1){
        return res.status(500).send('Database Error!')
    }

    //Create new order and return the new order ID
    let SQLStringCreateOrder = `INSERT INTO orders (user_ID) VALUES ($1) RETURNING id;`
    let valuesCreateOrder = [userID['rows'][0].id]
    const orderID = await db.query(SQLStringCreateOrder, valuesCreateOrder)
    
    //Insert new ordered items for any item which doesn't have a quantity of 0
    for(let i in menuItems){
        if(menuItems[i].itemQuantity > 0){
            let SQLStringCreateOrderedItem = `INSERT INTO ordered_items (order_id, menu_item_id, quantity) VALUES ($1, $2, $3);`
            let valuesCreateOrderedItem = [orderID['rows'][0].id , menuItems[i].itemID, menuItems[i].itemQuantity ]
            await db.query(SQLStringCreateOrderedItem, valuesCreateOrderedItem)
        }
    }

    res.sendStatus(200)
}

const getAllOrders = async (req, res) => {

    //SQL strings for getting the orders and ordered items
    let SQLStringGetOrder = `SELECT o.id, o.order_status, o.order_created_datetime, o.user_id, u.user_name FROM orders AS o INNER JOIN users AS u ON o.user_id = u.id`
    let SQLStringGetOrderedItems = `SELECT * FROM orders AS o INNER JOIN ordered_items AS oi ON o.id = oi.order_id INNER JOIN menu_items AS mi ON mi.id = oi.menu_item_id;`
    
    //Getting the orders and ordered items
    const ordersData= await db.query(SQLStringGetOrder)
    const orderedItems = await db.query(SQLStringGetOrderedItems)

    //Reversing the orders to get the newest order first
    const orders = ordersData['rows']
    orders.reverse()

    //Creating an array in the orders object and adding in all of the ordered items
    for(let i in orders){
        orders[i]['orderedItems'] = []
        for(let y in orderedItems['rows']){
            if(orderedItems['rows'][y].order_id === orders[i]['id']){
                orders[i]['orderedItems'].push(orderedItems['rows'][y])
            }
        }
        orders[i].order_created_datetime = orders[i].order_created_datetime.toLocaleString('en-GB', { hour: 'numeric', minute:'numeric', hour12: true, day: 'numeric', weekday: 'short', month: 'short' })
    }
    res.json(orders)
}


const getAllCompletedOrders = async (req, res) => {

    //SQL strings for getting the orders and ordered items
    let SQLStringGetOrder = `SELECT o.id, o.order_status, o.order_created_datetime, o.user_id, u.user_name FROM orders AS o INNER JOIN users AS u ON o.user_id = u.id WHERE o.order_status = 'completed'`
    let SQLStringGetOrderedItems = `SELECT * FROM orders AS o INNER JOIN ordered_items AS oi ON o.id = oi.order_id INNER JOIN menu_items AS mi ON mi.id = oi.menu_item_id;`
    
    //Getting the orders and ordered items
    const ordersData= await db.query(SQLStringGetOrder)
    const orderedItems = await db.query(SQLStringGetOrderedItems)

    //Reversing the orders to get the newest order first
    const orders = ordersData['rows']
    orders.reverse()

    //Creating an array in the orders object and adding in all of the ordered items
    for(let i in orders){
        orders[i]['orderedItems'] = []
        for(let y in orderedItems['rows']){
            if(orderedItems['rows'][y].order_id === orders[i]['id']){
                orders[i]['orderedItems'].push(orderedItems['rows'][y])
            }
        }
        orders[i].order_created_datetime = orders[i].order_created_datetime.toLocaleString('en-GB', { hour: 'numeric', minute:'numeric', hour12: true, day: 'numeric', weekday: 'short', month: 'short' })
    }
    res.json(orders)
}

const getAllPendingOrders = async (req, res) => {

    //SQL strings for getting the orders and ordered items
    let SQLStringGetOrder = `SELECT o.id, o.order_status, o.order_created_datetime, o.user_id, u.user_name FROM orders AS o INNER JOIN users AS u ON o.user_id = u.id WHERE o.order_status = 'pending'`
    let SQLStringGetOrderedItems = `SELECT * FROM orders AS o INNER JOIN ordered_items AS oi ON o.id = oi.order_id INNER JOIN menu_items AS mi ON mi.id = oi.menu_item_id;`
    
    //Getting the orders and ordered items
    const ordersData= await db.query(SQLStringGetOrder)
    const orderedItems = await db.query(SQLStringGetOrderedItems)

    //Reversing the orders to get the newest order first
    const orders = ordersData['rows']
    orders.reverse()

    //Creating an array in the orders object and adding in all of the ordered items
    for(let i in orders){
        orders[i]['orderedItems'] = []
        for(let y in orderedItems['rows']){
            if(orderedItems['rows'][y].order_id === orders[i]['id']){
                orders[i]['orderedItems'].push(orderedItems['rows'][y])
            }
        }
        orders[i].order_created_datetime = orders[i].order_created_datetime.toLocaleString('en-GB', { hour: 'numeric', minute:'numeric', hour12: true, day: 'numeric', weekday: 'short', month: 'short' })
    }
    res.json(orders)
}

//Complete an order
const completeOrder = async (req, res) => {
    console.log(req.body.orderID)
    let SQLStringGetUserID = `SELECT * FROM orders AS o INNER JOIN users AS u ON o.user_ID = u.id WHERE o.id = $1;`
    let valuesGetUserID = [req.body.orderID]    
    const userIDData= await db.query(SQLStringGetUserID, valuesGetUserID)
    console.log(userIDData['rows'])
    if(userIDData['rows'].length === 0){
        res.status(500).send('Database error!')
        return
    }

    let SQLStringCompleteOrder = `UPDATE orders SET order_status = 'completed' WHERE id = $1;`
    let valuesCompleteOrder=  [req.body.orderID]
    await db.query(SQLStringCompleteOrder, valuesCompleteOrder)

    

    res.sendStatus(200)
}


module.exports = { createOrder, getOrders, getPendingOrders, getCompletedOrders, getAllOrders, getAllCompletedOrders, getAllPendingOrders, completeOrder }