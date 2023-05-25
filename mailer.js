const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'Yandex',
	port: 465,
    secure: true,
	logger: true,
	debug: true,
    auth: {
        user: 'cobberaf2@yandex.ru',
        pass: 'rbflisumyoyawgyw'
    },
	tls: {
		rejectUnAuthorized: true
	}
})

const sendMail = async (name, phone, date, time, department) => {
    const mailOptions = {
        from: 'cobberaf2@yandex.ru',
        to: 'cobberaf@gmail.com',
        subject: 'Запись на прием к врачу в Meddical',
        text: `Здравствуйте, ${name}! Ваша заявка на прием к врачу принята.\nВаш телефон: ${phone}\nДата приема: ${date}\n` 
        + `Время приема: ${time}\nОтдел: ${department}\nПожалуйста не опаздывайте!\nСпасибо, ${name} за то, что выбрали нашу клинику!`
    }

    await transporter.sendMail(mailOptions)
}

module.exports = sendMail
