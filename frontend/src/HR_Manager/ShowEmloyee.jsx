import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../components/EmployeeBackbutton';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';

const ShowEmployee = () => {
  const [employee, setEmployee] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/employees/${id}`)
      .then((response) => {
        setEmployee(response.data);
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

      {/* Employee Details */}
      <div className="main-content">
        <header>
          <h1 className='text-3xl font-bold company-name'>Alpha Apperals PVT LTD</h1>
        </header>
        <div className='button-container'></div>
        <div className="main-content flex-1 p-6">
          <BackButton />
          <h1 className='text-3xl my-4'>Show Employee Records</h1>
          {loading ? (
            <Spinner />
          ) : (
            <div id="employee-details-card" className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4'>
             <center><div>
                
                {employee.images && (
                  <>
                    {employee.images.doc4 && (
                      <img src={employee.images.doc4} alt="Employee Image" className="my-2" />
                    )}
                  </>
                )}
              </div></center> 
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>NIC Number: </span>
                <span>{employee.idnumber}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Name: </span>
                <span>{employee.fname}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Position: </span>
                <span>{employee.designation}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Department: </span>
                <span>{employee.department}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Email: </span>
                <span>{employee.emaill}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Joined Date: </span>
                <span>{employee.join_date}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Basic Salary: </span>
                <span>{employee.basic_salary}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Allowance: </span>
                <span>{employee.allowance}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Skill Level: </span>
                <span>{employee.skill_level}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Create Time: </span>
                <span>{new Date(employee.createdAt).toString()}</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Update Time: </span>
                <span>{new Date(employee.updatedAt).toString()}</span>
              </div>
              <div>
                {/* Displaying Images */}
                {employee.images && (
                  <>
                    {employee.images.doc1 && (
                      <img src={employee.images.doc1} alt="Birth Certificate" className="my-2" style={{ width: '256px', height: '256px' }} />
                    )}
                    {employee.images.doc2 && (
                      <img src={employee.images.doc2} alt="Educational Certificate" className="my-2" style={{ width: '256px', height: '256px' }} />
                    )}
                    {employee.images.doc3 && (
                      <img src={employee.images.doc3} alt="Medical Report" className="my-2" style={{ width: '256px', height: '256px' }} />
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

export default ShowEmployee;