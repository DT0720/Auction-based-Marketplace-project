import { Address } from "@/domain/entities/Address"; 
import NetworkUtils, { ApiResponse } from "@/lib/networkUtils";

const endpoint = "/api/users/user-address/";

export async function getAddressesByUserId(userId: number): Promise<Address[]> {
    const response = await NetworkUtils.getRequest<ApiResponse<Address[]>>(endpoint + userId);
    return response?.data ?? [];
}

export async function createAddress(address: Address): Promise<Address | null> {
    const response = await NetworkUtils.postRequest<ApiResponse<Address>>(`${endpoint}/create`,address );
    return response?.data ?? null;
}

export async function updateAddress(address: Address): Promise<boolean> {
    const response = await NetworkUtils.putRequest<ApiResponse<null>>(`${endpoint}/update/${address.id}`,address);
    return response?.message === "Address updated successfully";
}

export async function deleteAddress(id: number): Promise<boolean> {
    const response = await NetworkUtils.deleteRequest<ApiResponse<null>>(`${endpoint}/delete/${id}`);
    return response?.message === "Address deleted successfully";
}