const connection = require('../databaseConfig.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Функция создания/подписание JSON Web Token
const generateAccessToken = (email, password) => {
    const payload = {
        email,
        password
    }
    return jwt.sign(payload, 'secret', {expiresIn: "24h"} )
}

class authController {
    registration(req, res) {
        try {
            const {email, password} = req.body
            connection.query("SELECT * FROM auth WHERE user_email = ?;", email, (err, resp) => {
                if (resp.length > 0) 
                    return res.json( {message: 'User with this email already registered'} )
                const hashPassword = bcrypt.hashSync(password, 5)
                connection.query("INSERT INTO auth (user_email, user_password) VALUES(?, ?);", [email, hashPassword], (err, response) => {
                    return res.json(true)
                })
            })
        } catch (e) {
            console.log(e)
            return res.json( {message: 'Registration error'} )   
        }    
    }

    login(req, res) {
        try {
            const {email, password} = req.body
            connection.query("SELECT * FROM auth WHERE user_email = ?;", email, (err, resp) => {
                if (resp !== undefined)
                    if (resp.length < 1) 
                        return res.json( {message: 'Email error'} )

                const validPassword = bcrypt.compareSync(password, resp[0].user_password)
                if (!validPassword) 
                    return res.json( {message: 'Password error'} ) 
                const token = generateAccessToken(email)

                // let d = new Date()
                // d.setDate(d.getDate() + 30)
                // res.cookie('jwt', token, {
                //     expires: d,
                //     httpOnly: true,
                //     secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
                //     sameSite: 'none'
                //  })
                
                return res.json( {token} )
            })
        } catch (e) {
            console.log(e)
            return res.json( {message: 'Login error'} )
        }
    }
}   

module.exports = new authController()