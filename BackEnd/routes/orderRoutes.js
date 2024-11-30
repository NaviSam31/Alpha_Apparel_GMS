import express from 'express';
import mongoose from 'mongoose';
import { Order } from '../models/orderModel.js';
import upload from '../multer/multerConfig.js'; // Using your existing multer configuration

const router = express.Router();

// Utility function to generate unique OrderID
const generateOrderID = async () => {
  let orderID;
  do {
    orderID = Math.floor(Math.random() * 9000000) + 1000000;
  } while (await Order.findOne({ OrderID: orderID }));
  return orderID;
};

// Create a new order (without handling image uploads)
// Create a new order (without handling image uploads)
router.post('/', upload.single('image'), async (req, res) => {
  console.log("Request body:", req.body);
  console.log("Uploaded file:", req.file);
  const { CusID, Items } = req.body;

  try {
    const OrderID = await generateOrderID();
    console.log("Generated OrderID:", OrderID);

    const imageFile = req.file;

    // Parse the Items string to JSON
    const parsedItems = JSON.parse(Items); // Change this line

    const newOrder = new Order({
      OrderID,
      CusID,
      Items: parsedItems, // Use the parsed items here
      image: req.file
        ? {
            data: req.file.buffer,
            contentType: req.file.mimetype,
          }
        : null,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


// Get all orders (including handling image data in the response)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();

    const formattedOrders = orders.map(order => {
      const imageUrl = order.image && order.image.data && order.image.contentType
        ? `data:${order.image.contentType};base64,${order.image.data.toString('base64')}`
        : null;  // Ensure safe access to image properties
      return { ...order.toObject(), image: imageUrl };
    });

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error.stack);
    res.status(500).json({ message: error.message });
  }
});

// Get an order by ID (including image data)
router.get('/:id', async (req, res) => {
  console.log(`Fetching order with ID: ${req.params.id}`);
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Order ID format' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const imageUrl = order.image && order.image.data && order.image.contentType
      ? `data:${order.image.contentType};base64,${order.image.data.toString('base64')}`
      : null;  // Ensure safe access to image properties

    res.status(200).json({ ...order.toObject(), image: imageUrl });
  } catch (error) {
    console.error('Error fetching order:', error.stack);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Update an order by ID (handling image uploads)
router.put('/:id', upload.fields([{ name: 'image' }, { name: 'receipt' }]), async (req, res) => {
  const { CusID, Items } = JSON.parse(req.body.data);
  try {
      if (!mongoose.isValidObjectId(req.params.id)) {
          return res.status(400).json({ message: 'Invalid Order ID format' });
      }

      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: 'Order not found' });

      // Update order fields
      order.CusID = CusID;
      order.Items = Items;

      // Handle image uploads if necessary
      if (req.files['image']) {
          order.image = {
              data: req.files['image'][0].buffer,
              contentType: req.files['image'][0].mimetype,
          };
      }

      // Save the updated order after modifying it
      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
  } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete an order by ID
router.delete('/:id', async (req, res) => {
  try {
    const results = await Order.findByIdAndDelete(req.params.id);
    if (!results) {
      return res.status(404).json({ message: 'Order not found!' });
    }
    return res.status(200).json({ message: 'Order deleted successfully!' });
  } catch (error) {
    console.error('Error deleting order:', error.stack);
    res.status(500).json({ message: error.message });
  }
});

export default router;
