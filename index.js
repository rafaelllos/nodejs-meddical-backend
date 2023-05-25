const express = require('express')
const authRouter = require('./routes/authRouter.js')
const applicationRouter = require('./routes/applicationRouter.js')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()

app.use(express.json())
// app.use(cors({origin: true, credentials: true}))
app.use(cors())
app.use('/auth', authRouter)
app.use('/', applicationRouter)
app.use(cookieParser())

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*")
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
//     res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept")
//     next()
// })

const start = () => {    
    try {
        app.listen(5000, () => console.log("Server opened!"))
    } catch (err) {
        console.log(err)   
    }
}

start()