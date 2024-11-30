import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { PORT, URL } from "./config.js";
import designRoutes from './routes/designRoutes.js';
import sizeRoutes from './routes/sizesRoutes.js';
import inventoryRoute from './routes/bookRoute.js'
import reOrderRoute from './routes/reOrderRoute.js'
import materialRequirementRoutes from './routes/materialRequirementRoutes.js'
import MarketingDiscountRoute from './routes/MarketingDiscountRoute.js'
import RegisteredCustomerRoute from'./routes/registeredcustomerRoute.js'
import orderRoutes from'./routes/orderRoutes.js'
import transportRoute from './routes/TransportRoute.js';
import vehicleRoute from './routes/VehicleRoute.js';


import DisplayItemRoute from'./routes/DisplayItemRoute.js'

import SupplierOrderRoutes from './routes/supplierOrderRoutes.js'
import supplierRoutes from './routes/supplierroutes.js'

import EmployeeRoutes from './routes/EmployeeRoutes.js'
import TrainingRoutes from './routes/trainroutes.js'

import fundRoute from'./routes/fundRoute.js'
import fundRequest from './routes/fundRequestRoute.js'


const app = express();


// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to handle CORS
app.use(cors()); 
// Route for the root endpoint
app.get('/', (req, res) => {
  console.log(req);
  return res.status(200).send('Welcome to MERN Stack');
});

// Sales routes
app.use('/designs', designRoutes);
app.use('/sizes', sizeRoutes);
app.use('/inventory', inventoryRoute);
app.use('/reOrder', reOrderRoute);
app.use('/materialRequirement', materialRequirementRoutes);

app.use("/discounts", MarketingDiscountRoute);

app.use("/customers", RegisteredCustomerRoute);
app.use("/orders", orderRoutes);

app.use('/transport',transportRoute);
app.use('/vehicle',vehicleRoute);

app.use("/items", DisplayItemRoute);

app.use("/employees", EmployeeRoutes);
app.use("/trainings", TrainingRoutes);

app.use("/supplierOrder", SupplierOrderRoutes);
app.use("/supplier", supplierRoutes);

app.use("/funds", fundRoute);
app.use("/fundRequest", fundRequest);

app.use('/uploads', express.static('uploads'));


// MongoDB connection and server start
mongoose.connect(URL)
  .then(() => {
    console.log('App connected successfully to MongoDB');
    app.listen(PORT, () => {
      console.log(`App is listening on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});
