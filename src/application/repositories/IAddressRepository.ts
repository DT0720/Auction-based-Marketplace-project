import { Address } from "@/domain/entities/Address";

export interface IAddressRepository {
    create(address: Address): Promise<Address | null>; // Create a new address
    update(address: Address): Promise<boolean>; // Update an existing address
    delete(id: number): Promise<boolean>; // Delete an address by ID
    findById(id: number): Promise<Address | null>; // Find an address by ID
    findByUserId(userId: number): Promise<Address[]>; // Find addresses by user ID
}