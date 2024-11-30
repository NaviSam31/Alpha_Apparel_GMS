import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom'; 
import BackButton from '../../components/InventoryBackButton';
import Spinner from '../../components/Spinner';

const CreateBooks = () => {
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [customCategory, setCustomCategory] = useState(''); 
  const [productDescription, setProductDescription] = useState('');
  const [Quantity, setQuantity] = useState('');
  const [MinQuantity, setMinQuantity] = useState('');
  const [unit, setUnit] = useState(''); 
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { itemCode: routeItemCode } = useParams();

  useEffect(() => {
    if (!routeItemCode) {
      console.error('No itemCode provided in route parameters.');
      return;
    }

    setLoading(true);
    axios.get(`http://localhost:5555/inventory/${routeItemCode}`)
      .then((response) => {
        const {productName, productCategory, Quantity, MinQuantity, unit, price } = response.data;

        setProductName(productName);
        setProductCategory(productCategory);
        setProductDescription(productDescription);
        setQuantity(Quantity);
        setQuantity(MinQuantity);
        setUnit(unit);
        setPrice(price);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert('An error occurred. Please check the console.');
        console.error(error);
      });
  }, [routeItemCode]);

  const handleUpdateBook = () => {
    // Convert Quantity and Price to numbers
    const quantityNum = Number(Quantity);
    const minQuantityNum = Number(MinQuantity);
    const priceNum = Number(price);
  
    // Validate Quantity and Price
    if (quantityNum <= 0) {
      alert('Quantity must be a positive number.');
      return;
    }
    if (minQuantityNum <= 0) {
      alert('Minimum Quantity must be a positive number.');
      return;
    }
  
    if (priceNum <= 0) {
      alert('Price must be a positive number.');
      return;
    }
  
    const data = {
      productName,
      productCategory: productCategory === 'Other' ? customCategory : productCategory,
      productDescription,
      Quantity: quantityNum,
      MinQuantity: minQuantityNum,
      unit,
      price: priceNum,
    };
  
    setLoading(true);
    axios.post('http://localhost:5555/inventory', data)
      .then(() => {
        setLoading(false);
        setSuccessMessage('Item successfully updated!');
        setTimeout(() => {
          setSuccessMessage('');
          navigate('/inventory/home');
        }, 2000);
      })
      .catch((error) => {
        setLoading(false);
        alert('An error occurred. Please check the console.');
        console.error(error);
      });
  };
  
  const handleProductNameChange = (e) => {
    const value = e.target.value;
    const regex = /^[A-Za-z0-9\s]*$/;
    if (regex.test(value)) {
      setProductName(value); 
      setErrorMessage(''); 
    } else {
      setErrorMessage('Product Name should contain only letters and numbers.');
    }
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
          <div className='nav-dept'><Link to="/inventory/home"><img src='/public/inventory.png' className='icon' alt='Inventory' /> Inventory</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/tshirt.png' className='icon' alt='Design' /> Design</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/orders.png' className='icon' alt='Orders' /> Orders</Link></div>
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
          <h1 className='text-3xl font-bold company-name'>Alpha Apperals PVT LTD</h1>
        </header>
        <div className='button-container'></div>
        <div className='main-content p-4'>
          <BackButton />
          <h1 className='text-3xl my-4'>Add New Product</h1>
          {loading && <Spinner />}
          {successMessage && <div className='bg-green-100 text-green-700 p-4 rounded-md mb-4'>{successMessage}</div>}
          <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto bg-gray-20'>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Product Name</label>
              <input
                type='text'
                value={productName}
                onChange={handleProductNameChange}
                className='border-2 border-gray-500 px-4 w-full'
              />
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Product Category</label>
              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className='border-2 border-gray-500 px-4 w-full'
              >
                <option value="">Select Category</option>
                <option value="Raw Materials">Raw Materials</option>
                <option value="Finished Items">Finished Items</option>
                <option value="Packing Materials">Packing Materials</option>
                <option value="Other">Other</option>
              </select>
              {productCategory === 'Other' && (
                <input
                  type='text'
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder='Enter custom category'
                  className='border-2 border-gray-500 px-4 w-full mt-2'
                />
              )}
            </div>
            <div className='my-4'>
                            <label className='text-xl mr-4 text-gray-500'>Product Description</label>
                            <textarea
                                value={productDescription}
                                onChange={(e) => setProductDescription(e.target.value)}
                                className='border-2 border-gray-500 px-4 w-full'
                                placeholder='Enter product description'
                            />
                        </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Quantity</label>
              <input
                type='number'
                value={Quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className='border-2 border-gray-500 px-4 w-full'
              />
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Minimum Quantity</label>
              <input
                type='number'
                value={MinQuantity}
                onChange={(e) => setMinQuantity(e.target.value)}
                className='border-2 border-gray-500 px-4 w-full'
              />
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)} 
                className='border-2 border-gray-500 px-4 w-full'
              >
                <option value="">Select Unit</option>
                <option value="m">cm</option>
                <option value="m">m</option>
                <option value="yards">yards</option>
                <option value="items">items</option>
              </select>
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Price</label>
              <input
                type='number'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className='border-2 border-gray-500 px-4 w-full'
              />
            </div>
            <button className='bg-green-500 text-white px-4 py-2 rounded my-4' onClick={handleUpdateBook} style={{ width: "100%" }}>
              Save Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBooks;
