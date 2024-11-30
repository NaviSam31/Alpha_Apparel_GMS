import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MdSearch } from 'react-icons/md';
import Spinner from '../../components/Spinner';

const ReOrderHome = () => {
  const [reOrders, setReOrders] = useState([]);
  const [filteredSizes, setFilteredSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/reOrder')
      .then((response) => {
        setReOrders(response.data);
        setFilteredSizes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching re-orders data:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredSizes(reOrders);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = reOrders.filter((reOrder) =>
        reOrder.Description.toLowerCase().includes(query) ||
        reOrder.Status.toLowerCase().includes(query)
      );
      setFilteredSizes(filtered);
    }
  }, [searchQuery, reOrders]);

  // Function to update the status of a re-order
  const updateStatus = (id, newStatus) => {
    axios
      .put(`http://localhost:5555/reOrder/${id}`, { Status: newStatus })
      .then((response) => {
        setReOrders((prev) => 
          prev.map((reOrder) => 
            reOrder._id === id ? { ...reOrder, Status: newStatus } : reOrder
          )
        );
        setFilteredSizes((prev) => 
          prev.map((reOrder) => 
            reOrder._id === id ? { ...reOrder, Status: newStatus } : reOrder
          )
        );
      })
      .catch((error) => {
        console.error('Error updating status:', error);
      });
  };

  return (
    <div className="flex">
      <div className="sidebar">
        <div className="brand">
          <img src='../public/company-logo.png' className='company-logo' alt='company-logo' />
        </div>
        <nav>
        <div className='nav-dept'><Link to="/"><img src='/public/home.png' className='icon' alt='Home' /> Home</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/inventory.png' className='icon' alt='Inventory' /> Inventory</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/tshirt.png' className='icon' alt='Design' /> Design</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/orders.png' className='icon' alt='Orders' /> Orders</Link></div>
          <div className='nav-dept'><Link to="/suppliers/home"><img src='/public/supplier.png' className='icon' alt='Supplier' /> Supplier</Link></div>
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
          <h1 className='text-3xl font-bold company-name'>Alpha Apparel PVT LTD</h1>
        </header>
        <div className='header-container'>
          <h1 className='text-3xl font-bold'>Manage All The Re-Orders Here</h1>
        </div>
        <div className='button-container'>
          <div className='search-container'>
            <div className='search-bar-container'>
              <MdSearch className='search-icon' />
              <input
                type='text'
                placeholder='Search by Status or Description'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='search-bar'
              />
            </div>
            <Link to='/suppliers/home'>
            <button className='button buttonMaterial'>
              <img src='../public/supplier.png' className='icon' alt='Material Requirement' /> Suppliers
            </button>
          </Link>
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className='table-container'>
              <table>
                <thead>
                  <tr>
                    <th className='border border-slate-600 bg-blue-500 text-white py-2'>Description</th>
                    <th className='border border-slate-600 bg-blue-500 text-white py-2'>Image</th>
                    <th className='border border-slate-600 bg-blue-500 text-white py-2'>Placed Date</th>
                    <th className='border border-slate-600 bg-blue-500 text-white py-2'>Status</th>
                    <th className='border border-slate-600 bg-blue-500 text-white py-2'>Remove Re-Order</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSizes.length > 0 ? (
                    filteredSizes.map((reOrder) => (
                      <tr key={reOrder._id} className="h-8">
                        <td className="border border-slate-700 rounded-md text-center">{reOrder.Description || 'N/A'}</td>
                        <td className="border border-slate-700 rounded-md text-center">
                          <center>
                            {reOrder.image ? (
                              <>
                                <img
                                  src={reOrder.image}
                                  alt={reOrder.image || 'Re-Order Report'}
                                  className="design-image"
                                />
                                <a 
                                  href={reOrder.image} 
                                  download 
                                  className="download-button"
                                  title="Download Image"
                                >
                                  Download
                                </a>
                              </>
                            ) : (
                              <span>No Image</span>
                            )}
                          </center>
                        </td>
                        <td className="border border-slate-700 rounded-md text-center">
                          {reOrder.createdAt ? (
                            <>
                              <div>{new Date(reOrder.createdAt).toLocaleDateString()}</div>
                              <div>{new Date(reOrder.createdAt).toLocaleTimeString()}</div>
                            </>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td className="border border-slate-700 rounded-md text-center">{reOrder.Status || 'N/A'}</td>
                        <td className="border border-slate-700 rounded-md text-center">
                          <div className="flex justify-center gap-x-4">
                            <button 
                              className='accepted'
                              onClick={() => updateStatus(reOrder._id, 'Accepted')}
                            >
                              Accepted
                            </button>
                            <button 
                              className='reject'
                              onClick={() => updateStatus(reOrder._id, 'Rejected')}
                            >
                              Rejected
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center p-4">No Re-Order requests Found!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReOrderHome;
