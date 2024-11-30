import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import BackButton from '../../components/FundButton';

const CreateFund = () => {
  const navigate = useNavigate();
  const [fund, setFund] = useState({
    department: "",
    project: "",
    allocated_amount: "",
    spent_amount: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleOnChange = (e) => {
    const { value, name } = e.target;

    // Numeric validation for allocated_amount and spent_amount
    if ((name === "allocated_amount" || name === "spent_amount") && value && isNaN(value)) {
      setErrors((prev) => ({
        ...prev,
        [name]: "This field must be a number.",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));

      setFund((prev) => ({
        ...prev,
        [name]: name === "allocated_amount" || name === "spent_amount" ? Number(value) : value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!fund.department) newErrors.department = "Department is required.";
    if (!fund.project) newErrors.project = "Project is required.";
    if (!fund.allocated_amount) {
      newErrors.allocated_amount = "Allocated Amount is required.";
    } else if (isNaN(fund.allocated_amount)) {
      newErrors.allocated_amount = "Allocated Amount must be a number.";
    }
    if (!fund.spent_amount) {
      newErrors.spent_amount = "Spent Amount is required.";
    } else if (isNaN(fund.spent_amount)) {
      newErrors.spent_amount = "Spent Amount must be a number.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5555/funds", fund);
      console.log(response.data);
      alert("Fund successfully added!");
      navigate("/funds/home");

      // Reset form and errors after successful submission
      setFund({
        department: "",
        project: "",
        allocated_amount: "",
        spent_amount: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error adding the fund:", error);
      alert("There was an error adding the fund: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
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
          <div className='nav-dept'><Link to=""><img src='/public/orders.png' className='icon' alt='Orders' /> Orders</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/supplier.png' className='icon' alt='Supplier' /> Supplier</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/marketing.png' className='icon' alt='Marketing' /> Marketing</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/human-resource.png' className='icon' alt='Human Resource' /> Human Resource</Link></div>
          <div className='nav-dept financial'>
            <Link to="/financial">
              <img src='/public/financial.png' className='icon' alt='Financial' /> Financial
            </Link>
            <div className='dropdown'>
              <Link to="/fundRequests/create">Request Fund</Link>
              <Link to="/funds/home">Finance Dashboard</Link>
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
          <BackButton />
          <h1 className='text-3xl my-4'>Create Fund</h1>
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
              <label className="text-xl text-gray-700">Project:</label>
              <input
                type="text"
                id="project"
                name="project"
                value={fund.project}
                onChange={handleOnChange}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
              {errors.project && <p className="text-red-500">{errors.project}</p>}
            </div>

            <div className="my-4">
              <label className="text-xl text-gray-700">Allocated Amount:</label>
              <input
                type="text"
                id="allocated_amount"
                name="allocated_amount"
                value={fund.allocated_amount}
                onChange={handleOnChange}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
              {errors.allocated_amount && <p className="text-red-500">{errors.allocated_amount}</p>}
            </div>

            <div className="my-4">
              <label className="text-xl text-gray-700">Spent Amount:</label>
              <input
                type="text"
                id="spent_amount"
                name="spent_amount"
                value={fund.spent_amount}
                onChange={handleOnChange}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
              {errors.spent_amount && <p className="text-red-500">{errors.spent_amount}</p>}
            </div>

            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded" style={{ width: "100%" }}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateFund;
