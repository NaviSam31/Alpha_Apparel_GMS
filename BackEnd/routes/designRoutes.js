import express from 'express';
import { Design } from '../models/designModels.js';
import upload from '../multer/multerConfig.js'; // Import the configured multer

const router = express.Router();

const generateDesignID = async () => {
  let designID;
  do {
    // Generate a random design ID: "D" followed by 9 random digits
    designID = 'D' + Math.floor(100000000 + Math.random() * 900000000).toString(); // Generates a string like "D123456789"
  } while (await Design.findOne({ designID })); // Ensure it is unique
  return designID;
};

// Route for saving a new design record
router.post('/', upload.single('image'), async (request, response) => { 
  try {
    const { DesignName, Description } = request.body; // Removed designID from here

    if (!DesignName || !Description) {
      return response.status(400).send({
        message: 'DesignName and Description are required fields!',
      });
    }

    // Generate a unique designID
    const designID = await generateDesignID();

    const newDesignRecord = {
      designID,
      DesignName,
      Description,
      image: request.file ? {
        data: request.file.buffer,
        contentType: request.file.mimetype,
      } : undefined,
    };

    const design = await Design.create(newDesignRecord);
    return response.status(201).send(design);
  } catch (error) {
    console.log('Error creating design:', error);
    response.status(500).send({ message: 'An error occurred!', error: error.message });
  }
});

// Route for getting all design records from database
router.get('/', async (request, response) => {
  try {
    const designs = await Design.find({});

    // Map through designs and convert image data to a base64 URL
    const formattedDesigns = designs.map(design => {
      const imageUrl = design.image 
        ? `data:${design.image.contentType};base64,${design.image.data.toString('base64')}`
        : null;

      return {
        ...design.toObject(), // Convert mongoose document to plain object
        image: imageUrl, // Add base64 image URL
      };
    });

    return response.status(200).json(formattedDesigns);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to get one design record by ID
router.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const design = await Design.findById(id);

    if (!design) {
      return response.status(404).json({ message: 'Design not found!' });
    }

    // Format the image URL
    const imageUrl = design.image 
      ? `data:${design.image.contentType};base64,${design.image.data.toString('base64')}`
      : null;

    const formattedDesign = {
      ...design.toObject(), // Convert mongoose document to plain object
      image: imageUrl, // Add base64 image URL
    };

    return response.status(200).json(formattedDesign);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for updating a design record
router.put('/:id', upload.single('image'), async (request, response) => { 
  try {
    const { id } = request.params;
    const updatedFields = {
      DesignName: request.body.DesignName,
      Description: request.body.Description,
    };

    // Check if a new file was uploaded and update the image field if so
    if (request.file) {
      updatedFields.image = {
        data: request.file.buffer, // Access file buffer
        contentType: request.file.mimetype, // Access file MIME type
      };
    }

    const design = await Design.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!design) {
      return response.status(404).json({ message: 'Design not found!' });
    }

    // Format the image URL for the response
    const imageUrl = design.image 
      ? `data:${design.image.contentType};base64,${design.image.data.toString('base64')}`
      : null;

    return response.status(200).json({ message: 'Design updated successfully!', design: { ...design.toObject(), image: imageUrl } });
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

// Route for deleting a design record
router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const results = await Design.findByIdAndDelete(id);

    if (!results) {
      return response.status(404).json({ message: 'Design not found!' });
    }

    return response.status(200).send({ message: 'Design deleted successfully!' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
