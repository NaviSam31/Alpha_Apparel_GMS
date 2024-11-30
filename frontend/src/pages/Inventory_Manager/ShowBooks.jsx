import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import BackButton from '../../components/InventoryBackButton';
import Spinner from '../../components/Spinner';

const ShowBooks = () => {
  const [inventory, setInventory] = useState({});
  const [loading, setLoading] = useState(false);
  const { itemCode } = useParams();
  const [user, setUser] = useState(null); // State to store logged-in user
  const [orderAmount, setOrderAmount] = useState(0); // State for order quantity
  const [orderUnit, setOrderUnit] = useState('cm'); // State for order unit, default to 'cm'

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser)); // Assuming user info is stored as JSON
    }

    if (!itemCode) {
      console.error("No itemCode provided in route parameters.");
      return;
    }

    setLoading(true);
    axios.get(`http://localhost:5555/inventory/${itemCode}`)
      .then((response) => {
        setInventory(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [itemCode]);



  const handleGenerateReport = () => {
    if (orderAmount <= 0 || !orderUnit) {
      alert('Please enter a valid quantity and unit for the reorder.');
      return;
    }
  
    // Get the current date and format it
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString(); // This will give a date in MM/DD/YYYY format or according to the user's locale
  
    // Create a temporary div to render the content
    const reportDiv = document.createElement('div');
    reportDiv.style.width = '700px';
    reportDiv.style.height = '400px';
    reportDiv.style.padding = '20px';
    reportDiv.style.backgroundColor = '#f0f0f0'; // Light gray background for card
  
    // Add content to the div as HTML elements
    reportDiv.innerHTML = `
      <h2 style="text-align:center; font-size:20px;">Alpha Apparel (PVT) LTD</h2>
      <h3 style="text-align:center; font-size:17px;">Re-Order Item Report</h3>
      <br><br>
      <div style="background-color:#f0f0f0; padding:20px; border:1px solid #000;font-size:17px;">
        <p><strong>Item Code:</strong> ${inventory.itemCode}</p>
        <p><strong>Product Name:</strong> ${inventory.productName}</p>
        <p><strong>Product Category:</strong> ${inventory.productCategory}</p>
        <p><strong>Quantity to Order:</strong> ${orderAmount}</p>
        <p><strong>Unit:</strong> ${orderUnit}</p>
        <br><br>
        <p><strong>Date:</strong> ${formattedDate}</p> <!-- Added the date -->
        <p style="text-align:right;"><strong>Prepared by:</strong> ${user ? user.name : 'Inventory Manager'}</p>
      </div>
    `;
  
    // Append the temporary div to the body (hidden)
    document.body.appendChild(reportDiv);
  
    // Use html2canvas to capture the content and generate a JPG
    html2canvas(reportDiv).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
  
      // Create a link element to download the JPG
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `reorder_report_${inventory.itemCode}.jpg`;
      link.click();
  
      // Remove the temporary div
      document.body.removeChild(reportDiv);
    });
  };
  
  
  
  
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">
          <img src='/company-logo.png' className='company-logo' alt='company-logo'></img>
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
          <div className='nav-dept'><Link to="/transport/home"><img src='/public/transport.png' className='icon' alt='Transport' /> Transport</Link></div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="flex justify-between items-center p-4">
          <h1 className='text-3xl font-bold company-name'>Alpha Apperals PVT LTD</h1>
          {user && (
            <div className="user-info">
              <span className="text-lg text-gray-700">Logged in as: {user.name}</span>
            </div>
          )}
        </header>
        <div className='button-container'></div>
        <div className='main-content p-4'>
          <BackButton />
          <h1 className='text-3xl my-4 text-center'>View Product</h1>

          {loading ? (
            <Spinner />
          ) : (
            <div className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4 max-w-md'>
              <div className='flex flex-col'>
                <div className='my-4'>
                  <span className='text-xl mr-4 text-gray-500'>Item Code:</span>
                  <span>{inventory.itemCode}</span>
                </div>
                <div className='my-4'>
                  <span className='text-xl mr-4 text-gray-500'>Product Name:</span>
                  <span>{inventory.productName}</span>
                </div>
                <div className='my-4'>
                  <span className='text-xl mr-4 text-gray-500'>Product Category:</span>
                  <span>{inventory.productCategory}</span>
                </div>
                <div className='my-4'>
                  <span className='text-xl mr-4 text-gray-500'>Product Description:</span>
                  <span>{inventory.productDescription}</span>
                </div>
                <div className='my-4'>
                  <span className='text-xl mr-4 text-gray-500'>Selling Price:</span>
                  <span>{inventory.price}</span>
                </div>
                <div className='my-4'>
                  <span className='text-xl mr-4 text-gray-500'>Quantity Available:</span>
                  <span>{inventory.Quantity} {inventory.unit}</span>
                </div>
                <div className='my-4'>
                  <span className='text-xl mr-4 text-gray-500'>Create Time:</span>
                  <span>{inventory.createdAt ? new Date(inventory.createdAt).toString() : 'N/A'}</span>
                </div>
                <div className='my-4'>
                  <span className='text-xl mr-4 text-gray-500'>Last Update Time:</span>
                  <span>{inventory.updatedAt ? new Date(inventory.updatedAt).toString() : 'N/A'}</span>
                </div>
              </div>
              {/* Reorder Section */}
              <div className='my-4'>
                <h2 className='text-2xl mb-2'>Reorder Section</h2>
                <input
                  type='number'
                  value={orderAmount}
                  onChange={(e) => setOrderAmount(e.target.value)}
                  placeholder='Enter quantity to order'
                  className='border p-2 rounded w-full'
                />
                <select
                  value={orderUnit}
                  onChange={(e) => setOrderUnit(e.target.value)}
                  className='border p-2 rounded w-full mt-2'
                >
                  <option value='cm'>cm</option>
                  <option value='m'>m</option>
                  <option value='yards'>yards</option>
                  <option value='items'>items</option>
                </select>
                <button
                  onClick={handleGenerateReport}
                  className='bg-blue-500 text-white p-2 rounded mt-2 w-full'
                >
                  Generate Reorder Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowBooks;
