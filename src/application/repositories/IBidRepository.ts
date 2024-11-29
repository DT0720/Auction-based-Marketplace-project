import { Bid } from "@/domain/entities/Bid";

export interface IBidRepository {
    createBid(auction_id: number, buyer_id: number, price: number): Promise<boolean>;
    getBidsByAuctionId(auction_id: number): Promise<Bid[]>;
}