import { prisma } from "../database/prisma";
import { IOffersRepository } from "@/application/repositories/IOfferRepository";
import { Offers } from "@/domain/entities/Offers";

export class OffersRepository implements IOffersRepository {
  constructor(

  ) {}

  async findByType(type: string): Promise<Offers | null> {
    const offerData = await prisma.offers.findFirst({ where: { type } });
    return offerData ? Offers.fromJson(offerData) : null;
  }

  async create(offer: Partial<Offers>): Promise<boolean> {
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

  async update(id: number, data: Partial<Offers>): Promise<boolean> {
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

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.offers.delete({ where: { id } });
      return true;
    } catch (error) {
      console.error("Error deleting offer:", error);
      return false;
    }
  }

  async getAllOffers(): Promise<Offers[]> {
    try {
        // Fetch all offers from the database
        const offersData = await prisma.offers.findMany();
    
        // Map the result to `Offers` objects
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
