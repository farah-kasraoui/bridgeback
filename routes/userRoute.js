const express= require("express")
const {createUser,loginUserCtrl,loginAdmin}= require("../controllers/userController")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();
router.post('/register',createUser);
router.post('/login',loginUserCtrl);
router.post("/loginadmin", loginAdmin);
 module.exports=router
