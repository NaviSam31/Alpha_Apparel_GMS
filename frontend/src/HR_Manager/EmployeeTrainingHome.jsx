import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete, MdSearch } from 'react-icons/md';
import Spinner from '../components/Spinner';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const EmployeeTrainingHome = () => {
  const [trainings, setTrainings] = useState([]);
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5555/trainings') // Replace with your API endpoint
      .then((response) => {
        setTrainings(response.data);
        setFilteredTrainings(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching training data:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredTrainings(trainings);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = trainings.filter((training) =>
        training.trainname.toLowerCase().includes(query) ||
        training.usersname.toLowerCase().includes(query)
      );
      setFilteredTrainings(filtered);
    }
  }, [searchQuery, trainings]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(17);
    doc.text('Alpha Aperal(PVT)LTD', 75, 20);
    doc.text('Employee Training Report', 70, 35);
    doc.text('------------------------------------------------------------------------------------------', 15, 45);

    const columns = [
      { title: 'Employee Name', dataKey: 'usersname' },
      { title: 'Training Name', dataKey: 'trainname' },
      { title: 'Department', dataKey: 'releventDepartment' },
      { title: 'description', dataKey: 'description' },
      { title: 'Schedule Date', dataKey: 'sheduleDate' },
      { title: 'Schedule Time', dataKey: 'sheduleTime' },
    ];

    const data = filteredTrainings.map(training => ({
      usersname: training.usersname,
      trainname: training.trainname,
      description: training.description,
      releventDepartment: training.releventDepartment,
      sheduleDate: training.sheduleDate,
      sheduleTime: training.sheduleTime,
    }));

    doc.autoTable(columns, data, { startY: 50 });
    doc.save('employee_training_report.pdf');
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
        <div className='header-container'>
          <h1 className='text-3xl font-bold'>Manage Employee Trainings</h1>
        </div>

        <div className='button-container'>
          <div className='search-container'>
            <div className='search-bar-container'>
              <MdSearch className='search-icon' />
              <input
                type='text'
                placeholder='Search by Employee Name or Training Name'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='search-bar'
              />
            </div>
          </div>
          <Link to='/training/create'>
            <button className='button buttonAddNew'>
              <img src='../public/add.png' className='icon' alt='Add' /> Add Training
            </button>
            </Link>
            <Link to='/employee/home'>
            <button className='button buttonMaterial'  style={{ width: "160px" }}>
              <img src='../public/user.png' className='icon' alt='Add' />Employee
            </button>
          </Link>

        
          <button onClick={generatePDF} className='button generate-report'>
            <span className='icon'><img src='../public/pdf.png' alt='PDF' /></span>Report (PDF)
          </button>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className='table-container'>
            <table className='dataTable'>
              <thead>
                <tr>
                  <th className='table-heading'>Employee Name</th>
                  <th className='table-heading'>Training Name</th>
                  <th className='table-heading'>description</th>
                  <th className='table-heading'>Schedule Date</th>
                  <th className='table-heading'>Schedule Time</th>
                  <th className='table-heading'>Department</th>
                  <th className='table-heading'>Additional Information</th>
                  <th className='table-heading'></th>
                </tr>
              </thead>
              <tbody>
                {filteredTrainings.length > 0 ? (
                  filteredTrainings.map((training) => (
                    <tr key={training._id} className="h-8">
                      <td className="border border-slate-700 rounded-md text-center">
                        {training.usersname || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {training.trainname || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {training.description || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {training.sheduleDate || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {training.sheduleTime || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {training.releventDepartment || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {training.options || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        <div className="flex justify-center gap-x-4">
                          <Link to={`/training/details/${training._id}`}>
                            <BsInfoCircle className="text-2xl text-green-800" />
                          </Link>
                          <Link to={`/training/edit/${training._id}`}>
                            <AiOutlineEdit className="text-2xl text-yellow-600" />
                          </Link>
                          <Link to={`/training/delete/${training._id}`}>
                            <MdOutlineDelete className="text-2xl text-red-600" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center p-4">
                      No training records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeTrainingHome;
