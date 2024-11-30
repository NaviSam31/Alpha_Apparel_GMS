import express from 'express';
import { Vehicle } from '../models/vehicleModel.js';

const router = express.Router();

// Route to save a new a vehicle
router.post('/', async (request, response) => {
    try {
        if (
            !request.body.year ||
            !request.body.model||
            !request.body.vehicle||
            !request.body.vehicleNo||
            !request.body.renteredCompany||
            !request.body.rentalFee||
            !request.body.capacity||
            !request.body.description

        ) {
            return response.status(400).send({
                message: 'Send all required fields: year, model, vehicle,vehicleNo,renteredCompany,rentalFee,capacity,description',
            });
        }
        const newVehicle = {
            year: request.body.year,
            model: request.body.model,
            vehicle: request.body.vehicle,
            vehicleNo: request.body.vehicleNo,
            renteredCompany: request.body.renteredCompany,
            rentalFee: request.body.rentalFee,
            capacity: request.body.capacity,
            description: request.body.description ,
        };
        const vehicle = await Vehicle.create(newVehicle);
        return response.status(201).send(vehicle);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//Route for get all vehicle from database
router.get('/', async (request, response) => {
    try {
        const vehicles = await Vehicle.find({});
        return response.status(200).json({
            count: vehicles.length,
            data: vehicles
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//Route for get one vehicle from database by id
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const vehicle = await Vehicle.findById(id);
        return response.status(200).json(vehicle);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//Route for update a vehicle
router.put('/:id', async (request, response) => {
    try {
        if (
            !request.body.year ||
            !request.body.model||
            !request.body.vehicle||
            !request.body.vehicleNo||
            !request.body.renteredCompany||
            !request.body.rentalFee||
            !request.body.capacity||
            !request.body.description
        ) {
            return response.status(400).send({
                message: 'year, model, vehicle,vehicleNo,renteredCompany,rentalFee,capacity,description',
            });
        }
        const { id } = request.params;

        const result = await Vehicle.findByIdAndUpdate(id, request.body);

        if (!result) {
            return response.status(404).json({ message: 'Vehicle not found' });
        }
        return response.status(200).send({ message: 'Vehicle updated successfully' });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});


//Route for delete a vehicle
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const result = await Vehicle.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: 'Vehicle not found' });
        }

        return response.status(200).send({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;