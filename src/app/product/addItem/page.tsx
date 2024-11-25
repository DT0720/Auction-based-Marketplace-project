'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ProductTypeEnum } from "@/domain/enums/ProductTypeEnum";
import { useLoader } from "@/hooks/use-loader";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/use-auth";
import { errorMessage, successMessage } from "@/components/ui/custom/Toast";
import { ROUTES } from "@/application/routing/routes";
import {addProduct, addProductToSellerInventory} from "@/application/usecases/sellerDashboard/products/addProduct";
import ImageHolderSquare from "@/components/ui/custom/ImageHolderSquare";

export default function AddProductForm() {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const [image, setImage] = useState<File | null>(null);

  const { showLoader, hideLoader } = useLoader();
  const { toast } = useToast();

  const { buyer_seller_id } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleCategoryChange = (value: string) => {
    setProductData({ ...productData, category: value });
  };

  const handleImageUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if(file){
        setImage(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const body = {
        product_name: productData.name,
        stock: parseInt(productData.stock),
        price_per_unit: parseFloat(productData.price),
        category: productData.category,
        description: productData.description,
      };

      console.log(body);

      showLoader();

      const product = await addProduct(body, image, buyer_seller_id);

      if (!product) {
        throw new Error("Failed to add product.");
      }

      if (product) {
        successMessage(toast, "Redirecting to dashboard...","Product Added Successfully!");
        showLoader();
        setTimeout(() => {
            window.location.href = ROUTES.SELLER_DASHBOARD
            hideLoader();
        }, 3000);
      }
    } catch (exception : any) {
      errorMessage(toast, "Failed to add product.", exception.message, "Try again");
    }finally{
      hideLoader();
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-24 p-10 bg-white rounded-lg shadow-md">
      <div className="flex justify-center mb-8">
        <ImageHolderSquare image={image} handleImageUpdate={handleImageUpdate} />
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={productData.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            className="mt-2"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={productData.description}
            onChange={handleInputChange}
            placeholder="Enter product description"
            className="mt-2 h-32"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              type="number"
              id="price"
              name="price"
              value={productData.price}
              onChange={handleInputChange}
              placeholder="Enter product price"
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input
              type="number"
              id="stock"
              name="stock"
              value={productData.stock}
              onChange={handleInputChange}
              placeholder="Enter stock quantity"
              className="mt-2"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select onValueChange={handleCategoryChange}>
            <SelectTrigger id="category" className="mt-2">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ProductTypeEnum).map(([key, value]) => (
                <SelectItem key={key} value={key}>{value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSubmit} className="w-full py-3 text-lg mt-8">
          Add Product
        </Button>
      </form>
    </div>
  );
}

