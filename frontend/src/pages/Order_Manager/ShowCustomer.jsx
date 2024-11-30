import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../../components/customerBackButton';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const ShowCustomer = () => {
  const [customers, setCustomers] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/customers/${id}`)
      .then((response) => {
        setCustomers(response.data);
        setLoading(false);
      }).catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(17);
    doc.text('Alpha Apparel (PVT) LTD', 120, 20);
    doc.text('Customer Report', 130, 35);
    doc.text('---------------------------------------------------------------------------', 80, 45);

    // Define the columns
    const columns = [
      { title: 'Field', dataKey: 'field' },
      { title: 'Value', dataKey: 'value' },
    ];

    // Prepare the customer data for the PDF
    const data = [
      { field: 'Customer ID', value: customers.CustomerID || 'N/A' },
      { field: 'Customer Name', value: customers.CustomerName || 'N/A' },
      { field: 'Address', value: customers.Address || 'N/A' },
      { field: 'City', value: customers.City || 'N/A' },
      { field: 'Country', value: customers.Country || 'N/A' },
      { field: 'Primary Contact No.', value: customers.ContactNo1 || 'N/A' },
      { field: 'Secondary Contact No.', value: customers.ContactNo2 || 'N/A' },
      { field: 'Email', value: customers.Email || 'N/A' },
      { field: 'Create Time', value: new Date(customers.createdAt).toString() },
      { field: 'Update Time', value: new Date(customers.updatedAt).toString() },
    ];

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
        <img src="/company-logo.png" className='company-logo' alt='company-logo'></img>
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

        {/* Design Details */}
        <div className="main-content flex-1 p-6">
          <BackButton />
          <h1 className='text-3xl my-4'>Customer Profile</h1>
          {loading ? (
            <Spinner />
          ) : (
            <div className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4'>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>ID: </span>
                <span>{customers._id}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Customer ID: </span>
                <span>{customers.CustomerID}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Customer Name: </span>
                <span>{customers.CustomerName}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Address: </span>
                <span>{customers.Address}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>City: </span>
                <span>{customers.City}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Country: </span>
                <span>{customers.Country}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>CountryCode: </span>
                <span>{customers.CountryCode}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Primary Contact No: </span>
                <span>{customers.ContactNo1}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Secondary Contact No: </span>
                <span>{customers.ContactNo2}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Email: </span>
                <span>{customers.Email}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Create Time: </span>
                <span>{new Date(customers.createdAt).toString()}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Update Time: </span>
                <span>{new Date(customers.updatedAt).toString()}</span>
              </div>
              <button onClick={generatePDF} className='button buttonAddNew'
                            style={{ 
                                width: '100%', 
                                height: '5%', 
                                justifyContent: 'center' ,
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                            }}>
                                <span className='icon'><img src='../../public/pdf.png' alt='PDF' /></span> Generate Report (PDF)
                            </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowCustomer;
