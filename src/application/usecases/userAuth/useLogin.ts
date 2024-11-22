import { UserAuthException } from "@/domain/errors/UserAuthException";
import { LoginResponse } from "@/domain/responses/LoginResponse";
import NetworkUtils, { ApiResponse } from "@/lib/networkUtils";
import ValidationUtils from "@/lib/validationUtils";

const endpoint = "/api/users/login";

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

function validate(data: any): string | null {

    if (!ValidationUtils.validateEmail(data.email)) {
        return "Please enter a valid email";
    }else if (!ValidationUtils.validatePassword(data.password)) {
        return "Please enter a valid password";
    }
    return null;
}

export default useLogin;