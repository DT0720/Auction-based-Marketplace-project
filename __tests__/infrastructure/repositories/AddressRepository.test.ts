import { Address } from '@/domain/entities/Address'; // Adjust import based on your project structure
import { AddressRepository } from '@/infrastructure/repositories/AddressRepository'; // Adjust import based on your project structure

describe('AddressRepository', () => {
    let addressRepository: AddressRepository;

    beforeEach(() => {
        addressRepository = new AddressRepository(); 
    });

    it('should create a new address', async () => {
        // Arrange
        const mockAddress = {
            user_id: 11,
            flat_no: 'A-101',
            house_no: '10',
            road_no: '5',
            sector: 2,
            area: 'Downtown',
            city: 'Metropolis',
            house_name: 'Green Villa'
        };

        // Act
        const createdAddress = await addressRepository.create(Address.fromJSON(mockAddress));
        
        // Assert
        expect(createdAddress).not.toBeNull();
        if (createdAddress !=null){
            expect(createdAddress.user_id).toBe(mockAddress.user_id);
            expect(createdAddress.flat_no).toBe(mockAddress.flat_no);
        }
    });

    it('should update an existing address', async () => {
        // Arrange
        const mockAddress = {
            user_id: 11,
            flat_no: 'A-101',
            house_no: '10',
            road_no: '5',
            sector: 2,
            area: 'Downtown',
            city: 'Metropolis',
            house_name: 'Green Villa'
        };

        const createdAddress = await addressRepository.create(Address.fromJSON(mockAddress));

        // Update details
        const updatedData = {
            ...createdAddress,
            flat_no: 'B-202' // Change flat number
        };

        // Act
        const success = await addressRepository.update(Address.fromJSON(updatedData));

        // Assert
        expect(success).toBe(true);
        if (createdAddress !=null){
            const updatedAddress = await addressRepository.findById(createdAddress.id);
            expect(updatedAddress).not.toBeNull();
            if(updatedAddress !=null){
                expect(updatedAddress.flat_no).toBe('B-202'); 
            }
        }  
    });

    it('should delete an existing address', async () => {
        // Arrange
        const mockAddress = {
            user_id: 11,
            flat_no: 'A-101',
            house_no: '10',
            road_no: '5',
            sector: 2,
            area: 'Downtown',
            city: 'Metropolis',
            house_name: 'Green Villa'
        };

        const createdAddress = await addressRepository.create(Address.fromJSON(mockAddress));

        // Act
        if (createdAddress !=null){
            const success = await addressRepository.delete(createdAddress.id);
            // Assert
            expect(success).toBe(true);
            if (createdAddress !=null){
                const deletedAddress = await addressRepository.findById(createdAddress.id);
                expect(deletedAddress).toBeNull(); // Ensure that the address no longer exists
            }
        } 
    });
});