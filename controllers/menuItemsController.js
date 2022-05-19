const db = require('../lib/dbConnect')

const getMenuItems = (req, res) => {
    let SQLStringGetMenuItems = `SELECT * FROM menu_items;`

    db.query(SQLStringGetMenuItems)
    .then(data => {
      res.json(data.rows)
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
}

module.exports = { getMenuItems }