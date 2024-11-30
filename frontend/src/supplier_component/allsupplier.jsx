import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { MdSearch } from 'react-icons/md';
import"../supplier_order_comonent/placeOrder.css"


function AllSupplier() {
  const [supplierList, setSupplierList] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch supplier details from the server
  const fetchSupplierDetails = async () => {
    try {
      const response = await axios.get("http://localhost:5555/supplier");
      if (response.data.success) {
        setSupplierList(response.data.data);
        setFilteredSuppliers(response.data.data); // Initialize the filtered list with all suppliers
      }
    } catch (err) {
      console.error("Error fetching supplier details:", err);
    }
  };

  useEffect(() => {
    fetchSupplierDetails();
  }, []);

  // Auto-search functionality to filter suppliers by phone number
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSuppliers(supplierList); // Show all suppliers if search is empty
    } else {
      const filteredData = supplierList.filter((supplier) =>
        supplier.phone.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSuppliers(filteredData);
    }
  }, [searchTerm, supplierList]);

  // Delete a supplier by id
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5555/supplier/${id}`
      );
      if (response.data.success) {
        fetchSupplierDetails(); // Refresh supplier list after deletion
        alert("Supplier deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting supplier:", err);
    }
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
        <div className='header-container'>
          <h1 className='text-3xl font-bold' style={{ marginLeft: "100px" }}>
            Manage All The Suppliers Here
          </h1>

        </div>

        <div className='button-container'>
          <div className='search-container'>
            <div className='search-bar-container'>
              <MdSearch className='search-icon' />
              <input
                type='text'
                placeholder='Search by Phone'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='search-bar'
                aria-label="Search"
              />
            </div>
          </div>
          <Link to='/allorders'>
            <button className='button buttonMaterial'>
              <img src='../public/packages.png' className='icon' alt='Material Requirement' /> Orders
            </button>
          </Link>
          <Link to='/reOrder/SupplierHome'>
            <button className='button buttonMaterial' style={{ width: "180px" }}>
              <img src='../public/return.png' className='icon' alt='Material Requirement' /> Orders Requests
            </button>
          </Link>
        </div>

        {/* Supplier Table */}
        <div style={{ width: "100%" }}>
          {filteredSuppliers.length === 0 ? (
            <p style={{ textAlign: "center" }}>No data found</p>
          ) : (
            <table className="supplierTable">
              <thead>
                <tr>
                  <th className="table-heading">Name</th>
                  <th className="table-heading">NIC</th>
                  <th className="table-heading">Phone Number</th>
                  <th className="table-heading">Product</th>
                  <th className="table-heading">Type</th>
                  <th className="table-heading">Unit Price</th>
                  <th className="table-heading">Contract Start</th>
                  <th className="table-heading">Contract End</th>
                  <th className="table-heading">Update</th>
                  <th className="table-heading">Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier._id}>
                    <td className="border border-slate-700 rounded-md text-center">{supplier.name}</td>
                    <td className="border border-slate-700 rounded-md text-center">{supplier.nic}</td>
                    <td className="border border-slate-700 rounded-md text-center">{supplier.phone}</td>
                    <td className="border border-slate-700 rounded-md text-center">{supplier.product}</td>
                    <td className="border border-slate-700 rounded-md text-center">{supplier.type}</td>
                    <td className="border border-slate-700 rounded-md text-center">{supplier.unitPrice}</td>
                    <td className="border border-slate-700 rounded-md text-center">{new Date(supplier.contractStart).toLocaleDateString()}</td>
                    <td className="border border-slate-700 rounded-md text-center">{new Date(supplier.contractEnd).toLocaleDateString()}</td>
                    <td className="border border-slate-700 rounded-md text-center">
                    <Link to={`/order/${supplier._id}`}>
                          <button className="editBtn">
                            Order
                          </button>
                        </Link>
                    {/* <button
                        onClick={(`/order/${supplier._id}`)}
                        className="btn-delete"
                      >
                        Order
                      </button> */}
                      {/* <Link to={`/order/${supplier._id}`} className="btn1">
                        Order
                      </Link> */}
                    </td>
                    <td>

                    <Link>
                          <button  onClick={() => handleDelete(supplier._id)}
                        className="deleteBtn">
                            Delete
                          </button>
                        </Link>
                      
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllSupplier;
