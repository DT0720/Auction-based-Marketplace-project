import { NextResponse } from 'next/server';
import { IAddressRepository } from "@/application/repositories/IAddressRepository"; // Adjust import path based on your project structure
import { AddressRepository } from "@/infrastructure/repositories/AddressRepository"; // Adjust import path based on your project structure
import { Address } from "@/domain/entities/Address"; // Adjust import path based on your project structure

const addressRepository: IAddressRepository = new AddressRepository();

// Handler for adding a new address
export async function POST(req: Request) {
    const { user_id, flat_no, house_no, house_name, road_no, sector, area, city } = await req.json();

    try {
        const newAddress = new Address(0, user_id, flat_no, house_no, house_name, road_no, sector, area, city);
        const createdAddress = await addressRepository.create(newAddress);
        
        return NextResponse.json(createdAddress, { status: 201 }); // Respond with created address
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}

// Handler for updating an existing address
export async function PUT(req: Request) {
    const { id, flat_no, house_no, house_name, road_no, sector, area, city } = await req.json();

    try {
        const existingAddress = await addressRepository.findById(id);
        
        if (!existingAddress) {
            return NextResponse.json({ message: 'Address not found' }, { status: 404 });
        }

        const updatedAddress = new Address(
          id,
          existingAddress.user_id,
          flat_no ?? existingAddress.flat_no,
          house_no ?? existingAddress.house_no,
          house_name ?? existingAddress.house_name,
          road_no ?? existingAddress.road_no,
          sector ?? existingAddress.sector,
          area ?? existingAddress.area,
          city ?? existingAddress.city
      );

      await addressRepository.update(updatedAddress);

      return NextResponse.json({ message: 'Updated successfully' });
      
    } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

// Handler for deleting an address
export async function DELETE(req: Request) {
    const { id } = await req.json();

    try {
        const success = await addressRepository.delete(id);
        
        if (!success) {
            return NextResponse.json({ message: 'Address not found' }, { status: 404 });
        }
        
        return NextResponse.json({ message: 'Successfully deleted' });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}