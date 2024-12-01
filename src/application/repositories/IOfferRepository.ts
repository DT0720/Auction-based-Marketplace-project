import { Offers } from "@/domain/entities/Offers";

export interface IOffersRepository {
  /**
   * Finds an offer by its type (e.g., coupon code).
   * @param {string} type - The type of the offer.
   * @returns {Promise<Offers | null>} The found offer or null if none exists.
   */
  findByType(type: string): Promise<Offers | null>;

  /**
   * Creates a new offer.
   * @param {Partial<Offers>} offer - The offer details to create.
   * @returns {Promise<boolean>} True if the creation was successful, otherwise false.
   */
  create(offer: Partial<Offers>): Promise<boolean>;

  /**
   * Updates an offer by its ID.
   * @param {number} id - The ID of the offer to update.
   * @param {Partial<Offers>} data - The updated offer details.
   * @returns {Promise<boolean>} True if the update was successful, otherwise false.
   */
  update(id: number, data: Partial<Offers>): Promise<boolean>;

  /**
   * Deletes an offer by its ID.
   * @param {number} id - The ID of the offer to delete.
   * @returns {Promise<boolean>} True if the deletion was successful, otherwise false.
   */
  delete(id: number): Promise<boolean>;

  /**
 * Retrieves all offers from the database as an array of 'Offers' objects.
 * @returns {Promise<Offers[]>} A promise that resolves to an array of 'Offers'.
 * @throws {Error} Throws an error if the fetch operation fails.
 */

  getAllOffers(): Promise<Offers[]>;

}