import { Address } from "@/domain/entities/Address"; 
import NetworkUtils, { ApiResponse } from "@/lib/networkUtils";

const endpoint = "/api/users/user-address/";

/**
 * Fetches the list of addresses for a user by their user ID.
 * 
 * @param userId - The ID of the user whose addresses are to be retrieved.
 * 
 * @returns A promise that resolves to an array of `Address` objects, or an empty array if no addresses are found.
 */
export async function getAddressesByUserId(userId: number): Promise<Address[]> {
    const response = await NetworkUtils.getRequest<ApiResponse<Address[]>>(endpoint + userId);
    return response?.data ?? [];
}

/**
 * Creates a new address for a user.
 * 
 * @param address - The address object to be created.
 * 
 * @returns A promise that resolves to the created `Address` object, or `null` if the creation fails.
 */
export async function createAddress(address: Address): Promise<Address | null> {
    const response = await NetworkUtils.postRequest<ApiResponse<Address>>(`${endpoint}/create`,address );
    return response?.data ?? null;
}

/**
 * Updates an existing address.
 * 
 * @param address - The address object with updated data.
 * 
 * @returns A promise that resolves to `true` if the address was updated successfully, or `false` if the update failed.
 */
export async function updateAddress(address: Address): Promise<boolean> {
    const response = await NetworkUtils.putRequest<ApiResponse<null>>(`${endpoint}/update/${address.id}`,address);
    return response?.message === "Address updated successfully";
}

/**
 * Deletes an address by its ID.
 * 
 * @param id - The ID of the address to be deleted.
 * 
 * @returns A promise that resolves to `true` if the address was deleted successfully, or `false` if the deletion failed.
 */
export async function deleteAddress(id: number): Promise<boolean> {
    const response = await NetworkUtils.deleteRequest<ApiResponse<null>>(`${endpoint}/delete/${id}`);
    return response?.message === "Address deleted successfully";
}