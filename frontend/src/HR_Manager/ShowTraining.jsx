import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../components/EmployeeBackbutton';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';

const ShowTraining = () => {
  const [training, setTraining] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/trainings/${id}`)
      .then((response) => {
        setTraining(response.data);
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
          <img src="/company-logo.png" className='company-logo' alt='company-logo' />
        </div>
        <nav>
          {/* Navigation Links */}
          <div className='nav-dept'><Link to="/home"><img src='/home.png' className='icon' alt='home' />Home</Link></div>
          <div className='nav-dept'><Link to="/inventory/home"><img src='/inventory.png' className='icon' alt='inventory' />Inventory</Link></div>
          <div className='nav-dept'><Link to="/"><img src='/tshirt.png' className='icon' alt='design' />Design</Link></div>
          <div className='nav-dept'><Link to="/orders"><img src='/orders.png' className='icon' alt='orders' />Orders</Link></div>
          <div className='nav-dept'><Link to="/supplier"><img src='/supplier.png' className='icon' alt='supplier' />Supplier</Link></div>
          <div className='nav-dept'><Link to="/discounts/home"><img src='/marketing.png' className='icon' alt='marketing' />Marketing</Link></div>
          <div className='nav-dept'><Link to="/hr"><img src='/human-resource.png' className='icon' alt='hr' />Human Resource</Link></div>
          <div className='nav-dept'><Link to="/financial"><img src='/financial.png' className='icon' alt='financial' />Financial</Link></div>
          <div className='nav-dept'><Link to="/transport"><img src='/transport.png' className='icon' alt='transport' />Transport</Link></div>
        </nav>
      </div>

      {/* Training Details */}
      <div className="main-content">
        <header>
          <h1 className='text-3xl font-bold company-name'>Alpha Apperals PVT LTD</h1>
        </header>
        <div className='button-container'></div>
        <div className="main-content flex-1 p-6">
          <BackButton />
          <h1 className='text-3xl my-4'>Show Training Records</h1>
          {loading ? (
            <Spinner />
          ) : (
            <div id="training-details-card" className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4'>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Training ID: </span>
                <span>{training._id}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Training Name: </span>
                <span>{training.trainname}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Training Description: </span>
                <span>{training.description}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Date: </span>
                <span>{new Date(training.sheduleDate).toLocaleDateString()}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Time: </span>
                <span>{training.sheduleTime} hours</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Relevent Department: </span>
                <span>{training.releventDepartment}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Description: </span>
                <span>{training.description}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Created At: </span>
                <span>{new Date(training.createdAt).toString()}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Updated At: </span>
                <span>{new Date(training.updatedAt).toString()}</span>
              </div>
              <div>
                {/* Displaying Images */}
                {training.images && (
                  <>
                    {training.images.cert && (
                      <img src={training.images.cert} alt="Training Certificate" className="my-2" />
                    )}
                    {training.images.feedback && (
                      <img src={training.images.feedback} alt="Feedback" className="my-2" />
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowTraining;
