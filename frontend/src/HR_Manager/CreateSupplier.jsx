import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Added `Link` import
import BackButton from '../components/EmployeeBackbutton';
import Spinner from '../components/Spinner';

const CreateContract = () => {
  const [name, setName] = useState(''); // Full Name
  const [nic, setNic] = useState(''); // NIC
  const [phone, setPhone] = useState(''); // Phone
  const [email, setEmail] = useState(''); // Email
  const [product, setProduct] = useState(''); // Product
  const [type, setType] = useState(''); // Type
  const [unitPrice, setUnitPrice] = useState(''); // Unit Price
  const [contractStart, setContractStart] = useState(''); // Contract Start Date
  const [contractEnd, setContractEnd] = useState(''); // Contract End Date
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Name validation: Only letters and spaces allowed
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!nameRegex.test(name)) {
      newErrors.name = 'Name can only contain letters';
    }

    // NIC validation: 12 digits or 9 digits + 'V'
    const nicRegex = /^(\d{12}|\d{9}[vV])$/;
    if (!nic.trim()) {
      newErrors.nic = 'NIC is required';
    } else if (!nicRegex.test(nic)) {
      newErrors.nic = 'NIC must be 12 digits or 9 digits followed by "V"';
    }

    // Phone validation: 10 digits
    const phoneRegex = /^\d{10}$/;
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

    // Unit price validation: Must be a number greater than 0
    if (!unitPrice.trim() || isNaN(unitPrice) || parseFloat(unitPrice) <= 0) {
      newErrors.unitPrice = 'Unit price must be a positive number';
    }

    // Contract start date validation
    if (!contractStart.trim()) {
      newErrors.contractStart = 'Contract start date is required';
    }

    // Contract end date validation
    if (!contractEnd.trim()) {
      newErrors.contractEnd = 'Contract end date is required';
    } else if (new Date(contractEnd) <= new Date(contractStart)) {
      newErrors.contractEnd = 'Contract end date must be after start date';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSaveContract = () => {
    if (!validateForm()) return;

    const contractData = {
      name,
      nic,
      phone,
      email,
      product,
      type,
      unitPrice: parseFloat(unitPrice),
      contractStart,
      contractEnd,
    };

    setLoading(true);
    axios.post('http://localhost:5555/supplier', contractData)
      .then(() => {
        setLoading(false);
        navigate('/supplier/home');
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error:', error);
        alert('An error occurred. Please check the console.');
      });
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">
          <img src="../public/company-logo.png" className="company-logo" alt="company-logo" />
        </div>
        <nav>
          <div className='nav-dept'><Link to="/"><img src='/public/home.png' className='icon' alt='Home' /> Home</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/inventory.png' className='icon' alt='Inventory' /> Inventory</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/tshirt.png' className='icon' alt='Design' /> Design</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/orders.png' className='icon' alt='Orders' /> Orders</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/supplier.png' className='icon' alt='Supplier' /> Supplier</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/marketing.png' className='icon' alt='Marketing' /> Marketing</Link></div>
          <div className='nav-dept'><Link to="/employee/home"><img src='/public/human-resource.png' className='icon' alt='Human Resource' /> Human Resource</Link></div>
          <div className='nav-dept financial'>
            <Link to="financial-dashboard">
              <img src='/public/financial.png' className='icon' alt='Financial' /> Financial
            </Link>
            <div className='dropdown'>
              <Link to="/fundRequests/create">Request Fund</Link>
              <Link to="">Finance Dashboard</Link>
            </div>
          </div>
          <div className='nav-dept'><Link to=""><img src='/public/transport.png' className='icon' alt='Transport' /> Transport</Link></div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header>
          <h1 className="text-3xl font-bold company-name">Alpha Apperals PVT LTD</h1>
        </header>
        <div className="p-4"> 
            <br></br>
            <br></br>
            <br></br>
  <BackButton />
  <h1 className="text-3xl my-4">Create Supplier</h1>
  {loading && <Spinner />}
  <div className="container mx-auto p-4">
    <div className="border-2 border-sky-400 rounded-xl p-6 w-full max-w-16xl mx-auto"  style={{ width: "750px" }}> {/* Increased width to max-w-3xl */}
      {/* Input fields */}
      <div className="mb-4">
        <label className="block text-gray-700">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-2 border-gray-300 p-3 w-full rounded"
        />
        {errors.name && <p className="text-red-500">{errors.name}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">NIC</label>
        <input
          type="text"
          value={nic}
          onChange={(e) => setNic(e.target.value)}
          className="border-2 border-gray-300 p-3 w-full rounded"
        />
        {errors.nic && <p className="text-red-500">{errors.nic}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border-2 border-gray-300 p-3 w-full rounded"
        />
        {errors.phone && <p className="text-red-500">{errors.phone}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-2 border-gray-300 p-3 w-full rounded"
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Product</label>
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="border-2 border-gray-300 p-3 w-full rounded"
        />
        {errors.product && <p className="text-red-500">{errors.product}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Type</label>
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border-2 border-gray-300 p-3 w-full rounded"
        />
        {errors.type && <p className="text-red-500">{errors.type}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Unit Price</label>
        <input
          type="text"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          className="border-2 border-gray-300 p-3 w-full rounded"
        />
        {errors.unitPrice && <p className="text-red-500">{errors.unitPrice}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Contract Start Date</label>
        <input
          type="date"
          value={contractStart}
          onChange={(e) => setContractStart(e.target.value)}
          className="border-2 border-gray-300 p-3 w-full rounded"
        />
        {errors.contractStart && <p className="text-red-500">{errors.contractStart}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Contract End Date</label>
        <input
          type="date"
          value={contractEnd}
          onChange={(e) => setContractEnd(e.target.value)}
          className="border-2 border-gray-300 p-3 w-full rounded"
        />
        {errors.contractEnd && <p className="text-red-500">{errors.contractEnd}</p>}
      </div>

      <button
        onClick={handleSaveContract}
        className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700 w-full"
      >
        Save Contract
      </button>
    </div>
  </div>
</div>

        
      </div>
    </div>
  );
};

export default CreateContract;
