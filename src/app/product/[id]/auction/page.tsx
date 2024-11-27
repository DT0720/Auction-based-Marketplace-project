'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getProductOnAuctionByProductId } from "@/application/usecases/buyerDashboard/products/getProductsOnAuction";
import ImageHolderSquare from "@/components/ui/custom/ImageHolderSquare";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Product } from "@/domain/entities/Product";
import { Auction } from "@/domain/entities/Auction";
import { errorMessage } from "@/components/ui/custom/Toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoader } from "@/hooks/use-loader";

export default function ProductAuctionPage() {
  const params = useParams();
  const id = params?.id;
  const { toast } = useToast();

  const [productAuction, setProductAuction] = useState<{ product: Product; auction: Auction } | null>(null);
  const [loading, setLoading] = useState(true);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    const fetchProductAuctionDetails = async () => {
      if (typeof id === "string") {
        try {
            showLoader();
          const productAuctionData = await getProductOnAuctionByProductId(parseInt(id, 10));
          if (productAuctionData) {
            setProductAuction(productAuctionData);
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
                <Button className="w-full py-4 text-lg font-bold mt-4" variant="outline">
                  Place Your Bid
                </Button>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bidder Name</TableHead>
                    <TableHead>Bid Amount</TableHead>
                    <TableHead>Bid Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Placeholder for Bidders Data */}
                  {/* You can fill this section with actual data */}
                  <TableRow>
                    <TableCell>John Doe</TableCell>
                    <TableCell>$100</TableCell>
                    <TableCell>12:00 PM, 1st Jan 2024</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>$150</TableCell>
                    <TableCell>1:30 PM, 1st Jan 2024</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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
                {/* Placeholder for Reviews Data */}
                <div className="space-y-4">
                  <div>
                    <p className="text-lg font-semibold">John Doe</p>
                    <p className="text-gray-600">Great product! Very satisfied with the quality.</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">Jane Smith</p>
                    <p className="text-gray-600">Product arrived on time and in perfect condition. Highly recommend!</p>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
