import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import BackButton from '../../components/FundButton';

const EditFund = () => {
  const [fund, setFund] = useState({
    department: '',
    project: '',
    allocated_amount: '',
    spent_amount: ''
  });
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFund = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/funds/${id}`);
        setFund(response.data.data);
      } catch (err) {
        setError("Error fetching fund details");
        console.error(err);
      }
    };

    fetchFund();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFund(prevFund => ({ ...prevFund, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5555/funds/${id}`, fund);
      alert("Fund updated successfully!");
      navigate("/funds/home");
    } catch (err) {
      setError("Error updating fund");
      console.error(err);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar bg-gray-800 text-white h-screen p-4">
        <div className="brand mb-6">
          <img src="/company-logo.png" className="logo w-32 mx-auto" alt="company-logo" />
        </div>
        <nav className="flex flex-col space-y-4">
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
      <div className="main-content flex-1 p-6">
        <header>
          <h1 className="text-3xl font-bold company-name mb-6">Alpha Apparels PVT LTD</h1>
        </header>

        {/* Edit Fund Form */}
        <div className="flex flex-col items-center p-6">
        <div className='button-container'>
        </div>
        <BackButton></BackButton>
          <h2 className="text-3xl my-4">Edit Fund</h2>
          <form onSubmit={handleSubmit} className="flex flex-col border-2 border-sky-400 rounded-xl p-6 w-[400px] mx-auto bg-white shadow-md">
            <div className="mb-4">
              <label className="block text-xl text-gray-700 mb-2" htmlFor="department">Department</label>
              <input
                type="text"
                name="department"
                id="department"
                value={fund.department}
                onChange={handleChange}
                placeholder="Enter department"
                required
                className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-sky-400"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xl text-gray-700 mb-2" htmlFor="project">Project</label>
              <input
                type="text"
                name="project"
                id="project"
                value={fund.project}
                onChange={handleChange}
                placeholder="Enter project"
                required
                className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-sky-400"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xl text-gray-700 mb-2" htmlFor="allocated_amount">Allocated Amount</label>
              <input
                type="number"
                name="allocated_amount"
                id="allocated_amount"
                value={fund.allocated_amount}
                onChange={handleChange}
                placeholder="Enter allocated amount"
                required
                className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-sky-400"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xl text-gray-700 mb-2" htmlFor="spent_amount">Spent Amount</label>
              <input
                type="number"
                name="spent_amount"
                id="spent_amount"
                value={fund.spent_amount}
                onChange={handleChange}
                placeholder="Enter spent amount"
                required
                className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-sky-400"
              />
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              className="mt-4 bg-sky-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-600 transition duration-200"
            >
              Update Fund
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditFund;
