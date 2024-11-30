import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdOutlineAddBox, MdOutlineDelete, MdSearch } from 'react-icons/md';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import"./placeOrder.css"

function AllOrders() {
  const [orderlist, setOrderlist] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchbtn, setSearchBtn] = useState("");
  const [loading, setLoading] = useState(false); // Define loading state
  const componentPDF = useRef();

  const getfetchdetails = async () => {
    try {
      const response = await axios.get("http://localhost:5555/supplierOrder");
      if (response.data.success) {
        setOrderlist(response.data.data);
        setFilteredOrders(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    getfetchdetails();
  }, []);

  useEffect(() => {
    if (searchbtn.trim() === "") {
      setFilteredOrders(orderlist);
    } else {
      const filteredData = orderlist.filter((order) =>
        order.nic.toLowerCase().includes(searchbtn.toLowerCase())
      );
      setFilteredOrders(filteredData);
    }
  }, [searchbtn, orderlist]);

  const handledelete = async (id) => {
    setLoading(true); // Set loading state to true
    try {
      const response = await axios.delete(`http://localhost:5555/supplierOrder/${id}`);
      if (response.data.success) {
        getfetchdetails(); // Refresh the order list after deletion
        alert("Order deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting order:", err);
      alert('An error occurred. Please check the console');
    } finally {
      setLoading(false); // Set loading state to false after request completes
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Alpha Apparel (PVT) LTD', 14, 22);
    doc.text('Orders Report', 14, 30);

    const columns = [
      { title: 'Supplier Name', dataKey: 'name' },
      { title: 'NIC', dataKey: 'nic' },
      { title: 'Product', dataKey: 'product' },
      { title: 'Quantity', dataKey: 'quantity' },
      { title: 'Date', dataKey: 'date' },
    ];

    const data = filteredOrders.map(order => ({
      name: order.name,
      nic: order.nic,
      product: order.product,
      quantity: isNaN(Number(order.quantity)) ? 'N/A' : Number(order.quantity),
      date: formatDate(order.date),
    }));

    doc.autoTable(columns, data, { startY: 40 });
    doc.save('orders_report.pdf');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      return 'Invalid Date';
    }
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
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
          <h1 className='text-3xl font-bold company-name'>Alpha Apparels PVT LTD</h1>
        </header>
        <h1 className='text-3xl font-bold' style={{ marginLeft: "-390px", marginTop: "70px" }}>
  Manage All The Orders Here
</h1>


        <div className='button-container'>
          <div className='search-container'>
            <div className='search-bar-container'>
              <MdSearch className='search-icon' />
              <input
                type='text'
                placeholder='Search by NIC'
                value={searchbtn}
                onChange={(e) => setSearchBtn(e.target.value)}
                className='search-bar'
                aria-label="Search"
              />
            </div>
          </div>
          <button onClick={generatePDF} className="button generate-report" type="button">
            Generate Report
            <img style={{ height: "20px", marginLeft: "5px" }} src="pdf.png" alt="Generate PDF" />
          </button>
          <Link to='/suppliers/home'>
            <button className='button buttonMaterial'>
              <img src='../public/supplier.png' className='icon' alt='Material Requirement' /> Suppliers
            </button>
          </Link>
        </div>

        {filteredOrders.length === 0 ? (
          <p style={{ textAlign: "center" }}>No data found</p>
        ) : (
          <>
            <table ref={componentPDF} className="supplierTable">
              <thead>
                <tr>
                  <th>Supplier Name</th>
                  <th>NIC</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Date</th>
                  <th>Edit Order</th>
                  <th>Delete</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => {
                  console.log(order._id); 
                  return (
                    <tr key={order._id}>
                      <td>{order.name}</td>
                      <td>{order.nic}</td>
                      <td>{order.product}</td>
                      <td>{isNaN(Number(order.quantity)) ? 'N/A' : Number(order.quantity)}</td>
                      <td>{formatDate(order.date)}</td>
                      <td>
                        <Link to={`/updateorder/${order._id}`}>
                          <button className="editBtn">
                            Edit
                          </button>
                        </Link>
                      </td>
                      <td>
                        <button
                          onClick={() => handledelete(order._id)}
                          className="deleteBtn"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}

              </tbody>
            </table>
          </>
        )}
        {loading && <p>Loading...</p>} {/* Display loading message if loading */}
      </div>
    </div>
  );
}

export default AllOrders;
