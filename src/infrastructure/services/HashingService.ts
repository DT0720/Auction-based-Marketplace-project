import { IHashingService } from "@/application/services/IHashingService";
import argon2 from "argon2";

/**
 * HashingService class implements IHashingService to provide hashing and comparison functionalities.
 * Utilizes argon2 for hashing and verification of values.
 */
export class HashingService implements IHashingService {
    /**
     * Hashes a given string value.
     *
     * @param {string} value - The string value to be hashed.
     * @returns {Promise<string>} - The hashed string.
     */
    async hash(value: string): Promise<string> {
        return await argon2.hash(value);
    }
    /**
     * Compares a given string value with a hashed string.
     *
     * @param {string} value - The original string value.
     * @param {string} hash - The hashed string to compare against.
     * @returns {Promise<boolean>} - Returns true if the value matches the hash, otherwise false.
     */
    async compare(value: string, hash: string): Promise<boolean> {
        try {
            return await argon2.verify(hash, value);
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}
