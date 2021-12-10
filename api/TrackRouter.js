const express = require("express");
const Track = require("../models/Track")
const Level = require("../models/Level")
const TrackRouter = express.Router()

// GET api/tracks (filter by level in queryparam)
TrackRouter.get("/tracks", async (req,res)=>{
    let levelid = req.query.levelid
    try {
        let tracks = []
        if (!levelid){
            tracks = await Track.find().populate("level")
        }
        else {
            tracks = await Track.find({level: levelid}).populate("level")
        }
        return res.status(200).json({
            success: true,
            tracks: tracks
        })
    }
    catch (error){
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}) 

// GET api/tracks/{trackid}
TrackRouter.get("/tracks/:trackid", async (req,res)=>{
    const {trackid} = req.params
    try {
        let track = await Track.findById(trackid).populate("level")
        if (!track){
            return res.status(404).json({
                success: false,
                message: "La etapa no se encontró"
            })
        }
        return res.status(200).json({
            success: true,
            track: track
        })
    }
    catch (error){
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}) 

// POST api/tracks (only admins)
TrackRouter.post("/tracks", async (req,res)=>{
    const {kilometers, level, startLocationLat, startLocationLong, endLocationLat, endLocationLong} = req.body
    try {
        if (!kilometers || !level || !startLocationLat || !startLocationLong || !endLocationLat || !endLocationLong){
            return res.status(400).json({
                success:false,
                message:"Faltan datos para la creación de la etapa"
            })
        }
        // Check if level exist
        let associatedLevel = await Level.findById(level)
        if (!associatedLevel){
            return res.status(400).json({
                success:false,
                message:"La dificultad no se encontró"
            })
        }
        const newTrack = new Track({
            kilometers,
            averageTime: 0,
            level: level,
            startLocationLat,
            startLocationLong,
            endLocationLat,
            endLocationLong
        })
        await newTrack.save()
        return res.status(200).json({
            success:true,
            track: newTrack,
            message:"Etapa creada correctamente!"
        })
    }
    catch (error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// PUT api/tracks/{trackid} (only admins)
TrackRouter.put("/tracks/:trackid", async (req,res)=>{
    const {trackid} = req.params
    const {kilometers, level, startLocationLat, startLocationLong, endLocationLat, endLocationLong} = req.body
    try {
        if (!kilometers || !level || !startLocationLat || !startLocationLong || !endLocationLat || !endLocationLong){
            return res.status(400).json({
                success:false,
                message:"Faltan datos para la modificación de la etapa"
            })
        }
        // Check if level exist
        let associatedLevel = await Level.findById(level)
        if (!associatedLevel){
            return res.status(400).json({
                success:false,
                message:"La dificultad no se encontró"
            })
        }
        const update = {
            kilometers: kilometers,
            level: level,
            startLocationLat: startLocationLat,
            startLocationLong: startLocationLong,
            endLocationLat: endLocationLat,
            endLocationLong: endLocationLong
        }
        Track.findByIdAndUpdate(trackid,update, function(err,track){
            if (err){
                return res.status(400).json({
                    success: false,
                    message: err.message
                })
            }
            else {
                if (!track){
                    return res.status(404).json({
                        success:false,
                        message:"La etapa no se encontró"
                    })
                }
                return res.status(200).json({
                    success:true,
                    track: track,
                    message:"Etapa modificada correctamente!"
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

// DELETE api/tracks/{trackid} (only admins)
TrackRouter.delete("/tracks/:trackid", async (req,res)=>{
    const {trackid} = req.params
    try {
        // TODO delete all registries associated to the trackid
        Track.findByIdAndDelete(trackid, function(err, track){
            if (err){
                return res.status(400).json({
                    success: false,
                    message: err.message
                })
            }
            else {
                if (!track){
                    return res.status(404).json({
                        success:false,
                        message:"La etapa no se encontró"
                    })
                }
                return res.status(200).json({
                    success:true,
                    track: track,
                    message:"Etapa eliminada correctamente!"
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

module.exports = TrackRouter