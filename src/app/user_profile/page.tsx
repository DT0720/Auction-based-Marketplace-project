"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"; // Adjust import based on your UI library
import { Card } from "@/components/ui/card"; // Adjust import based on your UI library

// Define the Address type
interface Address {
    id: number;
    addressLine: string;
}

// Define the Order type
interface Order {
    id: number;
    status: string; // e.g., "Returned", "Cancelled"
    totalPrice: number;
}

// Define the Review type
interface Review {
    id: number;
    productName: string;
    rating: number; // Assuming a rating out of 5
    comment: string;
}

// Main UserProfile component
const UserProfile: React.FC = () => {
    const [name, setName] = useState<string>('John Doe');
    const [phone, setPhone] = useState<string>('123-456-7890');
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [activeTab, setActiveTab] = useState<string>('profile');

    // Simulated data fetching (replace with actual API calls)
    useEffect(() => {
        const fetchData = async () => {
            // Simulated addresses
            setAddresses([
                { id: 1, addressLine: '123 Main St, Cityville' },
                { id: 2, addressLine: '456 Elm St, Townsville' },
            ]);

            // Simulated orders
            setOrders([
                { id: 101, status: 'Returned', totalPrice: 50 },
                { id: 102, status: 'Cancelled', totalPrice: 30 },
            ]);

            // Simulated reviews
            setReviews([
                { id: 201, productName: 'Product A', rating: 4, comment: 'Great product!' },
                { id: 202, productName: 'Product B', rating: 2, comment: 'Not what I expected.' },
            ]);
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-white flex">
            {/* Navigation Tabs on the Left */}
            <nav className="w-1/4 p-4 border-r border-gray-300">
                <h2 className="text-lg font-bold mb-4">Navigation</h2>
                <Button onClick={() => setActiveTab('profile')} className="w-full mb-2">
                    My Profile
                </Button>
                <Button onClick={() => setActiveTab('addressbook')} className="w-full mb-2">
                    Address Book
                </Button>
                <Button onClick={() => setActiveTab('orders')} className="w-full mb-2">
                    My Orders
                </Button>
                <Button onClick={() => setActiveTab('reviews')} className="w-full">
                    My Reviews
                </Button>
            </nav>

            {/* Content Area */}
            <div className="flex-grow p-4">
                {/* Profile Content */}
                {activeTab === 'profile' && (
                    <div>
                        <h2 className="text-xl font-bold">My Profile</h2>
                        <p>Name: {name}</p>
                        <p>Phone No: {phone}</p>
                        {/* Add more profile fields as needed */}
                    </div>
                )}

                {/* Address Book Content */}
                {activeTab === 'addressbook' && (
                    <div style={{ marginTop: '20px' }}>
                        <h2 className="text-xl font-bold">Address Book</h2>
                        {addresses.length === 0 ? (
                            <p>No addresses available.</p>
                        ) : (
                            addresses.map((address) => (
                                <Card key={address.id} className="mb-2 p-2 border border-gray-300 rounded">
                                    <span>{address.addressLine}</span>
                                </Card>
                            ))
                        )}
                    </div>
                )}

                {/* Orders Content */}
                {activeTab === 'orders' && (
                    <div style={{ marginTop: '20px' }}>
                        <h2 className="text-xl font-bold">My Orders</h2>

                        {/* My Returns Section */}
                        <h3 className="text-lg font-semibold mt-4">My Returns</h3>
                        {orders.filter(order => order.status === 'Returned').length === 0 ? (
                            <p>No returned orders available.</p>
                        ) : (
                            orders.filter(order => order.status === 'Returned').map((order) => (
                                <Card key={order.id} className="mb-2 p-2 border border-gray-300 rounded">
                                    <h4>Order ID: {order.id}</h4>
                                    <p>Status: {order.status}</p>
                                    <p>Total Price: ${order.totalPrice.toFixed(2)}</p>
                                </Card>
                            ))
                        )}

                        {/* My Cancellations Section */}
                        <h3 className="text-lg font-semibold mt-4">My Cancellations</h3>
                        {orders.filter(order => order.status === 'Cancelled').length === 0 ? (
                            <p>No cancelled orders available.</p>
                        ) : (
                            orders.filter(order => order.status === 'Cancelled').map((order) => (
                                <Card key={order.id} className="mb-2 p-2 border border-gray-300 rounded">
                                    <h4>Order ID: {order.id}</h4>
                                    <p>Status: {order.status}</p>
                                    <p>Total Price: ${order.totalPrice.toFixed(2)}</p>
                                </Card>
                            ))
                        )}
                    </div>
                )}

                {/* Reviews Content */}
                {activeTab === 'reviews' && (
                    <div style={{ marginTop: '20px' }}>
                        <h2 className="text-xl font-bold">My Reviews</h2>
                        {reviews.length === 0 ? (
                            <p>No reviews available.</p>
                        ) : (
                            reviews.map((review) => (
                                <Card key={review.id} className="mb-2 p-2 border border-gray-300 rounded">
                                    <h4>{review.productName}</h4>
                                    <p>Rating: {review.rating} / 5</p>
                                    <p>Comment: {review.comment}</p>
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;