const express = require("express");
const { model } = require("mongoose");
const Bike = require("../models/Bike");
const User = require("../models/User")
const Config = require("../models/Config")
const BikeRouter = express.Router()

// GET api/bikes?userid=X
BikeRouter.get("/bikes", async (req,res)=>{
    const userid = req.query.user
    try {
        let bikes = []
        if (!userid){
            bikes = await Bike.find().populate("user")  
        }
        else {
            bikes = await Bike.find({user: userid}).populate("user")
        }
        return res.status(200).json({
            success: true,
            bikes: bikes
        })
    }
    catch (error){
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}) 

// GET api/bikes/{bikeid}
BikeRouter.get("/bikes/:bikeid", async (req,res)=>{
    const {bikeid} = req.params
    try {
        let bike = await Bike.findById(bikeid).populate("user")
        if (!bike){
            return res.status(404).json({
                success: false,
                message: "La bici no se encontró"
            })
        }
        return res.status(200).json({
            success: true,
            bike: bike
        })
    }
    catch (error){
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}) 

// POST api/bikes (body con config)
BikeRouter.post("/bikes", async (req,res)=>{
    try {
        const{user, brand, model} = req.body
        if (!user || !brand || !model){
            return res.status(400).json({
                success:false,
                message:"Faltan datos para la creación de la bici"
            })
        }
        //Check if user exists
        let associatedUser = await User.findById(user) 
        if (!associatedUser){
            return res.status(404).json({
                success: false,
                message: "El usuario no existe"
            })
        }
        const newBike = new Bike({
            user: user,
            brand,
            model
        })
        await newBike.save()
        return res.status(200).json({
            success:true,
            bike: newBike,
            message:"Bici creada correctamente!"
        })
    }
    catch (error){
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
})

// PUT api/bikes/{bikeid}
BikeRouter.put("/bikes/:bikeid", async (req,res)=>{
    const {bikeid} = req.params
    const {brand, model} = req.body
    try {
        if (!brand || !model){
            return res.status(400).json({
                success:false,
                message:"Faltan datos para la modificación del registro"
            })
        }
        const update = {
            brand: brand,
            model: model
        }
        Bike.findByIdAndUpdate(bikeid,update, function(err,bike) {
            if (err){
                return res.status(400).json({
                    success: false,
                    message: err.message
                })
            }
            else {
                if (!bike){
                    return res.status(404).json({
                        success:false,
                        message:"La bicicleta no se encontró"
                    })
                }
                return res.status(200).json({
                    success:true,
                    bike: update,
                    message:"La bicicleta se modificó correctamente!"
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

// DELETE api/bikes/{bikeid}
BikeRouter.delete("/bikes/:bikeid", async (req,res)=>{
    const {bikeid} = req.params
    try {
        // TODO delete all configs associated to bikeid 
        Bike.findByIdAndDelete(bikeid, function(err, bike){
            if (err){
                return res.status(400).json({
                    success: false,
                    message: err.message
                })
            }
            else {
                if (!bike){
                    return res.status(404).json({
                        success:false,
                        message:"La bicicleta no se encontró"
                    })
                }
                // delete all configs associated to the bikeid
                Config.find({bike:bike._id}).then(function(configs){
                    configs.forEach(config => Config.findByIdAndDelete(config._id, function(err,config){
                            if(err){
                                return res.status(400).json({
                                    success: false,
                                    message: err.message
                                })
                            }
                        })
                    )
                })

                return res.status(200).json({
                    success:true,
                    bike: bike,
                    message:"Bicicleta eliminada correctamente!"
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

module.exports = BikeRouter