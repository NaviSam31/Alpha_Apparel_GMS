import React, { useState, useEffect } from "react";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom"; // Import Link for navigation

const EditDiscount = () => {
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [dis, setDis] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/discounts/${id}`)
      .then((response) => {
        setItem(response.data.item);
        setPrice(response.data.price);
        setDis(response.data.dis);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert("An error occurred. Please try again later.");
        console.log(error);
      });
  }, [id]);

  const handleEditDiscount = () => {
    if (!item || !price || !dis) {
      alert("All fields are required.");
      return;
    }
    const data = { item, price, dis };
    setLoading(true);
    axios
      .put(`http://localhost:5555/discounts/${id}`, data)
      .then(() => {
        setLoading(false);
        navigate("/discounts/home");
      })
      .catch((error) => {
        setLoading(false);
        alert("An error occurred. Please try again later.");
        console.log(error);
      });
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">
          <img src="/company-logo.png" className='company-logo' alt='company-logo' />
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
          <h1 className='text-3xl font-bold company-name'>Alpha Apparels PVT LTD</h1>
        </header>
        <div className='button-container'></div>
        <div className='main-content p-4'>
          <BackButton />
          <h1 className="text-3xl my-4">Edit Discount</h1>
          {loading && <Spinner />}
          <div className="flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4 mx-auto">
            <div className="my-4">
              <label className="text-xl mr-4 text-gray-500">Item</label>
              <input
                type="text"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
            </div>
            <div className="my-4">
              <label className="text-xl mr-4 text-gray-500">Price</label>
              <input
                type="text"
                value={price}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!isNaN(value)) {
                    setPrice(value);
                  }
                }}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
            </div>
            <div className="my-4">
              <label className="text-xl mr-4 text-gray-500">Discount</label>
              <input
                type="text"
                value={dis}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!isNaN(value)) {
                    setDis(value);
                  }
                }}
                className="border-2 border-gray-500 px-4 py-2 w-full"
              />
            </div>
            <button
              className={`bg-sky-300 m-8 px-4 py-2 rounded-md ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleEditDiscount}
              disabled={loading}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDiscount;
