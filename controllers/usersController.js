const db = require("../lib/dbConnect");



const test = async (req, res) => {

    console.log('Hitting test route')
    res.cookie('jwt', 'TESTING');
    res.sendStatus(200)
    
}




module.exports = {
    test
}
