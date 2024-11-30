import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete, MdSearch } from 'react-icons/md';
import Spinner from '../../components/Spinner';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const generatePDF = (sizesData) => {
  if (!sizesData || sizesData.length === 0) {
    alert('No data available to generate PDF.');
    return;
  }

  // Create jsPDF document in landscape mode
  const doc = new jsPDF({ orientation: 'landscape' });

  // Set report title and header
  doc.setFontSize(17);
  doc.text('Alpha Apparel (PVT) LTD', 120, 20);
  doc.text('Material Requirement Report', 115, 35);
  doc.text('---------------------------------------------------------------------------', 80, 45);

  // Get the current date
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString(); 

  // Add the current date to the report
  doc.setFontSize(12);
  doc.text(`Report Date: ${formattedDate}`, 14, 48);

  // Define table columns
  const columns = [
    { title: 'Design ID', dataKey: 'DesignID' },
    { title: 'Size', dataKey: 'sizeID' },
    { title: 'Material ID 1', dataKey: 'materialID1' },
    { title: 'QTY 1', dataKey: 'qtyRequired1' },
    { title: 'Material ID 2', dataKey: 'materialID2' },
    { title: 'QTY 2', dataKey: 'qtyRequired2' },
    { title: 'Material ID 3', dataKey: 'materialID3' },
    { title: 'QTY 3', dataKey: 'qtyRequired3' },
    { title: 'Material ID 4', dataKey: 'materialID4' },
    { title: 'QTY 4', dataKey: 'qtyRequired4' },
    { title: 'Material ID 5', dataKey: 'materialID5' },
    { title: 'QTY 5', dataKey: 'qtyRequired5' },
    { title: 'Material ID 6', dataKey: 'materialID6' },
    { title: 'QTY 6', dataKey: 'qtyRequired6' },
    { title: 'Material ID 7', dataKey: 'materialID7' },
    { title: 'QTY 7', dataKey: 'qtyRequired7' },
  ];

  let totals = Array(7).fill(0);

  // Map through the sizesData to populate table rows
  const data = sizesData.map((design) => {
    design.materials.forEach((material, index) => {
      if (index < 7) {
        totals[index] += material.qtyRequired || 0;
      }
    });

    const row = {
      DesignID: design.designID,
      sizeID: design.sizeID,
    };

    design.materials.forEach((material, index) => {
      row[`materialID${index + 1}`] = material.materialID || '';
      row[`qtyRequired${index + 1}`] = material.qtyRequired || 0;
    });

    return row;
  });

  // Add totals row at the bottom
  const totalsRow = {
    DesignID: 'Totals',
    sizeID: '',
  };

  totals.forEach((total, index) => {
    totalsRow[`materialID${index + 1}`] = '';
    totalsRow[`qtyRequired${index + 1}`] = total;
  });

  
  // Generate table with autoTable plugin
  doc.autoTable({
    head: [columns.map((col) => col.title)],
    body: [...data.map((row) => Object.values(row)), Object.values(totalsRow)],
    startY: 50,
  });

  // Save the PDF file
  doc.save('Material_Requirement_report_with_totals.pdf');
};


