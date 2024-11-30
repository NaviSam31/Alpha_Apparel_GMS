import express from "express";
import { discountmodel } from "../models/MarketingDiscountModel.js";

const router = express.Router();

//route to save a discount
router.post("/", async (request, response) => {
  try {
    if (!request.body.item || !request.body.price || !request.body.dis) {
      return response.status(400).send({
        message: "All fields are required",
      });
    }
    const newDiscount = {
      item: request.body.item,
      price: request.body.price,
      dis: request.body.dis,
    };
    const discount = await discountmodel.create(newDiscount);
    return response.status(201).send(discount);
  } catch (error) {
    console.log(error.message);
    response.status(500).send(error.message);
  }
});

//route for getting all discounts from the database
router.get("/", async (request, response) => {
  try {
    const discounts = await discountmodel.find();
    return response.status(200).json({
      count: discounts.length,
      data: discounts,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send(error.message);
  }
});

//route for getting all discounts from the database by id
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const discount = await discountmodel.findById(id);

    return response.status(200).json(discount);
  } catch (error) {
    console.log(error.message);
    response.status(500).send(error.message);
  }
});

//route for update a discount
router.put("/:id", async (request, response) => {
  try {
    if (!request.body.item || !request.body.price || !request.body.dis) {
      return response.status(400).send({
        message: "All fields are required",
      });
    }

    const { id } = request.params;

    const result = await discountmodel.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: "discount not found" });
    }
    return response
      .status(200)
      .send({ message: "discount updated successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send(error.message);
  }
});

//Route for deleting a discount
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const result = await discountmodel.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: "discount not found" });
    }
    return response
      .status(200)
      .send({ message: "discount deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
