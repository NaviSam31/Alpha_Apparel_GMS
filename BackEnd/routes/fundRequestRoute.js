import express from 'express';
import { fundRequestModel } from '../models/fundRequestModel.js';

const router = express.Router();

// Create a new fund request
router.post('/', async (req, res) => {
  const { department, reason, amount,status } = req.body;

  try {
    const newFundRequest = new fundRequestModel({
      department,
      reason,
      amount,
      status
    });

    const savedFundRequest = await newFundRequest.save();
    res.status(201).json({
      message: 'Fund request created successfully',
      data: savedFundRequest,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating fund request', error });
  }
});

// Get all fund requests
router.get('/', async (req, res) => {
  try {
    const fundRequests = await fundRequestModel.find();
    res.status(200).json({ data: fundRequests });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching fund requests', error });
  }
});

// Get a single fund request by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const fundRequest = await fundRequestModel.findById(id);

    if (!fundRequest) {
      return res.status(404).json({ message: 'Fund request not found' });
    }

    res.status(200).json({ data: fundRequest });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching fund request', error });
  }
});

// Update a fund request by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { department, reason, amount, status } = req.body;

  try {
    const updatedFundRequest = await fundRequestModel.findByIdAndUpdate(
      id,
      { department, reason, amount, status },
      { new: true } // Return the updated document
    );

    if (!updatedFundRequest) {
      return res.status(404).json({ message: 'Fund request not found' });
    }

    res.status(200).json({
      message: 'Fund request updated successfully',
      data: updatedFundRequest,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating fund request', error });
  }
});

// Delete a fund request by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedFundRequest = await fundRequestModel.findByIdAndDelete(id);

    if (!deletedFundRequest) {
      return res.status(404).json({ message: 'Fund request not found' });
    }

    res.status(200).json({ message: 'Fund request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting fund request', error });
  }
});

export default router;
