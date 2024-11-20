export interface IFileStorageService {
      /**
   * Uploads a file to the storage service.
   * @param file - The file to be uploaded.
   * @param path - The path or directory where the file will be stored.
   * @returns A promise that resolves with the file URL or path.
   */
  uploadFile(file: File, path: string): Promise<string>;

  /**
   * Deletes a file from the storage service.
   * @param filePath - The path or URL of the file to be deleted.
   * @returns A promise that resolves with a boolean indicating success or failure.
   */
  deleteFile(filePath: string): Promise<boolean>;

  /**
   * Gets the URL for a file stored in the storage service.
   * @param filePath - The path of the file.
   * @returns A promise that resolves with the public or private URL of the file.
   */
  getFileUrl(filePath: string): Promise<string>;

  /**
   * Checks if a file exists in the storage service.
   * @param filePath - The path of the file.
   * @returns A promise that resolves with a boolean indicating if the file exists.
   */
  fileExists(filePath: string): Promise<boolean>;
}