// src/utils/ValidationUtils.ts
export default class ValidationUtils {
    /**
     * Validates an email address.
     * @param email - The email to validate.
     * @returns True if valid, false otherwise.
     */
    static validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validates a password.
     * Must be at least 4 characters long.
     * @param password - The password to validate.
     * @returns True if valid, false otherwise.
     */
    static validatePassword(password: string): boolean {
        const passwordRegex = /^.{4,}$/; // At least 4 characters
        return passwordRegex.test(password);
    }

    /**
     * Validates a name.
     * Must consist of alphabets only, with optional spaces.
     * @param name - The name to validate.
     * @returns True if valid, false otherwise.
     */
    static validateName(name: string): boolean {
        const nameRegex = /^[A-Za-z\s]+$/; // Only alphabets and spaces
        return nameRegex.test(name);
    }

    /**
     * Combines multiple validation results.
     * @param validations - Array of validation results.
     * @returns True if all validations pass, false otherwise.
     */
    static combineValidations(...validations: boolean[]): boolean {
        return validations.every((isValid) => isValid);
    }
}
