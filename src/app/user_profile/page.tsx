"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AddressRepository } from "@/infrastructure/repositories/AddressRepository";
import { OrderRepository } from "@/infrastructure/repositories/OrderRepository";
import { getAddressesByUserId } from "@/application/usecases/profileManagement/addressManagement";
import { Card } from "@/components/ui/card";
import useAuth from "@/hooks/use-auth";
import { getCanceledOrders, getReturnedOrders } from "@/application/usecases/profileManagement/orderManagement";

const UserProfile = () => {
    const [userProfile, setUserProfile] = useState<any>(null); 
    const [addressBook, setAddressBook] = useState<any[]>([]); 
    const [returnedOrders, setReturnedOrders] = useState<any[]>([]); 
    const [cancelledOrders, setCancelledOrders] = useState<any[]>([]); 
    const [reviews, setReviews] = useState<any[]>([]); 
    const {user} = useAuth();

    useEffect(() => {
        // Fetch user profile and address book
        const fetchUserProfile = async () => {
            // Implement your logic to fetch user profile here
            // Example: setUserProfile(await UserRepository.getUserProfile());
        };

        const fetchAddressBook = async () => {
            const addresses = await getAddressesByUserId(user?.user_id ??0);
            setAddressBook(addresses);
        };

        const fetchReturnedOrders = async () => {
            const returned = await getReturnedOrders();
            setReturnedOrders(returned);
        };

        const fetchCanceledOrders = async () => {
            const cancelled = await getCanceledOrders();
            setCancelledOrders(cancelled);
        };

        const fetchReviews = async () => {
            // Implement your logic to fetch reviews here
            // Example: setReviews(await ReviewRepository.getUserReviews());
        };

        fetchUserProfile();
        fetchAddressBook();
        fetchReturnedOrders();
        fetchCanceledOrders();
        fetchReviews();
    }, []);

    return (
        <div className="flex">
            <nav className="w-1/4 bg-gray-100 p-4">
                <h2 className="font-bold text-lg">Navigation</h2>
                <ul>
                    <li><Button variant="link">My Profile</Button></li>
                    <li><Button variant="link">Address Book</Button></li>
                    <li><Button variant="link">My Orders</Button></li>
                    <ul>
                        <li><Button variant="link">My Returns</Button></li>
                        <li><Button variant="link">My Cancellations</Button></li>
                    </ul>
                    <li><Button variant="link">My Reviews</Button></li>
                </ul>
            </nav>

            <main className="w-3/4 p-4">
                {userProfile && (
                    <Card className="mb-4">
                        <h2 className="text-xl font-bold">User Profile</h2>
                        {/* Display user profile details */}
                        <p>Name: {userProfile.name}</p>
                        <p>Email: {userProfile.email}</p>
                        {/* Add more fields as necessary */}
                    </Card>
                )}

                <Card className="mb-4">
                    <h2 className="text-xl font-bold">Address Book</h2>
                    {addressBook.length > 0 ? (
                        addressBook.map((address) => (
                            <div key={address.id}>
                                <p>{address.street}, {address.city}, {address.zip}</p>
                                {/* Add more address details as necessary */}
                            </div>
                        ))
                    ) : (
                        <p>No addresses found.</p>
                    )}
                </Card>

                <Card className="mb-4">
                    <h2 className="text-xl font-bold">My Orders</h2>

                    {/* My Returns Section */}
                    <h3 className="font-semibold mt-4">My Returns</h3>
                    {returnedOrders.length > 0 ? (
                        returnedOrders.map((order) => (
                            <div key={order.id}>
                                <p>Order ID: {order.id} - Status: Returned</p>
                                {/* Add more order details as necessary */}
                            </div>
                        ))
                    ) : (
                        <p>No returned orders found.</p>
                    )}

                    {/* My Cancellations Section */}
                    <h3 className="font-semibold mt-4">My Cancellations</h3>
                    {cancelledOrders.length > 0 ? (
                        cancelledOrders.map((order) => (
                            <div key={order.id}>
                                <p>Order ID: {order.id} - Status: Cancelled</p>
                                {/* Add more order details as necessary */}
                            </div>
                        ))
                    ) : (
                        <p>No cancelled orders found.</p>
                    )}
                </Card>

                {/* My Reviews Section */}
                <Card className="mb-4">
                    <h2 className="text-xl font-bold">My Reviews</h2>
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.id}>
                                <p>Product: {review.productName} - Rating: {review.rating}</p>
                                {/* Add more review details as necessary */}
                            </div>
                        ))
                    ) : (
                        <p>No reviews found.</p>
                    )}
                </Card>
            </main>
        </div>
    );
};

export default UserProfile;