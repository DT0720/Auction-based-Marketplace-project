import { User } from "@/domain/entities/User";
import { UserAuthException } from "@/domain/errors/UserAuthException";
import NetworkUtils, { ApiResponse } from "@/lib/networkUtils";
import ValidationUtils from "@/lib/validationUtils";

const endpoint = "/api/users/login";

async function useLogin(data: any): Promise<boolean> {

    const message = validate(data);
    if (message != null) {
        throw new UserAuthException(message);
    }

    const response = await NetworkUtils.postRequest<ApiResponse<User>>(endpoint, data);

    if (response?.data == null) {
        throw new Error("Login Failed. Please try again.");
    }

    return true;
}

function validate(data: any): string | null {

    if (!ValidationUtils.validateEmail(data.email)) {
        return "Please enter a valid email";
    }else if (!ValidationUtils.validatePassword(data.password)) {
        return "Please enter a valid password";
    }
    return null;
}

export default useLogin;