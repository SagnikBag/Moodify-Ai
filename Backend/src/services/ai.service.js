import axios from "axios"
import FormData from "form-data"

async function analyzeSong(audioBuffer,filename){
    const formData = new FormData();

    formData.append("file",audioBuffer,{
        filename: filename,
        contentType:"audio/mpeg"
    });

    const response = await axios.post(
        `${process.env.AI_SERVICE_URL}/analyze-audio`,
        formData,
        {
            headers:{
                ...formData.getHeaders()
            },
            maxBodyLength :Infinity
        }
    );
    return response.data
}

export default {
    analyzeSong
}