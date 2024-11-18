// src/app/signup/page.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ToggleGroup,ToggleGroupItem } from "@/components/ui/toggle-group";
import NetworkUtils from "@/lib/networkUtils";
import { ROUTES } from "@/application/routing/routes";
import Link from "next/link";


export default function SignupPage() {

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
    
      const clearForm = () => { 
        setFormData(initialFormData); 
        setError(null);
        setSuccessMessage(null);
    };

    const handleToggleChange = (value : string) => {
        clearForm();
        setFormData((prev) => ({ ...prev, type: value }));
    }
      // Handle input changes
      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };
    
      // Handle file input change
      const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if(file){
            setFormData((prev) => ({ ...prev, image: file }));
        }
      };
    
      // Handle form submission
      const handleSignup = async (event: React.FormEvent) => {
        event.preventDefault();
    
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match!");
          return;
        }
    
        const endpoint = "/api/users/signup";

        const body = {
          name: formData.name,
          email: formData.email,
          gender: parseInt(formData.gender ?? "0"),
          age: parseInt(formData.age ?? "0"),
          secondaryEmail: null,
          password: formData.password,
          phone: formData.phone,
          photo: formData.image,
          type: formData.type,
        };

        try {
          const response = await NetworkUtils.postRequest(endpoint, body);
    
          if (response) {
            if(error) setError(null);
            setSuccessMessage("Signup successful! Please login.");
            setTimeout(() => (window.location.href = ROUTES.LOGIN), 1000);
          }
        } catch (error) {
          setError("Signup failed. Please try again.");
        }
      };

    
      return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
          {/* Toggle Options */}
 
          {/* Form Section */}
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
           
            <form onSubmit={handleSignup}>
              {/* Avatar with File Upload */}
            <ToggleGroup
                type="single"
                variant="outline"
                value={formData.type}
                onValueChange={(value) => {
                    if (value) {
                        handleToggleChange(value);
                    }
                }}
                className="w-full mb-6 mt-2"
                >
                <ToggleGroupItem
                    value="B"
                    className="flex-1 py-5 text-lg font-medium">
                    Buyer Registration
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="S"
                    className="flex-1 py-5 text-lg font-medium">
                    Seller Registration
                </ToggleGroupItem>
            </ToggleGroup>

              <div className="flex justify-center relative">
                <label htmlFor="image-upload" className="cursor-pointer">
                <Avatar className="h-24 w-24">
                    {formData.image ? (
                    <AvatarImage
                        src={URL.createObjectURL(formData.image)}
                        alt="User Avatar"
                    />
                    ) : (
                    <AvatarImage
                        alt="User Avatar"
                    />
                    )}
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                  <Input
                    id="image-upload"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

               {/* Error or Success Messages */}
                {!error && !successMessage && <div className="text-white mb-4">H</div>}
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
    
              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
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
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    type="password"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
    
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    type="number"
                    placeholder="Enter your age"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="tel"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
    
              <div className="mt-6">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Male</SelectItem>
                    <SelectItem value="1">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
    
              <div className="mt-8">
                <Button type="submit" className="w-full py-3 text-lg">
                  Register
                </Button>
              </div>
                <div className="mt-4 text-center">
                    <span className="text-sm text-gray-600">
                    Already have an account?{" "}
                        <Link href={ROUTES.LOGIN} className="text-blue-500 underline">
                            Login
                        </Link>
                    </span>
                </div>
            </form>
          </div>
        </div>
      );
  }
