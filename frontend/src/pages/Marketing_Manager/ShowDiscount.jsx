import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BackButton from "../../components/MarketingBackButton";
import Spinner from "../../components/Spinner";
import { Link } from 'react-router-dom';

const ShowDiscount = () => {
  const [discount, setDiscount] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/discounts/${id}`)
      .then((response) => {
        setDiscount(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching discount:", error);
        setLoading(false);
      });
  }, [id]);

  return (
      <div className="flex">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="brand">
            <img src="/company-logo.png" className='company-logo' alt='company-logo'></img>
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
    
        {/* Main Content */}
        <div className="main-content">
          <header>
            <h1 className='text-3xl font-bold company-name'>Alpha Apperals PVT LTD</h1>
          </header>
          <div className='button-container'></div>
    
          {/* Design Details */}
          <div className="main-content flex-1 p-6">
            <BackButton />
            <h1 className="text-3xl my-4">Show discount</h1>
            {loading ? (
              <Spinner />
            ) : (
              <div className="flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4">
                <div className="my-4">
                  <span className="text-xl mr-4 text-gray-500">ID</span>
                  <span>{discount._id}</span>
                </div>
                <div>
                  <span className="text-xl mr-4 text-gray-500">Item</span>
                  <span>{discount.item}</span>
                </div>
                <div>
                  <span className="text-xl mr-4 text-gray-500">Price</span>
                  <span>{discount.price}</span>
                </div>
                <div>
                  <span className="text-xl mr-4 text-gray-500">Discount</span>
                  <span>{discount.dis}</span>
                </div>
                <div>
                  <span className="text-xl mr-4 text-gray-500">Created At</span>
                  <span>{discount.createdAt}</span>
                </div>
                <div>
                  <span className="text-xl mr-4 text-gray-500">Updated At</span>
                  <span>{discount.updatedAt}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default ShowDiscount;
