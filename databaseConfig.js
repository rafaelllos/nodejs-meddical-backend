const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'react-hospital-app',
    password: 'rafaelllo'
})

connection.connect(err => {
    if (err) {
        console.log(err)
        return err
    }
    else console.log('Database connected!')
})

module.exports = connection