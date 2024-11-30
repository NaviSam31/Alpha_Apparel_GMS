import React, { useState, useEffect } from 'react';
import BackButton from '../../components/SizeBackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const EditSizes = () => {
  const [sizeID, setSizeID] = useState(''); // Initialize as empty string
  const [sizeName, setSizeName] = useState(''); // Initialize as empty string
  const [chestMeasurement, setChestMeasurement] = useState(''); // Initialize as empty string
  const [waistMeasurement, setWaistMeasurement] = useState(''); // Initialize as empty string
  const [hipMeasurement, setHipMeasurement] = useState(''); // Initialize as empty string
  const [length, setLength] = useState(''); // Initialize as empty string

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/sizes/${id}`)
      .then((response) => {
        const sizeData = response.data;
        console.log('Size Data:', sizeData);

        // Ensure all fields are set as strings
        setSizeID(sizeData.sizeID || ''); // Fallback to empty string if undefined
        setSizeName(sizeData.sizeName || ''); // Fallback to empty string if undefined
        setChestMeasurement(sizeData.chestMeasurement?.toString() || ''); // Convert to string
        setWaistMeasurement(sizeData.waistMeasurement?.toString() || ''); // Convert to string
        setHipMeasurement(sizeData.hipMeasurement?.toString() || ''); // Convert to string
        setLength(sizeData.length?.toString() || ''); // Convert to string
        
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert('An error occurred. Please check the console');
        console.log(error);
      });
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    if (!sizeID.trim()) {
      newErrors.sizeID = 'Size ID is required';
    } else if (!/^[a-zA-Z]+$/.test(sizeID)) { // Check if sizeID contains only letters
      newErrors.sizeID = 'Size ID must contain only letters';
    }
    if (!sizeName.trim()) newErrors.sizeName = 'Size Name is required';
    if (!chestMeasurement.trim() || isNaN(chestMeasurement) || parseFloat(chestMeasurement) <= 0)
      newErrors.chestMeasurement = 'Chest Measurement must be a positive number';
    if (!waistMeasurement.trim() || isNaN(waistMeasurement) || parseFloat(waistMeasurement) <= 0)
      newErrors.waistMeasurement = 'Waist Measurement must be a positive number';
    if (!hipMeasurement.trim() || isNaN(hipMeasurement) || parseFloat(hipMeasurement) <= 0)
      newErrors.hipMeasurement = 'Hip Measurement must be a positive number';
    if (!length.trim() || isNaN(length) || parseFloat(length) <= 0)
      newErrors.length = 'Length must be a positive number';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleEditSizes = () => {
    // Validate form fields before proceeding
    if (!validateForm()) {
      return; // Stop if there are validation errors
    }

    const data = {
      sizeID,
      sizeName,
      chestMeasurement,
      waistMeasurement,
      hipMeasurement,
      length,
    };

    setLoading(true);

    axios.put(`http://localhost:5555/sizes/${id}`, data)
      .then(() => {
        setLoading(false);
        navigate('/sizes/home');
      })
      .catch((error) => {
        setLoading(false);
        alert('An error occurred. Please check the console');
        console.log(error);
      });
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">
          <img src="/company-logo.png" className='company-logo' alt='company-logo'></img>
        </div>
        <nav>
          <div className='nav-dept'><Link to="/"><img src='/public/home.png' className='icon' alt='Home' /> Home</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/inventory.png' className='icon' alt='Inventory' /> Inventory</Link></div>
          <div className='nav-dept'><Link to="/design/home"><img src='/public/tshirt.png' className='icon' alt='Design' /> Design</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/orders.png' className='icon' alt='Orders' /> Orders</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/supplier.png' className='icon' alt='Supplier' /> Supplier</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/marketing.png' className='icon' alt='Marketing' /> Marketing</Link></div>
          <div className='nav-dept'><Link to= ""><img src='/public/human-resource.png' className='icon' alt='Human Resource' /> Human Resource</Link></div>
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
          <h1 className='text-3xl font-bold company-name'>Alpha Apperals PVT LTD</h1>
        </header>
        <div className='button-container'></div>
        <div className='p-4'>
          <BackButton />
          <h1 className='text-3xl my-4'>Edit Size Record</h1>
          {loading && <Spinner />}
          <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Size ID</label>
              <input
                type='text'
                value={sizeID}
                onChange={(e) => setSizeID(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {errors.sizeID && <p className='text-red-500'>{errors.sizeID}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Size Name</label>
              <input
                type='text'
                value={sizeName}
                onChange={(e) => setSizeName(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {errors.sizeName && <p className='text-red-500'>{errors.sizeName}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Chest Measurement</label>
              <input
                type='text'
                value={chestMeasurement}
                onChange={(e) => setChestMeasurement(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {errors.chestMeasurement && <p className='text-red-500'>{errors.chestMeasurement}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Waist Measurement</label>
              <input
                type='text'
                value={waistMeasurement}
                onChange={(e) => setWaistMeasurement(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {errors.waistMeasurement && <p className='text-red-500'>{errors.waistMeasurement}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Hip Measurement</label>
              <input
                type='text'
                value={hipMeasurement}
                onChange={(e) => setHipMeasurement(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {errors.hipMeasurement && <p className='text-red-500'>{errors.hipMeasurement}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Length</label>
              <input
                type='text'
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {errors.length && <p className='text-red-500'>{errors.length}</p>}
            </div>
            <div className='my-4'>
              <button
                onClick={handleEditSizes}
                className='bg-green-500 text-white px-4 py-2 rounded my-4'
                style={{ width: "100%" }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSizes;
