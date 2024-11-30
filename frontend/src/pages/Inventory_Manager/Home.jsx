import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete, MdSearch } from 'react-icons/md';
import Spinner from '../../components/Spinner';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Home = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/inventory')
      .then((response) => {
        setInventory(response.data.data);
        setFilteredInventory(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredInventory(inventory);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = inventory.filter(item =>
        item.itemCode.toLowerCase().includes(query) ||
        item.productName.toLowerCase().includes(query) ||
        item.productCategory.toLowerCase().includes(query)
      );
      setFilteredInventory(filtered);
    }
  }, [searchQuery, inventory]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Alpha Aperal(PVT)LTD', 14, 22);
    doc.text('Inventory Report', 14, 30);

    // Get the current date and format it
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString(); // This will give a date in MM/DD/YYYY format or according to the user's locale

    // Add the generated date below the title
    doc.setFontSize(12);
    doc.text(`Date: ${formattedDate}`, 14, 38);

    const columns = [
      { title: 'Item Code', dataKey: 'itemCode' },
      { title: 'Product Name', dataKey: 'productName' },
      { title: 'Product Category', dataKey: 'productCategory' },
      { title: 'Product Description', dataKey: 'productDescription' }, // Added column for product description
      { title: 'Selling Price', dataKey: 'price' },
      { title: 'Quantity', dataKey: 'Quantity' }
    ];

    const data = filteredInventory.map(item => ({
      itemCode: item.itemCode,
      productName: item.productName,
      productCategory: item.productCategory,
      productDescription: item.productDescription, // Added product description
      price: item.price,
      Quantity: item.Quantity
    }));

    // Set the Y coordinate for the table a little lower to accommodate the new date text
    doc.autoTable(columns, data, { startY: 50 });

    // Save the PDF
    doc.save('inventory_report.pdf');
};


  const deductQuantity = (itemCode) => {
    const deductionQty = parseInt(prompt('Enter the quantity to deduct:'), 10);
  
    if (!isNaN(deductionQty) && deductionQty > 0) {
      const updatedItem = inventory.find(item => item.itemCode === itemCode);
  
      if (updatedItem.Quantity < deductionQty) {
        alert(`Cannot deduct ${deductionQty}. Only ${updatedItem.Quantity} items are available.`);
      } else {
        const newQuantity = updatedItem.Quantity - deductionQty;
  
        // Update the quantity in the database
        axios
          .put(`http://localhost:5555/inventory/${itemCode}`, { Quantity: newQuantity })
          .then(response => {
            // After successfully updating the database, update the local state
            const updatedInventory = inventory.map(item =>
              item.itemCode === itemCode ? { ...item, Quantity: newQuantity } : item
            );
            setInventory(updatedInventory);
            setFilteredInventory(updatedInventory);
          })
          .catch(error => {
            console.error('Error updating inventory:', error);
            alert('Failed to update inventory.');
          });
      }
    } else {
      alert('Please enter a valid quantity.');
    }
  };
  
  const chartData = {
    labels: filteredInventory.map(item => item.productName),
    datasets: [
      {
        label: 'Quantity',
        data: filteredInventory.map(item => item.Quantity),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Inventory Quantity by Product',
      },
    },
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
          <div className='nav-dept'><Link to="/inventory/home"><img src='/public/inventory.png' className='icon' alt='Inventory' /> Inventory</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/tshirt.png' className='icon' alt='Design' /> Design</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/orders.png' className='icon' alt='Orders' /> Orders</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/supplier.png' className='icon' alt='Supplier' /> Supplier</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/marketing.png' className='icon' alt='Marketing' /> Marketing</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/human-resource.png' className='icon' alt='Human Resource' /> Human Resource</Link></div>
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
        <div className='button-container'></div>
        <div className='button-container'>
          <div className='search-container'>
            <div className='search-bar-container'>
              <MdSearch className='search-icon' />
              <input
                type='text'
                placeholder='Search by Item Code, Name, or Category'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='search-bar'
              />
            </div>

            {/* <select
              value={selectedCategory}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="filter-dropdown"
            >
              <option value="">Filter By Category</option>
              <option value="s">Raw Material</option>
              <option value="m">Packing Material</option>
              <option value="l">Finished Items</option>

            </select> */}
          </div>
          <Link to='/inventory/create'>
            <button className='button buttonAddNew'>
              <img src='../public/add.png' className='icon' alt='Add' /> Add Item
            </button>
          </Link>
          <Link to='/reOrder/home'>
            <button className='button buttonMaterial'>
              <img src='../public/return.png' className='icon' alt='Add' /> Re Order
            </button>
          </Link>
          <button
            onClick={generatePDF}
            className='button generate-report'
          >
            <span className='icon'><img src='/pdf.png' alt="PDF" /></span>Report (PDF)
          </button>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className='chart-container'>
              <Bar data={chartData} options={chartOptions} height={40} width={80} />
            </div>
            <div className='table-container-inventory'>
              <table>
                <thead>
                  <tr>
                    <th className='table-heading'>Item Code</th>
                    <th className='table-heading'>Product Name</th>
                    <th className='table-heading max-md:hidden'>Product Category</th>
                    <th className='table-heading max-md:hidden'>Product Description</th> {/* Added header for Product Description */}
                    <th className='table-heading max-md:hidden'>Selling Price</th>
                    <th className='table-heading max-md:hidden'>Quantity (Unit)</th>
                    <th className='table-heading'>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredInventory.map((item) => (
                    <tr key={item.itemCode} className={`table-row ${item.Quantity < item.MinQuantity ? 'highlight-row' : ''}`}>

                      <td className='border border-slate-700 rounded-md text-center'>{item.itemCode}</td>
                      <td className='border border-slate-700 rounded-md text-center max-md:hidden'>{item.productName}</td>
                      <td className='border border-slate-700 rounded-md text-center max-md:hidden'>{item.productCategory}</td>
                      <td className='border border-slate-700 rounded-md text-center max-md:hidden'>{item.productDescription}</td> {/* Display Product Description */}
                      <td className='border border-slate-700 rounded-md text-center max-md:hidden'>LKR. {item.price}</td>
                      <td className='border border-slate-700 rounded-md text-center max-md:hidden'>{item.Quantity}</td>
                      <td className='border border-slate-700 rounded-md text-center'>
                        <div className='flex justify-center gap-x-4'>
                          <Link to={`/inventory/details/${item.itemCode}`}>
                            <BsInfoCircle className='text-2xl text-green-800' />
                          </Link>
                          <Link to={`/inventory/edit/${item.itemCode}`}>
                            <AiOutlineEdit className='text-2xl text-yellow-600' />
                          </Link>
                          <Link to={`/inventory/delete/${item.itemCode}`}>
                            <MdOutlineDelete className='text-2xl text-red-600' />
                          </Link>
                          <button
                            onClick={() => deductQuantity(item.itemCode)}
                            className='text-2xl text-blue-600'
                            style={{ backgroundColor: 'transparent', cursor: 'pointer', outline: 'none', border: 'none' }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = 'transparent'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            Deduct
                          </button>

                        </div>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
