import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../../components/SizeBackButton';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';

const ShowSizes = () => {
  const [sizes, setSizes] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/sizes/${id}`)
      .then((response) => {
        setSizes(response.data);
        setLoading(false);
      }).catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);


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
          <div className='nav-dept'><Link to="/design/home"><img src='/public/tshirt.png' className='icon' alt='Design' /> Design</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/orders.png' className='icon' alt='Orders' /> Orders</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/supplier.png' className='icon' alt='Supplier' /> Supplier</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/marketing.png' className='icon' alt='Marketing' /> Marketing</Link></div>
          <div className='nav-dept'><Link to= ""><img src='/public/human-resource.png' className='icon' alt='Human Resource' /> Human Resource</Link></div>
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
          <h1 className='text-3xl my-4'>Show Size Records</h1>
          {loading ? (
            <Spinner />
          ) : (
            <div className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4'>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>ID: </span>
                <span>{sizes._id}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Size ID: </span>
                <span>{sizes.sizeID}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Size ID: </span>
                <span>{sizes.sizeName}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Chest Measurements: </span>
                <span>{sizes.chestMeasurement}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Waist Measurements: </span>
                <span>{sizes.waistMeasurement}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Hip Measurements: </span>
                <span>{sizes.hipMeasurement}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Length: </span>
                <span>{sizes.length}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Create Time: </span>
                <span>{new Date(sizes.createdAt).toString()}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Update Time: </span>
                <span>{new Date(sizes.updatedAt).toString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowSizes;
