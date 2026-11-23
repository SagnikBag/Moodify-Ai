import imagekit from '../config/imagekit.js';

async function uploadFile({buffer,filename,folder}){
    const response = await imagekit.upload({
        file:buffer,
        fileName:filename,
        folder:folder
    });
    return response;
}

export default {
    uploadFile
};