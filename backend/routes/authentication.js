const Express = require("express");
const router = Express.Router();
const controller = require("../controllers/authController.js")

router.get("/login", controller.login)

module.exports = {
    router,
    path: "/auth"
}