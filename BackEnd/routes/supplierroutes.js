import express from 'express';
import { suppliermodel } from '../models/suppliermodel.js';

const router = express.Router();

// POST - Create a new supplier
router.post("/", async (req, res) => {
    try {
        const data = new suppliermodel(req.body);
        await data.save();
        res.send({ success: true, message: "Supplier added" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error adding supplier" });
    }
});

// GET - Fetch all suppliers
router.get("/", async (req, res) => {
    console.log("Fetching all suppliers");

    try {
        const data = await suppliermodel.find({});
        res.json({ success: true, message: "Suppliers fetched successfully", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching suppliers" });
    }
});

// PUT - Update supplier information
router.put("/:id", async (req, res) => {
    const { id, ...rest } = req.body;
    try {
        const data = await suppliermodel.findByIdAndUpdate(id, rest, { new: true });
        if (!data) {
            return res.status(404).json({ success: false, message: "Supplier not found" });
        }
        res.json({ success: true, message: "Updated successfully", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error updating supplier" });
    }
});

// DELETE - Delete a supplier
// DELETE - Delete a supplier
router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    console.log(`Attempting to delete supplier with id: ${id}`);
    try {
        const data = await suppliermodel.findByIdAndDelete(id);
        if (!data) {
            return res.status(404).json({ success: false, message: "Supplier not found" });
        }
        res.json({ success: true, message: "Supplier deleted" });
    } catch (error) {
        console.error("Error in delete operation:", error);
        res.status(500).json({ success: false, message: "Error deleting supplier" });
    }
});


// GET - Fetch a single supplier by ID
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const user = await suppliermodel.findById(id);
        if (!user) {
            return res.status(404).send({ success: false, message: "Supplier not found" });
        }
        res.send({ success: true, message: "Supplier fetched successfully", data: user });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
});

// GET - Get count of suppliers
router.get("/count_supplier", async (req, res) => {
    try {
        const suppliers = await suppliermodel.find({});
        res.status(200).json({
            count: suppliers.length,
            data: suppliers
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: "Error counting suppliers" });
    }
});

export default router;
