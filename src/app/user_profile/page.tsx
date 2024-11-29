"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AddressRepository } from "@/infrastructure/repositories/AddressRepository";
import { OrderRepository } from "@/infrastructure/repositories/OrderRepository";
import { Card } from "@/components/ui/card";
import useAuth from "@/hooks/use-auth";
import { Toast } from "@/components/ui/toast";
import { UserRepository } from "@/infrastructure/repositories/UserRepository";

// Helper Functions
const showLoader = () => console.log("Loading...");
const hideLoader = () => console.log("Loading finished.");
const successMessage = (toast: any, message: string) =>
  toast({ variant: "success", description: message });
const errorMessage = (toast: any, title: string, message: string, action: string) =>
  toast({ variant: "error", title, description: message, action });

//Functions for address management
const createAddress = async (address: any, userId: number) => { 
  try { 
    const body = { user_id: userId, ...address }; 
    showLoader(); 
    const newAddress = await AddressRepository.create(body); 
    if (!newAddress) throw new Error("Failed to add address."); 
    successMessage(Toast, "Address Added Successfully!"); 
    return newAddress; 
  } catch (exception: any) { 
    errorMessage(Toast, "Failed to add address.", exception.message, "Try again"); 
  } finally { hideLoader(); } 
};

const deleteAddress = async (addressId: number) => { 
  try { 
    showLoader(); 
    const deleted = await AddressRepository.delete(addressId); 
    if (!deleted) throw new Error("Failed to delete address."); 
    successMessage(Toast, "Address Deleted Successfully!"); 
    return deleted; 
  } catch (exception: any) { 
    errorMessage(Toast, "Failed to delete address.", exception.message, "Try again"); 
  } finally { hideLoader(); } 
};

const updateAddress = async (addressId: number, updatedAddress: any) => { 
  try { 
    const body = { ...updatedAddress }; 
    showLoader(); 
    const updated = await AddressRepository.update(addressId, body); 
    if (!updated) throw new Error("Failed to update address."); 
    successMessage(Toast, "Address Updated Successfully!"); 
    return updated; 
  } catch (exception: any) { 
    errorMessage(Toast, "Failed to update address.", exception.message, "Try again"); 
  } finally { hideLoader(); } 
};

const findAddressesByUserId = async (userId: number) => { 
  try { 
    showLoader(); 
    const addresses = await AddressRepository.findByUserId(userId); 
    if (!addresses) throw new Error("No addresses found."); 
    return addresses; 
  } catch (exception: any) { 
    errorMessage(Toast, "Failed to fetch addresses.", exception.message, "Try again"); 
  } finally { hideLoader(); } 
};

//Functions for Order Management
const findReturnedOrders = async () => {
  try {
    showLoader();

    const returnedOrders = await OrderRepository.findReturnedOrders();

    if (!returnedOrders) {
      throw new Error("No returned orders found.");
    }

    return returnedOrders;
  } catch (exception: any) {
    errorMessage(Toast, "Failed to fetch returned orders.", exception.message, "Try again");
  } finally {
    hideLoader();
  }
};

const findCanceledOrders = async () => {
  try {
    showLoader();

    const canceledOrders = await OrderRepository.findCanceledOrders();

    if (!canceledOrders) {
      throw new Error("No canceled orders found.");
    }

    return canceledOrders;
  } catch (exception: any) {
    errorMessage(Toast, "Failed to fetch canceled orders.", exception.message, "Try again");
  } finally {
    hideLoader();
  }
};

