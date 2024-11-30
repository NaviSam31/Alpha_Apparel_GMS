import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { Link } from "react-router-dom";
import { BsInfoCircle } from 'react-icons/bs';
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import { useReactToPrint } from "react-to-print";

const Home = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredDiscounts, setFilteredDiscounts] = useState([]); // State for filtered discounts
  const [itemFilter, setItemFilter] = useState(""); // State for item filter
  const componentPDF = useRef();

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5555/discounts")
      .then((response) => {
        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setDiscounts(data);
        setFilteredDiscounts(data); // Initialize filtered discounts
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  // Handle search functionality
  const handleSearch = () => {
    const filtered = discounts.filter(
      (discount) => discount.dis.toString().includes(searchQuery) // Filter by discount percentage
    );
    setFilteredDiscounts(filtered);
  };

  // Handle reset search
  const handleResetSearch = () => {
    setSearchQuery("");
    setFilteredDiscounts(discounts); // Reset the filtered discounts
  };

  // Handle filter by item
  const handleFilter = () => {
    const filtered = discounts.filter(
      (discount) => (itemFilter ? discount.item === itemFilter : true) // Filter by item name
    );
    setFilteredDiscounts(filtered);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setItemFilter(""); // Reset item filter
    setFilteredDiscounts(discounts); // Reset the filtered discounts
  };

  // Report generation function
  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: "Discounts Report",
    onBeforeGetContent: () => {
      const dateElement = document.createElement("h6");
      dateElement.textContent = `Date: ${new Date().toLocaleDateString()}`;
      dateElement.id = "pdfDate";
      componentPDF.current.appendChild(dateElement);
    },
    onAfterPrint: () => {
      const dateElement = document.getElementById("pdfDate");
      if (dateElement) {
        componentPDF.current.removeChild(dateElement);
      }
      alert("Data saved in PDF");
    },
  });

  return (
    <div>
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
          <div className='nav-dept'><Link to="/discounts/home"><img src='/public/marketing.png' className='icon' alt='Marketing' /> Marketing</Link></div>
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
    <header>
          <h1 className='text-3xl font-bold company-name'>Alpha Apperals PVT LTD</h1>
        </header>
    <div className="p-4 bg-white-100 min-h-screen marketing-home">
      {" "}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl my-8">Manage All The Discounts Here,</h1>
        <div className="flex gap-4">
          <Link to="/discounts/create">
            <MdOutlineAddBox className="text-sky-800 text-4xl" />
          </Link>
          <button
            onClick={generatePDF}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            style={{ width: "150px" }} 

          >
            Generate Report
          </button>
        </div>
      </div>
      {/* Search by discount functionality */}
      <div className="my-4 flex items-center">
        <input
          type="text"
          placeholder="Search by discount percentage..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ml-2"
          style={{ width: "150px" }} 

        >
          Search
        </button>
        <button
          onClick={handleResetSearch}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 ml-2"
          style={{ width: "150px" }} 

        >
          Reset
        </button>
      </div>
      {/* Filter by item functionality */}
      <div className="my-4 flex justify-end items-center gap-4">
        <div className="flex items-center gap-2">
          <select
            value={itemFilter}
            onChange={(e) => setItemFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">Filter by item</option>
            {discounts.map((discount) => (
              <option key={discount._id} value={discount.item}>
                {discount.item}
              </option>
            ))}
          </select>

          <button
            onClick={handleFilter}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Filter
          </button>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <div ref={componentPDF}>
          <table className="w-full border-separate border border-spacing-2">
            <thead>
              <tr>
                <th className="border border-slate-600 rounded-md">Item</th>
                <th className="border border-slate-600 rounded-md">
                  Original Price
                </th>
                <th className="border border-slate-600 rounded-md">
                  Discount Percentage
                </th>
                <th className="border border-slate-600 rounded-md">
                  Discounted Price
                </th>
                <th className="border border-slate-600 rounded-md">
                  Choose Option
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDiscounts.map((discount) => {
                // Calculate the discounted price
                const discountedPrice = (
                  discount.price -
                  (discount.price * discount.dis) / 100
                ).toFixed(2);

                return (
                  <tr key={discount._id} className="h-8">
                    <td className="border border-slate-700 rounded-md text-center">
                      {discount.item}
                    </td>
                    <td className="border border-slate-700 rounded-md text-center">
                      {discount.price}
                    </td>
                    <td className="border border-slate-700 rounded-md text-center">
                      {discount.dis}%
                    </td>
                    <td className="border border-slate-700 rounded-md text-center">
                      {discountedPrice}
                    </td>
                    <td className="border border-slate-700 rounded-md text-center">
                      <div className="flex justify-center gap-4">
                      <Link to={`/discounts/details/${discount._id}`}>
                          <BsInfoCircle className="text-2xl text-gren-800" />
                        </Link>
                        <Link to={`/discounts/edit/${discount._id}`}>
                          <AiOutlineEdit className="text-2xl text-yellow-600" />
                        </Link>
                        <Link to={`/discounts/delete/${discount._id}`}>
                          <MdOutlineDelete className="text-2xl text-red-600" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
  );
};

export default Home;
