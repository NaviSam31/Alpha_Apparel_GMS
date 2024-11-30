import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../../components/Spinner';

const CreateFundRequest = () => {
  const navigate = useNavigate();
  const [fund, setFund] = useState({
    department: "",
    reason: "",
    amount: "",
    status: "not allocated",  // Set default status here
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleOnChange = (e) => {
    const { value, name } = e.target;

    // Numeric validation for amount
    if (name === "amount" && value && (isNaN(value) || Number(value) <= 0)) {
      setErrors((prev) => ({ ...prev, [name]: "Amount must be a positive number." }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
      setFund((prev) => ({ ...prev, [name]: name === "amount" ? Number(value) : value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!fund.department) newErrors.department = "Department is required.";
    if (!fund.reason) newErrors.reason = "Reason is required.";
    if (!fund.amount) {
      newErrors.amount = "Amount is required.";
    } else if (isNaN(fund.amount) || fund.amount <= 0) {
      newErrors.amount = "Amount must be a positive number.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5555/fundRequest", fund);
      console.log(response.data);
      alert("Fund request successfully added!");
      navigate("/funds/home");

      // Reset form and errors after successful submission
      setFund({
        department: "",
        reason: "",
        amount: "",
        status: "not allocated",  // Reset status to default
      });
      setErrors({});
    } catch (error) {
      console.error("Error adding the fund request:", error);
      alert("There was an error adding the fund request: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">
          <img src='/public/company-logo.png' className='company-logo' alt='company-logo' />
        </div>
        <nav>
        <div className='nav-dept'><Link to="/"><img src='/public/home.png' className='icon' alt='Home' /> Home</Link></div>
        <div className='nav-dept'><Link to=""><img src='/public/inventory.png' className='icon' alt='Inventory' /> Inventory</Link></div>
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
          <div className='nav-dept'><Link to=""><img src='/public/transport.png' className='icon' alt='Transport' /> Transport</Link></div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header>
          <h1 className='text-3xl font-bold company-name'>Alpha Apparels PVT LTD</h1>
        </header>
        <div className='button-container'></div>
        <div className="flex flex-col items-center p-6">
          <h1 className='text-3xl my-4'>Request Fund</h1>
          {loading && <Spinner />}
          <form onSubmit={handleSubmit} className="w-full max-w-lg border-2 p-6 rounded-lg">
            <div className="my-4">
              <label className="text-xl text-gray-700">Department:</label>
              <select
                id="department"
                name="department"
                value={fund.department}
                onChange={handleOnChange}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              >
                <option value="">Select a department</option>
                <option value="Inventory">Inventory</option>
                <option value="Design">Design</option>
                <option value="Orders">Orders</option>
                <option value="Marketing">Marketing</option>
                <option value="Supplier">Supplier</option>
                <option value="HR">HR</option>
                <option value="Transport">Transport</option>
              </select>
              {errors.department && <p className="text-red-500">{errors.department}</p>}
            </div>

            <div className="my-4">
              <label className="text-xl text-gray-700">Reason:</label>
              <input
                type="text"
                id="reason"
                name="reason"
                value={fund.reason}
                onChange={handleOnChange}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
              {errors.reason && <p className="text-red-500">{errors.reason}</p>}
            </div>

            <div className="my-4">
              <label className="text-xl text-gray-700">Amount:</label>
              <input
                type="text"
                id="amount"
                name="amount"
                value={fund.amount}
                onChange={handleOnChange}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
              {errors.amount && <p className="text-red-500">{errors.amount}</p>}
            </div>

            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded" style={{ width: "100%" }}>
              Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateFundRequest;
