const express = require("express");
const Registry = require("../models/Registry");
const Track = require("../models/Track");
const User = require("../models/User");
const Config = require("../models/Config");
const RegistryRouter = express.Router()

// GET api/registries?userid=X&trackid=X (filters by trackid/userid by queryparam)
RegistryRouter.get("/registries", async (req,res)=>{
    let userid = req.query.userid
    let trackid = req.query.trackid
    try {
        let registries = await Registry.find({user: userid, track: trackid}).populate("track").populate("user").populate("config")
        return res.status(200).json({
            success: true,
            registries
        })
    }
    catch (error){
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}) 

// GET api/registries/{registryid} (filters by queryparam)
RegistryRouter.get("/registries/:registryid", async (req,res)=>{
    const {registryid} = req.params
    try {
        let registry = await Registry.findById(registryid).populate("track").populate("user").populate("config")
        if (!registry){
            return res.status(404).json({
                success: false,
                message: "El registro no se encontró"
            })
        }
        return res.status(200).json({
            success: true,
            registry
        })
    }
    catch (error){
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}) 

// POST api/registries
RegistryRouter.post("/registries", async (req,res)=>{
    const {track, user, miliseconds, timeStamp, config} = req.body
    try {
        if (!track || !user || !miliseconds || !timeStamp || !config){
            return res.status(400).json({
                success:false,
                message:"Faltan datos para la creación de la etapa"
            })
        }
        // Check if exist
        // track
        if (!Track.findById(track)){
            return res.status(400).json({
                success: false,
                message: "La etapa no existe"
            })
        }
        // user
        if (!User.findById(user)){
            return res.status(400).json({
                success: false,
                message: "El usuario no existe"
            })
        }
        // config
        if (!Config.findById(config)){
            return res.status(400).json({
                success: false,
                message: "La configuración no existe"
            })
        }
        const newRegistry = new Registry({
            track,
            user,
            miliseconds,
            timeStamp,
            config
        })
        await newRegistry.save()
        return res.status(200).json({
            success:true,
            newRegistry,
            message:"Registro creado correctamente!"
        })
    }
    catch (error){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

// PUT api/registries/{registryid}
RegistryRouter.put("/registries/:registryid", async (req,res)=>{
    const {registryid} = req.params
    const {track, user, miliseconds, timeStamp, config} = req.body
    try {
        if (!track || !user || !miliseconds || !timeStamp || !config){
            return res.status(400).json({
                success:false,
                message:"Faltan datos para la modificación del registro"
            })
        }
        const update = {
            miliseconds: miliseconds,
            timeStamp: timeStamp,
            config: config
        }
        let registry = Registry.findByIdAndUpdate(registryid,update)
        if (!registry){
            return res.status(404).json({
                success:false,
                message:"El registro no se encontró"
            })
        }
        return res.status(200).json({
            success:true,
            track,
            message:"El registro se modificó correctamente!"
        })
    }
    catch (error){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

// DELETE api/registries/{registryid}
RegistryRouter.delete("/registries/:registryid", async (req,res)=>{
    const {registryid} = req.params
    try {
        let registry = Registry.findByIdAndDelete(registryid)
        if (!registry){
            return res.status(404).json({
                success:false,
                message:"El registro no se encontró"
            })
        }
        return res.status(200).json({
            success:true,
            track,
            message:"El registro fue eliminado correctamente!"
        })
    }
    catch (error){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

module.exports = RegistryRouter