// UserProfile Component
const UserProfile = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [addressBook, setAddressBook] = useState<any[]>([]);
  const [returnedOrders, setReturnedOrders] = useState<any[]>([]);
  const [cancelledOrders, setCancelledOrders] = useState<any[]>([]);
  const [newAddress, setNewAddress] = useState({ flat_no: "", house_no: "", house_name: "", road_no: "", sector: "", area: "", city: "" });
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      if (user?.user_id) {
        // Fetch user profile logic here
        try {
          const response = await fetch(`/api/users/user-profile{user.user_id}`);
          if (!response.ok) throw new Error('Failed to fetch user profile');
          const profileData = await response.json();
          setUserProfile(profileData);
      } catch (error) {
          console.error(error);
      }
         // Fetch address book
        const addresses = await findAddressesByUserId(user.user_id);
        setAddressBook(addresses);

        //Fetch returned orders
        const returned = await findReturnedOrders();
        setReturnedOrders(returned);

        // Fetch canceled orders
        const canceled = await findCanceledOrders();
        setCancelledOrders(canceled);
      }
    };

    loadData();
  }, [user?.user_id]);

  const handleAddAddress = async () => {
    const newAddr = await createAddress(newAddress, user?.user_id ?? 0);
    if (newAddr) {
      setAddressBook([...addressBook, newAddr]);
      setNewAddress({ flat_no: "", house_no: "", house_name: "", road_no: "", sector: "", area: "", city: "" }); // Reset form
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    const deleted = await deleteAddress(addressId);
    if (deleted) {
      setAddressBook(addressBook.filter((addr) => addr.id !== addressId));
    }
  };

  const handleUpdateAddress = async () => {
    if (editingAddress) {
      const updated = await updateAddress(editingAddress.id, newAddress);
      if (updated) {
        setAddressBook(
          addressBook.map((addr) =>
            addr.id === editingAddress.id ? updated : addr
          )
        );
        setEditingAddress(null);
        setNewAddress({ flat_no: "", house_no: "", house_name: "", road_no: "", sector: "", area: "", city: "" }); // Reset form
      }
    }
  };

  const startEditing = (address: any) => {
    setEditingAddress(address);
    setNewAddress(address);
  };
;
return (
  <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <main className="p-6 w-full max-w-4xl bg-white rounded-lg shadow-md">
      {userProfile && (
        <Card className="mb-6 p-4 border border-gray-300 rounded">
          <h2 className="text-2xl font-bold mb-2">User Profile</h2>
          <p><strong>Name:</strong> {userProfile.name}</p>
          <p><strong>Email:</strong> {userProfile.email}</p>
          <p><strong>Age:</strong> {userProfile.age}</p>
          <p><strong>Gender:</strong> {userProfile.gender === 1 ? "Male" : "Female"}</p>
          <p><strong>Phone:</strong> {userProfile.phone}</p>
          <p><strong>Secondary Email:</strong> {userProfile.secondaryEmail || "N/A"}</p>
        </Card>
      )}

      <Card className="mb-6 p-4 border border-gray-300 rounded">
        <h2 className="text-2xl font-bold mb-4">Address Book</h2>
        {addressBook.length > 0 ? (
          addressBook.map((address) => (
            <div key={address.id} className="mb-2">
              <p>
                {address.flat_no}, {address.house_no}, {address.house_name}, {address.road_no}, {address.sector}, {address.area}, {address.city}
              </p>
              <button onClick={() => startEditing(address)} className="mr-2 text-blue-500 hover:underline">Edit</button>
              <button onClick={() => handleDeleteAddress(address.id)} className="text-red-500 hover:underline">Delete</button>
            </div>
          ))
        ) : (
          <p>No addresses found.</p>
        )}

        <h3 className="font-semibold mt-6 mb-2">Add New Address</h3>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Flat No"
            value={newAddress.flat_no}
            onChange={(e) => setNewAddress({ ...newAddress, flat_no: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="House No"
            value={newAddress.house_no}
            onChange={(e) => setNewAddress({ ...newAddress, house_no: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="House Name"
            value={newAddress.house_name}
            onChange={(e) => setNewAddress({ ...newAddress, house_name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Road"
            value={newAddress.road_no}
            onChange={(e) => setNewAddress({ ...newAddress, road_no: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Sector"
            value={newAddress.sector}
            onChange={(e) => setNewAddress({ ...newAddress, sector: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Area"
            value={newAddress.area}
            onChange={(e) => setNewAddress({ ...newAddress, area: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="City"
            value={newAddress.city}
            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <Button onClick={handleAddAddress} className="w-full bg-blue-500 text-white p-2 rounded">Add Address</Button>
        </form>
      </Card>

      <Card className="mb-6 p-4 border border-gray-300 rounded">
        <h2 className="text-2xl font-bold mb-2">My Returns</h2>
        {returnedOrders.length > 0 ? (
          returnedOrders.map((order) => <p key={order.id}>{order.details}</p>)
        ) : (
          <p>No returned orders found.</p>
        )}
      </Card>

      <Card className="p-4 border border-gray-300 rounded">
        <h2 className="text-2xl font-bold mb-2">My Cancellations</h2>
        {cancelledOrders.length > 0 ? (
          cancelledOrders.map((order) => <p key={order.id}>{order.details}</p>)
        ) : (
          <p>No canceled orders found.</p>
        )}
      </Card>
    </main>
  </div>
);

};

export default UserProfile;
