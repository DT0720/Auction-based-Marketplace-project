export interface IHashingService {
    /**
     * Hashes a given string value.
     * 
     * @param {string} value - The value to be hashed.
     * @returns {Promise<string>} - The hashed string.
     */
    hash(value: string): Promise<string>;
    /**
     * Compares a given value with a hashed string to verify if they match.
     * 
     * @param {string} value - The original value.
     * @param {string} hash - The hashed string to compare against.
     * @returns {Promise<boolean>} - Returns true if the value matches the hash, otherwise false.
     */
    compare(value: string, hash: string): Promise<boolean>;
}