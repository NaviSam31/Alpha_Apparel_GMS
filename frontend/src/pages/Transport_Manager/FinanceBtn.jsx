import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../../components/Spinner'; // Make sure the path is correct
import { Link } from 'react-router-dom';

const FinanceBtn = () => {
  const [transports, setTransports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/transport') // Adjust the API endpoint if necessary
      .then((response) => {
        setTransports(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleApprove = (id) => {
    axios
      .put(`http://localhost:5555/transport/${id}/approve`) // Ensure this URL is correct
      .then(() => {
        console.log(`Approved transport with id: ${id}`);
        setTransports((prevTransports) =>
          prevTransports.map((transport) =>
            transport._id === id ? { ...transport, approved: true } : transport
          )
        );
      })
      .catch((error) => {
        console.error(`Failed to approve transport with id: ${id}`, error);
      });
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar w-1/5 p-4 bg-gray-100">
        <div className="brand mb-6">
          <img
            src="../public/company-logo.png"
            className="company-logo"
            alt="company-logo"
          />
        </div>
        <nav>
          <div className="nav-dept">
            <Link to="/">
              <img src="/public/home.png" className="icon" alt="Home" /> Home
            </Link>
          </div>
          <div className="nav-dept">
            <Link to="">
              <img src="/public/inventory.png" className="icon" alt="Inventory" />{' '}
              Inventory
            </Link>
          </div>
          <div className="nav-dept">
            <Link to="">
              <img src="/public/tshirt.png" className="icon" alt="Design" />{' '}
              Design
            </Link>
          </div>
          <div className="nav-dept">
            <Link to="">
              <img src="/public/orders.png" className="icon" alt="Orders" />{' '}
              Orders
            </Link>
          </div>
          <div className="nav-dept">
            <Link to="">
              <img src="/public/supplier.png" className="icon" alt="Supplier" />{' '}
              Supplier
            </Link>
          </div>
          <div className="nav-dept">
            <Link to="">
              <img
                src="/public/marketing.png"
                className="icon"
                alt="Marketing"
              />{' '}
              Marketing
            </Link>
          </div>
          <div className="nav-dept">
            <Link to="">
              <img
                src="/public/human-resource.png"
                className="icon"
                alt="Human Resource"
              />{' '}
              Human Resource
            </Link>
          </div>
          <div className="nav-dept financial">
            <Link to="">
              <img src="/public/financial.png" className="icon" alt="Financial" />{' '}
              Financial
            </Link>
            <div className="dropdown">
              <Link to="/fundRequests/create">Request Fund</Link>
              <Link to="">Finance Dashboard</Link>
            </div>
          </div>
          <div className="nav-dept">
            <Link to="/transport/home">
              <img src="/public/transport.png" className="icon" alt="Transport" />{' '}
              Transport
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content w-4/5 p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold company-name">Alpha Apparels PVT LTD</h1>
        </header>

        <div className="p-20">
          <h1 className="text-3xl my-6 text-center font-bold text-dark-blue">
             Travelling Cost Details 
          </h1>

          {/* Data display */}
          {loading ? (
            <Spinner />
          ) : transports.length > 0 ? (
            <div className="mt-8">
              <table className="min-w-full border-collapse border">
                <thead>
                  <tr>
                    <th className="p-2 border bg-blue-400">Job</th>
                    <th className="p-2 border bg-blue-400">Vehicle</th>
                    <th className="p-2 border bg-blue-400">Vehicle No</th>
                    <th className="p-2 border bg-blue-400">Driver NIC</th>
                    <th className="p-2 border bg-blue-400">Date</th>
                    <th className="p-2 border bg-blue-400">Time</th>
                    <th className="p-2 border bg-red-500">Cost</th>
                    <th className="p-2 border bg-blue-400">Destination</th>
                    <th className="p-2 border bg-yellow-400">Approval</th>
                  </tr>
                </thead>
                <tbody>
                  {transports.map((transport) => (
                    <tr key={transport._id}>
                      <td className="p-2 border">{transport.job}</td>
                      <td className="p-2 border">{transport.vehicle}</td>
                      <td className="p-2 border">{transport.vehicleNo}</td>
                      <td className="p-2 border">{transport.driver}</td>
                      <td className="p-2 border">{new Date(transport.date).toLocaleDateString()}</td>
                      <td className="p-2 border">{transport.time}</td>
                      <td className="p-2 border">{transport.cost}</td>
                      <td className="p-2 border">{transport.destination}</td>
                      <td className="p-2 border">
                        <div className="flex justify-center">
                          <button 
                            onClick={() => handleApprove(transport._id)} 
                            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500"
                          >
                            Approve
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No transport data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinanceBtn;
