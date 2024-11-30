import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete, MdSearch } from 'react-icons/md';
import Spinner from '../../components/Spinner';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReOrderHome = () => {
  const [reOrders, setReOrders] = useState([]); // Correct state name for re-orders
  const [filteredSizes, setFilteredSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch re-orders data
  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/reOrder')
      .then((response) => {
        setReOrders(response.data); // Correct the state to set reOrders
        setFilteredSizes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching re-orders data:', error);
        setLoading(false);
      });
  }, []);

  // Filter re-orders based on search query
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

  // const generatePDF = () => {
  //   const doc = new jsPDF();
  //   doc.setFontSize(17);
  //   doc.text('Alpha Apparel (PVT) LTD', 80, 20);
  //   doc.text('Size Report', 90, 35);
  //   doc.text('------------------------------------------------------------------------------------------', 15, 45);

  //   const columns = [
  //     { title: 'Design ID', dataKey: 'designID' },
  //     { title: 'Design Name', dataKey: 'designName' },
  //     { title: 'Description', dataKey: 'description' }
  //   ];

  //   const data = filteredSizes.map((size) => ({
  //     designID: size.designID,
  //     designName: size.DesignName,
  //     description: size.Description
  //   }));

  //   if (data.length > 0) {
  //     doc.autoTable(columns, data, { startY: 50 });
  //   } else {
  //     doc.text('No records found', 15, 50);
  //   }

  //   doc.save('Design_report.pdf');
  // };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">
          <img src='../public/company-logo.png' className='company-logo' alt='company-logo' />
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
          </div>
          <Link to='/reOrder/create'>
            <button className='button buttonAddNew'>
              <img src='../public/add.png' className='icon' alt='Add' /> Place Order
            </button>
          </Link>
          <Link to='/inventory/home'>
            <button className='button buttonMaterial'>
              <img src='../public/inventory.png' className='icon' alt='Inventory' /> Inventory
            </button>
          </Link>
          {/* <button onClick={generatePDF} className='button generate-report'>
            <span className='icon'><img src='../public/pdf.png' alt='PDF' /></span> Report (PDF)
          </button> */}
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
                      <tr
                        key={reOrder._id}
                        className={`h-8 table-row ${reOrder.Status === 'Rejected' ? 'rejected-row' : ''}`} // Corrected here
                      >
                        <td className="border border-slate-700 rounded-md text-center">{reOrder.Description || 'N/A'}</td>
                        <td className="border border-slate-700 rounded-md text-center">
                          <center>
                            {reOrder.image ? (
                              <img
                                src={reOrder.image}
                                alt={reOrder.image || 'Re-Order Report'}
                                className="design-image"
                              />
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
                            <Link to={`/reOrder/delete/${reOrder._id}`}>
                              <MdOutlineDelete className="text-3xl text-red-600" />
                            </Link>
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
