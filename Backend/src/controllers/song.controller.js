import Song from '../model/song.model.js';
import storageService from '../services/storage.service.js'
import aiService from '../services/ai.service.js'

async function uploadSong(req,res){

    let uploadedAudioFile = null

    try{
        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "Please upload an sudio file"
            })
        }
        
        const {title,artist} = req.body

        if(!title){
            return res.status(400).json({
                success: false,
                message: "Song title are required"
            })
        }

        

        // analyze audio using python ai service

        const aiResult = await aiService.analyzeSong(
            req.file.buffer,
            req.file.originalname
        );

        if(!aiResult.success || !aiResult.features){

            throw new Error("Audio analysis failed")
        }

        const features = aiResult.features;

        // upload audio in imagekit

        uploadedAudioFile = await storageService.uploadFile({
            buffer: req.file.buffer,
            filename: `${Date.now()}-${req.file.originalname}`,
            folder:"/moodify/song"
        })

        // save song info in mongodb

        const song = await Song.create({
            userId: req.user.id,
            title,
            artist: artist || "Unknown Atrist",
            audioUrl:uploadedAudioFile.url,
            audioFileId:uploadedAudioFile.fileId,
            duration: features.duration,

            audioFeatures:{
                tempo: features.tempo,
                energy: features.energy,
                spectralCentroid: features.spectral_centroid,
                zeroCrossingRate: features.zero_crossing_rate
            },
            suggestedMood: "neutral",
            finalMood: "neutral",
            moodSourse: "user"
        })

        return res.status(201).json({
            success: true,
            message:'Song uploaded and analyze  successfully',
            song
        })

    }catch(error){
        console.error("Song upload error",error)

        if(uploadedAudioFile?.fileId){
            try{
                await storageService.deleteFile(
                    uploadedAudioFile.fileId
                );

            }catch(deleteError){
                consloe.error("Imagekit cleanup failed",deleteError)
            }
        }

        return res.status(500).json({
            success: false,
            message: "Failed to upload analyze song",
            error: error.message
        })
    }
   
}

async function getMySongs(req,res){
    try{
        const songs = await Song.find({
            userId:req.user.id
        }).sort({createdAt:-1})

        return res.status(200).json({
            success: true,
            totalSongs:songs.length,
            songs
        })
    }catch(error){
        console.error("get song error",error)

        return res.status(500).json({
            success: false,
            message:"Failed to fetch songs"
        })
    }
}

async function deleteSong(req,res){

    try{

        const {songId} = req.params;

        const song = await Song.findOne({
            _id: songId,
            userId: req.user.id
        });

        if(!song){
            return res.status(404).json({
                success: false,
                message: "Song not found"
            })
        }

        if(song.audioFileId){
            await storageService.deleteFile(song.audioFileId);
        }

        await Song.findByIdAndDelete(songId)

        return res.status(200).json({
            success: true,
            message: "Song deleted successfully"
        }) 

    }catch(error){
        console.error("Delete song error",error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete song"
        })
    }
}

async function updateSong(req,res){

    try{

        const {songId} = req.params;

        const {title,atirst,finalMood} = req.body;

        const allowedMoods = ["happy","sad","angry","neutral","relaxed"];

        const song = await Song.findOne({
            _id: songId,
            userId: req.user.id
        });

        if(!song){
            return res.status(404).json({
                success: "false",
                message: "song not found"
            })
        }

        if(title !== undefined){
            song.title = title
        }

        if(atirst !== undefined){
            song.atirst = atirst
        }

        if(finalMood !== undefined){

            if(!allowedMoods.includes(finalMood)){
                return res.status(400).json({
                    success: false,
                    message: "Invalid mood"
                })
            }
            song.finalMood = finalMood;
            song.moodSourse = "user"
        }

        await song.save()

        return res.status(200).json({
            success: true,
            message: "Song updated successfully",
            song
        })
    }catch(error){
        console.error("updated song error",error)

        return res.status(500).json({
            success: false,
            message: "Failed to update song"
        })

    }
}

export {
    
    uploadSong,
    getMySongs,
    deleteSong,
    updateSong    
}