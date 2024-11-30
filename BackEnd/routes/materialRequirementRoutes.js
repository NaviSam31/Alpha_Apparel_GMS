import express from 'express';
import { MaterialRequirement } from '../models/materialRequirementModel.js';

const router = express.Router();

// Route for saving a new material requirement record
router.post('/', async (request, response) => { 
  try {
    const { designID, sizeID, materials } = request.body;

    // Validate that all required fields are present
    if (!designID || !sizeID || !Array.isArray(materials) || materials.length === 0) {
      return response.status(400).send({
        message: 'DesignID, sizeID, and at least one material are required fields!',
      });
    }

    const newMaterialRequirement = {
      designID,
      sizeID,
      materials,
    };

    const createdMaterialRequirement = await MaterialRequirement.create(newMaterialRequirement);
    return response.status(201).send(createdMaterialRequirement);
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

// Route for getting all material requirement records
router.get('/', async (request, response) => {
  try {
    const materialRequirements = await MaterialRequirement.find({});
    return response.status(200).json(materialRequirements);
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

// Route to get one material requirement record by ID
router.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const materialRequirement = await MaterialRequirement.findById(id);

    if (!materialRequirement) {
      return response.status(404).json({ message: 'Material Requirement not found!' });
    }

    return response.status(200).json(materialRequirement);
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

// Route for updating a material requirement record
router.put('/:id', async (request, response) => { 
  try {
    const { id } = request.params;
    const updatedFields = request.body;

    const materialRequirement = await MaterialRequirement.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!materialRequirement) {
      return response.status(404).json({ message: 'Material Requirement not found!' });
    }

    return response.status(200).json({ message: 'Material Requirement updated successfully!', materialRequirement });
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

// Route for deleting a material requirement record
router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const results = await MaterialRequirement.findByIdAndDelete(id);

    if (!results) {
      return response.status(404).json({ message: 'Material Requirement not found!' });
    }

    return response.status(200).send({ message: 'Material Requirement deleted successfully!' });
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

export default router;
