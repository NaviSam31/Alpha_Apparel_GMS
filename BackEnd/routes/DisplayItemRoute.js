import express from 'express';
import { DisplayItem } from '../models/DisplayItemModel.js'; // Import DisplayItem model
import { Inventory } from '../models/bookModels.js'; // Import Inventory model to fetch itemCode
import upload from '../multer/multerConfig.js'; // Multer for file uploads

const router = express.Router();

// Create a new Display Item
router.post('/', upload.single('image'), async (req, res) => { // Added async here
    const { itemCode, productName, productDescription, unit, price } = req.body;
    const image = req.file; // Extract image from req.file
    console.log('Received:', { itemCode, productName, productDescription, unit, price });

    try {
        // Ensure itemCode is provided
        if (!itemCode) {
            return res.status(400).json({ message: 'Item code is required.' });
        }

        // Check if itemCode already exists in DisplayItem
        const existingItem = await DisplayItem.findOne({ itemCode }); // Added await here
        if (existingItem) {
            return res.status(400).json({ message: 'Item code already exists.' });
        }

        // Fetch Quantity from Inventory for the itemCode
        const inventoryItem = await Inventory.findOne({ itemCode });
        if (!inventoryItem) {
            return res.status(404).json({ message: 'Item not found in inventory' });
        }

        // Create a new Display Item
        const newItem = new DisplayItem({
            itemCode,
            productName,
            productDescription, // Include productDescription
            unit,
            price,
            image: image ? { data: image.buffer, contentType: image.mimetype } : undefined // Check if image exists
        });

        // Save the new item to the database
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        console.error('Error creating display item:', error.stack);
        res.status(500).json({ message: 'Error creating display item: ' + error.message }); // Improved error message
    }
});

// Get all Display Items
router.get('/', async (req, res) => {
    try {
        const items = await DisplayItem.find();
        const formattedItems = items.map(item => {
            const imageUrl = item.image && item.image.data && item.image.contentType
                ? `data:${item.image.contentType};base64,${item.image.data.toString('base64')}`
                : null;
            return { ...item.toObject(), image: imageUrl };
        });

        res.status(200).json(formattedItems);
    } catch (error) {
        console.error('Error fetching display items:', error.stack);
        res.status(500).json({ message: 'Error fetching display items: ' + error.message }); // Improved error message
    }
});

// Get a Display Item by itemCode
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const item = await DisplayItem.findById(id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        const imageUrl = item.image
            ? `data:${item.image.contentType};base64,${item.image.data.toString('base64')}`
            : null;

        res.status(200).json({ ...item.toObject(), image: imageUrl });
    } catch (error) {
        console.error('Error fetching display item:', error);
        res.status(500).json({ message: 'Internal Server Error: ' + error.message });
    }
});


// Update a Display Item by itemCode
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { productName, productDescription, unit, price } = req.body;
        const image = req.file;

        // Find the display item by ID
        const item = await DisplayItem.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Update item fields
        item.productName = productName;
        item.productDescription = productDescription;
        item.unit = unit;
        item.price = price;

        // Update the image if a new one is uploaded
        if (image) {
            item.image = {
                data: image.buffer,
                contentType: image.mimetype,
            };
        }

        // Save updated item
        const updatedItem = await item.save();
        res.status(200).json(updatedItem);
    } catch (error) {
        console.error('Error updating display item:', error.stack);
        res.status(500).json({ message: 'Error updating display item: ' + error.message });
    }
});


// Delete a Display Item by itemCode
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const results = await DisplayItem.findByIdAndDelete(id);

        if (!results) {
            return response.status(404).json({ message: 'Item not found!' });
        }

        return response.status(200).send({ message: 'Display item deleted successfully!' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;
