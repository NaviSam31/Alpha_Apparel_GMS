import React, { useState, useEffect } from "react";
import BackButton from "../../components/MarketingBackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const CreateDiscount = () => {
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [dis, setDis] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const navigate = useNavigate();

  // Fetch items from the API
  useEffect(() => {
    axios
      .get("http://localhost:5555/items")
      .then((response) => {
        setItems(response.data);
        setLoadingItems(false);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        setLoadingItems(false);
      });
  }, []);

  useEffect(() => {
    if (price && dis) {
      const priceValue = parseFloat(price);
      const discountPercentage = parseFloat(dis);

      if (!isNaN(priceValue) && !isNaN(discountPercentage) && priceValue >= 0 && discountPercentage >= 0 && discountPercentage <= 100) {
        const discountAmount = (priceValue * discountPercentage) / 100;
        setDiscountedPrice((priceValue - discountAmount).toFixed(2));
      } else {
        setDiscountedPrice(0);
      }
    } else {
      setDiscountedPrice(0);
    }
  }, [price, dis]);

  const handleSaveDiscount = () => {
    if (!item || !price || !dis) {
      alert("All fields are required.");
      return;
    }

    const priceValue = parseFloat(price);
    const discountPercentage = parseFloat(dis);

    // Validate that price and discount percentage are valid
    if (priceValue < 0 || discountPercentage < 0 || discountPercentage > 100) {
      alert("Price cannot be negative and discount percentage must be between 0 and 100.");
      return;
    }

    const data = {
      item,
      price: priceValue,
      dis: discountPercentage,
      discountedPrice: parseFloat(discountedPrice),
    };

    setLoading(true);
    axios
      .post("http://localhost:5555/discounts", data)
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
          <img src="../public/company-logo.png" className="company-logo" alt="company-logo" />
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
          <h1 className="text-3xl font-bold company-name">Alpha Apparels PVT LTD</h1>
        </header>
        <div className='button-container'>
        </div>
        <div className="main-content p-4">
          <BackButton />
          <h1 className="text-3xl my-4">Create Discount</h1>
          {loadingItems ? <Spinner /> : ""}
          <div className="flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4 mx-auto">
            <div className="my-4">
              <label className="text-xl mr-4 text-gray-500">Item</label>
              {loadingItems ? (
                <Spinner />
              ) : (
                <select
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  className="border-2 border-gray-500 px-4 py-2 w-full"
                >
                  <option value="" disabled>Select an item</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.itemCode}>
                      {item.productName} (Code: {item.itemCode})
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <div className="my-4">
                <label className="text-xl mr-4 text-gray-500">Price</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="border-2 border-gray-500 px-4 py-2 w-full"
                  min="0"
                />
              </div>
              <div className="my-4">
                <label className="text-xl mr-4 text-gray-500">Discount Percentage</label>
                <input
                  type="number"
                  value={dis}
                  onChange={(e) => setDis(e.target.value)}
                  className="border-2 border-gray-500 px-4 py-2 w-full"
                  min="0"
                  max="100"
                />
              </div>
              <div className="my-4">
                <label className="text-xl mr-4 text-gray-500">Discounted Price</label>
                <input
                  type="text"
                  value={discountedPrice}
                  readOnly
                  className="border-2 border-gray-500 px-4 py-2 w-full bg-gray-200"
                />
              </div>
              <button
                className={`bg-sky-300 m-8 px-4 py-2 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={handleSaveDiscount}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDiscount;
