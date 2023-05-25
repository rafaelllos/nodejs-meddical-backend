const Router = require('express')
const router = new Router()
const controller = require('../controller/applicationController.js')

router.post('/application', controller.createApplication)
router.get('/getApplication/:email', controller.getApplication)

module.exports = router