import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete, MdSearch } from 'react-icons/md';
import Spinner from '../../components/Spinner';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DisplayItemHome = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5555/items')
      .then((response) => {
        setItems(response.data);
        setFilteredItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching item data:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredItems(items);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = items.filter((item) =>
        item.itemCode.toLowerCase().includes(query) ||
        item.productName.toLowerCase().includes(query)
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  return (
    <div className="flex">
      {/* Sidebar */}
    
      {/* Main Content */}
      <div className="main-content">
        <header className="flex justify-between items-center p-4">
          <div className="brand">
            <img src='/company-logo.png' className='company-logo' alt='company-logo' />
          </div>
          <h1 className='text-3xl font-bold company-name'>Alpha Apparel PVT LTD</h1>
          <Link to="/login">
            <button className="btn-login bg-blue-500 text-white px-4 py-2 rounded">
              Login
            </button>
          </Link>
        </header>
        
        <div className='button-container'></div>
        <div className='button-container'>
          <div className='search-container'>
            <div className='search-bar-container'>
              <MdSearch className='search-icon' />
              <input
                type='text'
                placeholder='Search by Item Code or Product Name'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='search-bar'
              />
            </div>
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className='cards-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4'>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div key={item._id} className="card border rounded-lg shadow-md p-4">
                  <h2 className="text-xl font-bold">{item.productName || 'N/A'}</h2>
                  <p><strong>Item Code:</strong> {item.itemCode || 'N/A'}</p>
                  <p><strong>Description:</strong> {item.productDescription || 'N/A'}</p>
                  <p><strong>Unit:</strong> {item.unit || 'N/A'}</p>
                  <p><strong>Price:</strong> {item.price !== undefined ? item.price : 'N/A'}</p>
                  <div className="flex justify-center items-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.productName || 'Design Image'}
                        className="design-image max-w-full h-32 object-cover"
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center p-4">No item records found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayItemHome;
