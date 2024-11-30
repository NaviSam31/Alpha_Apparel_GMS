import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import BackButton from '../components/TrainingBackButton';

const EditTraining = () => {
  const { id } = useParams(); // Get the ID of the training from the URL params
  const [trainingData, setTrainingData] = useState({
    usersname: '',
    trainname: '',
    releventDepartment: '',
    description: '',
    option: '',
    sheduleDate: '',
    sheduleTime: '',
  });
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
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

  // Fetch the existing training data by ID when component mounts
  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/trainings/${id}`);
        setTrainingData(response.data); // Assuming the API returns the training object
      } catch (error) {
        setError('Failed to fetch training data.');
      }
    };
    fetchTrainingData();
  }, [id]);

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
        employee?.fname && employee.fname.toLowerCase().includes(query)
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees([]);
    }
  };

  // Handle selecting an employee from the dropdown
  const handleEmployeeSelect = (name) => {
    setTrainingData((prevData) => ({
      ...prevData,
      usersname: name,
    }));
    setFilteredEmployees([]);
  };

  // Handle form submission to update the training
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Make the PUT request to update the training record
      await axios.put(`http://localhost:5555/trainings/${id}`, trainingData);
      setLoading(false);
      // Redirect to the training home page after successful update
      navigate('/training/home');
    } catch (error) {
      setError('Failed to update training. Please try again.');
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
          <h1 className="text-3xl font-bold mb-5">Edit Training</h1>
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
              <label htmlFor="option" className='text-xl mr-4 text-gray-500'>Option</label>
              <textarea
                id="option"
                name="option"
                value={trainingData.options}
                onChange={handleInputChange}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
    
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 w-[200px] mx-auto"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Training'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTraining;
