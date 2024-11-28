import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { couponCode } = req.body;

  if (!couponCode) {
    return res.status(400).json({ error: "Coupon code is required" });
  }

  try {
    // Use findUnique if type is unique, or findFirst otherwise
    const offer = await prisma.offers.findFirst({
      where: { type: couponCode },
    });

    if (!offer) {
      return res.status(404).json({ error: "Invalid coupon code" });
    }

    // Return the discount amount
    return res.status(200).json({
      discountAmount: parseFloat(offer.discount_amount.toString()),
      message: "Discount applied successfully",
    });
  } catch (error) {
    console.error("Error fetching discount:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
