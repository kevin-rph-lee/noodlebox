const db = require('../lib/dbConnect')

//Get orders owned by a single user
const getOrders = async (req, res) => {


    //Throw error if we don't get only a single user back
    if(userID['rows'].length !== 1){
        return res.status(500).send('Database Error!')
    }

    //SQL strings for getting the orders and ordered items
    let SQLStringGetOrder = `SELECT * FROM orders;`
    let SQLStringGetOrderedItems = `SELECT * FROM orders AS o INNER JOIN ordered_items AS oi ON o.id = oi.order_id INNER JOIN menu_items AS mi ON mi.id = oi.menu_item_id ORDER BY 1 DESC;`
    
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

//Get pending orders owned by a single user
const getPendingOrders = async (req, res) => {

    //SQL strings for getting the orders and ordered items
    let SQLStringGetOrder = `SELECT o.id, u.user_name, o.order_completion, o.order_created_datetime FROM orders as o INNER JOIN users AS u ON o.user_id = u.id WHERE o.order_completion = false;`
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

//Get finished orders owned by a single user
const getFinishedOrders = async (req, res) => {

    //SQL strings for getting the orders and ordered items
    let SQLStringGetOrder = `SELECT o.id, u.user_name, o.order_completion, o.order_created_datetime FROM orders as o INNER JOIN users AS u ON o.user_id = u.id WHERE o.order_completion = true;`
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

//Get orders owned by a single user
const getAllOrders = async (req, res) => {

    //SQL strings for getting the orders and ordered items
    let SQLStringGetOrder = `SELECT o.id, u.user_name, o.order_completion, o.order_created_datetime FROM orders as o INNER JOIN users AS u ON o.user_id = u.id;`
    let SQLStringGetOrderedItems = `SELECT * FROM orders AS o INNER JOIN ordered_items AS oi ON o.id = oi.order_id INNER JOIN menu_items AS mi ON mi.id = oi.menu_item_id;`
    
    //Getting the orders and ordered items
    const ordersData= await db.query(SQLStringGetOrder)
    const orderedItems = await db.query(SQLStringGetOrderedItems)

    console.log(ordersData.rows)

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

//Complete a single order
const completeOrder = async (req, res) => {

    //Checking if order_id is coming from the client is formatted correclty
    if(typeof req.body.orderID !== 'number') {
        return res.status(500).send('Recieved bad format data from client!')
    }
    let SQLStringCompleteUsers = `UPDATE orders SET order_completion = true WHERE id = $1;`
    let valuesCompleteUsers = [req.body.orderID]
    db.query(SQLStringCompleteUsers, valuesCompleteUsers)
      .then(async () => {
        res.sendStatus(200)    
    })

    
}


module.exports = { createOrder, getOrders, getAllOrders, completeOrder, getPendingOrders, getFinishedOrders }