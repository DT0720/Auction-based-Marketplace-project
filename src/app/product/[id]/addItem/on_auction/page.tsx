'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useLoader } from "@/hooks/use-loader";
import { useParams, useRouter } from "next/navigation";
import { getProductById } from "@/application/usecases/sellerDashboard/products/getProductById";
import ImageHolderSquare from "@/components/ui/custom/ImageHolderSquare";
import { errorMessage, successMessage } from "@/components/ui/custom/Toast";
import { useToast } from "@/hooks/use-toast";
import { addProductOnAuction } from "@/application/usecases/sellerDashboard/products/addProduct";
import useAuth from "@/hooks/use-auth";
import { ROUTES } from "@/application/routing/routes";
import { Label } from "@/components/ui/label";
import CustomDatePicker from "@/components/ui/custom/CustomDatePicker";
import { formatCurrency } from "@/lib/stringUtils";
import { ProductTypeEnum } from "@/domain/enums/ProductTypeEnum";

export default function AddItemOnAuction() {
  const params = useParams();
  const id = params?.id;
  const initialFormData = {
    productName: "",
    category: "",
    pricePerUnit: 0.0,
    buyItNowPrice: 0.0,
    minimumPrice: 0.0,
    stock: 0,
    description: "",
    endTime: "",
  };

  const { showLoader, hideLoader } = useLoader();
  const [formData, setFormData] = useState(initialFormData);
  const [image, setImage] = useState<File | null>(null);
  const [endTime, setEndTime] = useState<{ date: Date | undefined; time: string }>({ date: undefined, time: "12:00" });
  const { toast } = useToast();
  const { buyer_seller_id } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (typeof id === "string") {
        showLoader();
        try {
          const productData = await getProductById(parseInt(id, 10));
          if (productData) {
            setFormData({
              productName: productData.productName ?? "",
              category: productData.category ?? ProductTypeEnum.NO_CATEGORY,
              pricePerUnit: productData.pricePerUnit ? productData.pricePerUnit : 0.0,
              buyItNowPrice: 0.0,
              minimumPrice: 0.0,
              stock: productData.stock ? productData.stock : 0,
              description: productData.description ?? "",
              endTime: "",
            });
            setImage(productData.photo ? new File([], productData.photo) : null);
          }
        } catch (error) {
          console.error("Error fetching product details: ", error);
        } finally {
          hideLoader();
        }
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined, time: string) => {
    setEndTime({ date, time });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      showLoader();

      const body = {
        product_id: typeof id === "string" ? parseInt(id, 10) : 0,
        status: true,
        buy_it_now_price: formData.buyItNowPrice?.toString() || "0.00",
        minimum_price: formData.minimumPrice?.toString() || "0.00",
        end_time: endTime.date ? new Date(`${endTime.date.toISOString().split('T')[0]}T${endTime.time}:00Z`).toISOString() : null,
      };

      const success = await addProductOnAuction(body, buyer_seller_id);

      if (!success) {
        throw new Error("Failed to put product up for auction");
      }

      successMessage(toast, "Product updated successfully");
      setTimeout(() => {
        router.push(ROUTES.SELLER_DASHBOARD);
      }, 3000);
    } catch (error: any) {
      errorMessage(toast, error.message, "Invalid input!");
      console.error("Error updating product: ", error);
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800">
            Put Product Up for Auction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          <div className="flex justify-center mb-6">
            <ImageHolderSquare image={image} />
          </div>

          <div>
            <Label className="block text-lg font-medium text-gray-700">
              Product Name
            </Label>
            <p className="text-gray-800 font-semibold">{formData.productName}</p>
          </div>

          <div>
            <Label className="block text-lg font-medium text-gray-700">
              Category
            </Label>
            <p className="text-gray-800 font-semibold">{formData.category}</p>
          </div>

          
          <div>
            <Label htmlFor="stock" className="block text-lg font-medium text-gray-700">
              Stock Quantity
            </Label>
            <p className="text-gray-800 font-semibold">{formData.stock}</p>
          </div>

          <div>
            <Label htmlFor="stock" className="block text-lg font-medium text-gray-700">
              Normal Price
            </Label>
            <p className="text-gray-800 font-semibold">{formatCurrency(formData.pricePerUnit)}</p>
          </div>

          <div>
            <Label className="block text-lg font-medium text-gray-700 mb-3">Description</Label>
            <p className="text-gray-800 font-semibold">{formData.description}</p>
          </div>

          <div>
            <Label htmlFor="pricePerUnit" className="block text-lg font-medium text-gray-700">
              Starting Price
            </Label>
            <Input
              id="minimumPrice"
              name="minimumPrice"
              type="number"
              value={formData.minimumPrice}
              onChange={handleChange}
              placeholder="Enter starting price"
              required
            />
          </div>

          <div>
            <Label htmlFor="buyItNowPrice" className="block text-lg font-medium text-gray-700 mb-1">
              Buy it now Price
            </Label>
            <Input
              id="buyItNowPrice"
              name="buyItNowPrice"
              type="number"
              value={formData.buyItNowPrice}
              onChange={handleChange}
              placeholder="Enter desired price"
              required
            />
          </div>

          <div>
            <Label htmlFor="endTime" className="block text-lg font-medium text-gray-700 mb-1">
              Auction End Time
            </Label>
            <CustomDatePicker selectedDate={endTime.date} onDateChange={handleDateChange} />
          </div>

          <Button type="submit" className="w-full py-4 text-lg font-bold" variant="outline" onClick={handleSubmit}>
            Put Product Up for Auction
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
