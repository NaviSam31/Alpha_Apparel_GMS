import express from 'express';
import { Inventory } from '../models/bookModels.js';

const router = express.Router();

// Helper function to generate item code
const generateItemCode = async () => {
    let itemCode;
    let existingItem;

    do {
        // Generate a random 6-digit number and prepend "IT"
        const randomNumbers = Math.floor(100000 + Math.random() * 900000);
        itemCode = `IT${randomNumbers}`;

        // Check if itemCode already exists
        existingItem = await Inventory.findOne({ itemCode });
    } while (existingItem); // Repeat if code is not unique

    return itemCode;
};

// Route for saving a new inventory item
router.post('/', async (req, res) => {
    try {
        const { productName, productCategory, productDescription, Quantity, MinQuantity, unit, price } = req.body;
        if (!productName || !productCategory || !productDescription || !Quantity || !MinQuantity || !unit || !price) {
            return res.status(400).send({
                message: 'Send all required fields: productName, productCategory, productDescription, Quantity, MinQuantity, unit, price',
            });
        }

        // Generate unique itemCode
        const itemCode = await generateItemCode();

        const newItem = { itemCode, productName, productCategory, productDescription, Quantity, MinQuantity, unit, price };
        const inventory = await Inventory.create(newItem);
        return res.status(201).send(inventory);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route for getting all inventory items
router.get('/', async (req, res) => {
    try {
        const inventory = await Inventory.find({});
        return res.status(200).json({
            count: inventory.length,
            data: inventory,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route for getting one inventory item by itemCode
router.get('/:itemCode', async (req, res) => {
    try {
        const { itemCode } = req.params;
        const inventory = await Inventory.findOne({ itemCode });

        if (!inventory) {
            return res.status(404).json({ message: 'Item not found' });
        }

        return res.status(200).json(inventory);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route to update an inventory item
router.put('/:itemCode', async (req, res) => {
    try {
        const { itemCode } = req.params;
        const updateData = req.body;
        const result = await Inventory.findOneAndUpdate({ itemCode }, updateData, { new: true });

        if (!result) {
            return res.status(404).json({ message: 'Item not found' });
        }
        return res.status(200).send({ message: 'Item updated successfully' });

    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route for deleting an inventory item
router.delete('/:itemCode', async (req, res) => {
    try {
        const { itemCode } = req.params;
        const result = await Inventory.findOneAndDelete({ itemCode });

        if (!result) {
            return res.status(404).json({ message: 'Item not found' });
        }

        return res.status(200).send({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

export default router;
