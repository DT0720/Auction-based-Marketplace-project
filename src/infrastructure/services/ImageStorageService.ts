import { IFileStorageService } from "@/application/services/IFileStorageService";
import { supabase } from "../database/supabaseClient";

/**
 * ImageStorageService class implements IFileStorageService to provide image upload, deletion, and retrieval functionalities.
 * Utilizes Supabase for storage-related operations.
 */
export class ImageStorageService implements IFileStorageService {
    private bucketName: string;

    public static productPlaceholderImage = "/assets/product-placeholder.png";

    /**
     * Constructor to initialize the ImageStorageService with a bucket name.
     * Defaults to "uploads" if no bucket name is provided.
     *
     * @param {string} [bucketName] - Optional bucket name for file storage.
     */
    constructor(bucketName?: string) {
        this.bucketName = bucketName ? bucketName : "uploads";
    }

    /**
     * Uploads a file to Supabase storage.
     *
     * @param {File} [file] - The file to be uploaded.
     * @param {string} [path] - The path where the file should be uploaded.
     * @param {string} [folderPath] - Optional folder path to prepend to the file path.
     * @returns {Promise<string>} - The path of the uploaded file.
     * @throws Will throw an error if no file or path is provided, or if the upload fails.
     */
    async uploadFile(
        file?: File,
        path?: string,
        folderPath?: string
    ): Promise<string> {
        //Need to work on folder path

        if (!file) {
            throw new Error("No file provided");
        }

        if (!path) {
            throw new Error("No path provided");
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
    /**
     * Deletes a file from Supabase storage.
     *
     * @param {string} filePath - The path of the file to be deleted.
     * @param {string} [folderPath] - Optional folder path to prepend to the file path.
     * @returns {Promise<boolean>} - Returns true if the file was deleted successfully.
     * @throws Will throw an error if the deletion fails.
     */
    async deleteFile(filePath: string, folderPath?: string): Promise<boolean> {
        //Need to work on folder path

        const fullPath = folderPath ? `${folderPath}/${filePath}` : filePath;

        const { error } = await supabase.storage
            .from(this.bucketName)
            .remove([fullPath]);

        if (error) {
            throw new Error(`Delete failed: ${error.message}`);
        }

        return true;
    }

    /**
     * Retrieves the public URL of a file in Supabase storage.
     *
     * @param {string} filePath - The path of the file.
     * @param {string} [folderPath] - Optional folder path to prepend to the file path.
     * @returns {Promise<string | null>} - The public URL of the file, or null if the file does not exist.
     */
    async getFileUrl(
        filePath: string,
        folderPath?: string
    ): Promise<string | null> {
        //Need to work on folder path

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

    /**
     * Checks if a file exists in Supabase storage.
     *
     * @param {string} filePath - The path of the file to check.
     * @param {string} [folderPath] - Optional folder path to prepend to the file path.
     * @returns {Promise<boolean>} - Returns true if the file exists, otherwise false.
     * @throws Will throw an error if the existence check fails.
     */
    async fileExists(filePath: string, folderPath?: string): Promise<boolean> {
        //Need to work on folder path

        const fullPath = folderPath ? `${folderPath}/${filePath}` : filePath;

        const { data, error } = await supabase.storage
            .from(this.bucketName)
            .list("", { search: fullPath });

        if (error) {
            throw new Error(`File existence check failed: ${error.message}`);
        }

        return data.some((file) => file.name === fullPath);
    }
}
