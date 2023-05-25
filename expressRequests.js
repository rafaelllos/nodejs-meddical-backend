import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import {Strategy, ExtractJwt} from 'passport-jwt'

import { sendMail } from './mailer.js'
import { connection } from './databaseConfig.js'


const app = express()
app.use(express.json())
app.use(express.urlencoded( {extended: false} ))
app.use(cors())


app.listen(8800, () => {
    console.log("Server opened!")
})


app.post('/applications', (req, res) => {
    const q = 'INSERT INTO applications ' + 
    '(user_name, user_gender, user_email, user_phone, application_date, application_time, application_department, user_text) VALUES(?);'

    const values = [
        req.body.user_name,
        req.body.user_gender,
        req.body.user_email,
        req.body.user_phone,
        req.body.application_date,
        req.body.application_time,
        req.body.application_department,
        req.body.user_text
    ]

    connection.query(q, [values], (err, response) => {
        return res.json( {message: 'Заявка создана!'} )
    })

    sendMail(
        req.body.user_name, 
        req.body.user_phone, 
        req.body.application_date, 
        req.body.application_time, 
        req.body.application_department)
})


app.post('/registration', (req, res) => {
    try {
        const {email, password} = req.body
        connection.query("SELECT * FROM auth WHERE user_email = ?;", email, (err, resp) => {
            // Проверка на наличие записей регистрации пользователя в БД
            // Если таковые имеются - выведи на клиент сообщение: Пользователь зарегистрирован
            // Иначе продолжи выполнять инструкции
            if (resp.length > 0) 
                return res.json( {message: 'User with this email already registered'} )
            // Хэширование пароля
            const hashPassword = bcrypt.hashSync(password, 1)
            // SQL-запрос регистрации/добавления данных пользователя в БД
            connection.query("INSERT INTO auth (user_email, user_password) VALUES(?, ?);", [email, hashPassword], (err, response) => {
                return res.json(true)
            })
        })
    } catch (e) {
        console.log(e)
        res.status(400).json( {message: 'Registration error'} )   
    }
})


// Создание JWT-токена
const generateAccessToken = (id, email) => {
    const payload = {
        userId: id,
        email: email
    }
    return jwt.sign(payload, 'Hello', {expiresIn: "1h"})
}


app.post('/login', (req, res) => {
    try {
        const {email, password} = req.body
        connection.query("SELECT * FROM auth WHERE user_email = ?;", email, (err, resp) => {
            if (resp < 1) 
                return res.json( {message: 'Email error'} )
            const validPassword = bcrypt.compareSync(password, resp.password)
            if (!validPassword) 
                return res.json( {message: 'Password error'} )
            const token = generateAccessToken(resp.id, resp.user_email)
            return res.json( {token} )
        })
    } catch (e) {
        console.log(e)
        res.status(400).json( {message: 'Login error'} )
    }
})


app.use(passport.initialize())
