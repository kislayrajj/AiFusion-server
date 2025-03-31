const express = require("express")
const {sendMessage, getMessage} = require("../controllers/chatController")

const router = express.Router()

router.post("/sendMessage", sendMessage)
router.get("/getMessage", getMessage)


module.exports = router