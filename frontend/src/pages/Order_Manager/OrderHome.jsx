import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete, MdSearch } from 'react-icons/md';
import Spinner from '../../components/Spinner';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const OrderHome = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxItems, setMaxItems] = useState(0);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5555/orders') // Update with your API endpoint
      .then((response) => {
        const fetchedOrders = response.data;
        setOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders);

        // Find the maximum number of items in any order
        const maxItemsInOrder = Math.max(...fetchedOrders.map(order => order.Items.length));
        setMaxItems(maxItemsInOrder);

        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching order data:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredOrders(orders);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = orders.filter((order) => {
        const orderId = String(order.OrderID).toLowerCase(); // Convert to string
        const cusId = String(order.CusID).toLowerCase(); // Convert to string
        return orderId.includes(query) || cusId.includes(query);
      });
      setFilteredOrders(filtered);
    }
  }, [searchQuery, orders]);


  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(17);
    doc.text('Alpha Apparel (PVT) LTD', 80, 20);
    doc.text('Order Report', 90, 35);
    doc.text('------------------------------------------------------------------------------------------', 15, 45);

    const columns = [
      { title: 'Order ID', dataKey: 'OrderID' },
      { title: 'Customer ID', dataKey: 'CusID' },
      ...Array.from({ length: maxItems }, (_, index) => ({
        title: `Item ${index + 1}`,
        dataKey: `Item${index + 1}`
      })),
      ...Array.from({ length: maxItems }, (_, index) => ({
        title: `Quantity ${index + 1}`,
        dataKey: `Qty${index + 1}`
      }))
    ];

    const data = filteredOrders.map(order => {
      const rowData = {
        OrderID: order.OrderID,
        CusID: order.CusID,
      };

      // Add item codes and quantities
      order.Items.forEach((item, index) => {
        rowData[`Item${index + 1}`] = item.itemCode;
        rowData[`Qty${index + 1}`] = item.qtyRequired;
      });

      // Fill remaining columns with 'N/A' and 0
      for (let i = order.Items.length; i < maxItems; i++) {
        rowData[`Item${i + 1}`] = 'N/A';
        rowData[`Qty${i + 1}`] = 0;
      }

      return rowData;
    });

    doc.autoTable(columns, data, { startY: 50 });
    doc.save('Order_report.pdf');
  };

  // Function to handle completing an order
  const handleCompleteOrder = (orderId) => {
    // Find the order and update its status to 'Completed'
    const updatedOrders = orders.map(order =>
      order._id === orderId ? { ...order, status: 'Completed' } : order
    );
    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders);
  };

  return (
    <div className="flex">
      <div className="sidebar">
        <div className="brand">
          <img src="/company-logo.png" className='company-logo' alt='company-logo' />
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
                placeholder='Search by Order ID or Customer ID'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='search-bar'
              />
            </div>
          </div>
          {/* Buttons for adding orders and generating report */}
          <Link to='/customers/home'>
            <button className='button buttonMaterial'>
              <img src='../public/user.png' className='icon' alt='Add' /> Customer
            </button>
          </Link>
          <Link to='/orders/create'>
            <button className='button buttonAddNew'>
              <img src='../public/add.png' className='icon' alt='Add' /> Add Order
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
                  <th className='table-heading'>Order ID</th>
                  <th className='table-heading'>Customer ID</th>
                  {Array.from({ length: maxItems }, (_, index) => (
                    <React.Fragment key={index}>
                      <th className='table-heading'>Item {index + 1}</th>
                      <th className='table-heading'>Qty {index + 1}</th>
                    </React.Fragment>
                  ))}
                  {/* New Payment Slip Header */}
                  <th className="table-heading">Payment Slip</th>
                  {/* Action Buttons Header */}
                  <th className="table-heading">Actions</th>
                  <th className='table-heading'>Complete</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="border border-slate-700 rounded-md text-center">{order.OrderID}</td>
                      <td className="border border-slate-700 rounded-md text-center">{order.CusID || 'N/A'}</td>
                      {order.Items.map((item, index) => (
                        <React.Fragment key={index}>
                          <td className="border border-slate-700 rounded-md text-center">{item.itemCode}</td>
                          <td className="border border-slate-700 rounded-md text-center">{item.qtyRequired}</td>
                        </React.Fragment>
                      ))}
                      {/* Add empty columns for missing items */}
                      {Array.from({ length: maxItems - order.Items.length }, (_, index) => (
                        <React.Fragment key={index}>
                          <td className="border border-slate-700 rounded-md text-center">N/A</td>
                          <td className="border border-slate-700 rounded-md text-center">0</td>
                        </React.Fragment>
                      ))}

                      <td className="border border-slate-700 rounded-md text-center">
                        <center>
                          {order.image ? (
                            <img
                              src={order.image}
                              alt="Payment Slip"
                              className="payment-slip-image"
                            />
                          ) : (
                            <span>No Image</span>
                          )}
                        </center>
                      </td>


                      {/* Action buttons (Edit, Delete) */}
                      <td className="border border-slate-700 rounded-md text-center">
                        <div className="flex justify-center gap-x-4">
                          <Link to={`/orders/edit/${order._id}`}>
                            <AiOutlineEdit className="text-2xl text-yellow-600" />
                          </Link>
                          <Link to={`/orders/details/${order._id}`}>
                            <BsInfoCircle className="text-2xl text-green-800" />
                          </Link>

                          <Link to={`/orders/delete/${order._id}`}>
                            <MdOutlineDelete className="text-2xl text-red-600" />
                          </Link>
                        </div>
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {order.status === 'Completed' ? (
                          <span style={{ color: 'green', fontWeight: 'bold' }}>Completed</span>
                        ) : (
                          <button
                            onClick={() => handleCompleteOrder(order._id)}
                            style={{
                              backgroundColor: '#4CAF50',
                              color: 'white',
                              padding: '8px 12px',
                              border: 'none',
                              borderRadius: '5px',
                              width: '95%',
                              fontWeight: 'bold'
                            }}
                          >
                            Complete
                          </button>
                        )}
                      </td>

                    </tr>

                  ))
                ) : (
                  <tr>
                    <td colSpan={maxItems * 2 + 4} className="text-center p-4">No order records found.</td>
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

export default OrderHome;
