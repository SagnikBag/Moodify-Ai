import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title:{
        type: String,
        required: true,
        trim: true
    },
    artist:{
        type: String,
        default: "Unknown Artist",
    },
    audioUrl:{
        type: String,
        required: true
    },
    audioFileId:{
        type: String,
        default: ""
    },
    coverImageUrl:{
        type: String,
        default: ""
    },
    audioFeatures:{

        tempo:{
            type:Number,
            default:0
        },
        energy:{
            type: Number,
            default: 0
        },
        spectralCentroid:{
            type: Number,
            default:0
        },
        zeroCrossingRate:{
            type: Number,
            default:0
        },

    },
    suggestedMood:{
        type: String,
        enum:["happy","sad","angry","neutral"],
        default: "neutral"
    },
    finalMood:{
        type: String,
        enum:["happy","sad","angry","neutral"],
        default: "neutral"
    },
    moodSource:{
        type: String,
        enum:["user","ai"],
        default: "user"
    },
    duration:{
        type: Number,
        default: 0
    }

},{
    timestamps: true
})

const Song = mongoose.model("Song",songSchema);

export default Song;