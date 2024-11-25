'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ProductTypeEnum } from "@/domain/enums/ProductTypeEnum";
import { useState, useEffect } from "react";
import { useLoader } from "@/hooks/use-loader";
import { useParams, useRouter } from "next/navigation";
import { getProductById } from "@/application/usecases/sellerDashboard/products/getProductById";
import ImageHolderSquare from "@/components/ui/custom/ImageHolderSquare";
import { errorMessage, successMessage } from "@/components/ui/custom/Toast";
import { useToast } from "@/hooks/use-toast";
import { addProductOnSale } from "@/application/usecases/sellerDashboard/products/addProduct";
import useAuth from "@/hooks/use-auth";
import { ROUTES } from "@/application/routing/routes";

export default function AddItemOnSale() {
  const params = useParams();
  const id = params?.id;
  const initialFormData = {
    productName: "",
    category: "",
    pricePerUnit: 0.00,
    quantity_for_sale: 0,
    stock: 0,
    description: "",
  };

  const { showLoader, hideLoader } = useLoader();
  const [formData, setFormData] = useState(initialFormData);
  const [image, setImage] = useState<File | null>(null);
  const { toast } = useToast();
  const { buyer_seller_id } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (typeof id === 'string') {
        showLoader();
        try {
          const productData = await getProductById(parseInt(id, 10));
          if (productData) {
            setFormData({
              productName: productData.productName ?? "",
              category: productData.category ?? ProductTypeEnum.NO_CATEGORY,
              pricePerUnit: productData.pricePerUnit ? productData.pricePerUnit: 0.00,
              quantity_for_sale: 0,
              stock: productData.stock ? productData.stock: 0,
              description: productData.description ?? "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        showLoader();

        const body = {
            product_id: id,
            productName: formData.productName,
            category: formData.category,
            pricePerUnit: formData.pricePerUnit,
            quantity_for_sale: typeof formData.quantity_for_sale === "string"
            ? parseInt(formData.quantity_for_sale, 10)
            : formData.quantity_for_sale,
            stock: formData.stock,
            description: formData.description,
        };

        await addProductOnSale(body, buyer_seller_id);

        successMessage(toast, "Product updated successfully");
        setTimeout(() => {router.push(ROUTES.SELLER_DASHBOARD)}, 3000);
        
    } catch (error : any) {
        errorMessage(toast, "Error updating product: ", error.message);
        console.error("Error updating product: ", error);
    } finally {
        hideLoader();
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white border border-gray-300 rounded-lg shadow-md p-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Update Product for Sale</h1>
        <div className="flex justify-center relative mb-6">
          <ImageHolderSquare image={image}/>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="productName" className="block text-lg font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <Input
              id="productName"
              name="productName"
              value={formData.productName}
              placeholder="Enter product name"
              required
              readOnly
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-lg font-medium text-gray-700 mb-1">
              Category
            </label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ProductTypeEnum).map(([key, value]) => (
                  <SelectItem key={key} value={value}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="pricePerUnit" className="block text-lg font-medium text-gray-700 mb-1">
              Price per Unit
            </label>
            <Input
              id="pricePerUnit"
              name="pricePerUnit"
              type="number"
              value={formData.pricePerUnit}
              onChange={handleChange}
              placeholder="Enter price per unit"
              required
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-lg font-medium text-gray-700 mb-1">
              Stock Quantity
            </label>
            <Input
              id="stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Enter available stock"
              required
              readOnly
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-lg font-medium text-gray-700 mb-1">
              Number of items to put on sale
            </label>
            <Input
              id="quantity_for_sale"
              name="quantity_for_sale"
              type="number"
              value={formData.quantity_for_sale}
              onChange={handleChange}
              placeholder="Enter number of items to put on sale"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-3">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              required
              className="h-40"
            />
          </div>

          <Button type="submit" className="w-full py-4 text-lg font-bold" variant="outline">
            Update Product for Sale
          </Button>
        </form>
      </div>
    </div>
  );
}
