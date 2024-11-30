import express from 'express';
import { fundmodel } from '../models/fundmodel.js';

const router = express.Router();

// Middleware for input validation (optional)
// import { validateFundInput } from '../validators/fundValidator.js';

// Get all funds
router.get("/", async (req, res) => {
    try {
        const data = await fundmodel.find({});
        if (!data.length) {
            return res.json({ success: true, message: "No funds found.", data: [] });
        }
        res.json({ success: true, data: data });
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ success: false, message: "Error fetching funds", error });
    }
});

// Create a new fund
router.post("/", /*validateFundInput,*/ async (req, res) => {
    try {
        const newFund = new fundmodel(req.body);
        await newFund.save();
        res.status(201).json({ success: true, message: "Fund created successfully." });
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ success: false, message: "Error creating fund", error });
    }
});

// Get a fund by ID
router.get("/:id", async (req, res) => {
    try {
        const fund = await fundmodel.findById(req.params.id);
        if (!fund) {
            return res.status(404).json({ success: false, message: "Fund not found" });
        }
        res.json({ success: true, data: fund });
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ success: false, message: "Error fetching fund", error });
    }
});

// Update a fund
router.put("/:id", async (req, res) => {
    try {
        const updatedFund = await fundmodel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFund) {
            return res.status(404).json({ success: false, message: "Fund not found" });
        }
        res.json({ success: true, message: "Fund updated successfully.", data: updatedFund });
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ success: false, message: "Error updating fund", error });
    }
});

// Delete a fund
router.delete("/:id", async (req, res) => {
    try {
        const deletedFund = await fundmodel.findByIdAndDelete(req.params.id);
        if (!deletedFund) {
            return res.status(404).json({ success: false, message: "Fund not found" });
        }
        res.json({ success: true, message: "Fund deleted successfully." });
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ success: false, message: "Error deleting fund", error });
    }
});

export default router;
