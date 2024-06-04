import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
    api_key: process.env.CLOUDNARY_CLOUD_KEY,
    api_secret: process.env.CLOUDNARY_CLOUD_SECRET
});

const uploadOnCloudnary = async (file) => {
    try {
        if (!file)
            return null
        const uploadResult = await cloudinary.uploader.upload(file, {
            resource_type: "auto"
        })
        fs.unlinkSync(file)
        return uploadResult
    } catch (error) {
        fs.unlinkSync(file)
        console.log("Cloudnary error while uploading file", error)
        return null
    }
}

const deleteFromCloudnary = async (fileUrl) => {
    try {
        const publicId = fileUrl.substring(fileUrl.lastIndexOf('/') + 1, fileUrl.lastIndexOf('.'))
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(result);
        return result
    } catch (error) {
        console.log("Cloudnary error while deleting file", error)
        return null
    }
}

const deleteVideoFromCloudnary = async (fileUrl) => {
    try {
        const publicId = fileUrl.substring(fileUrl.lastIndexOf('/') + 1, fileUrl.lastIndexOf('.'))
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
        console.log(result);
        return result
    } catch (error) {
        console.log("Cloudnary error while deleting file", error)
        return null
    }
}

export { uploadOnCloudnary, deleteFromCloudnary, deleteVideoFromCloudnary }


// uploadOnCloudnary("https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg")

// uploadResult has following data
// {
//     asset_id: 'cfb5bf0576c63e506b5ed56c1dad3161',
//     public_id: 'c7vrndgwkfdqs3k5vs00',
//     version: 1715424357,
//     version_id: '16955690cbeadc2fe6cf7a4a6876c14a',
//     signature: '54a33eda0e738146199df37d41475ed38e408fa8',
//     width: 1500,
//     height: 2000,
//     format: 'jpg',
//     resource_type: 'image',
//     created_at: '2024-05-11T10:45:57Z',
//     tags: [],
//     bytes: 637145,
//     type: 'upload',
//     etag: '0820bb9f409968a32a000d3ad541eb78',
//     placeholder: false,
//     url: 'http://res.cloudinary.com/lldhrcloud/image/upload/v1715424357/c7vrndgwkfdqs3k5vs00.jpg',
//     secure_url: 'https://res.cloudinary.com/lldhrcloud/image/upload/v1715424357/c7vrndgwkfdqs3k5vs00.jpg',
//     folder: '',
//     original_filename: 'shoes',
//     api_key: 'key'
//   }
