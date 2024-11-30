import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete, MdSearch } from 'react-icons/md';
import Spinner from '../../components/Spinner';
import jsPDF from 'jspdf';
import 'jspdf-autotable';



const CustomerHome = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedcity, setSelectedcity] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5555/customers')
      .then((response) => {
        setCustomers(response.data);
        setFilteredCustomers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching customer data:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = customers;

    // Filter based on search query
    if (searchQuery !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((customer) => {
        const customerIDString = customer.CustomerID ? String(customer.CustomerID).toLowerCase() : '';
        const customerNameString = customer.CustomerName ? customer.CustomerName.toLowerCase() : '';

        // Match either CustomerID or CustomerName
        return customerIDString.includes(query) || customerNameString.includes(query);
      });
    }

    // Filter based on selected city
    if (selectedcity) {
      filtered = filtered.filter((customer) => customer.City === selectedcity);
    }

    setFilteredCustomers(filtered);
  }, [searchQuery, selectedcity, customers]);
  

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(17);
    doc.text('Alpha Apparel (PVT) LTD', 120, 20);
    doc.text('Customer Report', 130, 35);
    doc.text('---------------------------------------------------------------------------', 80, 45);
    // Define the columns
    const columns = [
      { title: 'Customer ID', dataKey: 'CustomerID' },
      { title: 'Customer Name', dataKey: 'CustomerName' },
      { title: 'Address', dataKey: 'Address' },
      { title: 'City', dataKey: 'City' },
      { title: 'Country', dataKey: 'Country' },
      { title: 'Primary Contact No.', dataKey: 'ContactNo1' },
      { title: 'Secondary Contact No.', dataKey: 'ContactNo2' },
      { title: 'Email', dataKey: 'Email' },
    ];

    // Map customer data to be used in the PDF
    const data = filteredCustomers.map((customer) => ({
      CustomerID: customer.CustomerID || 'N/A',
      CustomerName: customer.CustomerName || 'N/A',
      Address: customer.Address || 'N/A',
      City: customer.City || 'N/A',
      Country: customer.Country || 'N/A',
      ContactNo1: customer.ContactNo1 || 'N/A',
      ContactNo2: customer.ContactNo2 || 'N/A',
      Email: customer.Email || 'N/A',
    }));

    // Generate the table with the data
    doc.autoTable({
      head: [columns.map(col => col.title)], // Set the table headers
      body: data.map(item => columns.map(col => item[col.dataKey])), // Set the table body
      startY: 50
    });

    // Save the generated PDF
    doc.save('customer_report.pdf');
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
          <h1 className='text-3xl font-bold company-name'>Alpha Apperals PVT LTD</h1>
        </header>
        <div className='button-container'></div>
        <div className='button-container'>
          <div className='search-container'>
            <div className='search-bar-container'>
              <MdSearch className='search-icon' />
              <input
                type='text'
                placeholder='Search by Customer ID or Customer Name'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='search-bar'
              />
            </div>
            <select
              value={selectedcity}
              onChange={(e) => setSelectedcity(e.target.value)}
              className="filter-dropdown"
              style={{
                width: '200px', // Set a specific width
                padding: '10px', // Add padding for better spacing
                fontSize: '16px', // Adjust font size
                color: '#333', // Text color
                backgroundColor: '#f5f5f5', // Background color
                border: '1px solid #ccc', // Border styling
                borderRadius: '5px', // Rounded corners
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
                outline: '1px', // Remove outline
                
              }}
            >
              <option value="">Filter By City</option>
              <option value="Mathara">Mathara</option>
              <option value="Negambo">Negambo</option>
              <option value="Nugegoda">Nugegoda</option>
              <option value="Borella">Borella</option>
              
            </select>
          </div>
          <Link to='/customers/create'>
            <button className='button buttonAddNew' style={{ width: "180px" }}>
              <img src='../public/add.png' className='icon' alt='Add' /> Add Customer
            </button>
          </Link>
          <Link to='/orders/home'>
            <button className='button buttonMaterial'>
              <img src='../public/order.png' className='icon' alt='Sizes' /> Place Order
            </button>
          </Link>
          <Link to='/items/home'>
            <button className='button buttonMaterial'>
              <img src='../public/order.png' className='icon' alt='Sizes' /> Listed Items
            </button>
          </Link>
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
          <div className='table-container Customer-home'>
            <table>
              <thead>
                <tr>
                  <th className='table-heading max-md:hidden'>Customer ID</th>
                  <th className='table-heading'>Customer Name</th>
                  <th className='table-heading'>Address</th>
                  <th className='table-heading'>City</th>
                  <th className='table-heading'>Country</th>
                  <th className='table-heading max-md:hidden'>CountryCode</th>
                  <th className='table-heading max-md:hidden'>Primary ContactNo</th>
                  <th className='table-heading max-md:hidden'>Secondary ContactNo</th>
                  <th className='table-heading max-md:hidden'>Email</th>
                  <th className='table-heading'></th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr key={customer._id} className="h-8">
                      <td className="border border-slate-700 rounded-md text-center">
                        {customer.CustomerID || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center max-md:hidden">
                        {customer.CustomerName || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {customer.Address || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {customer.City || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center max-md:hidden">
                        {customer.Country || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {customer.CountryCode || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {customer.ContactNo1 || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {customer.ContactNo2 || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {customer.Email || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        <div className="flex justify-center gap-x-4">
                          <Link to={`/customers/details/${customer._id}`}>
                            <BsInfoCircle className="text-2xl text-green-800" />
                          </Link>
                          <Link to={`/customers/edit/${customer._id}`}>
                            <AiOutlineEdit className="text-2xl text-yellow-600" />
                          </Link>
                          <Link to={`/customers/delete/${customer._id}`}>
                            <MdOutlineDelete className="text-2xl text-red-600" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center p-4">
                      No registered customers records found.
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

export default CustomerHome;
