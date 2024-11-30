import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete, MdSearch } from 'react-icons/md';
import Spinner from '../../components/Spinner';
import jsPDF from 'jspdf';
import 'jspdf-autotable';



const SizeHome = () => {
  const [sizes, setSizes] = useState([]);
  const [filteredSizes, setFilteredSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5555/sizes')
      .then((response) => {
        setSizes(response.data);
        setFilteredSizes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching size data:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredSizes(sizes);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = sizes.filter((size) =>
        size.sizeID.toLowerCase().includes(query) ||
        size.sizeName.toLowerCase().includes(query)
      );
      setFilteredSizes(filtered);
    }
  }, [searchQuery, sizes]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(17);
    doc.text('Alpha Aperal(PVT)LTD', 80, 20);
    doc.text('Size Report', 90, 35);
    doc.text('------------------------------------------------------------------------------------------', 15, 42);


  // Get the current date
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString(); 

  // Add the current date to the report
  doc.setFontSize(12);
  doc.text(`Report Date: ${formattedDate}`, 14, 48);


    const columns = [
      { title: 'Size ID', dataKey: 'sizeID' },
      { title: 'sizeName', dataKey: 'sizeName' },
      { title: 'chestMeasurement', dataKey: 'chestMeasurement' },
      { title: 'waistMeasurement', dataKey: 'waistMeasurement' },
      { title: 'hipMeasurement', dataKey: 'hipMeasurement' },
      { title: 'length', dataKey: 'length' },
    ];

    const data = filteredSizes.map(sizes => ({
      sizeID: sizes.sizeID,
      sizeName: sizes.sizeName,
      chestMeasurement: sizes.chestMeasurement,
      waistMeasurement: sizes.waistMeasurement,
      hipMeasurement: sizes.hipMeasurement,
      length: sizes.length,
    }));

    doc.autoTable(columns, data, { startY: 50 });
    doc.save('size_report.pdf');
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
        <div className='header-container'>
          <h1 className='text-3xl font-bold'>Manage All The Sizes Here</h1>


        </div>
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
          <Link to='/sizes/create'>
            <button className='button buttonAddNew'>
              <img src='../public/add.png' className='icon' alt='Add' /> Add New
            </button>
          </Link>
          <Link to='/design/home' >
            <button className='button buttonMaterial'>
              <img src='../public/tshirt.png' className='icon' alt='Add' /> Designs
            </button>
          </Link>
          <Link to='/materialRequirement/home'>
            <button className='button buttonMaterial'>
              <img src='../public/machine.png' className='icon' alt='Add' /> Materials
            </button>
          </Link>
          <button
            onClick={generatePDF}
            className='button generate-report'
          >
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
                  <th className='table-heading max-md:hidden'>Size ID</th>
                  <th className='table-heading'>Size Name</th>
                  <th className='table-heading'>Chest Measurement (Inches)</th>
                  <th className='table-heading'>Waist Measurement (Inches)</th>
                  <th className='table-heading'>Hip Measurement (Inches)</th>
                  <th className='table-heading max-md:hidden'>Length (Inches)</th>
                  <th className='table-heading'></th>
                </tr>
              </thead>
              <tbody>
                {filteredSizes.length > 0 ? (
                  filteredSizes.map((size) => (
                    <tr key={size._id} className="h-8">
                      <td className="border border-slate-700 rounded-md text-center">
                        {size.sizeID || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center max-md:hidden">
                        {size.sizeName || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {size.chestMeasurement || 0}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {size.waistMeasurement || 0}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center max-md:hidden">
                        {size.hipMeasurement || 0}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {size.length || 0}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        <div className="flex justify-center gap-x-4">
                          <Link to={`/sizes/details/${size._id}`}>
                            <BsInfoCircle className="text-2xl text-green-800" />
                          </Link>
                          <Link to={`/sizes/edit/${size._id}`}>
                            <AiOutlineEdit className="text-2xl text-yellow-600" />
                          </Link>
                          <Link to={`/sizes/delete/${size._id}`}>
                            <MdOutlineDelete className="text-2xl text-red-600" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center p-4">
                      No size records found.
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

export default SizeHome;
