"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AddressRepository } from "@/infrastructure/repositories/AddressRepository";
import { getAddressesByUserId, createAddress, updateAddress, deleteAddress } from "@/application/usecases/profileManagement/addressManagement";
import { OrderRepository } from "@/infrastructure/repositories/OrderRepository";
import { findByBuyerId } from "@/application/usecases/profileManagement/orderManagement";
import { Card } from "@/components/ui/card";
import useAuth from "@/hooks/use-auth";
import { Toast } from "@/components/ui/toast";
import { UserRepository } from "@/infrastructure/repositories/UserRepository";
import { Address } from "@/domain/entities/Address";
import { Order } from "@/domain/entities/Order";
import { user } from "@prisma/client";
import { OrderStatusEnum } from "@/domain/enums/OrderStatusEnum";

const userProfile: React.FC = () => {
  const [user, setUser] = useState<user | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});
  const [orders, setOrders] = useState<Order[]>([]); 
  const [canceledOrders, setCanceledOrders] = useState<Order[]>([]);
  const [returnedOrders, setReturnedOrders] = useState<Order[]>([]);
  const [userId, setUserId] = useState<number>(1); // Replace with dynamic user ID
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedAddresses = await getAddressesByUserId(userId);
        setAddresses(fetchedAddresses);

        const fetchedOrders = await findByBuyerId(6);
        setOrders(fetchedOrders);

        // Filter orders by status on the frontend
        setCanceledOrders(fetchedOrders.filter((order) => order.status === OrderStatusEnum.Cancelled));
        setReturnedOrders(fetchedOrders.filter((order) => order.status === OrderStatusEnum.Returned));
      } catch (error: any) {
        setError(error.message || "Failed to fetch addresses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [userId]);

  const handleCreateAddress = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (newAddress) {
        const createdAddress = await createAddress(newAddress as Address);
        if (createdAddress) {
          setAddresses((prev) => [...prev, createdAddress]);
        }
      }
    } catch (error: any) {
      setError(error.message || "Failed to create address");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAddress = async (updatedAddress: Address) => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await updateAddress(updatedAddress);
      if (success) {
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === updatedAddress.id ? updatedAddress : addr
          )
        );
      }
    } catch (error: any) {
      setError(error.message || "Failed to update address");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await deleteAddress(addressId);
      if (success) {
        setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
      }
    } catch (error: any) {
      setError(error.message || "Failed to delete address");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <main className="p-6 w-full max-w-4xl bg-white rounded-lg shadow-md">
        {/* User Profile Section */}
        {user && (
          <Card className="mb-6 p-4 border border-gray-300 rounded">
            <h2 className="text-2xl font-bold mb-2">User Profile</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>Gender:</strong> {user.gender === 1 ? "Male" : "Female"}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Secondary Email:</strong> {user.secondary_email || "N/A"}</p>
          </Card>
        )}

        {/* Address Book Section */}
        <Card className="mb-6 p-4 border border-gray-300 rounded">
          <h2 className="text-2xl font-bold mb-4">Address Book</h2>
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div key={address.id} className="mb-2">
                <p>
                  {address.flat_no}, {address.house_no}, {address.house_name}, {address.road_no}, {address.sector}, {address.area}, {address.city}
                </p>
                <button onClick={() => handleUpdateAddress(address)} className="mr-2 text-blue-500 hover:underline">Edit</button>
                <button onClick={() => handleDeleteAddress(address.id)} className="text-red-500 hover:underline">Delete</button>
              </div>
            ))
          ) : (
            <p>No addresses found.</p>
          )}

          <h3 className="font-semibold mt-6 mb-2">Add New Address</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateAddress();
            }}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Flat No"
              value={newAddress.flat_no || ""}
              onChange={(e) => setNewAddress({ ...newAddress, flat_no: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="House No"
              value={newAddress.house_no || ""}
              onChange={(e) => setNewAddress({ ...newAddress, house_no: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="House Name"
              value={newAddress.house_name || ""}
              onChange={(e) => setNewAddress({ ...newAddress, house_name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Road"
              value={newAddress.road_no || ""}
              onChange={(e) => setNewAddress({ ...newAddress, road_no: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
            type="number" // Change the input type to number for integer input
            placeholder="Sector"
            value={newAddress.sector || ""} // Default to an empty string if undefined
            onChange={(e) =>
            setNewAddress({ ...newAddress, sector: parseInt(e.target.value) || 0 })
            } // Parse the input as an integer
            className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Area"
              value={newAddress.area || ""}
              onChange={(e) => setNewAddress({ ...newAddress, area: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="City"
              value={newAddress.city || ""}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <Button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Add Address</Button>
          </form>
        </Card>

        {/* My Returns Section */}
        <Card className="mb-6 p-4 border border-gray-300 rounded">
          <h2 className="text-2xl font-bold mb-2">My Returns</h2>
          {returnedOrders.length > 0 ? (
            returnedOrders.map((order) => (
              <div key={order.id} className="mb-2">
                <p><strong>Order ID:</strong> {order.id} - <strong>Status:</strong> {order.status}</p>
              </div>
            ))
          ) : (
            <p>No returned orders found.</p>
          )}
        </Card>

        {/* My Cancellations Section */}
        <Card className="p-4 border border-gray-300 rounded">
          <h2 className="text-2xl font-bold mb-2">My Cancellations</h2>
          {canceledOrders.length > 0 ? (
            canceledOrders.map((order) => (
              <div key={order.id} className="mb-2">
                <p><strong>Order ID:</strong> {order.id} - <strong>Status:</strong> {order.status}</p>
              </div>
            ))
          ) : (
            <p>No canceled orders found.</p>
          )}
        </Card>
      </main>
    </div>
  );
};
export default userProfile;
