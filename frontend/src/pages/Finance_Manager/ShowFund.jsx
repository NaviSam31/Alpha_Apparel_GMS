import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';

const ShowFunds = () => {
  const [fund, setFund] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/funds/details/${id}`)
      .then((response) => {
        setFund(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError('Error fetching fund details');
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">
          <img src="/company-logo.png" className='logo' alt='company-logo' />
        </div>
        <nav>
        <div className='nav-dept'><Link to="/"><img src='/public/home.png' className='icon' alt='Home' /> Home</Link></div>
        <div className='nav-dept'><Link to="/inventory/home"><img src='/public/inventory.png' className='icon' alt='Inventory' /> Inventory</Link></div>
          <div className='nav-dept'><Link to="/design/home"><img src='/public/tshirt.png' className='icon' alt='Design' /> Design</Link></div>
          <div className='nav-dept'><Link to="/customers/home"><img src='/public/orders.png' className='icon' alt='Orders' /> Orders</Link></div>
          <div className='nav-dept'><Link to="/suppliers/home"><img src='/public/supplier.png' className='icon' alt='Supplier' /> Supplier</Link></div>
          <div className='nav-dept'><Link to="/discounts/home"><img src='/public/marketing.png' className='icon' alt='Marketing' /> Marketing</Link></div>
          <div className='nav-dept'><Link to="/employee/home"><img src='/public/human-resource.png' className='icon' alt='Human Resource' /> Human Resource</Link></div>
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

      {/* Fund Details */}
      <div className="main-content">
        <header>
          <h1 className='text-3xl font-bold company-name'>Alpha Apparels PVT LTD</h1>
        </header>
        <div className="main-content flex-1 p-6">
          <BackButton />
          <h1 className='text-3xl my-4'>Show Fund Details</h1>
          {loading ? (
            <Spinner />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div id="fund-details-card" className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4'>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>ID: </span>
                <span>{fund._id}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Department: </span>
                <span>{fund.department}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Project: </span>
                <span>{fund.project}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Allocated Amount: </span>
                <span>{fund.Allocated_Amount}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Spent Amount: </span>
                <span>{fund.spent_amount}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Create Time: </span>
                <span>{new Date(fund.createdAt).toString()}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Update Time: </span>
                <span>{new Date(fund.updatedAt).toString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowFunds;
