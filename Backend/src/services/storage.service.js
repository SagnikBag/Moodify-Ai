import imagekit from '../config/imagekit.js';

async function uploadFile({buffer,filename,folder}){
    const response = await imagekit.upload({
        file:buffer,
        fileName:filename,
        folder:folder
    });
    return response;
}
async function deleteFile(fileId){
    const response = await imagekit.deleteFile(fileId)

    return response
}

export default {
    uploadFile,
    deleteFile
};