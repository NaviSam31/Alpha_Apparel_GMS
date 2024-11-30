import React, { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const EditDesigns = () => {
  const [designID, setDesignID] = useState('');
  const [sizeID, setSizeID] = useState('');
  const [DesignName, setDesignName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [Description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null); // State for the selected image file
  const [imagePreview, setImagePreview] = useState(''); // State for image preview
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/designs/${id}`)
      .then((response) => {
        console.log("API Response: ", response.data); // Log the response
        const designData = response.data;
  
        setDesignID(designData.designID);
        setSizeID(designData.sizeID);
        setDesignName(designData.DesignName);
        setImageUrl(designData.image);
        setDescription(designData.Description);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert('An error occurred. Please check the console');
        console.log(error);
      });
  }, [id]);
  

  // Update the image preview when a file is selected
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set the image preview URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const handleEditSales = () => {
    // Basic validation (you can expand this)
    const newErrors = {};
    if (!designID) newErrors.designID = "Design ID is required.";
    if (!DesignName) newErrors.DesignName = "Design Name is required.";
    if (!imageUrl && !selectedFile) newErrors.imageUrl = "An image file or URL is required."; // Updated validation

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return; // Stop if errors exist

    const data = {
      designID,
      DesignName,
      imageUrl,
      Description
    };

    const formData = new FormData(); // Create a FormData object
    formData.append('designID', designID);
    formData.append('DesignName', DesignName);
    formData.append('Description', Description);

    // Append image file if selected
    if (selectedFile) {
      formData.append('image', selectedFile);
    } else {
      formData.append('imageUrl', imageUrl); // Otherwise, use the existing URL
    }

    setLoading(true);

    axios.put(`http://localhost:5555/designs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // Set content type for file uploads
      }
    })
      .then(() => {
        setLoading(false);
        navigate('/design/home'); // Navigate after successful update
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
          <img src="/company-logo.png" className='company-logo' alt='company-logo' />
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
        <div className='button-container'>
        </div>
        <div className='main-content p-4'>
          <BackButton />
          <h1 className='text-3xl my-4'>Edit Design Record</h1>
          {loading && <Spinner />}
          <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Design ID</label>
              <input
                type='text'
                value={designID}
                onChange={(e) => setDesignID(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
                readOnly
              />
              {errors.designID && <p className='text-red-500'>{errors.designID}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Design Name</label>
              <input
                type='text'
                value={DesignName}
                onChange={(e) => setDesignName(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {errors.DesignName && <p className='text-red-500'>{errors.DesignName}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Upload New Image</label>
              <input
                type='file'
                onChange={handleFileChange} // Use the new handler
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
            </div>
            {/* Preview the selected image */}
            {imagePreview && (
              <div className="my-4">
                <img src={imagePreview} alt="Preview" className="w-full h-auto border border-gray-500 rounded" />
              </div>
            )}
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Description</label>
              <textarea
                value={Description}
                onChange={(e) => setDescription(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {errors.Description && <p className='text-red-500'>{errors.Description}</p>}
            </div>
            <button
              onClick={handleEditSales}
              className='bg-green-500 text-white px-4 py-2 rounded my-4'
              style={{ width: "100%" }}
            >
              Update Design Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDesigns;
