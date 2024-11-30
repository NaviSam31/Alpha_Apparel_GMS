import express from 'express';
import { Size } from '../models/sizeModels.js';

const router = express.Router();

// Route for saving a new sales record
router.post('/', async (request, response) => {
  try {
    // Validate request body manually or use a validation library
    const { sizeID, sizeName, chestMeasurement, waistMeasurement, hipMeasurement, length } = request.body;

    if (!sizeID || !sizeName || !chestMeasurement || !waistMeasurement || !hipMeasurement || !length) {
      return response.status(400).send({ message: 'All fields are required.' });
    }

    // Proceed with creating the record
    const newSize = { sizeID, sizeName, chestMeasurement, waistMeasurement, hipMeasurement, length };
    const sizes = await Size.create(newSize);

    return response.status(201).send(sizes);
  } catch (error) {
    console.error('Error:', error.message);
    response.status(500).send({ message: error.message });
  }
});



// Route for Get all sales records from database
router.get('/', async(request, response) =>{
try{
  const size = await Size.find({});

  return response.status(200).json(size);
}
  catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
})


// Route to Get one record by ID
router.get('/:id', async(request, response) =>{
  try{

    const { id } = request.params;
    const size = await Size.findById(id);
  
    return response.status(200).json(size);
  }
    catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  })

// Route for update 
router.put('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const {
      sizeID,
      sizeName,
      chestMeasurement,
      waistMeasurement,
      hipMeasurement,
      length
    } = request.body;

    // Validate that all required fields are present
    if (
      !sizeID ||
      !sizeName ||
      !chestMeasurement ||
      !waistMeasurement ||
      !hipMeasurement ||
      !length 
    ) {
      return response.status(400).send({ message: 'Send all required fields!' });
    }

    const results = await Size.findByIdAndUpdate(id, request.body, { new: true });

    if (!results) {
      return response.status(404).json({ message: 'Size not found!' });
    }

    return response.status(200).send({ message: 'Size updated successfully!' });
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

// Route for delete
router.delete('/:id', async (request, response) =>{
try{
  const { id } = request.params;
  const results = await Size.findByIdAndDelete(id, request.body);

  if(!results){
    return response.status.json({ message: 'Size not found!'});
  }

  return response.status(200).send({ message:'Size deleted successfully!'});
}catch(error){
  console.log(error.message);
  response.status(500).send({ message: error.message });
}

})

export default router;