import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete, MdSearch } from 'react-icons/md';
import Spinner from '../../components/Spinner';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DesignHome = () => {
  const [designs, setDesigns] = useState([]);
  const [filteredSizes, setFilteredSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5555/designs')
      .then((response) => {
        setDesigns(response.data);
        setFilteredSizes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching design data:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredSizes(designs);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = designs.filter((design) =>
        design.designID.toLowerCase().includes(query) ||
        design.DesignName.toLowerCase().includes(query));
      setFilteredSizes(filtered);
    }
  }, [searchQuery, designs]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(17);
    doc.text('Alpha Apparel (PVT) LTD', 80, 20);
    doc.text('Design Report', 90, 35);
    doc.text('------------------------------------------------------------------------------------------', 15, 45);
  
    // Get the current date and format it
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString(); // MM/DD/YYYY format or according to locale
  
    // Add the date below the header
    doc.setFontSize(12);
    doc.text(`Date: ${formattedDate}`, 15, 50);
  
    const columns = [
      { title: 'Design ID', dataKey: 'designID' },
      { title: 'Design Name', dataKey: 'designName' },
      { title: 'Description', dataKey: 'description' }
    ];
  
    const data = filteredSizes.map(size => ({
      designID: size.designID,
      designName: size.DesignName,
      description: size.Description
    }));
  
    // Adjust the startY for the table to avoid overlapping the date
    if (data.length > 0) {
      doc.autoTable(columns, data, { startY: 60 });
    } else {
      doc.text('No records found', 15, 60);
    }
  
    // Save the PDF
    doc.save('Design_report.pdf');
  };
  

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">
          <img src='../public/company-logo.png' className='company-logo' alt='company-logo' />
        </div>
        <nav>
          <div className='nav-dept'><Link to="/"><img src='/public/home.png' className='icon' alt='Home' /> Home</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/inventory.png' className='icon' alt='Inventory' /> Inventory</Link></div>
          <div className='nav-dept'><Link to="/design/home"><img src='/public/tshirt.png' className='icon' alt='Design' /> Design</Link></div>
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
          <h1 className='text-3xl font-bold'>Manage All The Designs Here</h1>
        </div>
        <div className='button-container'>
          <div className='search-container'>
            <div className='search-bar-container'>
              <MdSearch className='search-icon' />
              <input
                type='text'
                placeholder='Search by Design ID or Design Name'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='search-bar'
              />
            </div>
            
          </div>
          <Link to='/designs/create'>
            <button className='button buttonAddNew'>
              <img src='../public/add.png' className='icon' alt='Add' /> Add New
            </button>
          </Link>
          <Link to='/sizes/home'>
            <button className='button buttonMaterial'>
              <img src='../public/tape-measure.png' className='icon' alt='Sizes' /> Sizes
            </button>
          </Link>
          <Link to='/materialRequirement/home'>
            <button className='button buttonMaterial'>
              <img src='../public/machine.png' className='icon' alt='Material Requirement' /> Materials
            </button>
          </Link>
          <button onClick={generatePDF} className='button generate-report'>
            <span className='icon'><img src='../public/pdf.png' alt='PDF' /></span> Report (PDF)
          </button>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className='table-container'>
              <table>
                <thead>
                  <tr>
                    <th className='border border-slate-600 bg-blue-500 text-white py-2'>Design ID</th>
                    <th className='border border-slate-600 bg-blue-500 text-white py-2'>Design Name</th>
                    <th className='border border-slate-600 bg-blue-500 text-white py-2'>Description</th>
                    <th className='border border-slate-600 bg-blue-500 text-white py-2'>Image</th>
                    <th className='border border-slate-600 bg-blue-500 text-white py-2'></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSizes.length > 0 ? (
                    filteredSizes.map((design) => (
                      <tr key={design._id} className="h-8">
                        <td className="border border-slate-700 rounded-md text-center">{design.designID}</td>
                        <td className="border border-slate-700 rounded-md text-center">{design.DesignName || 'N/A'}</td>
                        <td className="border border-slate-700 rounded-md text-center">{design.Description || 'N/A'}</td>
                        <td className="border border-slate-700 rounded-md text-center">
                          <center>
                            {design.image ? (
                              <img
                                src={design.image}
                                alt={design.DesignName || 'Design Image'}
                                className="design-image"
                              />
                            ) : (
                              <span>No Image</span>
                            )}
                          </center>
                        </td>
                        <td className="border border-slate-700 rounded-md text-center">
                          <div className="flex justify-center gap-x-4">
                            <Link to={`/designs/details/${design._id}`}>
                              <BsInfoCircle className="text-2xl text-green-800" />
                            </Link>
                            <Link to={`/designs/edit/${design._id}`}>
                              <AiOutlineEdit className="text-2xl text-yellow-600" />
                            </Link>
                            <Link to={`/designs/delete/${design._id}`}>
                              <MdOutlineDelete className="text-2xl text-red-600" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center p-4">No design records found.</td>
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

export default DesignHome;