const MaterialRequirementHome = () => {
  const [materialRequirement, setMaterialRequirement] = useState([]);
  const [filteredSizes, setFilteredSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [maxMaterialsCount, setMaxMaterialsCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5555/materialRequirement')
      .then((response) => {
        const data = response.data;
        setMaterialRequirement(data);
        setFilteredSizes(data);
        // Determine the maximum number of materials for any design
        const maxCount = Math.max(...data.map(item => item.materials.length), 0);
        setMaxMaterialsCount(maxCount);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching design data:', error);
        setLoading(false);
      });
  }, []);

  // Filter function
  useEffect(() => {
    let filtered = materialRequirement;

    // Filter based on search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (material) =>
          material.designID.toLowerCase().includes(query) ||
          material.sizeID.toLowerCase().includes(query)
      );
    }

    // Filter based on selected size
    if (selectedSize) {
      filtered = filtered.filter((material) => material.sizeID === selectedSize);
    }

    setFilteredSizes(filtered);
  }, [searchQuery, selectedSize, materialRequirement]);

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
        <h1 className='text-3xl font-bold'>Manage Material Requirement Here</h1>
        
        </div>
        <div className='button-container'>
          <div className='search-container'>
            <div className='search-bar-container'>
              <MdSearch className='search-icon' />
              <input
                type='text'
                placeholder='Search by Design ID, Design Name, or Size ID'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='search-bar'
              />
            </div>

            {/* Dropdown for Size Filter */}
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="filter-dropdown"
            >
              <option value="">Filter By All Sizes</option>
              <option value="s">S</option>
              <option value="m">M</option>
              <option value="l">L</option>
              <option value="xl">XL</option>
              <option value="xxl">XXL</option>
              <option value="3xl">3XL</option>
            </select>
          </div>
          <Link to='/materialRequirement/create'>
            <button className='button buttonAddNew'>
              <img src='../public/add.png' className='icon' alt='Add' /> Add New
            </button>
          </Link>
          <Link to='/sizes/home'>
            <button className='button buttonMaterial'>
              <img src='../public/tape-measure.png' className='icon' alt='Add' /> Sizes
            </button>
          </Link>
          <Link to='/design/home'>
            <button className='button buttonMaterial'>
              <img src='../public/tshirt.png' className='icon' alt='Add' /> Designs
            </button>
          </Link>
          <button
            onClick={() => generatePDF(filteredSizes)}
            className='button generate-report'
          >
            <span className='icon'><img src='../public/pdf.png' alt='PDF' /></span>Report (PDF)
          </button>

        </div>

        <div className='table-container-inventory'>
          {loading ? (
            <Spinner />
          ) : (
            <table className='material-table'>
              <thead>
                <tr>
                  <th className='table-heading'>Design ID</th>
                  <th className='table-heading'>Size ID</th>
                  {Array.from({ length: maxMaterialsCount }, (_, index) => (
                    <React.Fragment key={`materialID${index + 1}`}>
                      <th className='table-heading'>Material ID {index + 1}</th>
                      <th className='table-heading'>QTY {index + 1}</th>
                    </React.Fragment>
                  ))}
                  <th className='table-heading'>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredSizes.map((size) => {
                  const materialsCount = size.materials.length;
                  return (
                    <tr key={size.designID}>
                      <td className='border border-slate-700 rounded-md text-center'>{size.designID}</td>
                      <td className='border border-slate-700 rounded-md text-center'>{size.sizeID}</td>
                      {size.materials.map((material, index) => (
                        <React.Fragment key={material.materialID}>
                          {index < maxMaterialsCount ? (
                            <>
                              <td className='border border-slate-700 rounded-md text-center'>{material.materialID}</td>
                              <td className='border border-slate-700 rounded-md text-center'>{material.qtyRequired}</td>
                            </>
                          ) : null}
                        </React.Fragment>
                      ))}
                      {/* Fill in the remaining cells for missing materials */}
                      {Array.from({ length: maxMaterialsCount - materialsCount }, (_, index) => (
                        <React.Fragment key={`empty-${index}`}>
                          <td className='border border-slate-700 rounded-md text-center'>N/A</td>
                          <td className='border border-slate-700 rounded-md text-center'>0</td>
                        </React.Fragment>
                      ))}
                      <td className='border border-slate-700 rounded-md text-center'>
                        <div className="flex justify-center gap-x-4">
                        <Link to={`/materialRequirement/details/${size._id}`}>
                            <BsInfoCircle className="text-2xl text-green-800" />
                          </Link>
                          <Link to={`/materialRequirement/edit/${size._id}`} className='text-2xl text-yellow-600'>
                            <AiOutlineEdit />
                          </Link>
                          <Link to={`/materialRequirement/delete/${size._id}`} className='text-2xl text-red-600'>
                            <MdOutlineDelete />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialRequirementHome;
