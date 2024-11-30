import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../../components/DisplayItemBackButton';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';

const ShowDisplayItem = () => {
  const [item, setItem] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/items/${id}`)
      .then((response) => {
        setItem(response.data);
        setLoading(false);
      }).catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  // Convert Base64 string to Data URL (if necessary)
  const getBase64ImageUrl = (base64String) => {
    return `data:${item.contentType};base64,${base64String}`;
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">
          <img src="/company-logo.png" className='logo' alt='company-logo' />
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

      {/* Item Details */}
      <div className="main-content">
        <header>
          <h1 className='text-3xl font-bold company-name'>Alpha Apperals PVT LTD</h1>
        </header>
        <div className='button-container'></div>
        <div className="main-content flex-1 p-6">
          <BackButton />
          <h1 className='text-3xl my-4'>Show Item Records</h1>
          {loading ? (
            <Spinner />
          ) : (
            <div id="item-details-card" className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4'>
              {/* Display Image */}
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Item Image: </span>
                {item.image ? (
                  <center>
                    <img
                      src={item.image} // Directly use the base64 string or image URL
                      alt={item.itemName || 'Item Image'}
                      className="w-full h-auto border border-gray-500 rounded"
                    />
                  </center>
                ) : (
                  <span>No Image</span>
                )}
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>ID: </span>
                <span>{item._id}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Item Code: </span>
                <span>{item.itemCode}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Item Name: </span>
                <span>{item.productName}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Description: </span>
                <span>{item.productDescription}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Create Time: </span>
                <span>{new Date(item.createdAt).toString()}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Update Time: </span>
                <span>{new Date(item.updatedAt).toString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowDisplayItem;
