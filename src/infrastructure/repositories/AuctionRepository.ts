import { IAuctionRepository } from "@/application/repositories/IAuctionRepository";
import { Auction } from "@/domain/entities/Auction";
import { prisma } from "../database/prisma";
import { Prisma } from "@prisma/client";
import { Product } from "@/domain/entities/Product";
import { User } from "@/domain/entities/User";
import { Review } from "@/domain/entities/Review";
import { Bid } from "@/domain/entities/Bid";

/**
 * Auction Repository class.
 * Implements methods to interact with the auction database.
 */
export class AuctionRepository implements IAuctionRepository{
    /**
     * Creates a new auction.
     * 
     * @param {Auction} auction - The auction data to create.
     * @returns {Promise<boolean>} - True if the auction is successfully created, otherwise false.
     */
    async create(auction: Auction): Promise<boolean> {
        try{
            const nowAuction = await prisma.auction.create({
                data: {
                    product_id: auction.productId,
                    seller_id: auction.sellerId,
                    minimum_price: new Prisma.Decimal(auction.minimumPrice), // Use Prisma.Decimal for decimal fields
                    buy_it_now_price: new Prisma.Decimal(auction.buyItNowPrice), // Use Prisma.Decimal for decimal fields
                    status: auction.status,
                    start_time: auction.startTime,
                    end_time: auction.endTime,
                }
            });

            if(!nowAuction){
                throw new Error("Error creating auction");
            }

            return true;
        }catch(error){
            console.log(auction);
            return false;
        }
    }

    /**
     * Deletes an auction.
     * 
     * @param {number} id - The ID of the auction to delete.
     * @returns {Promise<boolean>} - True if the auction is successfully deleted, otherwise false.
     */
    async delete(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    /**
     * Finds an auction by ID.
     * 
     * @param {number} id - The ID of the auction to find.
     * @returns {Promise<Auction | null>} - The auction object if found, otherwise null.
     */
    async findActiveAuctionsById(id: number): Promise<{ product: Product; auction: Auction } | null> {
        try{
            const productsOnSale = await prisma.product.findFirst({
                where: {
                    auction: {
                        some: {
                            product_id: id,
                            status: true
                        }
                    }
                },
                include: {
                    auction: true
                }
            });
    
            if(!productsOnSale){
                throw new Error("Error fetching products on sale by id");
            }
    
            return {
                product: Product.fromJson(productsOnSale),
                auction: Auction.fromJson(productsOnSale.auction[0])
            };
        }catch(error){
            console.log(error);
            return null;
        }
    }
    async findById(id: number): Promise<{ product: Product; auction: Auction } | null> {
        try{
            const productsOnSale = await prisma.product.findFirst({
                where: {
                    auction: {
                        some: {
                            product_id: id,
                        }
                    }
                },
                include: {
                    auction: true
                }
            });
    
            if(!productsOnSale){
                throw new Error("Error fetching products on sale by id");
            }
    
            return {
                product: Product.fromJson(productsOnSale),
                auction: Auction.fromJson(productsOnSale.auction[0])
            };
        }catch(error){
            console.log(error);
            return null;
        }
    }
    /**
     * Finds all auctions.
     * 
     * @returns {Promise<Auction[]>} - The list of all auctions.
     */
    async findAll(): Promise<Auction[]> {
        throw new Error("Method not implemented.");
    }
    /**
     * Finds all products on auction.
     * 
     * @returns {Promise<{Product, Auction}>} - The list of all products on auction.
     */
    async findAllProductsOnAuction(): Promise<{ product: Product; auction: Auction }[]> {
        try{
            const productsOnSale = await prisma.product.findMany({
                where: {
                    auction: {
                        some: {
                            status: true
                        }
                    }
                },
                include: {
                    auction: true
                }
            });
    
            if(!productsOnSale){
                throw new Error("Error fetching products on sale");
            }
    
            return productsOnSale.flatMap(product => 
                product.auction.map(auction => ({
                    product: Product.fromJson(product),
                    auction: Auction.fromJson(auction)
                }))
            );
        }catch(error){
            console.log(error);
            return [];
        }
    }

    /**
     * Finds product by id on auction with reviews and bidders.
     * 
     * @returns {Promise<{Review[], Bid[]}>} - The bidders, and reviews if found, otherwise empty list.
     */
    async findProductByIdWithDetails(productId: number): Promise<{ reviews: Review[]; bids: Bid[] } | null> {
        try{
            const auctionWithDetails = await prisma.auction.findFirst({
                where: {
                    product_id: productId,
                    status: true
                },
                include: {
                    bid: true,
                    product: {
                        include: {
                            review: true
                        }
                    }
                }
            });
      
            if(!auctionWithDetails){
                throw new Error("Error fetching auction details");
            }
      
            const reviews = auctionWithDetails.product.review.map((review) => Review.fromJson(review));
            const bids = auctionWithDetails.bid.map((bid) => Bid.fromJson(bid));
      
            return { reviews, bids };
        }catch(error){
            console.log(error);
            return null;
        }
      }
      
      
}