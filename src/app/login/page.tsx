'use client'

import { ROUTES } from "@/application/routing/routes";
import useLogin from "@/application/usecases/userAuth/useLogin";
import { Button } from "@/components/ui/button";
import { errorMessage, successMessage } from "@/components/ui/custom/Toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/use-auth";
import { useLoader } from "@/hooks/use-loader";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage(){

    const initialFormData = {
        name: "",
        email: "",
        gender: "0", // Default value
        age: "",
        password: "",
        confirmPassword: "",
        phone: "",
        image: null as File | null,
        type: "B", // Default type
      };
    
      const [formData, setFormData] = useState(initialFormData);
      const { toast } = useToast();
      const { showLoader, hideLoader } = useLoader();
      const { login } = useAuth();

      // Handle input changes
      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };
    
      // Handle form submission
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        const body = {
          email: formData.email,
          password: formData.password,
        };

        try {
          showLoader();
          const data = await useLogin(body);

          console.log("Buyer Seller Id: " + data.buyer_seller_id);

          if(data != null){
            successMessage(toast, "Login successful!", "You have been logged in successfully.");
            setTimeout(() => {
              login(data.token, data.user, data.credit, data.buyer_seller_id);
              window.location.href = data.user.type.toLocaleLowerCase() === "b" 
                  ? ROUTES.BUYER_DASHBOARD 
                  : ROUTES.SELLER_DASHBOARD;
            }, 3000);
          }
        } catch (error: any) {
          errorMessage(toast, "Login failed.", error.message, "Try again");
        }finally{
          hideLoader();
        }
      };


      return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
          {/* Form Container */}
          <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
            {/* Title */}
            <h1 className="text-2xl font-bold text-center text-gray-800 mt-4">Login</h1>
      
            <form onSubmit={handleLogin}>
      
              {/* Form Fields */}
              <div className="grid gap-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
      
              {/* Submit Button */}
              <div className="mt-8">
                <Button type="submit" className="w-full py-3 text-lg">
                  Login
                </Button>
              </div>
      
              {/* Redirect to Signup */}
              <div className="mt-4 text-center">
                <span className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link href={ROUTES.SIGNUP} className="text-blue-500 underline">
                    Signup
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      );
      
}