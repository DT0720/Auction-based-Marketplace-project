import { IFileStorageService } from "@/application/services/IFileStorageService";
import { supabase } from "../database/supabaseClient";

export class ImageStorageService implements IFileStorageService{
    private bucketName: string;

    public static productPlaceholderImage = '/assets/product-placeholder.png';

    constructor(bucketName?: string) {
        this.bucketName = bucketName ? bucketName : "uploads";
    }

    async uploadFile(file?: File, path?: string): Promise<string> {

        if (!file) {
            throw new Error('No file provided');
        }

        if (!path) {
            throw new Error('No path provided');
        }

        const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(path, file);
  
      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }
  
      return data.path;
    }

    async deleteFile(filePath: string): Promise<boolean> {
        const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([filePath]);
  
      if (error) {
        throw new Error(`Delete failed: ${error.message}`);
      }
  
      return true;
    }

    async getFileUrl(filePath: string): Promise<string | null> {
        const { data } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);
    
        const imageExists = await this.fileExists(filePath); 

        if (!data || !data.publicUrl || !imageExists) {
            return null;
        }
    
      return data.publicUrl;
    }

    async fileExists(filePath: string): Promise<boolean> {
        const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list('', { search: filePath });
  
      if (error) {
        throw new Error(`File existence check failed: ${error.message}`);
      }
  
      return data.some(file => file.name === filePath);
    }
    
}