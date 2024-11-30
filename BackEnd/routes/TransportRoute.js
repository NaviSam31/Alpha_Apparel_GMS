import express from 'express';
import { Transport } from '../models/transportModel.js';

const router = express.Router();

// Route to save a new transport
router.post('/', async (request, response) => {
    try {
        if (
            !request.body.job ||
            !request.body.vehicle ||
            !request.body.vehicleNo ||
            !request.body.driver ||
            !request.body.date ||
            !request.body.time ||
            !request.body.cost ||
            !request.body.destination
        ) {
            return response.status(400).send({
                message: 'Send all required fields: job, vehicle, vehicleNo, driver, date, time, cost, destination',
            });
        }
        const newTransport = {
            job: request.body.job,
            vehicle: request.body.vehicle,
            vehicleNo: request.body.vehicleNo,
            driver: request.body.driver,
            date: request.body.date,
            time: request.body.time,
            cost: request.body.cost,
            destination: request.body.destination,
            approved: false, // Initialize approval status
        };
        const transport = await Transport.create(newTransport);
        return response.status(201).send(transport);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for getting all transportation from the database
router.get('/', async (request, response) => {
    try {
        const transports = await Transport.find({});
        return response.status(200).json({
            count: transports.length,
            data: transports
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for getting one transportation from the database by id
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const transport = await Transport.findById(id);
        return response.status(200).json(transport);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for updating a transportation
router.put('/:id', async (request, response) => {
    try {
        if (
            !request.body.job ||
            !request.body.vehicle ||
            !request.body.vehicleNo ||
            !request.body.driver ||
            !request.body.date ||
            !request.body.time ||
            !request.body.cost ||
            !request.body.destination
        ) {
            return response.status(400).send({
                message: 'job, vehicle, vehicleNo, driver, date, time, cost, destination are required',
            });
        }
        const { id } = request.params;

        const result = await Transport.findByIdAndUpdate(id, request.body, { new: true });

        if (!result) {
            return response.status(404).json({ message: 'Transport not found' });
        }
        return response.status(200).send({ message: 'Transport updated successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for approving a transportation
router.put('/:id/approve', async (request, response) => {
    try {
        const { id } = request.params;

        // Update the approved field to true
        const result = await Transport.findByIdAndUpdate(id, { approved: true }, { new: true });

        if (!result) {
            return response.status(404).json({ message: 'Transport not found' });
        }
        return response.status(200).send({ message: 'Transport approved successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for deleting a transportation
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const result = await Transport.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: 'Transport not found' });
        }

        return response.status(200).send({ message: 'Transport deleted successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;
