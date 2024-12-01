import { prisma } from "../database/prisma";
import { IOffersRepository } from "@/application/repositories/IOfferRepository";
import { Offers } from "@/domain/entities/Offers";

/**
 * Repository for managing offers in the database.
 * Implements the IOffersRepository interface.
 */

export class OffersRepository implements IOffersRepository 

{
  constructor
  (

  ) {}

  /**
   * Finds an offer by its type.
   * @param {string} type - The type of the offer to search for.
   * @returns {Promise<Offers | null>} - The offer if found, otherwise null.
 */

  async findByType(type: string): Promise<Offers | null> 
     // Implementation
  {

    const offerData = await prisma.offers.findFirst({ where: { type } });
    return offerData ? Offers.fromJson(offerData) : null;
  }

   /**
   * Creates a new offer in the database.
   * @param {Partial<Offers>} offer - The offer data to create.
   * @returns {Promise<boolean>} - True if creation succeeds, false otherwise.
   */

  async create(offer: Partial<Offers>): Promise<boolean> 
  {
    // Implementation
    try {
      await prisma.offers.create({
        data: {
          type: offer.type!,
          discount_amount: offer.discountAmount!,
        },
      });
      return true;
    } catch (error) {
      console.error("Error creating offer:", error);
      return false;
    }
  }

  /**
   * Updates an existing offer in the database.
   * @param {number} id - The ID of the offer to update.
   * @param {Partial<Offers>} data - The data to update the offer with.
   * @returns {Promise<boolean>} - True if the update succeeds, false otherwise.
   */

  async update(id: number, data: Partial<Offers>): Promise<boolean>
   {
     // Implementation
    try {
      await prisma.offers.update({
        where: { id },
        data: {
          type: data.type,
          discount_amount: data.discountAmount,
        },
      });
      return true;
    } catch (error) {
      console.error("Error updating offer:", error);
      return false;
    }
  }

  /**
   * Delete an existing offer in the database.
   * @param {number} id - The ID of the offer to delete.
   * @param {Partial<Offers>} data - The data to delete the offer with.
   * @returns {Promise<boolean>} - True if the delete succeeds, false otherwise.
   */

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.offers.delete({ where: { id } });
      return true;
    } catch (error) {
      console.error("Error deleting offer:", error);
      return false;
    }
  }

  /**
 * Fetches all offers from the database and returns them as an array of `Offers` objects.
 * @returns {Promise<Offers[]>} A promise resolving to an array of `Offers`.
 * @throws {Error} Throws an error if fetching offers fails.
 */

  async getAllOffers(): Promise<Offers[]> {
    try {
      
        const offersData = await prisma.offers.findMany();
    
        return offersData.map((offer) =>
          Offers.fromJson({
            id: offer.id,
            type: offer.type,
            discount_amount: parseFloat(offer.discount_amount.toString()), // Ensure the correct type
          })
        );
      } catch (error) {
        console.error('Error fetching offers:', error);
        throw new Error('Failed to fetch offers');
      }
  }

}
