const express = require("express");
const Track = require("../models/Track")
const Level = require("../models/Level")
const TrackRouter = express.Router()

// GET api/tracks (filter by level in queryparam)
TrackRouter.get("/tracks", async (req,res)=>{
    let levelid = req.query.levelid
    try {
        let tracks = await Track.find({level: levelid})
        return res.status(200).json({
            success: true,
            tracks
        })
    }
    catch (error){
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}) 

// GET api/tracks/{trackid}
TrackRouter.get("/tracks/:trackid", async (req,res)=>{
    const {trackid} = req.params
    try {
        let track = await Track.findById(trackid)
        if (!track){
            return res.status(404).json({
                success: false,
                message: "La etapa no se encontró"
            })
        }
        return res.status(200).json({
            success: true,
            track
        })
    }
    catch (error){
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}) 

// POST api/tracks (only admins)
TrackRouter.post("/tracks", async (req,res)=>{
    const {kilometers, averageTime, level, startLocationLat, startLocationLong, endLocationLat, endLocationLong} = req.body
    try {
        // Check credentials
        // TODO
        if (!kilometers || !averageTime || !level || !startLocationLat || !startLocationLong || !endLocationLat || !endLocationLong){
            return res.status(400).json({
                success:false,
                message:"Faltan datos para la creación de la etapa"
            })
        }
        if (!Level.findById(level)){
            return res.status(400).json({
                success:false,
                message:"La dificultad no se encontró"
            })
        }
        const newTrack = new Track({
            kilometers,
            averageTime,
            level,
            startLocationLat,
            startLocationLong,
            endLocationLat,
            endLocationLong
        })
        await newTrack.save()
        return res.status(200).json({
            success:true,
            newTrack,
            message:"Etapa creada correctamente!"
        })
    }
    catch (error){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
})
// PUT api/tracks/{trackid} (only admins)
TrackRouter.put("/tracks/:trackid", async (req,res)=>{
    const {trackid} = req.params
    const {kilometers, averageTime, level, startLocationLat, startLocationLong, endLocationLat, endLocationLong} = req.body
    try {
        // Check credentials
        // TODO
        if (!kilometers || !averageTime || !level || !startLocationLat || !startLocationLong || !endLocationLat || !endLocationLong){
            return res.status(400).json({
                success:false,
                message:"Faltan datos para la modificación de la etapa"
            })
        }
        const update = {
            kilometers: kilometers,
            averageTime: averageTime,
            level: level,
            startLocationLat: startLocationLat,
            startLocationLong: startLocationLong,
            endLocationLat: endLocationLat,
            endLocationLong: endLocationLong
        }
        let track = Track.findByIdAndUpdate(trackid,update)
        if (!track){
            return res.status(404).json({
                success:false,
                message:"La etapa no se encontró"
            })
        }
        return res.status(200).json({
            success:true,
            track,
            message:"Etapa modificada correctamente!"
        })
    }
    catch (error){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
})
// DELETE api/tracks/{trackid} (only admins)
TrackRouter.delete("/tracks/:trackid", async (req,res)=>{
    const {trackid} = req.params
    try {
        // Check credentials
        // TODO
        let track = Track.findByIdAndDelete(trackid)
        if (!track){
            return res.status(404).json({
                success:false,
                message:"La etapa no se encontró"
            })
        }
        return res.status(200).json({
            success:true,
            track,
            message:"Etapa eliminada correctamente!"
        })
    }
    catch (error){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

module.exports = TrackRouter