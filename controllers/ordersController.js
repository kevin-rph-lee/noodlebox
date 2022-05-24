const db = require('../lib/dbConnect')

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

module.exports = { createOrder }