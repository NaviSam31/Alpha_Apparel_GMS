import React, { useState, useEffect } from 'react';
import BackButton from '../../components/customerBackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const CreateCustomer = () => {
  const [CustomerID, setCustomerID] = useState('');
  const [CustomerName, setCustomerName] = useState('');
  const [Address, setAddress] = useState('');
  const [City, setCity] = useState('');
  const [Country, setCountry] = useState('Sri lanka');
  const [CountryCode, setCountryCode] = useState('+94');
  const [ContactNo1, setContactNo1] = useState('');
  const [ContactNo2, setContactNo2] = useState('');
  const [Email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Auto-generate Customer ID
  useEffect(() => {
    const generateCustomerID = () => {
      const generatedID = 'CUST-' + Math.floor(100000 + Math.random() * 900000);
      setCustomerID(generatedID); // Set the generated ID to state
    };

    generateCustomerID(); // Call the function to generate the ID
  }, []); // Empty dependency array means this runs once when the component mounts

  const validateForm = () => {
    const newErrors = {};

    if (!CustomerID.trim()) newErrors.CustomerID = 'Customer ID is required';
    if (!CustomerName.trim()) newErrors.CustomerName = 'Customer Name is required';
    if (!Address.trim()) newErrors.Address = 'Address is required';
    if (!City.trim()) newErrors.City = 'City is required';
    if (!Country.trim()) newErrors.Country = 'Country is required';
    if (!CountryCode.trim()) newErrors.CountryCode = 'Country code is required';




    // Contact Number validation (exactly 9 digits, no special characters)
    if (!ContactNo1.trim()) {
      newErrors.ContactNo1 = 'Primary Contact No is required';
    } else if (!/^\d{9}$/.test(ContactNo1)) {  // Updated to allow exactly 9 digits
      newErrors.ContactNo1 = 'Primary Contact No must be exactly 9 digits and contain only numbers';
    }

    if (ContactNo2 && !/^\d{9}$/.test(ContactNo2)) {  // Updated to allow exactly 9 digits
      newErrors.ContactNo2 = 'Secondary Contact No must be exactly 9 digits and contain only numbers';
    }


    // Email validation
    if (!Email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
      newErrors.Email = 'A valid email is required';
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveCustomer = async () => {
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    setLoading(true);
    try {
      // Create the formData object
      const formData = {
        CustomerID,
        CustomerName,
        Address,
        City,
        Country,
        CountryCode,
        ContactNo1,
        ContactNo2,
        Email,
      };

      // Make the POST request with formData
      await axios.post('http://localhost:5555/customers', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      navigate('/customers/home');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create customer. Please check your input.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">
          <img src='../public/company-logo.png' className='company-logo' alt='company-logo' />
        </div>
        <nav>
          <div className='nav-dept'><Link to="/"><img src='/public/home.png' className='icon' alt='Home' /> Home</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/inventory.png' className='icon' alt='Inventory' /> Inventory</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/tshirt.png' className='icon' alt='Design' /> Design</Link></div>
          <div className='nav-dept'><Link to="/customers/home"><img src='/public/orders.png' className='icon' alt='Orders' /> Orders</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/supplier.png' className='icon' alt='Supplier' /> Supplier</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/marketing.png' className='icon' alt='Marketing' /> Marketing</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/human-resource.png' className='icon' alt='Human Resource' /> Human Resource</Link></div>
          <div className='nav-dept financial'>
            <Link to="">
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
          <h1 className='text-3xl font-bold company-name'>Alpha Apparels PVT LTD</h1>
        </header>
        <div className='button-container'>
        </div>

        <div className='main-content p-4'>
          <BackButton />
          <h1 className='text-3xl my-4'>Create Customer Record</h1>
          {loading && <Spinner />}
          <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
            {/* Input fields */}
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Customer ID</label>
              <input
                type='text'
                value={CustomerID}
                readOnly // Make it read-only since it's auto-generated
                className='border-2 border-gray-500 px-4 py-2 w-full bg-gray-200' // Make it look distinct
              />
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Customer Name</label>
              <input
                type='text'
                value={CustomerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {errors.CustomerName && <p className='text-red-500'>{errors.CustomerName}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Address</label>
              <input
                type='text'
                value={Address}
                onChange={(e) => setAddress(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {errors.Address && <p className='text-red-500'>{errors.Address}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>City</label>
              <input
                type='text'
                value={City}
                onChange={(e) => setCity(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {errors.City && <p className='text-red-500'>{errors.City}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Country</label>
              <input
                type='text'
                value={Country}
                readOnly
                onChange={(e) => setCountry(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {errors.Country && <p className='text-red-500'>{errors.Country}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Country Code</label>
              <input
                type='text'
                value={CountryCode}
                readOnly
                onChange={(e) => setCountryCode(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {errors.CountryCode && <p className='text-red-500'>{errors.CountryCode}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Primary Contact No</label>
              <input
                type='text'
                value={ContactNo1}
                onChange={(e) => setContactNo1(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {errors.ContactNo1 && <p className='text-red-500'>{errors.ContactNo1}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Secondary Contact No</label>
              <input
                type='text'
                value={ContactNo2}
                onChange={(e) => setContactNo2(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {errors.ContactNo2 && <p className='text-red-500'>{errors.ContactNo2}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Email</label>
              <input
                type='text'
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {errors.Email && <p className='text-red-500'>{errors.Email}</p>}
            </div>
            <div className='flex justify-center mt-4'>
              <button
                onClick={handleSaveCustomer}
                className='bg-green-500 text-white px-4 py-2 rounded my-4'
                style={{ width: "100%" }}
              >
                Create Customer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCustomer;
