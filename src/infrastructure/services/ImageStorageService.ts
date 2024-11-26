import { IFileStorageService } from "@/application/services/IFileStorageService";
import { supabase } from "../database/supabaseClient";

export class ImageStorageService implements IFileStorageService{
    private bucketName: string;

    public static productPlaceholderImage = '/assets/product-placeholder.png';

    constructor(bucketName?: string) {
        this.bucketName = bucketName ? bucketName : "uploads";
    }

    async uploadFile(file?: File, path?: string, folderPath?: string): Promise<string> {      //Need to work on folder path

        if (!file) {
            throw new Error('No file provided');
        }

        if (!path) {
            throw new Error('No path provided');
        }

        const fullPath = folderPath ? `${folderPath}/${path}` : path;
    
        const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(fullPath, file);
  
      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }
  
      return data.path;
    }

    async deleteFile(filePath: string,folderPath?: string): Promise<boolean> {              //Need to work on folder path  

        const fullPath = folderPath ? `${folderPath}/${filePath}` : filePath;
  
        const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([fullPath]);
  
      if (error) {
        throw new Error(`Delete failed: ${error.message}`);
      }
  
      return true;
    }

    async getFileUrl(filePath: string, folderPath?: string): Promise<string | null> {       //Need to work on folder path

        const fullPath = folderPath ? `${folderPath}/${filePath}` : filePath;
  
        const { data } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(fullPath);
    
        const imageExists = await this.fileExists(fullPath); 

        if (!data || !data.publicUrl || !imageExists) {
            return null;
        }
    
      return data.publicUrl;
    }

    async fileExists(filePath: string, folderPath?: string): Promise<boolean> {           //Need to work on folder path

      const fullPath = folderPath ? `${folderPath}/${filePath}` : filePath;


        const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list('', { search: fullPath});
  

      if (error) {
        throw new Error(`File existence check failed: ${error.message}`);
      }
  
      return data.some(file => file.name === fullPath);
    }
    
}