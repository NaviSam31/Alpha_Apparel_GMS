import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete, MdSearch } from 'react-icons/md';
import Spinner from '../../components/Spinner';




const SizeChart = () => {
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

  

  return (
    <div className="flex">


      {/* Main Content */}
      <div className="main-content">
        <header>
        <img src='../public/company-logo.png' className='company-logo' alt='company-logo'></img>
          <h1 className='text-3xl font-bold company-name'>Alpha Apperals PVT LTD</h1>
        </header>
        <div className='header-container' >
          <h1 className='text-3xl font-bold'>Size Chart</h1>


        </div>
        <div className='button-container' style={{ marginLeft: '-50px' }}>
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
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className='table-container' style={{ marginLeft: '-120px' }}>
            <table className='dataTable'>
              <thead>
                <tr>
                  <th className='table-heading max-md:hidden'>Size ID</th>
                  <th className='table-heading'>Size Name</th>
                  <th className='table-heading'>Chest Measurement (Inches)</th>
                  <th className='table-heading'>Waist Measurement (Inches)</th>
                  <th className='table-heading'>Hip Measurement (Inches)</th>
                  <th className='table-heading max-md:hidden'>Length (Inches)</th>
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

export default SizeChart;
