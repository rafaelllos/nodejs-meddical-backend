const connection = require('../databaseConfig.js')
const sendMail = require('../mailer.js')

class applicationController {
    createApplication(req, res) {
        try {
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

            const q = 'INSERT INTO applications ' + 
                '(user_name, user_gender, user_email, user_phone, application_date, application_time, application_department, user_text) VALUES(?);'

            connection.query(q, [values], (err, resp) => {
                return res.json( {message: 'Заявка создана!'} )
            })

            sendMail(
                req.body.user_name, 
                req.body.user_phone, 
                req.body.application_date, 
                req.body.application_time, 
                req.body.application_department)
        } catch (e) {
            console.log(e)
            return res.json( {message: 'Application error'} )
        }
    }

    getApplication(req, res) {
        try {
            const email = req.params.email

            connection.query("SELECT application_date, application_time, application_department, user_text " + 
                "FROM applications WHERE user_email = ?;", email, (err, resp) => {
                if (resp !== undefined)
                    if (resp.length < 1) 
                        return res.json( {message: 'Email error'} )

                return res.send(resp)
            })
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new applicationController()