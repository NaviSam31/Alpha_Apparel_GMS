import express from 'express';
import { Train } from '../models/trainmodel.js'; // Adjust the import path as necessary

const router = express.Router();


router.post('/', async (req, res) => {
    try {
        const newTrain = new Train(req.body);
        const savedTrain = await newTrain.save();
        res.status(201).json(savedTrain);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all training records
router.get('/', async (req, res) => {
    try {
        const trains = await Train.find();
        res.status(200).json(trains);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific training record by ID
router.get('/:id', async (req, res) => {
    try {
        const train = await Train.findById(req.params.id);
        if (!train) return res.status(404).json({ message: 'Train not found' });
        res.status(200).json(train);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a specific training record by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedTrain = await Train.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTrain) return res.status(404).json({ message: 'Train not found' });
        res.status(200).json(updatedTrain);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a specific training record by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedTrain = await Train.findByIdAndDelete(req.params.id);
        if (!deletedTrain) return res.status(404).json({ message: 'Train not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
