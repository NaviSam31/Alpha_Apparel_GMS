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
        item.productName.toLowerCase().includes(query) // Changed itemName to productName
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(17);
    doc.text('Alpha Apparel (PVT) LTD', 80, 20);
    doc.text('Item Report', 90, 35);
    doc.text('------------------------------------------------------------------------------------------', 15, 45);

    const columns = [
      { title: 'Item Code', dataKey: 'itemCode' },
      { title: 'Product Name', dataKey: 'productName' }, // Changed to productName
      { title: 'Description', dataKey: 'productDescription' }, // Changed to productDescription
      { title: 'Unit', dataKey: 'unit' }, // Added unit
      { title: 'Price', dataKey: 'price' }, // Added price
       
    ];

    const data = filteredItems.map(item => ({
      itemCode: item.itemCode,
      productName: item.productName,
      productDescription: item.productDescription,
      unit: item.unit, // Added unit
      price: item.price, // Added price
     
    }));

    if (data.length > 0) {
      doc.autoTable(columns, data, { startY: 50 });
    } else {
      doc.text('No records found', 15, 50);
    }

    doc.save('Item_report.pdf');
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
          <h1 className='text-3xl font-bold company-name'>Alpha Apparel PVT LTD</h1>
        </header>
        <div className='button-container'></div>
        <div className='button-container'>
          <div className='search-container'>
            <div className='search-bar-container'>
              <MdSearch className='search-icon' />
              <input
                type='text'
                placeholder='Search by Item Code or Product Name' // Updated placeholder
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='search-bar'
              />
            </div>

          </div>
          <Link to='/customers/home'>
            <button className='button buttonMaterial'>
              <img src='../public/user.png' className='icon' alt='Add' /> Customer
            </button>
          </Link>
          <Link to='/items/create'>
            <button className='button buttonAddNew'>
              <img src='../public/add.png' className='icon' alt='Add' /> Add Item
            </button>
          </Link>

          <button onClick={generatePDF} className='button generate-report'>
            <span className='icon'><img src='../public/pdf.png' alt='PDF' /></span> Report (PDF)
          </button>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  <th className='table-heading'>Item Code</th>
                  <th className='table-heading'>Product Name</th> {/* Changed to Product Name */}
                  <th className='table-heading'>Description</th>
                  <th className='table-heading'>Unit</th> {/* Added Unit */}
                  <th className='table-heading'>Price</th>
                  <th className='table-heading'>Design Image</th> {/* Added Price */}
                  <th className='table-heading max-md:hidden'></th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item._id} className="h-8">
                      <td className="border border-slate-700 rounded-md text-center">{item.itemCode}</td>
                      <td className="border border-slate-700 rounded-md text-center">{item.productName || 'N/A'}</td> {/* Updated to productName */}
                      <td className="border border-slate-700 rounded-md text-center">{item.productDescription || 'N/A'}</td> {/* Updated to productDescription */}
                      <td className="border border-slate-700 rounded-md text-center">{item.unit || 'N/A'}</td> {/* Added Unit */}
                      <td className="border border-slate-700 rounded-md text-center">{item.price !== undefined ? item.price : 'N/A'}</td> {/* Added Price */}
                      <td className="border border-slate-700 rounded-md text-center">
                        <center>
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.productName || 'Item Image'}
                              className="Item-image"
                            />
                          ) : (
                            <span>No Image</span>
                          )}
                        </center>
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        <div className="flex justify-center gap-x-4">
                          <Link to={`/items/details/${item._id}`}>
                            <BsInfoCircle className="text-2xl text-green-800" />
                          </Link>
                          <Link to={`/items/edit/${item._id}`}>
                            <AiOutlineEdit className="text-2xl text-yellow-600" />
                          </Link>
                          <Link to={`/items/delete/${item._id}`}>
                            <MdOutlineDelete className="text-2xl text-red-600" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-4">No item records found.</td> {/* Changed colspan to 6 */}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayItemHome;
