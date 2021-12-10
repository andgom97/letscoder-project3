const express = require("express");
const Level = require("../models/Level");
const LevelRouter = express.Router()

// Get all levels
LevelRouter.get("/levels", async (req,res)=>{
    try {
        levels = await Level.find()  
        return res.status(200).json({
            success: true,
            levels
        })
    }
    catch (error){
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
})

// Post level (only admins)
LevelRouter.post("/levels", async (req, res)=>{
    const{tag} = req.body
    try {
        if(!tag){
            return res.status(400).json({
                success:false,
                message:"Faltan datos en el nivel"
            })
        }
        const newLevel = new Level({
            tag
        })
        await newLevel.save()
        return res.status(200).json({
            success:true,
            newLevel,
            message:"Nivel creado correctamente!"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        }) 
    }
})

// Delete level (only admins)
LevelRouter.delete("/levels/:levelid", async (req,res)=>{
    const {levelid} = req.params
    try {
        Level.findByIdAndDelete(levelid, function(err, level) {
            if(err){
                return res.status(400).json({
                    success: false,
                    message: err.message
                })
            }
            else {
                if (!level){
                    return res.status(404).json({
                        success: false,
                        message: "El nivel no se encontró"
                    })
                }
                return res.status(200).json({
                    success:true,
                    level,
                    message:"Nivel eliminada correctamente!"
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

module.exports = LevelRouter