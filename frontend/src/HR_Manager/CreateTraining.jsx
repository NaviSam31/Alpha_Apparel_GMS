import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import BackButton from '../components/TrainingBackButton';

const CreateTraining = () => {
  const [trainingData, setTrainingData] = useState({
    usersname: '',
    trainname: '',
    releventDepartment: '',
    description: '',
    option: '',
    sheduleDate: '',
    sheduleTime: '',
  });
  const [employees, setEmployees] = useState([]); // To store all employees fetched from the server
  const [filteredEmployees, setFilteredEmployees] = useState([]); // To store filtered employee names
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch employee names when component mounts
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5555/employees');
        setEmployees(response.data); // Assuming the API returns an array of employee objects
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };
    fetchEmployees();
  }, []);

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTrainingData((prevData) => ({
      ...prevData,
      [name]: value, // Use 'name' to update the correct field
    }));

    // If the usersname input is changing, filter employee suggestions
    if (name === 'usersname') {
      handleEmployeeInputChange(value);
    }
  };

  // Filter employee names as the user types
  const handleEmployeeInputChange = (input) => {
    const query = input.toLowerCase();
    if (query) {
      const filtered = employees.filter((employee) => 
        employee?.fname && employee.fname.toLowerCase().includes(query) // Ensure employee and employee.name exist
      );
      setFilteredEmployees(filtered); // Update the filtered employee list
    } else {
      setFilteredEmployees([]); // Clear suggestions when input is empty
    }
  };

  // Handle selecting an employee from the dropdown
  const handleEmployeeSelect = (name) => {
    setTrainingData((prevData) => ({
      ...prevData,
      usersname: name, // Update the usersname with the selected name
    }));
    setFilteredEmployees([]); // Clear suggestions after selection
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Make the POST request to add a new training record
      await axios.post('http://localhost:5555/trainings', trainingData);
      setLoading(false);
      // Redirect to the training home page after successful submission
      navigate('/training/home');
    } catch (error) {
      setError('Failed to create training. Please try again.');
      setLoading(false);
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
          <h1 className='text-3xl font-bold company-name'>Alpha Apperals PVT LTD</h1>
        </header>
        <div className='button-container'>
          </div>
        <BackButton />
        <div className='main-content p-4'>
          <h1 className="text-3xl font-bold mb-5">Add New Training</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
            <div className="my-4">
              <label htmlFor="usersname" className='text-xl mr-4 text-gray-500'>Employee Name</label>
              <input
                type="text"
                id="usersname"
                name="usersname"
                value={trainingData.usersname}
                onChange={handleInputChange}
                required
                className="border-2 border-gray-500 px-4 py-2 w-full"
                placeholder="Enter Employee Name"
                autoComplete="off"
              />
              {/* Display dropdown of filtered employee names */}
              {filteredEmployees.length > 0 && (
                <ul className="dropdown">
                  {filteredEmployees.map((employee, index) => (
                    <li
                      key={index}
                      onClick={() => handleEmployeeSelect(employee.fname)}
                      className="cursor-pointer border-b-2 p-2 hover:bg-gray-200"
                    >
                      {employee.fname}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="my-4">
              <label htmlFor="trainname" className='text-xl mr-4 text-gray-500'>Training Name</label>
              <input
                type="text"
                id="trainname"
                name="trainname"
                value={trainingData.trainname}
                onChange={handleInputChange}
                required
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
            </div>

            <div className="my-4">
              <label htmlFor="releventDepartment" className='text-xl mr-4 text-gray-500'>Relevant Department</label>
              <input
                type="text"
                id="releventDepartment"
                name="releventDepartment"
                value={trainingData.releventDepartment}
                onChange={handleInputChange}
                required
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
            </div>

            <div className="my-4">
              <label htmlFor="description" className='text-xl mr-4 text-gray-500'>Description</label>
              <textarea
                id="description"
                name="description"
                value={trainingData.description}
                onChange={handleInputChange}
                required
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
            </div>

            <div className="my-4">
              <label htmlFor="sheduleDate" className='text-xl mr-4 text-gray-500'>Schedule Date</label>
              <input
                type="date"
                id="sheduleDate"
                name="sheduleDate"
                value={trainingData.sheduleDate}
                onChange={handleInputChange}
                required
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
            </div>

            <div className="my-4">
              <label htmlFor="sheduleTime" className='text-xl mr-4 text-gray-500'>Schedule Time</label>
              <input
                type="time"
                id="sheduleTime"
                name="sheduleTime"
                value={trainingData.sheduleTime}
                onChange={handleInputChange}
                required
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
            </div>

            <div className="my-4">
              <label htmlFor="releventDepartment" className='text-xl mr-4 text-gray-500'>Additional Information</label>
              <textarea
                type="text"
                id="options"
                name="options"
                value={trainingData.options}
                onChange={handleInputChange}
                required
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
            </div>

            <button
              type="submit"
              className='bg-sky-400 text-white py-2 px-4 rounded-md mt-4'
              disabled={loading}
              style={{ width: "100%" }}

            >
              {loading ? 'Adding Training...' : 'Add Training'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTraining;
