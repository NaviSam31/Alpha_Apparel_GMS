import React, { useEffect, useState } from 'react';
import BackButton from '../components/SupplierBackbutton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const EditEmployee = () => {
  const { id } = useParams(); // Get the employee ID from the URL
  const [name, setName] = useState('');
  const [nic, setNic] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [product, setProduct] = useState('');
  const [type, setType] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [contractStart, setContractStart] = useState('');
  const [contractEnd, setContractEnd] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to fetch employee details
  const fetchEmployeeDetails = async () => {
    try {
        console.log(`Fetching supplier with ID: ${id}`);
        const response = await axios.get(`http://localhost:5555/supplier/${id}`);
        
        // Log the entire response for debugging
        console.log('Response data:', response.data);

        // Extract supplier details from the response
        const employee = response.data.data; // Access the nested data

        // Check if employee data is present
        if (employee) {
            setName(employee.name);
            setNic(employee.nic);
            setPhone(employee.phone);
            setEmail(employee.email);
            setProduct(employee.product);
            setType(employee.type);
            setUnitPrice(String(employee.unitPrice)); // Ensure it's a string
            setContractStart(employee.contractStart); // Date should be in ISO format
            setContractEnd(employee.contractEnd); // Date should be in ISO format
        } else {
            console.error("No employee data found.");
        }
    } catch (error) {
        console.error('Error fetching employee details:', error);
        alert('An error occurred while fetching employee details. Please check the console.');
    }
};


  useEffect(() => {
    fetchEmployeeDetails();
  }, []); // Fetch employee details on component mount

  const validateForm = () => {
    const newErrors = {};

    // Name validation: Only letters allowed
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    // NIC validation
    if (!nic.trim()) {
      newErrors.nic = 'NIC is required';
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/; // Adjust regex based on your phone number format
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    // Product validation
    if (!product.trim()) {
      newErrors.product = 'Product is required';
    }

    // Type validation
    if (!type.trim()) {
      newErrors.type = 'Type is required';
    }

    // Unit Price validation
    if (!unitPrice.trim() || isNaN(unitPrice) || parseFloat(unitPrice) <= 0) {
      newErrors.unitPrice = 'Unit Price must be a positive number';
    }

    // Contract Start validation
    if (!contractStart) {
      newErrors.contractStart = 'Contract Start date is required';
    }

    // Contract End validation
    if (!contractEnd) {
      newErrors.contractEnd = 'Contract End date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateEmployee = () => {
    if (!validateForm()) return;

    const updatedData = {
      name,
      nic,
      phone,
      email,
      product,
      type,
      unitPrice: parseFloat(unitPrice), // Convert to number
      contractStart,
      contractEnd,
    };

    setLoading(true);
    axios.put(`http://localhost:5555/supplier/${id}`, updatedData)
      .then(() => {
        setLoading(false);
        navigate('/supplier/home');
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error updating employee:', error);
        alert('An error occurred. Please check the console.');
      });
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">
          <img src="/company-logo.png" className="company-logo" alt="company-logo" />
        </div>
        <nav>
          {/* Navigation items */}
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header>
          <h1 className="text-3xl font-bold company-name">Alpha Apperals PVT LTD</h1>
        </header>

        <div className="main-content p-4">
        <br></br>
          <br></br>
          <br></br>
          <BackButton />
          <h1 className="text-3xl my-4">Edit Supplier Record</h1>
          {loading && <Spinner />}
          <div className="flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto">
            {/* Input fields */}
            <div className="my-4">
              <label className="text-xl mr-4 text-gray-500">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>

            <div className="my-4">
              <label className="text-xl mr-4 text-gray-500">NIC</label>
              <input
                type="text"
                value={nic}
                onChange={(e) => setNic(e.target.value)}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
              {errors.nic && <p className="text-red-500">{errors.nic}</p>}
            </div>

            <div className="my-4">
              <label className="text-xl mr-4 text-gray-500">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
              {errors.phone && <p className="text-red-500">{errors.phone}</p>}
            </div>

            <div className="my-4">
              <label className="text-xl mr-4 text-gray-500">Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>

            <div className="my-4">
              <label className="text-xl mr-4 text-gray-500">Product</label>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
              {errors.product && <p className="text-red-500">{errors.product}</p>}
            </div>

            <div className="my-4">
              <label className="text-xl mr-4 text-gray-500">Type</label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
              {errors.type && <p className="text-red-500">{errors.type}</p>}
            </div>

            <div className="my-4">
              <label className="text-xl mr-4 text-gray-500">Unit Price</label>
              <input
                type="text"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
              {errors.unitPrice && <p className="text-red-500">{errors.unitPrice}</p>}
            </div>

            <div className="my-4">
              <label className="text-xl mr-4 text-gray-500">Contract Start</label>
              <input
                type="date"
                value={contractStart}
                onChange={(e) => setContractStart(e.target.value)}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
              {errors.contractStart && <p className="text-red-500">{errors.contractStart}</p>}
            </div>

            <div className="my-4">
              <label className="text-xl mr-4 text-gray-500">Contract End</label>
              <input
                type="date"
                value={contractEnd}
                onChange={(e) => setContractEnd(e.target.value)}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
              {errors.contractEnd && <p className="text-red-500">{errors.contractEnd}</p>}
            </div>

            <button
              onClick={handleUpdateEmployee}
              className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Update Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
