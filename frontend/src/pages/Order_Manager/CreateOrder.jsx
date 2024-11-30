import React, { useState, useEffect } from 'react';
import BackButton from '../../components/orderBackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const CreateOrder = () => {
  const [cusID, setCusID] = useState('');
  const [items, setItems] = useState([{ itemCode: '', qtyRequired: '' }]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [itemCodes, setItemCodes] = useState([]);
  const [filteredItemCodes, setFilteredItemCodes] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [customers, setCustomers] = useState([]); // State for customer data
  const [filteredCustomers, setFilteredCustomers] = useState([]); // State for filtered customers
  const navigate = useNavigate();

  // Fetch item codes from inventory
  useEffect(() => {
    axios.get('http://localhost:5555/inventory')
      .then((response) => setItemCodes(response.data.data.map(item => item.itemCode)))
      .catch((error) => console.error('Error fetching item codes:', error));
  }, []);

  // Fetch customer data
  useEffect(() => {
    axios.get('http://localhost:5555/customers')
      .then((response) => setCustomers(response.data)) // Adjust according to your API response structure
      .catch((error) => console.error('Error fetching customers:', error));
  }, []);

  // Handle item change
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);

    // Filter item codes if the field is itemCode
    if (field === 'itemCode') {
      setFilteredItemCodes(
        itemCodes.filter(code => code.toLowerCase().includes(value.toLowerCase()) &&
          !newItems.some(item => item.itemCode === code))
      );
    }
  };

  // Handle customer ID input change
  const handleCusIDChange = (value) => {
    setCusID(value);

    // Filter customers based on the input
    setFilteredCustomers(customers.filter(customer =>
      customer.CustomerID.toLowerCase().includes(value.toLowerCase())
    ));
  };

  const handleCustomerSelect = (customer) => {
    setCusID(customer.CustomerID); // Set selected customer ID
    setFilteredCustomers([]); // Clear the filtered list after selection
  };

  const validateForm = () => {
    const newErrors = {};
    if (!cusID.trim()) newErrors.cusID = 'Customer ID is required';

    items.forEach((item, index) => {
      if (!item.itemCode.trim()) {
        newErrors[`itemCode${index + 1}`] = `Item Code ${index + 1} is required`;
      }
      if (!item.qtyRequired.trim() || isNaN(item.qtyRequired) || parseFloat(item.qtyRequired) <= 0) {
        newErrors[`qtyRequired${index + 1}`] = `Quantity Required ${index + 1} must be a positive number`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddItem = () => {
    setItems([...items, { itemCode: '', qtyRequired: '' }]);
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

  // Handle item removal
  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSaveOrder = () => {
    if (!validateForm()) return;

    setLoading(true);

    const formData = new FormData();
    const orderItems = items.map(({ itemCode, qtyRequired }) => ({
      itemCode,
      qtyRequired: parseFloat(qtyRequired),
    }));

    // Append form data
    formData.append('CusID', cusID);
    formData.append('Items', JSON.stringify(orderItems));

    // Append image file if available
    if (imageFile) {
      formData.append('image', imageFile);
    }

    axios.post('http://localhost:5555/orders', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(() => navigate('/orders/home'))
      .catch((error) => {
        console.error('An error occurred:', error);
        alert('An error occurred. Please check the console for more details.');
      })
      .finally(() => setLoading(false));
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
        <br />
        <div className='main-content p-4'>
          <BackButton />
          <h1 className='text-3xl my-4'>Create Order</h1>
          {loading && <Spinner />}
          <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
            {/* Customer ID input field */}
            <div className='my-4'>
              <label className='text-xl text-gray-500'>Customer ID</label>
              <input
                type='text'
                value={cusID}
                onChange={(e) => handleCusIDChange(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {errors.cusID && <p className='text-red-500'>{errors.cusID}</p>}
              {filteredCustomers.length > 0 && (
                <ul className='border'>
                  {filteredCustomers.map((customer) => (
                    <li key={customer._id} onClick={() => handleCustomerSelect(customer)} className='cursor-pointer hover:bg-gray-200'>
                      {customer.CustomerID} - {customer.CustomerName} {/* Adjust based on your customer data structure */}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.map((item, index) => (
              <div key={index} className='my-4'>
                <label className='text-xl text-gray-500'>Item Code</label>
                <input
                  type='text'
                  value={item.itemCode}
                  onChange={(e) => handleItemChange(index, 'itemCode', e.target.value)}
                  className='border-2 border-gray-500 px-4 py-2 w-full'
                />
                {errors[`itemCode${index + 1}`] && <p className='text-red-500'>{errors[`itemCode${index + 1}`]}</p>}
                {filteredItemCodes.length > 0 && (
                  <ul className='border'>
                    {filteredItemCodes.map((code, idx) => (
                      <li key={idx} onClick={() => handleItemChange(index, 'itemCode', code)} className='cursor-pointer hover:bg-gray-200'>
                        {code}
                      </li>
                    ))}
                  </ul>
                )}
                
                <label className='text-xl text-gray-500'>Quantity Required</label>
                <input
                  type='number'
                  value={item.qtyRequired}
                  onChange={(e) => handleItemChange(index, 'qtyRequired', e.target.value)}
                  className='border-2 border-gray-500 px-4 py-2 w-full'
                />
                {errors[`qtyRequired${index + 1}`] && <p className='text-red-500'>{errors[`qtyRequired${index + 1}`]}</p>}

                <button onClick={() => handleRemoveItem(index)} className="bg-red-500 text-white px-4 py-2 rounded my-4"
                 style={{ width: "25%" }}
                  >Remove Item</button>
              </div>
            ))}

           
            

            <div className='my-4'>
              <label className='text-xl text-gray-500'>Image Upload</label>
              <input type='file' accept='image/*' onChange={handleImageChange} className='border-2 border-gray-500 px-4 py-2 w-full' />
              {imagePreview && <img src={imagePreview} alt='Preview' className='mt-2' style={{ width: '100px', height: '100px' }} />}
            </div>

            <button onClick={handleAddItem} className='bg-blue-500 text-white px-4 py-2 my-4 rounded'
            style={{ width: "100%" }}
            >Add Item</button>
            <button onClick={handleSaveOrder} className='bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded my-4'
            style={{ width: "100%" }}
            >Save Order</button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
