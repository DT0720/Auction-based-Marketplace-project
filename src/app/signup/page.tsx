// src/app/signup/page.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "@/components/ui/select";
import { ToggleGroup,ToggleGroupItem } from "@/components/ui/toggle-group";
import NetworkUtils from "@/lib/networkUtils";
import { ROUTES } from "@/application/routing/routes";
import Link from "next/link";
import { FileStorageService } from "@/infrastructure/services/FileStorageService";
import { useToast } from "@/hooks/use-toast";
import { errorMessage, successMessage } from "@/components/ui/custom/Toast";
import ImageHolder from "@/components/ui/custom/ImageHolder";
import { useLoader } from "@/hooks/use-loader";


export default function SignupPage() {

    const fileStorageService = new FileStorageService();

      const initialFormData = {
        name: "",
        email: "",
        gender: "0", // Default value
        age: "",
        password: "",
        confirmPassword: "",
        phone: "",
        type: "B", // Default type
      };

      const { toast } = useToast();

      const { showLoader, hideLoader } = useLoader();
    
      const [formData, setFormData] = useState(initialFormData);
      const [userRegistrationTypeText, setUserRegistrationTypeText] = useState("Buyer Registration");
      const [image, setImage] = useState<File | null>(null);
    
      const clearForm = () => { 
        setFormData(initialFormData); 
      };

      const handleToggleChange = (value : string) => {
          clearForm();
          setUserRegistrationTypeText(value === "B" ? "Buyer Registration" : "Seller Registration");
          setFormData((prev) => ({ ...prev, type: value }));
      }
      // Handle input changes
      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };
    
      // Handle file input change
      const handleImageUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if(file){
            setImage(file);
        }
      };
    
      // Handle form submission
      const handleSignup = async (event: React.FormEvent) => {
        event.preventDefault();
    
        if (formData.password !== formData.confirmPassword) {
          errorMessage(toast,"Signup failed.", "Passwords do not match!", "Try again");
          return;
        }

        try {

          const endpoint = "/api/users/signup";

          const body = {
            name: formData.name,
            email: formData.email,
            gender: parseInt(formData.gender ?? "0"),
            age: parseInt(formData.age ?? "0"),
            secondaryEmail: null,
            password: formData.password,
            phone: formData.phone,
            type: formData.type,
          };

          showLoader();

          const response = await NetworkUtils.postRequest(endpoint, body);
    
          if (response) {
            await handleImageUpload();

            successMessage(toast, "Redirecting to login page...","Signup Successful!");

            setTimeout(() => (window.location.href = ROUTES.LOGIN), 3000);
          }
        } catch (exception : any) {
          errorMessage(toast, "Signup failed.", exception.message, "Try again");
        }finally{
          hideLoader();
        }
      };

      const handleImageUpload = async () => {

        if (image) {
          const fileName = image?.name ?? "default.jpg";
          const path = `uploads/${fileName}`;
          const photoUrl = await fileStorageService.uploadFile(image != null ? image : undefined, path);
  
          // Update the user profile with the image URL
          await NetworkUtils.postRequest('/api/users/update-profile', {
            email: formData.email,
            photo: photoUrl,
          });
        }
      }

      return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
          {/* Toggle Options */}
          <div className="w-full max-w-md">
            <ToggleGroup
                  type="single"
                  variant="outline"
                  value={formData.type}
                  onValueChange={(value) => {
                      if (value) {
                          handleToggleChange(value);
                      }
                  }}
                  className="w-full mb-4 mt-2"
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
          </div>

          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
            <div>
              <h1 className="text-2xl font-semibold text-center mb-4">{userRegistrationTypeText}</h1>
            </div>
              <div className="flex justify-center relative mb-4">
                <ImageHolder image={image} handleImageUpdate={handleImageUpdate} />
              </div>
          {/* Form Section */}
            <form onSubmit={handleSignup}>
    
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
