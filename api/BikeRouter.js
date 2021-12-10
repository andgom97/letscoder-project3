const express = require("express");
const { model } = require("mongoose");
const Bike = require("../models/Bike");
const BikeRouter = express.Router()

// GET api/bikes?userid=X
BikeRouter.get("/bikes", async (req,res)=>{
    let userid = req.query.userid
    try {
        let bikes = await Bike.find({user: userid}).populate("user")
        return res.status(200).json({
            success: true,
            bikes
        })
    }
    catch (error){
        return res.status(400).json({
            success: false,
            message: err.message
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
            bike
        })
    }
    catch (error){
        return res.status(400).json({
            success: false,
            message: err.message
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
        // Check if exist
        // user
        if (!User.findById(user)){
            return res.status(400).json({
                success: false,
                message: "El usuario no existe"
            })
        }
        const newBike = new Bike({
            user,
            brand,
            model
        })
        await newBike.save()
        return res.status(200).json({
            success:true,
            newBike,
            message:"Bici creada correctamente!"
        })
    }
    catch (error){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

// PUT api/bikes/{bikeid}
BikeRouter.put("/bikes/:bikeid", async (req,res)=>{
    const {bikeid} = req.params
    const {user, brand, model} = req.body
    try {
        if (!user || !brand || !model){
            return res.status(400).json({
                success:false,
                message:"Faltan datos para la modificación del registro"
            })
        }
        const update = {
            brand: brand,
            model: model
        }
        let bike = Bike.findByIdAndUpdate(bikeid,update)
        if (!bike){
            return res.status(404).json({
                success:false,
                message:"La bicicleta no se encontró"
            })
        }
        return res.status(200).json({
            success:true,
            bike,
            message:"La bicicleta se modificó correctamente!"
        })
    }
    catch (error){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

// DELETE api/bikes/{bikeid}
BikeRouter.delete("/bikes/:bikeid", async (req,res)=>{
    const {bikeid} = req.params
    try {
        let bike = Bike.findByIdAndDelete(bikeid)
        if (!bike){
            return res.status(404).json({
                success:false,
                message:"La bicicleta no se encontró"
            })
        }
        return res.status(200).json({
            success:true,
            bike,
            message:"Bicicleta eliminada correctamente!"
        })
    }
    catch (error){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

module.exports = BikeRouter