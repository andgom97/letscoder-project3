const express = require("express");
const User = require("../models/User")
const Bike = require("../models/Bike")
const Config = require("../models/Config")
const Registry = require("../models/Registry")
const UserRouter = express.Router()

// GET api/users
UserRouter.get("/users", async (req,res)=>{
    const email = req.query.email
    try {
        let users = []
        if (!email){
            users = await User.find()  
        }
        else {
            users = await User.find({email:email})
        }
        return res.status(200).json({
            success: true,
            users: users
        })
    }
    catch (error){
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
})

// GET api/users/{userid}   
UserRouter.get("/users/:userid", async (req,res)=>{
    const {userid} = req.params
    try {
        let user = await User.findById(userid)
        if (!user){
            return res.status(404).json({
                success: false,
                message: "El ususario no se encontró"
            })
        }
        return res.status(200).json({
            success: true,
            user: user
        })
    }
    catch (error){
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}) 

// POST api/users
UserRouter.post("/users", async (req, res)=>{
    const{name, email, password} = req.body
    try {
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
            user: newUser,
            message:"Usuario creado correctamente!"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        }) 
    }
})

//PUT api/users/{userid}
UserRouter.put("/users/:userid", async (req,res)=>{
    const {userid} = req.params
    const {name, email, password} = req.body
    try {
        if (!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"Faltan datos para la modificación del usuario"
            })
        }
        const update = {
            name: name,
            email: email,
            password: password
        }
        User.findByIdAndUpdate(userid, update, function(err,user) {
            if (err){
                return res.status(400).json({
                    success: false,
                    message: err.message
                })
            }
            else {
                if (!user){
                    return res.status(404).json({
                        success:false,
                        message:"El usuario no se encontró"
                    })
                }     
                return res.status(200).json({
                    success:true,
                    user: update,
                    message:"Usuario modificada correctamente!"
                })
            }
        })
    }
    catch (error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})
// DELETE api/users/{userid} 
UserRouter.delete("/users/:userid", async (req,res)=>{
    const {userid} = req.params
    try {
        User.findByIdAndDelete(userid, function(err, user) {
            if(err){
                return res.status(400).json({
                    success: false,
                    message: err.message
                })
            }
            else {
                if (!user){
                    return res.status(404).json({
                        success: false,
                        message: "Usuario no se encontró"
                    })
                }
                // delete all bikes associated to the userid
                Bike.find({user: userid}).then(function(bikes){
                    bikes.forEach(bike => Bike.findByIdAndDelete(bike._id, function(err,bike) {
                        if(err){
                            return res.status(400).json({
                                success: false,
                                message: err.message
                            })
                        }
                        else {
                            // delete all configs associated to the bikeid
                            Config.find({bike:bike._id}).then(function(configs){
                                configs.forEach(config => Config.findByIdAndDelete(config._id, function(err,config){
                                    if(err){
                                        return res.status(400).json({
                                            success: false,
                                            message: err.message
                                        })
                                    }
                                }))
                            })
                        }
                    }))
                })
                // delete all registries associated to the userid
                Registry.find({user: userid}).then(function(registries){
                    registries.forEach(registry => Registry.findByIdAndDelete(registry._id, function(err,registry) {
                        if(err){
                            return res.status(400).json({
                                success: false,
                                message: err.message
                            })
                        }
                    }))
                })
                return res.status(200).json({
                    success:true,
                    user: user,
                    message:"Usuario eliminada correctamente!"
                })
            }
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

module.exports = UserRouter