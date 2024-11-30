import React, { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const CreateDesign = () => {
  const [designID, setDesignID] = useState('');
  const [DesignName, setDesignName] = useState('');
  const [Description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [itemCodes, setItemCodes] = useState([]);
  const [charCountDesignName, setCharCountDesignName] = useState(0);
  const [charCountDescription, setCharCountDescription] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch item codes from inventory
    axios.get('http://localhost:5555/inventory')
      .then((response) => {
        const codes = response.data.data.map(item => item.itemCode);
        setItemCodes(codes);
      })
      .catch((error) => {
        console.error('Error fetching item codes:', error);
      });

    // Generate Design ID on mount
    generateDesignID();
  }, []);

  const generateDesignID = () => {
    const id = 'D' + Math.floor(100000000 + Math.random() * 900000000);
    setDesignID(id);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!designID.trim()) newErrors.designID = 'Design ID is required';
    if (!DesignName.trim()) newErrors.DesignName = 'Design Name is required';
    else if (DesignName.length > 60) newErrors.DesignName = 'Design Name cannot exceed 60 characters';
    
    if (!Description.trim()) newErrors.Description = 'Description is required';
    else if (Description.length > 250) newErrors.Description = 'Description cannot exceed 250 characters';

    if (!imageFile) newErrors.imageFile = 'Image file is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview('');
    }
  };

  const handleSaveDesign = () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('designID', designID);
    formData.append('DesignName', DesignName);
    formData.append('Description', Description);
    formData.append('image', imageFile);

    setLoading(true);

    axios.post('http://localhost:5555/designs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(() => {
        setLoading(false);
        navigate('/design/home');
      })
      .catch((error) => {
        setLoading(false);
        console.error('An error occurred:', error);
        setErrors({ submit: 'An error occurred while saving the design.' });
      });
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
          <h1 className='text-3xl font-bold company-name'>Alpha Apparels PVT LTD</h1>
        </header>
        <div className='button-container'></div>

        <div className='main-content p-4'>
          <BackButton />
          <h1 className='text-3xl my-4'>Create Design Record</h1>
          {loading && <Spinner />}
          <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
            {/* Input fields */}
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Design ID</label>
              <input
                type='text'
                value={designID}
                readOnly // Make it read-only if it's auto-generated
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {errors.designID && <p className='text-red-500'>{errors.designID}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Design Name</label>
              <input
                type='text'
                value={DesignName}
                onChange={(e) => {
                  setDesignName(e.target.value);
                  setCharCountDesignName(e.target.value.length);
                }}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              <small className='text-gray-500'>{charCountDesignName}/60</small>
              {errors.DesignName && <p className='text-red-500'>{errors.DesignName}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Description</label>
              <textarea
                value={Description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setCharCountDescription(e.target.value.length);
                }}
                className='border-2 border-gray-500 px-4 py-2 w-full'
                rows={4}
              />
              <small className='text-gray-500'>{charCountDescription}/250</small>
              {errors.Description && <p className='text-red-500'>{errors.Description}</p>}
            </div>
            {/* Image Upload Field */}
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Upload Design Image</label>
              <input
                type='file'
                accept="image/*"
                onChange={handleImageChange}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {errors.imageFile && <p className='text-red-500'>{errors.imageFile}</p>}
              {/* Image Preview */}
              {imagePreview && (
                <div className='mt-4'>
                  <img src={imagePreview} alt="Design Preview" className='w-full h-auto border border-gray-500 rounded' />
                </div>
              )}
            </div>

            <button onClick={handleSaveDesign} className='bg-green-500 text-white px-4 py-2 rounded my-4'
              style={{ width: "100%" }}
            >
              Save Design
            </button>
            {errors.submit && <p className='text-red-500'>{errors.submit}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDesign;
