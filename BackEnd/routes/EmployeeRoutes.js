import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { itemmodel } from '../models/EmployeeModel.js'; // Import the employee model

const router = express.Router();

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// Create a new employee with image uploads
router.post('/', upload.fields([
    { name: 'doc1', maxCount: 1 },
    { name: 'doc2', maxCount: 1 },
    { name: 'doc3', maxCount: 1 },
    { name: 'doc4', maxCount: 1 }
]), async (req, res) => {
    const {
        fname, emaill, idnumber, join_date,
        designation, department, basic_salary,
        allowance, skill_level
    } = req.body;

    try {
        const newEmployee = new itemmodel({
            fname,
            emaill,
            idnumber,
            join_date,
            designation,
            department,
            basic_salary,
            allowance,
            skill_level,
            doc1: req.files['doc1'] ? {
                data: req.files['doc1'][0].buffer,
                contentType: req.files['doc1'][0].mimetype
            } : undefined,
            doc2: req.files['doc2'] ? {
                data: req.files['doc2'][0].buffer,
                contentType: req.files['doc2'][0].mimetype
            } : undefined,
            doc3: req.files['doc3'] ? {
                data: req.files['doc3'][0].buffer,
                contentType: req.files['doc3'][0].mimetype
            } : undefined,
            doc4: req.files['doc4'] ? {
                data: req.files['doc4'][0].buffer,
                contentType: req.files['doc4'][0].mimetype
            } : undefined
        });

        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee); // Send back the saved employee data
    } catch (error) {
        res.status(400).json({ message: "Error adding employee", error });
    }
});

// Get all employees
// router.get('/', async (req, res) => {
//   try {
//       const employees = await itemmodel.find();

//       // Convert image buffers to base64 strings
//       const employeesWithImages = employees.map(employee => ({
//           ...employee.toObject(),
//           doc1: employee.doc1 ? `data:${employee.doc1.contentType};base64,${employee.doc1.data.toString('base64')}` : null,
//           doc2: employee.doc2 ? `data:${employee.doc2.contentType};base64,${employee.doc2.data.toString('base64')}` : null,
//           doc3: employee.doc3 ? `data:${employee.doc3.contentType};base64,${employee.doc3.data.toString('base64')}` : null,
//       }));

//       res.status(200).json(employeesWithImages);
//   } catch (error) {
//       res.status(500).json({ message: "Error fetching employees", error });
//   }
// });

router.get('/', async (req, res) => {
    try {
        // Fetch employees from the database
        const employees = await itemmodel.find();

        // Convert image buffers (doc1, doc2, doc3) to base64 strings
        const employeesWithImages = employees.map(employee => ({
            ...employee.toObject(), // Convert mongoose document to plain object
            doc1: employee.doc1 && employee.doc1.data ? `data:${employee.doc1.contentType};base64,${employee.doc1.data.toString('base64')}` : null,
            doc2: employee.doc2 && employee.doc2.data ? `data:${employee.doc2.contentType};base64,${employee.doc2.data.toString('base64')}` : null,
            doc3: employee.doc3 && employee.doc3.data ? `data:${employee.doc3.contentType};base64,${employee.doc3.data.toString('base64')}` : null,
            doc4: employee.doc4 && employee.doc4.data ? `data:${employee.doc3.contentType};base64,${employee.doc4.data.toString('base64')}` : null,
        }));

        // Send the employee data along with the base64 encoded images
        res.status(200).json(employeesWithImages);

    } catch (error) {
        console.error('Error fetching employees:', error); // Log the error
        res.status(500).json({ message: 'Error fetching employee data' });
    }
});




// Get employee by ID
router.get('/:id', async (req, res) => {
    try {
        const employee = await itemmodel.findById(req.params.id);

        if (employee) {
            // Format images as base64 strings
            const images = {
                doc1: employee.doc1 ? `data:${employee.doc1.contentType};base64,${employee.doc1.data.toString('base64')}` : null,
                doc2: employee.doc2 ? `data:${employee.doc2.contentType};base64,${employee.doc2.data.toString('base64')}` : null,
                doc3: employee.doc3 ? `data:${employee.doc3.contentType};base64,${employee.doc3.data.toString('base64')}` : null,
                doc4: employee.doc4 ? `data:${employee.doc4.contentType};base64,${employee.doc4.data.toString('base64')}` : null,
            };

            // Create a response object with relevant employee details and images
            const response = {
                id: employee._id,
                idnumber: employee.idnumber,
                fname: employee.fname,
                designation: employee.designation,
                department: employee.department,
                emaill: employee.emaill,
                join_date: employee.join_date,
                basic_salary: employee.basic_salary,
                allowance: employee.allowance,
                skill_level: employee.skill_level,
                createdAt: employee.createdAt,
                updatedAt: employee.updatedAt,
                images, // Include formatted images
            };

            res.status(200).json(response);
        } else {
            res.status(404).json({ message: "Employee not found" });
        }
    } catch (error) {
        console.error("Error fetching employee:", error);
        res.status(500).json({ message: "Error fetching employee", error });
    }
});


// Update employee details with image uploads
router.put('/:id', upload.fields([
    { name: 'doc1', maxCount: 1 },
    { name: 'doc2', maxCount: 1 },
    { name: 'doc3', maxCount: 1 },
    { name: 'doc4', maxCount: 1 }
]), async (req, res) => {
    const {
        fname, emaill, idnumber, join_date,
        designation, department, basic_salary,
        allownance, skill_level
    } = req.body;

    try {
        const updatedEmployee = await itemmodel.findByIdAndUpdate(
            req.params.id,
            {
                fname,
                emaill,
                idnumber,
                join_date,
                designation,
                department,
                basic_salary,
                allownance,
                skill_level,
                doc1: req.files['doc1'] ? {
                    data: req.files['doc1'][0].buffer,
                    contentType: req.files['doc1'][0].mimetype
                } : undefined,
                doc2: req.files['doc2'] ? {
                    data: req.files['doc2'][0].buffer,
                    contentType: req.files['doc2'][0].mimetype
                } : undefined,
                doc3: req.files['doc3'] ? {
                    data: req.files['doc3'][0].buffer,
                    contentType: req.files['doc3'][0].mimetype
                } : undefined,
                doc4: req.files['doc4'] ? {
                    data: req.files['doc4'][0].buffer,
                    contentType: req.files['doc4'][0].mimetype
                } : undefined
            },
            { new: true } // Return the updated document
        );

        if (updatedEmployee) {
            res.status(200).json(updatedEmployee);
        } else {
            res.status(404).json({ message: "Employee not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating employee", error });
    }
});

// Delete employee
router.delete('/:id', async (req, res) => {
    try {
        const deletedEmployee = await itemmodel.findByIdAndDelete(req.params.id);
        if (deletedEmployee) {
            res.status(200).json({ message: "Employee deleted successfully" });
        } else {
            res.status(404).json({ message: "Employee not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting employee", error });
    }
});

export default router;
