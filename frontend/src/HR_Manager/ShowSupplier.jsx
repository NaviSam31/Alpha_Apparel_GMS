import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../components/SupplierBackbutton';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';

const ShowSupplier = () => {
  const [supplier, setSupplier] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/supplier/${id}`)
      .then((response) => {
        setSupplier(response.data.data); // Accessing the nested data
        setLoading(false);
      }).catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">
          <img src="/company-logo.png" className='company-logo' alt='company-logo' />
        </div>
        <nav>
          {/* Navigation Links */}
          <div className='nav-dept'><Link to="/home"><img src='/home.png' className='icon' alt='home' />Home</Link></div>
          <div className='nav-dept'><Link to="/inventory/home"><img src='/inventory.png' className='icon' alt='inventory' />Inventory</Link></div>
          <div className='nav-dept'><Link to="/"><img src='/tshirt.png' className='icon' alt='design' />Design</Link></div>
          <div className='nav-dept'><Link to="/orders"><img src='/orders.png' className='icon' alt='orders' />Orders</Link></div>
          <div className='nav-dept'><Link to="/supplier"><img src='/supplier.png' className='icon' alt='supplier' />Supplier</Link></div>
          <div className='nav-dept'><Link to="/discounts/home"><img src='/marketing.png' className='icon' alt='marketing' />Marketing</Link></div>
          <div className='nav-dept'><Link to="/hr"><img src='/human-resource.png' className='icon' alt='hr' />Human Resource</Link></div>
          <div className='nav-dept'><Link to="/financial"><img src='/financial.png' className='icon' alt='financial' />Financial</Link></div>
          <div className='nav-dept'><Link to="/transport"><img src='/transport.png' className='icon' alt='transport' />Transport</Link></div>
        </nav>
      </div>

      {/* Supplier Details */}
      <div className="main-content">
        <header>
          <h1 className='text-3xl font-bold company-name'>Alpha Apperals PVT LTD</h1>
        </header>
        <div className="main-content flex-1 p-6">
            <br></br>
            <br></br>
            <br></br>
          <BackButton />
          <h1 className='text-3xl my-4'>Show Supplier Records</h1>
          {loading ? (
            <Spinner />
          ) : (
            <div id="supplier-details-card" className='flex flex-col border-2 border-sky-400 rounded-xl  w-fit p-4'style={{ width: "500px" }} >
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Supplier ID: </span>
                <span>{supplier._id}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Name: </span>
                <span>{supplier.name}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>NIC: </span>
                <span>{supplier.nic}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Phone: </span>
                <span>{supplier.phone}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Email: </span>
                <span>{supplier.email}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Product: </span>
                <span>{supplier.product}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Type: </span>
                <span>{supplier.type}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Unit Price: </span>
                <span>{supplier.unitPrice} USD</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Contract Start: </span>
                <span>{new Date(supplier.contractStart).toLocaleDateString()}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Contract End: </span>
                <span>{new Date(supplier.contractEnd).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowSupplier;
