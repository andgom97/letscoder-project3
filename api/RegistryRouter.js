const express = require("express");
const Registry = require("../models/Registry");
const Track = require("../models/Track");
const User = require("../models/User");
const Bike = require("../models/Bike");
const Config = require("../models/Config");
const RegistryRouter = express.Router()

// TODO
function UpdateAverageTime(trackid){
    // Get track averageTime
    // Get all registries associated to the track = marks, nRegistries
    // Update averageTime => marks / nRegsitries
}

// GET api/registries?userid=X&trackid=X (filters by trackid/userid by queryparam)
RegistryRouter.get("/registries", async (req,res)=>{
    let userid = req.query.userid
    let trackid = req.query.trackid
    try {
        let registries = []
        if (!userid && !trackid){
            registries = await Registry.find().populate("track").populate("user").populate("config").populate("bike")
        }
        else if (!userid){
            registries = await Registry.find({track: trackid}).populate("track").populate("user").populate("config").populate("bike")
        }
        else if (!trackid){
            registries = await Registry.find({user: userid}).populate("track").populate("user").populate("config").populate("bike")
        }
        else{
            registries = await Registry.find({user: userid, track: trackid}).populate("track").populate("user").populate("config").populate("bike")
        }

        return res.status(200).json({
            success: true,
            registries: registries
        })
    }
    catch (error){
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}) 

// GET api/registries/{registryid} 
RegistryRouter.get("/registries/:registryid", async (req,res)=>{
    const {registryid} = req.params
    try {
        let registry = await Registry.findById(registryid).populate("track").populate("user").populate("config").populate("bike")
        if (!registry){
            return res.status(404).json({
                success: false,
                message: "El registro no se encontró"
            })
        }
        return res.status(200).json({
            success: true,
            registry: registry
        })
    }
    catch (error){
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}) 

// POST api/registries
RegistryRouter.post("/registries", async (req,res)=>{
    const {track, user, miliseconds, bike, config} = req.body
    try {
        if (!track || !user || !miliseconds || !bike || !config){
            return res.status(400).json({
                success:false,
                message:"Faltan datos para la creación de la etapa"
            })
        }
        // Check if track exist
        let associatedTrack = await Track.findById(track)
        if (!associatedTrack){
            return res.status(400).json({
                success: false,
                message: "La etapa no existe"
            })
        }
        // Check if user exist
        let associatedUser = await User.findById(user)
        if (!associatedUser){
            return res.status(400).json({
                success: false,
                message: "El usuario no existe"
            })
        }
        // Check if bike exist and is associated to the user 
        let associatedBike = await Bike.findOne({_id: bike, user: user})
        if (!associatedBike){
            return res.status(400).json({
                success: false,
                message: "La bicicleta no existe"
            })
        }
        // Check if config exist and is associated to the bike
        let associatedConfig = await Config.findOne({_id: config, bike: bike})
        if (!associatedConfig){
            return res.status(400).json({
                success: false,
                message: "La configuración no existe"
            })
        }
        const newRegistry = new Registry({
            track: track,
            user: user,
            miliseconds,
            timeStamp: Date.now(),
            bike: bike,
            config: config
        })
        await newRegistry.save()
        // TODO Update track averageTime

        return res.status(200).json({
            success:true,
            registry: newRegistry,
            message:"Registro creado correctamente!"
        })
    }
    catch (error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// PUT api/registries/{registryid}
RegistryRouter.put("/registries/:registryid", async (req,res)=>{
    const {registryid} = req.params
    const {miliseconds, bike, config} = req.body
    try {
        if (!miliseconds || !bike || !config){
            return res.status(400).json({
                success:false,
                message:"Faltan datos para la modificación del registro"
            })
        }
        const update = {
            miliseconds: miliseconds,
            timeStamp: Date.now(),
            bike: bike,
            config: config
        }
        Registry.findByIdAndUpdate(registryid,update, function(err,user){
            if (err){
                return res.status(400).json({
                    success: false,
                    message: err.message
                })
            }
            else {
                if (!registry){
                    return res.status(404).json({
                        success:false,
                        message:"El registro no se encontró"
                    })
                }
                return res.status(200).json({
                    success:true,
                    registry: update,
                    message:"El registro se modificó correctamente!"
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

// DELETE api/registries/{registryid}
RegistryRouter.delete("/registries/:registryid", async (req,res)=>{
    const {registryid} = req.params
    try {
        Registry.findByIdAndDelete(registryid, function(err,registry){
            if (err){
                return res.status(400).json({
                    success: false,
                    message: err.message
                })
            }
            else {
                if (!registry){
                    return res.status(404).json({
                        success:false,
                        message:"El registro no se encontró"
                    })
                }
                return res.status(200).json({
                    success:true,
                    registry: registry,
                    message:"El registro fue eliminado correctamente!"
                })
            }
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