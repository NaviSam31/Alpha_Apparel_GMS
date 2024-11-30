import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./placeOrder.css";
import { useNavigate } from 'react-router-dom';

function PlaceOrder() {
  const [orderdata, setorderdata] = useState({
    name: "",
    nic: "",
    product: "",
    quantity: "",
    date: "",
  });
  const [supplierData, setsupplierData] = useState({
    name: "",
    phone: "",
    product: "",
    type: "",
    unitPrice: "",
    contractStart: "",
    contractEnd: "",
  });
  const [errors, setErrors] = useState({});

  const { id } = useParams();

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/supplier/${id}`);
        const data = response.data;

        if (data.success) {
          setsupplierData(data.data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchSupplierData();
  }, [id]);

  const handleInputChange = (e) => {
    setsupplierData({
      ...supplierData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setorderdata((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate the field being edited
    const fieldErrors = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldErrors[name],
    }));
  };

  const validateField = (fieldName, value) => {
    const fieldErrors = {};

    // Validation rules for the specific field
    switch (fieldName) {
      case "nic":
        if (!value.trim()) {
          fieldErrors.nic = "NIC is required";
        } 
        // Regex to match either 9 digits followed by 'V' or exactly 12 digits
        else if (!/^\d{9}V$|^\d{12}$/.test(value)) {
          fieldErrors.nic = "NIC must be 9 digits followed by 'V' or exactly 12 digits";
        }
        break;
      case "product":
        if (!value.trim()) {
          fieldErrors.product = "Product is required";
        }
        break;
      case "quantity":
        if (!value.trim()) {
          fieldErrors.quantity = "Quantity is required";
        } else if (!/^\d+$/.test(value)) {
          fieldErrors.quantity = "Invalid quantity";
        }
        break;
      case "date":
        if (!value) {
          fieldErrors.date = "Date is required";
        }
        break;
      default:
        break;
    }

    return fieldErrors;
  };

  const navigate = useNavigate(); // Initialize the navigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = {};
    Object.keys(orderdata).forEach((key) => {
      const fieldErrors = validateField(key, orderdata[key]);
      if (Object.keys(fieldErrors).length > 0) {
        formErrors[key] = fieldErrors[key];
      }
    });
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        console.log("Sending order data:", orderdata);
        const response = await axios.post("http://localhost:5555/supplierOrder", orderdata);
        console.log(response.data);
        alert("Order placed successfully!");

        navigate('/allorders'); // Navigate to /allorders after success
      } catch (error) {
        console.error("Error placing order:", error.response?.data || error);
        alert("An error occurred while placing the order");
      }
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
        <div className='button-container'></div>
        <div className="order-form">
          <form onSubmit={handleSubmit}>
            <h2>Place New Order</h2>
            <label className="form-label1">Supplier / Company Name : </label>
            <input
              type="text"
              className="form-input"
              id="name"
              name="name"
              placeholder="Enter Supplier Name"
              onChange={handleOnChange}
            />
            <br />
            <label className="form-label1">Supplier NIC : </label>
            <input
              type="text"
              className="form-input"
              id="nic"
              name="nic"
              placeholder="Enter Supplier's NIC'"
              onChange={handleOnChange}
            />
            {errors.nic && <span className="text-danger">{errors.nic}</span>}
            <br />
            <br />
            <label className="form-label1">Product : </label>
            <select
              className="form-select"
              id="product"
              name="product"
              onChange={handleOnChange}
            >
              <option value="">Select the category</option>
              <option value="cotton">Cotton</option>
              <option value="nylon">Nylon</option>
              <option value="polyester">Polyester</option>
              <option value="linen">Linen</option>
              <option value="silk">Silk</option>
              <option value="beads">Beads</option>
              <option value="zipper">Zippers</option>
              <option value="ribbon">Ribbons</option>
              <option value="dye">Fabric dyes</option>
              <option value="box">Shipping Boxes</option>
              <option value="sewingThread">Sewing Threads</option>
              <option value="elastic">Elastics</option>
              <option value="glue">Glues</option>
              <option value="lableTag">Labels and Tags</option>
            </select>
            {errors.product && (
              <span className="text-danger">{errors.product}</span>
            )}
            <br />
            <br />
            <label htmlFor="quantity" className="form-label1">
              Quantity Needed :{" "}
            </label>
            <input
              type="text"
              id="quantity"
              name="quantity"
              placeholder="Enter Quantity Needed"
              className="form-input"
              onChange={handleOnChange}
            />
            {errors.quantity && (
              <span className="text-danger">{errors.quantity}</span>
            )}
            <br />
            <br />
            <label htmlFor="date" className="form-label1">
              Date :{" "}
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className="form-input"
              onChange={handleOnChange}
            />
            {errors.date && <span className="text-danger">{errors.date}</span>}
            <br />
            <br />
            <br />
            <button className="orderbtn">Send Order</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;
