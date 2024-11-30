import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete, MdHome } from 'react-icons/md';

const VehicleHome = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [filteredVehicles, setFilteredVehicles] = useState([]); // State for filtered vehicles

    useEffect(() => {
        setLoading(true);
        axios
            .get('http://localhost:5555/vehicle')
            .then((response) => {
                setVehicles(response.data.data);
                setFilteredVehicles(response.data.data); // Initialize filteredVehicles with all vehicles
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    // Function to handle search
    const handleSearch = () => {
        const filtered = vehicles.filter((vehicle) =>
            vehicle.model.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredVehicles(filtered);
    };

    // Function to reset search
    const handleReset = () => {
        setSearchQuery('');
        setFilteredVehicles(vehicles);
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="sidebar w-1/5 p-4 bg-gray-100">
                <div className="brand mb-6">
                    <img src='../public/company-logo.png' className='company-logo' alt='company-logo' />
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
                        <Link to="">
                            <img src='/public/financial.png' className='icon' alt='Financial' /> Financial
                        </Link>
                        <div className='dropdown'>
                            <Link to="/fundRequests/create">Request Fund</Link>
                            <Link to="">Finance Dashboard</Link>
                        </div>
                    </div>
                    <div className='nav-dept'><Link to="/transport/home"><img src='/public/transport.png' className='icon' alt='Transport' /> Transport</Link></div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="main-content w-4/5 p-6">
                <header className="mb-6">
                    <h1 className='text-3xl font-bold company-name'>Alpha Apperals PVT LTD</h1>
                </header>

                <div className='button-container'>
                </div>

                <div className='p-4'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-3xl my-6 text-center font-bold text-dark-blue'>
                            Manage All The Vehicles Here,
                        </h1>
                        <div className='flex items-center gap-x-2'>
                            <Link to='/vehicle/create'>
                                <MdOutlineAddBox className='text-sky-800 text-4xl' />
                            </Link>
                            <Link to='/transport/home'>
                                <MdHome className='text-sky-800 text-4xl' />
                            </Link>
                        </div>
                    </div>

                    {/* Search input and buttons */}
                    <div className='my-4 flex items-center gap-2'>
                        <input
                            type='text'
                            placeholder='Search by model name...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='p-2 border border-gray-300 rounded-md'
                        />
                        <button
                            onClick={handleSearch}
                            className='px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-600'
                            style={{ width: "150px" }}
                        >
                            Search
                        </button>
                        <button
                            onClick={handleReset}
                            className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600'
                            style={{ width: "150px" }}
                        >
                            Reset
                        </button>
                    </div>

                    {loading ? (
                        <Spinner />
                    ) : (
                        <table className='w-full border border-slate-600'>
                            <thead>
                                <tr>
                                    <th className='border border-slate-600 bg-blue-500 text-white py-2'>No</th>
                                    <th className='border border-slate-600 bg-blue-500 text-white py-2'>Year</th>
                                    <th className='border border-slate-600 bg-blue-500 text-white py-2'>Model</th>
                                    <th className='border border-slate-600 bg-blue-500 text-white py-2'>Vehicle</th>
                                    <th className='border border-slate-600 bg-blue-500 text-white py-2'>VehicleNo</th>
                                    <th className='border border-slate-600 bg-blue-500 text-white py-2'>Rentered Company</th>
                                    <th className='border border-slate-600 bg-blue-500 text-white py-2'>Rental Fee</th>
                                    <th className='border border-slate-600 bg-blue-500 text-white py-2'>Capacity</th>
                                    <th className='border border-slate-600 bg-blue-500 text-white py-2'>Description</th>
                                    <th className='border border-slate-600 bg-blue-500 text-white py-2'>Operations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredVehicles.map((vehicle, index) => (
                                    <tr key={vehicle._id} className='h-8'>
                                        <td className='border border-slate-700 text-center'>
                                            {index + 1}
                                        </td>
                                        <td className='border border-slate-700 text-center'>
                                            {vehicle.year}
                                        </td>
                                        <td className='border border-slate-700 text-center'>
                                            {vehicle.model}
                                        </td>
                                        <td className='border border-slate-700 text-center'>
                                            {vehicle.vehicle}
                                        </td>
                                        <td className='border border-slate-700 text-center'>
                                            {vehicle.vehicleNo}
                                        </td>
                                        <td className='border border-slate-700 text-center'>
                                            {vehicle.renteredCompany}
                                        </td>
                                        <td className='border border-slate-700 text-center'>
                                            {vehicle.rentalFee}
                                        </td>
                                        <td className='border border-slate-700 text-center'>
                                            {vehicle.capacity}
                                        </td>
                                        <td className='border border-slate-700 text-center'>
                                            {vehicle.description}
                                        </td>
                                        <td className='border border-slate-700 text-center'>
                                            <div className='flex justify-center gap-x-4'>
                                                <Link to={`/vehicle/details/${vehicle._id}`}>
                                                    <BsInfoCircle className='text-2xl text-green-800' />
                                                </Link>
                                                <Link to={`/vehicle/edit/${vehicle._id}`}>
                                                    <AiOutlineEdit className='text-2xl text-yellow-600' />
                                                </Link>
                                                <Link to={`/vehicle/delete/${vehicle._id}`}>
                                                    <MdOutlineDelete className='text-2xl text-red-800' />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>
        </div>

    );
};

export default VehicleHome;
