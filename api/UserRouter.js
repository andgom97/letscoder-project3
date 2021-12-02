const express = require("express");
const User = require("../models/User")
const UserRouter = express.Router()

UserRouter.post("/register", async (req, res)=>{
    try {
        const{name, email, password} = req.body
        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"Faltan datos en el registro"
            })
        }
        const user = await User.findOne({email})
        if(user) return res.status(400).json({
            success:false,
            message:"Este usuario ya esta registrado"
        })

        const newUser = new User({
            name,
            email,
            password
        })
        await newUser.save()
        return res.status(200).json({
            success:true,
            newUser,
            message:"Usuario creado correctamente!"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: err.message
        }) 
    }
})

module.exports = UserRouter