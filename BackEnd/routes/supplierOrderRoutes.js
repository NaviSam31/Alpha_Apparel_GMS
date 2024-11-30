import mongoose from 'mongoose';
import express from 'express';
import { odermodel } from '../models/SupplierOrder.js';
import { suppliermodel } from '../models/suppliermodel.js';

const router = express.Router();

// Create a new supplier order
router.post("/", async (req, res) => {
    try {
        const data = new odermodel(req.body);
        await data.save();
        res.status(201).send({ success: true, message: "Order placed successfully" });
    } catch (error) {
        console.error("Error saving order:", error);
        res.status(500).send({ success: false, message: "Failed to place order" });
    }
});

// Get all suppliers
router.get('/', async (req, res) => {
    try {
        const suppliers = await odermodel.find();
        res.status(200).json({ success: true, data: suppliers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get an order by ID
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const order = await odermodel.findById(id);
        if (!order) {
            return res.status(404).send({ success: false, message: "Order not found" });
        }
        res.send({ success: true, message: "Order fetched successfully", data: order });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
});

// Update an order by ID
// Update an order by ID
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const rest = req.body;
  try {
      const data = await odermodel.updateOne({ _id: id }, rest);
      if (data.modifiedCount === 0) {
          return res.status(404).send({ success: false, message: "Order not found or no changes made" });
      }
      res.json({ success: true, message: "Order updated successfully", data });
  } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, message: "Failed to update order" });
  }
});


// Delete an order by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await odermodel.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.status(200).json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

export default router;
