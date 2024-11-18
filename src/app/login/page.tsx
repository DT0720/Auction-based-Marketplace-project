'use client'

import { ROUTES } from "@/application/routing/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NetworkUtils from "@/lib/networkUtils";
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
    
      const [error, setError] = useState<string | null>(null);
      const [successMessage, setSuccessMessage] = useState<string | null>(null);

      // Handle input changes
      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };
    
      // Handle form submission
      const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
    
        // if (formData.password !== formData.confirmPassword) {
        //   setError("Passwords do not match!");
        //   return;
        // }
    
        const endpoint = "/api/users/login";

        const body = {
          email: formData.email,
          password: formData.password,
        };

        try {
          const response = await NetworkUtils.postRequest(endpoint, body);
    
          if (response) {
            if(error) setError(null);
            setSuccessMessage("Login successful! Please login.");
            setTimeout(() => (window.location.href = ROUTES.LOGIN), 1000);
          }
        } catch (error) {
          setError("Login failed" + error);
        }
      };


      return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
          {/* Form Container */}
          <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
            {/* Title */}
            <h1 className="text-2xl font-bold text-center text-gray-800 mt-4">Login</h1>
      
            <form onSubmit={handleLogin}>
              {/* Error or Success Messages */}
              {!error && !successMessage && <div className="text-white">H</div>}
              {error && <div className="text-red-500">{error}</div>}
              {successMessage && <div className="text-green-500">{successMessage}</div>}
      
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