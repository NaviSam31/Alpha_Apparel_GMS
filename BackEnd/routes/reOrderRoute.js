import express from 'express';
import { ReOrder } from '../models/reOrderModel.js'; 
import multer from 'multer'; 
import mongoose from 'mongoose';


const router = express.Router();

// Set up multer for handling image uploads
const storage = multer.memoryStorage(); // Store the image in memory
const upload = multer({ storage: storage });

// POST route - Create a new ReOrder with image upload
router.post('/', upload.single('image'), async (req, res) => {
  console.log('Request body:', req.body);
  console.log('Uploaded file:', req.file);

  try {
    const { Description, Status } = req.body;

    if (!Description || !Status) {
      return res.status(400).json({ message: 'Description and Status are required' });
    }

    const newReOrder = new ReOrder({
      Description,
      Status,
      image: req.file ? { data: req.file.buffer, contentType: req.file.mimetype } : null,
    });

    const createdReOrder = await newReOrder.save();
    res.status(201).json(createdReOrder);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: error.message });
  }
});


// GET route - Fetch all ReOrders with image handling
router.get('/', async (req, res) => {
  try {
    const reorders = await ReOrder.find();

    const formattedReorders = reorders.map(reorder => {
      const imageUrl = reorder.image 
        ? `data:${reorder.image.contentType};base64,${reorder.image.data.toString('base64')}`
        : null;

      return {
        ...reorder.toObject(), // Convert mongoose document to plain object
        image: imageUrl, // Add base64 image URL
      };
    });

    res.json(formattedReorders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET route - Fetch a single ReOrder by ID with image handling
// GET route - Fetch a single ReOrder by ID with image handling
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const reorder = await ReOrder.findById(id);

    if (reorder) {
      const imageUrl = reorder.image 
        ? `data:${reorder.image.contentType};base64,${reorder.image.data.toString('base64')}` 
        : null;

      const formattedReorder = {
        ...reorder.toObject(),
        image: imageUrl,
      };

      res.json(formattedReorder);
    } else {
      res.status(404).json({ message: 'ReOrder not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// PUT route - Update a ReOrder with optional image upload
router.put('/:id', async (req, res) => {
  const { id } = req.params; // Get ID from request parameters
  const { Description, Status } = req.body;

  // Validate the ID
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid or missing ID' });
  }

  try {
    const updatedReOrder = await ReOrder.findByIdAndUpdate(
      id,
      { Description, Status, image: req.file ? { data: req.file.buffer, contentType: req.file.mimetype } : undefined },
      { new: true } // Return the updated document
    );

    if (!updatedReOrder) {
      return res.status(404).json({ message: 'ReOrder not found' });
    }
    res.status(200).json(updatedReOrder);
  } catch (error) {
    console.error('Error updating reorder:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE route - Delete a ReOrder by ID
// DELETE route - Delete a ReOrder by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const reorder = await ReOrder.findByIdAndDelete(id); // Use findByIdAndDelete

    if (reorder) {
      res.json({ message: 'ReOrder request removed' });
    } else {
      res.status(404).json({ message: 'ReOrder request not found' });
    }
  } catch (error) {
    console.error('Error deleting reorder:', error);
    res.status(500).json({ message: error.message });
  }
});




export default router;
