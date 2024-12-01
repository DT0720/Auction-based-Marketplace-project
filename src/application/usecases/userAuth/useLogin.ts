import { UserAuthException } from "@/domain/errors/UserAuthException";
import { LoginResponse } from "@/domain/responses/LoginResponse";
import NetworkUtils, { ApiResponse } from "@/lib/networkUtils";
import ValidationUtils from "@/lib/validationUtils";

const endpoint = "/api/users/login";

/**
 * Sends a login request to the API with the provided data and returns the login response.
 *
 * @async
 * @function useLogin
 * @param {any} data - The login data, including email and password.
 * @returns {Promise<LoginResponse>} A promise that resolves to a `LoginResponse` object if the login is successful.
 * @throws {UserAuthException} Throws a `UserAuthException` if the provided data is invalid or if an error occurs during the login request.
 *
 * @description This function validates the login data (email and password), sends a POST request to the login endpoint (`/api/users/login`), and returns the login response if successful. If validation fails or the API returns an error, it throws a `UserAuthException`.
 *
 * @example
 * const loginData = { email: "user@example.com", password: "password123" };
 * try {
 *     const loginResponse = await useLogin(loginData);
 *     console.log('Login successful:', loginResponse);
 * } catch (error) {
 *     console.error('Login failed:', error.message);
 * }
 */
async function useLogin(data: any): Promise<LoginResponse> {

    const message = validate(data);
    if (message != null) {
        throw new UserAuthException(message);
    }

    const response = await NetworkUtils.postRequest<ApiResponse<LoginResponse>>(endpoint, data);

    if (response?.data == null) {
        throw new UserAuthException(response?.message || "An error occurred");
    }

    return response.data;
}

/**
 * Validates the login data (email and password).
 *
 * @function validate
 * @param {any} data - The login data, including email and password.
 * @returns {string | null} A validation error message if the data is invalid, or `null` if the data is valid.
 *
 * @description This helper function checks if the email and password are valid using utility functions. 
 * It returns a message indicating the error if the validation fails or `null` if the data passes validation.
 *
 * @example
 * const data = { email: "invalid-email", password: "short" };
 * const validationMessage = validate(data);
 * if (validationMessage) {
 *     console.log(validationMessage); // "Please enter a valid email"
 * }
 */
function validate(data: any): string | null {

    if (!ValidationUtils.validateEmail(data.email)) {
        return "Please enter a valid email";
    }else if (!ValidationUtils.validatePassword(data.password)) {
        return "Please enter a valid password";
    }
    return null;
}

export default useLogin;