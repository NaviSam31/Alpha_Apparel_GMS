import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MdOutlineAddBox, MdOutlineDelete, MdSearch } from 'react-icons/md';
import { AiOutlineEdit } from 'react-icons/ai';
import Spinner from '../../components/Spinner';
import jsPDF from 'jspdf';
import 'jspdf-autotable';



const FundHome = () => {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const response = await axios.get('http://localhost:5555/funds');
        setFunds(response.data.data);
      } catch (err) {
        setError('Error fetching funds');
        console.error(err.response ? err.response.data : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFunds();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this fund?')) {
      try {
        await axios.delete(`http://localhost:5555/funds/${id}`);
        setFunds(funds.filter(fund => fund._id !== id));
        alert('Fund successfully deleted!');
      } catch (err) {
        console.error('Error deleting fund:', err);
        alert('There was an error deleting the fund.');
      }
    }
  };

  // Function to filter funds based on the search query
  const filteredFunds = funds.filter((fund) =>
    fund.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fund.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Funds Report', 20, 10);
  
    const tableColumns = ["Department", "Project", "Allocated Amount", "Spent Amount"];
    const tableRows = filteredFunds.map(fund => [
      fund.department,
      fund.project,
      fund.allocated_amount,
      fund.spent_amount,
    ]);
  
    // Generate the table using jspdf-autotable
    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: 20,
    });
  
    // Save the generated PDF
    doc.save('funds-report.pdf');
  };
  

  if (loading) return <Spinner />;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">
          <img src='/public/company-logo.png' className='company-logo' alt='company-logo' />
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
      <div className="main-content" style={{ marginLeft: '200px' }}>
        <header>
          <h1 className='text-3xl font-bold company-name'>Alpha Apparels PVT LTD</h1>
        </header>
        <div className='button-container'></div>
        <div className='button-container'>
          <div className='search-container'>
            <div className='search-bar-container'>
              <MdSearch className='search-icon' />
              <input
                type='text'
                placeholder='Search by Size ID or Size Name'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='search-bar'
              />
            </div>
          </div>
          <Link to='/funds/create'>
            <button className='button buttonAddNew'>
              <img src='../public/add.png' className='icon' alt='Add' /> Allocate Fund
            </button>
          </Link>
          <Link to='/fundRequests/home' >
            <button className='button buttonMaterial'  style={{ width: "170px" }}>
              <img src='../public/money.png' className='icon' alt='Add' /> Fund Requests
            </button>
          </Link>
          <Link to='/transprt/financeBTN' >
            <button className='button buttonMaterial'  style={{ width: "170px" }}>
              <img src='../public/money.png' className='icon' alt='Add' /> Transport Funds
            </button>
          </Link>
          <button
            onClick={generatePDF}
            className='button generate-report'
          >
            <span className='icon'><img src='../public/pdf.png' alt='PDF' /></span>Report (PDF)
          </button>
        </div>




        <div className="flex flex-col items-center p-6">
          <h2 className="text-2xl font-bold mb-4">Fund List</h2>
          {filteredFunds.length === 0 ? (
            <p>No funds available.</p>
          ) : (
            <div className='table-container'>
              <table className="min-w-full border-2 border-gray-300">
                <thead>
                  <tr>
                    <th className="table-heading">Department</th>
                    <th className="table-heading">Project</th>
                    <th className="table-heading">Allocated Amount</th>
                    <th className="table-heading">Spent Amount</th>
                    <th className="table-heading">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFunds.map(fund => (
                    <tr key={fund._id}>
                      <td className="border border-slate-700 rounded-md text-center">
                        {fund.department}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {fund.project}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {fund.allocated_amount}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {fund.spent_amount}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        <div className="flex justify-center gap-x-4">
                          <Link to={`/funds/edit/${fund._id}`}>
                            <AiOutlineEdit className='text-2xl text-yellow-600' />
                          </Link>
                          <Link to={`/funds/delete/${fund._id}`}>
                            <MdOutlineDelete className='text-2xl text-red-600' />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FundHome;
