import { PhotoTypeEnum } from "@/domain/enums/PhotoTypeEnum";
import { UserAuthException } from "@/domain/errors/UserAuthException";
import { ImageStorageService } from "@/infrastructure/services/ImageStorageService";
import NetworkUtils from "@/lib/networkUtils";
import ValidationUtils from "@/lib/validationUtils";

const fileStorageService = new ImageStorageService();

const endpoint = "/api/users/signup";

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

const handleImageUpload = async (user_email: string, image : File | null) => {

    if (image) {
      const fileName = image?.name ?? "default.jpg";
      const path = `uploads/${fileName}`;
      const photoUrl = await fileStorageService.uploadFile(image != null ? image : undefined, path, PhotoTypeEnum.USER);

      // Update the user profile with the image URL
      await NetworkUtils.postRequest('/api/users/update-profile', {
        email: user_email,
        photo: photoUrl,
      });
    }
  }

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