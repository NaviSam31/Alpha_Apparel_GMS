import React, { useState, useEffect } from 'react';
import BackButton from '../../components/DisplayItemBackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const CreateDisplayItem = () => {
  const [items, setItems] = useState([]); // Holds itemCode, itemName, itemDescription, unit, and price
  const [selectedItemCode, setSelectedItemCode] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch item codes, names, descriptions, unit, and price from inventory
  useEffect(() => {
    axios.get('http://localhost:5555/inventory')
      .then((response) => {
        // Store itemCode, itemName, itemDescription, unit, and price
        setItems(response.data.data.map(item => ({
          itemCode: item.itemCode,
          itemName: item.productName, // Assuming productName exists in your data
          itemDescription: item.productDescription, // Assuming productDescription exists in your data
          unit: item.unit, // Assuming unit exists in your data
          price: item.price // Assuming price exists in your data
        })));
      })
      .catch((error) => console.error('Error fetching item data:', error));
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!selectedItemCode) newErrors.itemCode = 'Item Code is required';
    if (!itemName.trim()) newErrors.itemName = 'Item Name is required';
    if (!itemDescription.trim()) newErrors.itemDescription = 'Item Description is required';
    if (!unit.trim()) newErrors.unit = 'Unit is required';
    if (price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!imageFile) newErrors.imageFile = 'Image file is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG or PNG).');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview('');
    }
  };

  // Cleanup function for revoking the object URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSaveItem = () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('itemCode', selectedItemCode);
    formData.append('productName', itemName);
    formData.append('productDescription', itemDescription);
    formData.append('unit', unit);
    formData.append('price', String(price)); // Ensure price is a string
    formData.append('image', imageFile);

    console.log('Form Data:', [...formData.entries()]); // Log the form data

    setLoading(true);

    axios.post('http://localhost:5555/items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(() => navigate('/items/home'))
      .catch((error) => {
        console.error('An error occurred:', error.response ? error.response.data : error.message);
        alert('An error occurred. Please check the console for more details.');
      })
      .finally(() => setLoading(false));
  };


  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">
          <img src='../public/company-logo.png' className='company-logo' alt='company-logo'></img>
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
        <div className='button-container'></div>
        <div className='main-content p-4'>
          <BackButton />
          <h1 className='text-3xl my-4'>Create Display Item</h1>
          {loading && <Spinner />}
          <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
            {/* Input fields */}
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Item Code</label>
              <select
                value={selectedItemCode}
                onChange={(e) => {
                  const selected = items.find(item => item.itemCode === e.target.value);
                  setSelectedItemCode(selected.itemCode);
                  setItemName(selected.itemName); // Set the item name based on selected item code
                  setItemDescription(selected.itemDescription); // Set the item description based on selected item code
                  setUnit(selected.unit); // Set unit based on selected item
                  setPrice(selected.price); // Set price based on selected item
                }}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              >
                <option value="">Select Item Code</option>
                {items.map((item, index) => (
                  <option key={index} value={item.itemCode}>{`${item.itemCode} - ${item.itemName}`}</option>
                ))}
              </select>
              {errors.itemCode && <p className='text-red-500'>{errors.itemCode}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Item Name</label>
              <input
                type='text'
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {errors.itemName && <p className='text-red-500'>{errors.itemName}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Item Description</label>
              <textarea
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {errors.itemDescription && <p className='text-red-500'>{errors.itemDescription}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Unit</label>
              <input
                type='text'
                value={unit}
                readOnly
                onChange={(e) => setUnit(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {errors.unit && <p className='text-red-500'>{errors.unit}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Price</label>
              <input
                type='number'
                value={price}
                readOnly
                onChange={(e) => setPrice(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {errors.price && <p className='text-red-500'>{errors.price}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Image</label>
              <input
                type='file'
                onChange={handleImageChange}
                accept='image/*'
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {errors.imageFile && <p className='text-red-500'>{errors.imageFile}</p>}
              {imagePreview && <img src={imagePreview} alt="Preview" className='mt-4 w-24 h-24 object-cover' />}
            </div>

            <button
              onClick={handleSaveItem}
              className='bg-green-500 text-white px-4 py-2 rounded my-4'
                style={{ width: "100%" }}
            >
              Save Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDisplayItem;
