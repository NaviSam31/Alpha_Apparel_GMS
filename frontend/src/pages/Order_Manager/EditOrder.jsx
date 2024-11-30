import React, { useState, useEffect } from 'react';
import BackButton from '../../components/customerBackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

const EditOrder = () => {
  const [orderId, setOrderID] = useState('');
  const [cusID, setCusID] = useState('');
  const [items, setItems] = useState([{ itemCode: '', qtyRequired: '' }]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [itemCodes, setItemCodes] = useState([]);
  const [filteredItemCodes, setFilteredItemCodes] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [receiptPreview, setReceiptPreview] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch item codes from inventory
  useEffect(() => {
    axios.get('http://localhost:5555/inventory')
      .then((response) => setItemCodes(response.data.data.map(item => item.itemCode)))
      .catch((error) => console.error('Error fetching item codes:', error));
  }, []);

  // Fetch order details to populate the form
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5555/orders/${id}`);
        const orderData = response.data;
        setOrderID(orderData.OrderID);
        setCusID(orderData.CusID);
        setItems(orderData.Items.map(({ itemCode, qtyRequired }) => ({
          itemCode,
          qtyRequired: qtyRequired.toString(),
        })));
      } catch (error) {
        console.error('Error fetching order:', error);
        alert('An error occurred while fetching the order. Please check the console for details.');
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrderDetails();
  }, [id]);

  // Handle item change
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);

    if (field === 'itemCode') {
      setFilteredItemCodes(
        itemCodes.filter(code =>
          code.toLowerCase().includes(value.toLowerCase()) &&
          !newItems.some(item => item.itemCode === code)
        )
      );
    }
  };

  // Handle item removal
  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    setImagePreview('');
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleItemCodeSelect = (index, code) => {
    const newItems = [...items];
    newItems[index].itemCode = code;
    setItems(newItems);
    setFilteredItemCodes([]);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!cusID.trim()) newErrors.cusID = 'Customer ID is required';

    items.forEach((item, index) => {
      if (!item.itemCode.trim()) {
        newErrors[`itemCode${index + 1}`] = `Item Code ${index + 1} is required`;
      }
      if (!item.qtyRequired.trim() || isNaN(item.qtyRequired) || parseFloat(item.qtyRequired) <= 0) {
        newErrors[`qtyRequired${index + 1}`] = `Quantity Required ${index + 1} must be a positive number `;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddItem = () => {
    setItems([...items, { itemCode: '', qtyRequired: '' }]);
  };

  const handleUpdateOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const orderItems = items.map(({ itemCode, qtyRequired }) => ({
      itemCode,
      qtyRequired: parseFloat(qtyRequired),
    }));

    const data = {
      CusID: cusID,
      Items: orderItems,
    };

    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));

      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const response = await axios.put(`http://localhost:5555/orders/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Response:", response.data);
      navigate('/orders/home');
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred. Please check the console for more details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">
          <img src='../../public/company-logo.png' className='company-logo' alt='company-logo' />
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
          <h1 className='text-3xl my-4'>Edit Order</h1>
          {loading && <Spinner />}
          {!loading && (
            <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
              {/* Input fields */}
              <div className='my-4'>
                <label className='text-xl text-gray-500'>Order ID</label>
                <input
                  type='text'
                  value={orderId}
                  readOnly
                  className='border-2 border-gray-500 px-4 py-2 w-full'
                />
              </div>
              <div className='my-4'>
                <label className='text-xl text-gray-500'>Customer ID</label>
                <input
                  type='text'
                  value={cusID}
                  readOnly
                  className='border-2 border-gray-500 px-4 py-2 w-full'
                />
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
                  {filteredItemCodes.length > 0 && (
                    <ul className="border border-gray-300">
                      {filteredItemCodes.map((code, i) => (
                        <li
                          key={i}
                          onClick={() => handleItemCodeSelect(index, code)}
                          className="cursor-pointer p-2 hover:bg-gray-100"
                        >
                          {code}
                        </li>
                      ))}
                    </ul>
                  )}
                  {errors[`itemCode${index + 1}`] && (
                    <p className="text-red-500">{errors[`itemCode${index + 1}`]}</p>
                  )}
                  <label className='text-xl text-gray-500'>Quantity Required</label>
                  <input
                    type='text'
                    value={item.qtyRequired}
                    onChange={(e) => handleItemChange(index, 'qtyRequired', e.target.value)}
                    className='border-2 border-gray-500 px-4 py-2 w-full'
                  />
                  {errors[`qtyRequired${index + 1}`] && (
                    <p className="text-red-500">{errors[`qtyRequired${index + 1}`]}</p>
                  )}
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded my-4"
                    onClick={() => handleRemoveItem(index)}
                    style={{ width: "25%" }}
                  >
                    Remove Item
                  </button>
                </div>
              ))}
              

              <div className='my-4'>
                <label className='text-xl text-gray-500'>Upload Receipt</label>
                <input
                  type='file'
                  onChange={handleImageChange}
                  className='border-2 border-gray-500 px-4 py-2 w-full'
                />
                {receiptPreview && <img src={receiptPreview} alt="Preview" className='my-4 w-full' />}
              </div>

              <button
                className="bg-blue-500 text-white px-4 py-2 rounded my-4"
                onClick={handleAddItem}
                style={{ width: "100%" }}
              >
                Add Another Item
              </button>

              <button

                onClick={handleUpdateOrder}
                className='bg-green-500 hover:bg-green-700 text-black px-4 py-2 rounded my-4'
                style={{ width: "100%" }}
              >
                Update Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditOrder;
