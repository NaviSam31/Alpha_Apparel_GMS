import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete, MdSearch } from 'react-icons/md';
import Spinner from '../components/Spinner';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const SupplierHome = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  axios.get('http://localhost:5555/supplier')
  .then((response) => {
    console.log(response.data); // Check the entire response
    setSuppliers(response.data.data); // Access the 'data' field here
    setFilteredSuppliers(response.data.data); // Access the 'data' field here
    setLoading(false);
  })
  .catch((error) => {
    console.error('Error fetching supplier data:', error);
    setLoading(false);
  });



  useEffect(() => {
    if (searchQuery === '') {
      setFilteredSuppliers(suppliers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = suppliers.filter((supplier) =>
        supplier.name.toLowerCase().includes(query) ||
        supplier.nic.toLowerCase().includes(query)
      );
      setFilteredSuppliers(filtered);
    }
  }, [searchQuery, suppliers]);

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.setFontSize(17);
    doc.text('Alpha Apparel (PVT) LTD', 120, 20);
    doc.text('Supplier Report', 125, 35);
    doc.text('---------------------------------------------------------------------------------------------------------------', 50, 45);

    const now = new Date();
    const reportDate = now.toLocaleDateString();
    const reportTime = now.toLocaleTimeString();

    doc.setFontSize(10);
    doc.text(`Report generated on: ${reportDate} at ${reportTime}`, 10, 40);

    const columns = [
      { title: 'Name', dataKey: 'name' },
      { title: 'NIC', dataKey: 'nic' },
      { title: 'Phone', dataKey: 'phone' },
      { title: 'Email', dataKey: 'email' },
      { title: 'Product', dataKey: 'product' },
      { title: 'Type', dataKey: 'type' },
      { title: 'Unit Price', dataKey: 'unitPrice' },
      { title: 'Contract Start', dataKey: 'contractStart' },
      { title: 'Contract End', dataKey: 'contractEnd' },
    ];

    const data = filteredSuppliers.map(supplier => ({
      name: supplier.name,
      nic: supplier.nic,
      phone: supplier.phone,
      email: supplier.email,
      product: supplier.product,
      type: supplier.type,
      unitPrice: supplier.unitPrice,
      contractStart: supplier.contractStart,
      contractEnd: supplier.contractEnd,
    }));

    doc.autoTable(columns, data, { startY: 50 });

    let finalY = doc.lastAutoTable.finalY || 50;
    doc.text('----------------------------------------------------------------------------------------------------------------------------------------------------------', 60, finalY + 10);

    doc.save('supplier_report.pdf');
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
          <div className='nav-dept'><Link to=""><img src='/public/inventory.png' className='icon' alt='Inventory' /> Inventory</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/tshirt.png' className='icon' alt='Design' /> Design</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/orders.png' className='icon' alt='Orders' /> Orders</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/supplier.png' className='icon' alt='Supplier' /> Supplier</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/marketing.png' className='icon' alt='Marketing' /> Marketing</Link></div>
          <div className='nav-dept'><Link to="/employee/home"><img src='/public/human-resource.png' className='icon' alt='Human Resource' /> Human Resource</Link></div>
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
        <div className='header-container'>
          <h1 className='text-3xl font-bold'>Manage Suppliers Here</h1>
        </div>

        <div className='button-container'>
          <div className='search-container'>
            <div className='search-bar-container'>
              <MdSearch className='search-icon' />
              <input
                type='text'
                placeholder='Search by Name or NIC'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='search-bar'
              />
            </div>

            <Link to='/employee/home'>
            <button className='button buttonMaterial'  style={{ width: "160px",marginRight:"20px" }}>
              <img src='../public/user.png' className='icon' alt='Add' />Employee
            </button>
          </Link>
            
            

            <Link to='/supplier/create'>
            <button className='button buttonMaterial'  style={{ width: "200px" }}>
            <img src='../public/teaching.png' className='icon' alt='Add'/>Create Supplier
            </button>
          </Link>
          </div>
          <button
            onClick={generatePDF}
            className='button generate-report'
          >
            <span className='icon'><img src='../public/pdf.png' alt='PDF' /></span>Report (PDF)
          </button>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className='table-container'>
            <table className='dataTable'>
              <thead>
                <tr>
                  <th className='table-heading'>Name</th>
                  <th className='table-heading'>NIC</th>
                  <th className='table-heading'>Phone</th>
                  <th className='table-heading'>Email</th>
                  <th className='table-heading'>Product</th>
                  <th className='table-heading'>Type</th>
                  <th className='table-heading'>Unit Price</th>
                  <th className='table-heading'>Contract Start</th>
                  <th className='table-heading'>Contract End</th>
                  <th className='table-heading'>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((supplier) => (
                    <tr key={supplier._id} className="h-8">
                      <td className="border border-slate-700 rounded-md text-center">
                        {supplier.name || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {supplier.nic || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {supplier.phone || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {supplier.email || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {supplier.product || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {supplier.type || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {supplier.unitPrice || 0}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {supplier.contractStart ? new Date(supplier.contractStart).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {supplier.contractEnd ? new Date(supplier.contractEnd).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        <div className="flex justify-center gap-x-4">
                          <Link to={`/supplier/details/${supplier._id}`}>
                            <BsInfoCircle className="text-2xl text-green-800" />
                          </Link>
                          <Link to={`/supplier/edit/${supplier._id}`}>
                            <AiOutlineEdit className="text-2xl text-yellow-600" />
                          </Link>
                          <Link to={`/supplier/delete/${supplier._id}`}>
                            <MdOutlineDelete className="text-2xl text-red-600" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center p-4">
                      No supplier records found.
                    </td>
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

export default SupplierHome;
