import { UserAuthException } from "@/domain/errors/UserAuthException";
import { ImageStorageService } from "@/infrastructure/services/ImageStorageService";
import NetworkUtils from "@/lib/networkUtils";
import ValidationUtils from "@/lib/validationUtils";

const fileStorageService = new ImageStorageService();

const endpoint = "/api/users/signup";

/**
 * Handles the user signup process by validating the input data, sending a signup request, 
 * and uploading an image if provided.
 *
 * @async
 * @function useSignup
 * @param {any} data - The signup data, including name, email, and password.
 * @param {File | null} image - The image file to upload (optional).
 * @returns {Promise<boolean>} A promise that resolves to `true` if the signup is successful, or throws an error if it fails.
 * @throws {UserAuthException} Throws a `UserAuthException` if validation fails.
 * @throws {Error} Throws an error if the signup fails or the image upload fails.
 *
 * @description This function first validates the input data. If the validation is successful, 
 * it sends a request to sign up the user. If the signup is successful, it handles the image upload 
 * (if an image is provided). The function returns `true` if everything completes successfully.
 *
 * @example
 * const signupData = { name: "John Doe", email: "john@example.com", password: "password123", confirmPassword: "password123" };
 * const imageFile = new File(["image content"], "profile.jpg");
 * try {
 *     const result = await useSignup(signupData, imageFile);
 *     console.log('Signup successful:', result);
 * } catch (error) {
 *     console.error('Signup failed:', error.message);
 * }
 */
async function useSignup(data: any, image: File | null): Promise<boolean> {

    const message = validate(data);
    if (message != null) {
        throw new UserAuthException(message);
    }

    const success = await NetworkUtils.postRequest(endpoint, data);

    if (!success) {
        throw new Error("Signup Failed.");
    }

    await handleImageUpload(data.email, image);

    return true;
}

/**
 * Handles the image upload process for a user's profile.
 *
 * @async
 * @function handleImageUpload
 * @param {string} user_email - The email of the user whose profile is being updated.
 * @param {File | null} image - The image file to upload (optional).
 * @returns {Promise<void>} A promise that resolves when the image upload is complete.
 *
 * @description This function uploads the provided image to the server if an image is provided.
 * If the upload is successful, it updates the user's profile with the image URL.
 *
 * @example
 * const userEmail = "john@example.com";
 * const imageFile = new File(["image content"], "profile.jpg");
 * await handleImageUpload(userEmail, imageFile);
 */
const handleImageUpload = async (user_email: string, image : File | null) => {

    if (image) {
      const fileName = image?.name ?? "default.jpg";
      const path = `uploads/${fileName}`;
      const photoUrl = await fileStorageService.uploadFile(image != null ? image : undefined, path);

      // Update the user profile with the image URL
      await NetworkUtils.postRequest('/api/users/update-profile', {
        email: user_email,
        photo: photoUrl,
      });
    }
  }

/**
 * Validates the input data for the user signup process.
 *
 * @function validate
 * @param {any} data - The signup data, including name, email, password, and confirmPassword.
 * @returns {string | null} A validation error message if the data is invalid, or `null` if the data is valid.
 *
 * @description This function validates the user's name, email, password, and confirm password fields.
 * It checks if the name, email, and password are valid, and whether the password matches the confirm password.
 * If any validation fails, it returns an appropriate error message.
 *
 * @example
 * const data = { name: "John Doe", email: "john@example.com", password: "password123", confirmPassword: "password123" };
 * const validationMessage = validate(data);
 * if (validationMessage) {
 *     console.log(validationMessage); // Will output validation errors if any.
 * }
 */
function validate(data: any): string | null {

    if(!ValidationUtils.validateName(data.name)){
        return "Please enter a valid name";
    }else if (!ValidationUtils.validateEmail(data.email)) {
        return "Please enter a valid email";
    }else if (!ValidationUtils.validatePassword(data.password)) {
        return "Please enter a valid password";
    }else if (data.password != data.confirmPassword) {

        console.log("Pass" + data.password);
        console.log("confirm Pass" + data.confirmPassword);


        return "Passwords do not match!";
    }
    return null;
}

export default useSignup;