const express = require("express");
const Config = require("../models/Config")
const Bike = require("../models/Bike")
const ConfigRouter = express.Router()

//GET api/configs?bikeid=XXX
ConfigRouter.get("/configs", async (req,res)=>{
    let bikeid = req.query.bikeid
    try {
        let configs = await Config.find({bike: bikeid})
        return res.status(200).json({
            success: true,
            configs
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
            config
        })
    }
    catch (error){
        return res.status(400).json({
            success: false,
            message: err.message
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
        if (!Bike.findById(bike)){
            return res.status(400).json({
                success:false,
                message:"La bicicleta no se encontró"
            })
        }
        const newConfig = new Config({
            bike,
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
            newConfig,
            message:"Configuración creada correctamente!"
        })
    }
    catch (error){
        return res.status(500).json({
            success: false,
            message: err.message
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
        let config = Config.findByIdAndUpdate(configid,update)
        if (!track){
            return res.status(404).json({
                success:false,
                message:"La configuración no se encontró"
            })
        }
        return res.status(200).json({
            success:true,
            config,
            message:"Configuración modificada correctamente!"
        })
    }
    catch (error){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

//DELETE api/configs/{configid}
ConfigRouter.delete("/configs/:configid", async (req,res)=>{
    const {configid} = req.params
    try {
        let config = Config.findByIdAndDelete(configid)
        if (!config){
            return res.status(404).json({
                success:false,
                message:"La configuración no se encontró"
            })
        }
        return res.status(200).json({
            success:true,
            config,
            message:"Configuración eliminada correctamente!"
        })
    }
    catch (error){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

module.exports = ConfigRouter