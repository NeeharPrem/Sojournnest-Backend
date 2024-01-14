import cloudinary from "../config/cloudinary";
import fs from 'fs'

class CloudinarySetup{
    async upload(filePath: string, folder: string) {
       try {
           const result = await cloudinary.uploader.upload(filePath,{folder});
           fs.unlink(filePath, (err) => {
               if (err) {
                   console.error('Error deleting file:', err);
               }
           });
           return result;
       } catch (error) {
        const err:Error = error as Error
        console.log(err.message)
       }
    }
}
export default CloudinarySetup;