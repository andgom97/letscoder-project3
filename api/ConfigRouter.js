const express = require("express");
const Config = require("../models/Config")
const Bike = require("../models/Bike")
const ConfigRouter = express.Router()

//GET api/configs?bikeid=XXX
ConfigRouter.get("/configs", async (req,res)=>{
    let bikeid = req.query.bikeid
    try {
        let configs = [] 
        if (!bikeid){
            configs = await Config.find().populate("bike")
        }
        else {
            configs = await Config.find({bike: bikeid}).populate("bike")
        }
        return res.status(200).json({
            success: true,
            configs: configs
        })
    }
    catch (error){
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}) 

//GET api/configs/{configid}
ConfigRouter.get("/configs/:configid", async (req,res)=>{
    const {configid} = req.params
    try {
        let config = await Config.findById(configid).populate("bike")
        if (!config){
            return res.status(404).json({
                success: false,
                message: "La configuración no se encontró"
            })
        }
        return res.status(200).json({
            success: true,
            config: config
        })
    }
    catch (error){
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}) 

//POST api/configs (specify bikeid in body)
ConfigRouter.post("/configs", async (req,res)=>{
    const {bike, frame, saddle, fork, transmission, brakes, sprocket, plate} = req.body
    try {
        if (!bike || !frame || !saddle || !fork || !transmission || !brakes || !sprocket || !plate){
            return res.status(400).json({
                success:false,
                message:"Faltan datos para la creación de la configuración"
            })
        }
        let associatedBike = await Bike.findById(bike)
        if (!associatedBike){
            return res.status(400).json({
                success:false,
                message:"La bicicleta no se encontró"
            })
        }
        const newConfig = new Config({
            bike: bike,
            frame,
            saddle,
            fork,
            transmission,
            brakes,
            sprocket,
            plate
        })
        await newConfig.save()
        return res.status(200).json({
            success:true,
            config: newConfig,
            message:"Configuración creada correctamente!"
        })
    }
    catch (error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

//PUT api/configs/{configid}
ConfigRouter.put("/configs/:configid", async (req,res)=>{
    const {configid} = req.params
    const {bike, frame, saddle, fork, transmission, brakes, sprocket, plate} = req.body    
    try {
        if (!bike || !frame || !saddle || !fork || !transmission || !brakes || !sprocket || !plate){
            return res.status(400).json({
                success:false,
                message:"Faltan datos para la creación de la configuración"
            })
        }
        const update = {
            frame: frame,
            saddle: saddle,
            fork: fork,
            transmission: transmission,
            brakes: brakes,
            sprocket: sprocket,
            plate: plate
        }
        Config.findByIdAndUpdate(configid,update, function(err,config){
            if (err){
                return res.status(400).json({
                    success: false,
                    message: err.message
                })
            }
            else {
                if (!config){
                    return res.status(404).json({
                        success:false,
                        message:"La configuración no se encontró"
                    })
                }
                return res.status(200).json({
                    success:true,
                    config: update,
                    message:"Configuración modificada correctamente!"
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

//DELETE api/configs/{configid}
ConfigRouter.delete("/configs/:configid", async (req,res)=>{
    const {configid} = req.params
    try {
        Config.findByIdAndDelete(configid, function(err,config){
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                })
            }
            else {
                if (!config){
                    return res.status(404).json({
                        success:false,
                        message:"La configuración no se encontró"
                    })
                }
                return res.status(200).json({
                    success:true,
                    config: config,
                    message:"Configuración eliminada correctamente!"
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

module.exports = ConfigRouter