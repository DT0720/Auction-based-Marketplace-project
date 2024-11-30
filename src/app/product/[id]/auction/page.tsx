'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getProductOnAuctionByProductId, getReviewAndBiddersByProductId } from "@/application/usecases/buyerDashboard/products/getProductsOnAuction";
import ImageHolderSquare from "@/components/ui/custom/ImageHolderSquare";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Product } from "@/domain/entities/Product";
import { Auction } from "@/domain/entities/Auction";
import { errorMessage, successMessage } from "@/components/ui/custom/Toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoader } from "@/hooks/use-loader";
import { Review } from "@/domain/entities/Review";
import { Bid } from "@/domain/entities/Bid";
import { formatCurrency } from "@/lib/stringUtils";
import { Input } from "@/components/ui/input";
import { placeBid } from "@/application/usecases/buyerDashboard/auction/placeBid";
import useAuth from "@/hooks/use-auth";


export default function ProductAuctionPage() {
  const params = useParams();
  const id = params?.id;
  const { toast } = useToast();

  const [productAuction, setProductAuction] = useState<{ product: Product; auction: Auction; } | null>(null);
  const [reviewAndBidderData, setReviewAndBidderData] = useState<{ reviews: Review[]; bids: Bid[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [auctionActive, setAuctionActive] = useState(true);
  const { showLoader, hideLoader } = useLoader();
  const { user, currentBalance, buyer_seller_id, fetchAndUpdateBalance } = useAuth();


  useEffect(() => {
    const fetchProductAuctionDetails = async () => {
      if (typeof id === "string") {
        try {
          showLoader();
          const productAuctionData = await getProductOnAuctionByProductId(parseInt(id, 10));
          if (productAuctionData) {
            setProductAuction(productAuctionData);
          }
          const reviewAndBidderData = await getReviewAndBiddersByProductId(parseInt(id, 10));
          if (reviewAndBidderData) {
            setReviewAndBidderData(reviewAndBidderData);
          }
        } catch (error) {
          console.error("Error fetching product auction details: ", error);
          errorMessage(toast, "Unable to fetch product auction details");
        } finally {
          hideLoader();
          setLoading(false);
        }
      }
    };
    fetchProductAuctionDetails();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (productAuction?.auction.endTime) {
        updateTimeLeft(productAuction.auction.endTime);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [productAuction]);

  const updateTimeLeft = (endTime: Date | string) => {
    const end = typeof endTime === 'string' ? new Date(endTime).getTime() : endTime.getTime();
    const now = new Date().getTime();
    const difference = end - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      setTimeLeft(`${days > 0 ? `${days}d ` : ''}${hours}h ${minutes}m ${seconds}s`);
    } else {
      setTimeLeft("Auction ended");
      setAuctionActive(false);
    }
  };

  const handleBidAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBidAmount(e.target.value);
  };


const handleBidSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const bidValue = parseFloat(bidAmount);
  if (isNaN(bidValue) || bidValue <= (reviewAndBidderData?.bids.reduce((max, bidder) => Math.max(max, bidder.price), 0) || 0)) {
    errorMessage(toast, "Bid amount must be higher than the current highest bid");
    return;
  }

  if (productAuction?.auction && productAuction.auction.id) {
    try {
      showLoader();
      
      const buyerId = buyer_seller_id; // Replace this with the actual user id from context or state.
      const auctionId = productAuction.auction.id;
      const price = bidValue;

      console.log("Buyer ID: " + buyerId);

      // Make sure userId is valid
      if (buyerId <= 0) {
        throw new Error("Invalid buyer ID");
      }

      if (price <= 0) {
        throw new Error("Price must be greater than 0");
      }

      if(!currentBalance || currentBalance < price){
        errorMessage(toast, "Insufficient balance. Please add funds to your account.");
        return;
      }

      const lastBidder = await placeBid(buyerId, auctionId, user?.user_id ?? 0,price);

      console.log("Last bidder: " + JSON.stringify(lastBidder));  

      if (lastBidder > 0) {
        const updatedReviewAndBidderData = await getReviewAndBiddersByProductId((typeof id == "string") ? parseInt(id, 10) : 0);
        if (updatedReviewAndBidderData) {
          setReviewAndBidderData(updatedReviewAndBidderData);
        }
        fetchAndUpdateBalance();
        successMessage(toast, "Bid placed successfully");
      } else {
        errorMessage(toast, "Failed to place bid. Please try again.");
      }
    } catch (error: any) {
      errorMessage(toast, error.message || "Unexpected error occurred");
    } finally {
      hideLoader();
    }
  } else {
    errorMessage(toast, "Invalid auction data");
  }
};

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Information */}
        {loading ? (
          <Skeleton className="w-full h-full rounded-lg" />
        ) : (
          productAuction && (
            <Card className="w-full h-full">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-gray-800">
                  {productAuction.product.productName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6 h-full flex flex-col">
                <ImageHolderSquare image={productAuction.product.photo} />
                <div>
                  <Label className="block text-lg font-medium text-gray-700 mb-1">
                    Description
                  </Label>
                  <p className="text-gray-800 font-semibold">
                    {productAuction.product.description}
                  </p>
                </div>
                <div>
                  <Label className="block text-lg font-medium text-gray-700 mb-1">
                    Time Left
                  </Label>
                  <p className="text-gray-800 font-semibold">
                    {timeLeft}
                  </p>
                </div>
                {
                  auctionActive ? (
                    <div>
                        <div>
                          <Label htmlFor="bidAmount" className="block text-lg font-medium text-gray-700 mb-1">
                            Your Bid Amount
                          </Label>
                          <Input
                            id="bidAmount"
                            name = "bidAmount"
                            type="number"
                            value={bidAmount}
                            onChange={handleBidAmountChange}
                            placeholder="Enter your bid"
                          />
                        </div>
                      <Button className="w-full py-4 text-lg font-bold mt-4" variant="outline" onClick={handleBidSubmit}>
                        Place Your Bid
                      </Button>
                    </div>
                  ) :
                  null
                }
              </CardContent>
            </Card>
          )
        )}

        {/* Bidders List */}
        {loading ? (
          <Skeleton className="w-full h-full rounded-lg" />
        ) : (
          <Card className="w-full h-full">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-gray-800">
                Bidders List
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 h-full">
              <ScrollArea>
                {reviewAndBidderData && reviewAndBidderData.bids.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bid Amount</TableHead>
                        <TableHead>Bid Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviewAndBidderData.bids.map((bid, index) => (
                        <TableRow key={index}>
                          <TableCell>{formatCurrency(bid.price)}</TableCell>
                          <TableCell>{bid.created_at.toString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-gray-600">No bidders yet</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Reviews Section */}
        {loading ? (
          <Skeleton className="w-full h-64 rounded-lg" />
        ) : (
          <Card className="w-full h-full md:col-span-2">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-gray-800">
                Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="h-40">
                {reviewAndBidderData && reviewAndBidderData.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviewAndBidderData.reviews.map((review, index) => (
                      <div key={index}>
                        {/* <p className="text-lg font-semibold">{review.reviewerName}</p> */}
                        <p className="text-gray-600">{review.review_content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No reviews yet</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
