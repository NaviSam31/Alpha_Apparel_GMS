import React, { useEffect, useState } from 'react';
import BackButton from '../components/EmployeeBackbutton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const EditEmployee = () => {
  const { id } = useParams(); // Get the employee ID from the URL
  const [fname, setFname] = useState('');
  const [emaill, setEmaill] = useState('');
  const [idnumber, setIdnumber] = useState('');
  const [doc1, setDoc1] = useState(null);
  const [doc2, setDoc2] = useState(null);
  const [doc3, setDoc3] = useState(null);
  const [doc4, setDoc4] = useState(null);
  const [joinDate, setJoinDate] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [basicSalary, setBasicSalary] = useState('');
  const [allowance, setAllowance] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  
  // Function to fetch employee details
  const fetchEmployeeDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5555/employees/${id}`);
      const employee = response.data;

      // Set form fields with existing employee data
      setFname(employee.fname);
      setEmaill(employee.emaill);
      setIdnumber(employee.idnumber);
      setJoinDate(employee.join_date);
      setDesignation(employee.designation);
      setDepartment(employee.department);
      setBasicSalary(String(employee.basic_salary)); // Ensure it's a string
      setAllowance(String(employee.allowance)); // Also ensure allowance is a string
      setSkillLevel(employee.skill_level);
    } catch (error) {
      console.error('Error fetching employee details:', error);
      alert('An error occurred while fetching employee details. Please check the console.');
    }
  };

  useEffect(() => {
    fetchEmployeeDetails();
  }, []); // Fetch employee details on component mount

  const validateForm = () => {
    const newErrors = {};

    // Name validation: Only letters allowed
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!fname.trim()) {
      newErrors.fname = 'Full Name is required';
    } else if (!nameRegex.test(fname)) {
      newErrors.fname = 'Full Name can only contain letters';
    }

    // Email validation: Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emaill.trim()) {
      newErrors.emaill = 'Email is required';
    } else if (!emailRegex.test(emaill)) {
      newErrors.emaill = 'Invalid email format';
    }

    // ID Number validation: 12 digits or 9 digits + 'V'
    const idNumberRegex = /^(\d{12}|\d{9}[vV])$/;
    if (!idnumber.trim()) {
      newErrors.idnumber = 'ID Number is required';
    } else if (!idNumberRegex.test(idnumber)) {
      newErrors.idnumber = 'ID Number must be 12 digits or 9 digits followed by "V"';
    }

    // Basic Salary validation: Must be a number greater than 0
    if (!basicSalary.trim() || isNaN(basicSalary) || parseFloat(basicSalary) <= 0) {
      newErrors.basicSalary = 'Basic Salary must be a positive number';
    }

    // Allowance validation: Must be a number greater than 0
    if (!allowance.trim() || isNaN(allowance) || parseFloat(allowance) <= 0) {
      newErrors.allowance = 'Allowance must be a positive number';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  

  const handleUpdateEmployee = () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('fname', fname);
    formData.append('emaill', emaill);
    formData.append('idnumber', idnumber);
    formData.append('doc1', doc1);
    formData.append('doc2', doc2);
    formData.append('doc3', doc3);
    formData.append('doc4', doc4);
    formData.append('join_date', joinDate);
    formData.append('designation', designation);
    formData.append('department', department);
    formData.append('basic_salary', basicSalary);
    formData.append('allowance', allowance);
    formData.append('skill_level', skillLevel);

    setLoading(true);
    axios.put(`http://localhost:5555/employees/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(() => {
        setLoading(false);
        navigate('/employee/home');
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error updating employee:', error);
        alert('An error occurred. Please check the console.');
      });
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">
          <img src="/company-logo.png" className="company-logo" alt="company-logo" />
        </div>
        <nav>
          <div className='nav-dept'><Link to="/home"><img src='/public/home.png' className='icon'></img>Home</Link></div>
          <div className='nav-dept'><Link to="/inventory/home"><img src='/public/inventory.png' className='icon'></img>Inventory</Link></div>
          <div className='nav-dept'><Link to="/"><img src='/public/tshirt.png' className='icon'></img>Design</Link></div>
          <div className='nav-dept'><Link to="/orders"><img src='/public/orders.png' className='icon'></img>Orders</Link></div>
          <div className='nav-dept'><Link to="/supplier"><img src='/public/supplier.png' className='icon'></img>Supplier</Link></div>
          <div className='nav-dept'><Link to="/discounts/home"><img src='/public/marketing.png' className='icon'></img>Marketing</Link></div>
          <div className='nav-dept'><Link to="/hr"><img src='/public/human-resource.png' className='icon'></img>Human Resource</Link></div>
          <div className='nav-dept'><Link to="/financial"><img src='/public/financial.png' className='icon'></img>Financial</Link></div>
          <div className='nav-dept'><Link to="/transport"><img src='/public/transport.png' className='icon'></img>Transport</Link></div>
        </nav><nav>
          <div className='nav-dept'><Link to="/"><img src='/public/home.png' className='icon' alt='Home' /> Home</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/inventory.png' className='icon' alt='Inventory' /> Inventory</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/tshirt.png' className='icon' alt='Design' /> Design</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/orders.png' className='icon' alt='Orders' /> Orders</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/supplier.png' className='icon' alt='Supplier' /> Supplier</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/marketing.png' className='icon' alt='Marketing' /> Marketing</Link></div>
          <div className='nav-dept'><Link to="/employee/home"><img src='/public/human-resource.png' className='icon' alt='Human Resource' /> Human Resource</Link></div>
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
          <h1 className="text-3xl font-bold company-name">Alpha Apperals PVT LTD</h1>
        </header>
        <div className='button-container'>
        </div>

        <div className="main-content p-4">
          

          <BackButton />
          <h1 className="text-3xl my-4">Edit Employee Record</h1>
          {loading && <Spinner />}
          <div className="flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto">
            {/* Input fields */}
            <div className="my-4">
              <label className="text-xl mr-4 text-gray-500">Full Name</label>
              <input
                type="text"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
              {errors.fname && <p className="text-red-500">{errors.fname}</p>}
            </div>
            <div className="my-4">
              <label className="text-xl mr-4 text-gray-500">Email</label>
              <input
                type="text"
                value={emaill}
                onChange={(e) => setEmaill(e.target.value)}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
              {errors.emaill && <p className="text-red-500">{errors.emaill}</p>}
            </div>
            <div className="my-4">
              <label className="text-xl mr-4 text-gray-500">ID Number</label>
              <input
                type="text"
                value={idnumber}
                onChange={(e) => setIdnumber(e.target.value)}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
              {errors.idnumber && <p className="text-red-500">{errors.idnumber}</p>}
            </div>

            <div className="my-4">
              <label className="text-xl mr-4 text-gray-500">Join Date</label>
              <input
                type="date"
                value={joinDate}
                onChange={(e) => setJoinDate(e.target.value)}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
            </div>
            <div className="my-4">
              <label className="text-xl mr-4 text-gray-500">Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
            </div>
            <div className="my-4">
              <label className="text-xl mr-4 text-gray-500">Department</label>
              <select
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              >
                <option value="">Select Department</option>
                <option value="Inventory">Inventory</option>
                <option value="Financial">Financial</option>
                <option value="Order">Order</option>
                <option value="Design">Design</option>
                <option value="Transport">Transport</option>
                <option value="Supplier">Supplier</option>
                <option value="HR">HR</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
            <div className="my-4">
              <label className="text-xl mr-4 text-gray-500">Basic Salary</label>
              <input
                type="text"
                value={basicSalary}
                onChange={(e) => setBasicSalary(e.target.value)}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
              {errors.basicSalary && <p className="text-red-500">{errors.basicSalary}</p>}
            </div>
            <div className="my-4">
              <label className="text-xl mr-4 text-gray-500">Allowance</label>
              <input
                type="text"
                value={allowance}
                onChange={(e) => setAllowance(e.target.value)}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
              {errors.allowance && <p className="text-red-500">{errors.allowance}</p>}
            </div>
            <div className="my-4">
              <label className="text-xl mr-4 text-gray-500">Skill Level</label>
              <input
                type="text"
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
            </div>

            {/* Upload document fields */}
            <div className="my-4">
              <label className="text-xl mr-4 text-gray-500">Update Birthcertificate</label>
              <input
                type="file"
                onChange={(e) => setDoc1(e.target.files[0])}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
            </div>
            <div className="my-4">
              <label className="text-xl mr-4 text-gray-500">Update Educational Certificates</label>
              <input
                type="file"
                onChange={(e) => setDoc2(e.target.files[0])}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
            </div>
            <div className="my-4">
              <label className="text-xl mr-4 text-gray-500">Update medical Report</label>
              <input
                type="file"
                onChange={(e) => setDoc3(e.target.files[0])}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
            </div>
            <div className="my-4">
              <label className="text-xl mr-4 text-gray-500">Update Photo</label>
              <input
                type="file"
                onChange={(e) => setDoc4(e.target.files[0])}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
            </div>

            {/* Update button */}
            <button
              onClick={handleUpdateEmployee}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4"
              style={{ width: "100%" }}
            >
              Update Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
