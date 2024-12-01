import { ISellerRepository } from "@/application/repositories/ISellerRepository";
import { Seller } from "@/domain/entities/Seller";
import { prisma } from "../database/prisma";

/**
 * Repository for handling Seller data.
 */
export class SellerRepository implements ISellerRepository {
  
  /**
   * Deletes a seller by ID.
   * 
   * @param id - The ID of the seller to be deleted.
   * @throws Will throw an error because this method is not yet implemented.
   */
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  /**
   * Creates a new seller entry based on a given user ID.
   * 
   * @param user_id - The user ID associated with the seller.
   * @returns A promise that resolves to `true` if the seller was created successfully, or `false` if an error occurs.
   */
  async create(user_id: number): Promise<boolean> {
    try {
      await prisma.seller.create({
        data: {
          user_id: user_id
        }
      });
      return true;
    } catch (e: any) {
      console.log(e.trace());
      return false;
    }
  }

  /**
   * Finds a seller by the given user ID.
   * 
   * @param _user_id - The user ID associated with the seller.
   * @returns A promise that resolves to the `Seller` entity if found, or `null` if not found or an error occurs.
   */
  async findById(_user_id: number): Promise<Seller | null> {
    try {
      const seller = await prisma.seller.findFirst({
        where: {
          user_id: _user_id
        }
      });
      return Seller.fromJson(seller);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  /**
   * Finds a user ID by the given seller ID.
   * 
   * @param seller_id - The ID of the seller.
   * @returns A promise that resolves to the associated user ID if found, or `null` if not found or an error occurs.
   */
  async findUserIdBySellerId(seller_id: number): Promise<number | null> {
    try {
      const seller = await prisma.seller.findFirst({
        where: {
          id: seller_id
        }
      });
      return seller?.user_id ?? null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
