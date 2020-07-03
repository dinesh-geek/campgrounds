var express    = require("express"),
      router     = express.Router(),
      User       = require("../models/user"),
      async      = require("async"),
      nodemailer = require("nodemailer"),
      crypto     = require("crypto")


router.get("/password_reset",function(req,res){
    res.render("password");
});  




module.exports = router;