import  express from 'express'
import { uploadSong,getMySongs } from '../controllers/song.controller.js'
import authMiddleware from '../middilewares/auth.middleware.js'
import upload from '../middilewares/upload.middleware.js'


const router = express.Router()

router.post("/upload",authMiddleware,upload.single("audio"),uploadSong)
router.get('/',authMiddleware,getMySongs)


export default router