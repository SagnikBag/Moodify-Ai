import Song from '../model/song.model.js';
import storageService from '../services/storage.service.js'

async function uploadSong(req,res){

    try{
        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "Please upload an sudio file"
            })
        }
        
        const {title,atirst} = req.body

        if(!title){
            return res.status(400).json({
                success: false,
                message: "Song title are required"
            })
        }

        // Upload audio to imagekit

        const audioFile = await storageService.uploadFile({
            buffer: req.file.buffer,
            filename: `${Date.now()}-${req.file.originalname}`,
            folder: '/moodify/songs'
        })

        // save song info in mongodb

        const song = await Song.create({
            userId: req.user.id,
            title,
            atirst: atirst || "Unknown Atrist",
            audioUrl:audioFile.url,
            audioFileId:audioFile.fileId,
            suggestedMood: "neutral",
            finalMood: "neutral",
            moodSourse: "user"
        })

        return res.status(201).json({
            success: true,
            message:'Song uploaded successfully',
            song
        })

    }catch(error){
        console.error("Song upload error",error)

        return res.status(500).json({
            success: false,
            message: "Failed to upload song",
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