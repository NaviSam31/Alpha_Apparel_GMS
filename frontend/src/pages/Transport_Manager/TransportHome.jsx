import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import { generatePath, Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import { FaCar, FaFilePdf } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Home = () => {
    const componentPDF = useRef();
    const [transports, setTransports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [jobFilter, setJobFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [filteredTransports, setFilteredTransports] = useState([]);

    useEffect(() => {
        setLoading(true);
        axios
            .get('http://localhost:5555/transport')
            .then((response) => {
                const transportsWithDates = response.data.data.map((transport) => {
                    const date = new Date(transport.date);
                    return {
                        ...transport,
                        date: isNaN(date.getTime()) ? null : date,
                    };
                });
                setTransports(transportsWithDates);
                setFilteredTransports(transportsWithDates);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    const formatDate = (date) => {
        if (!date || isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
    };

    const handleSearch = () => {
        const filtered = transports.filter((transport) =>
            transport.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredTransports(filtered);
    };

    const handleFilter = () => {
        let filtered = transports;

        if (jobFilter) {
            filtered = filtered.filter((transport) =>
                transport.job.toLowerCase() === jobFilter.toLowerCase()
            );
        }

        if (dateFilter) {
            filtered = filtered.filter(
                (transport) => formatDate(transport.date) === dateFilter
            );
        }

        setFilteredTransports(filtered);
    };

    const handleResetSearch = () => {
        setSearchQuery('');
        setFilteredTransports(transports);
    };

    const handleResetFilters = () => {
        setJobFilter('');
        setDateFilter('');
        setFilteredTransports(transports);
    };

    useEffect(() => {
        handleFilter();
    }, [jobFilter, dateFilter, transports]);

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(17);
        doc.text('Alpha Aperal(PVT)LTD', 80, 20);
        doc.text('Transport Report', 90, 35);
        doc.text('------------------------------------------------------------------------------------------', 15, 45);
        const columns = [
            { title: 'Job', dataKey: 'job' },
            { title: 'Vehicle', dataKey: 'vehicle' },
            { title: 'VehicleNo', dataKey: 'vehicleNo' },
            { title: 'Driver NIC', dataKey: 'driver' },
            { title: 'Date', dataKey: 'date' },
            { title: 'Time', dataKey: 'time' },
            { title: 'Cost', dataKey: 'cost' },
            { title: 'Destination', dataKey: 'destination' }
        ];

        const data = filteredTransports.map(transport => ({
            job: transport.job,
            vehicle: transport.vehicle,
            vehicleNo: transport.vehicleNo,
            driver: transport.driver,
            date: formatDate(transport.date),
            time: transport.time,
            cost: transport.cost,
            destination: transport.destination,
        }));

        doc.autoTable(columns, data, { startY: 50 });
        doc.save('transport_report.pdf');
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
                    <h1 className="text-3xl font-bold company-name">
                        Alpha Apperals PVT LTD
                    </h1>
                </header>

                <div className="button-container"></div>

                <div className="p-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl my-6 text-center font-bold text-dark-blue">
                            Manage All The Transportation Here
                        </h1>
                        <div className="flex items-center gap-x-2">
                            <Link to="/transport/create">
                                <MdOutlineAddBox className="text-sky-800 text-4xl" />
                            </Link>
                            <Link to="/vehicle">
                                <FaCar className="text-sky-800 text-4xl" />
                            </Link>
                        </div>
                    </div>

                    {/* Report Generation Button */}
                    <div className="flex justify-end mb-3">
                        <button
                            className="px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-red-500 flex items-center gap-2"
                            onClick={generatePDF}
                            style={{ width: '200px' }} // Adjusted for the icon
                        >
                            <FaFilePdf className="text-white text-2xl" />
                            Report Generation
                        </button>
                    </div>

                    {/* Permission Button */}
                    <div className="my-4">
                        <Link
                            to="/transport/finance" // Updated the link to navigate to the TransportFinance page
                            className="px-3 py-1 bg-indigo-700 text-white hover:bg-indigo-400"
                            style={{ width: '100px' }}
                        >
                            Finance
                        </Link>
                    </div>

                    {/* Search input */}
                    <div className="my-4 flex items-center">
                        <input
                            type="text"
                            placeholder="Search by vehicle name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="p-2 border border-gray-300"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-blue-600 text-white ml-2 hover:bg-blue-400"
                            style={{ width: '100px' }}
                        >
                            Search
                        </button>
                        <button
                            onClick={handleResetSearch}
                            className="px-4 py-2 bg-gray-500 text-white ml-2"
                            style={{ width: '80px' }}
                        >
                            Reset
                        </button>
                    </div>


                    {/* Filter inputs and buttons */}
                    <div className="my-4 flex justify-end items-center gap-4">
                        <div className="flex items-center gap-2">
                            <select
                                value={jobFilter}
                                onChange={(e) => setJobFilter(e.target.value)}
                                className="p-2 border border-gray-300"
                            >
                                <option value="">Filter by job</option>
                                <option value="staff">Staff</option>
                                <option value="production">Production</option>
                            </select>

                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="p-2 border border-gray-300"
                            />
                        </div>

                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-green-600 text-white ml-2 hover:bg-green-400"
                            style={{ width: '100px' }}
                        >
                            Filter
                        </button>

                        <button
                            onClick={handleResetFilters}
                            className="px-4 py-2 bg-gray-500 text-white"
                            style={{ width: '80px' }}
                        >
                            Reset
                        </button>
                    </div>

                    {/* Data display */}
                    {loading ? (
                        <Spinner />
                    ) : filteredTransports.length > 0 ? (
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
                                        <th className="p-2 border bg-blue-400">Cost</th>
                                        <th className="p-2 border bg-blue-400">Destination</th>
                                        <th className="p-2 border bg-blue-400">Operations</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransports.map((transport) => (
                                        <tr key={transport._id}>
                                            <td className="p-2 border">{transport.job}</td>
                                            <td className="p-2 border">{transport.vehicle}</td>
                                            <td className="p-2 border">{transport.vehicleNo}</td>
                                            <td className="p-2 border">{transport.driver}</td>
                                            <td className="p-2 border">{formatDate(transport.date)}</td>
                                            <td className="p-2 border">{transport.time}</td>
                                            <td className="p-2 border">{transport.cost}</td>
                                            <td className="p-2 border">{transport.destination}</td>
                                            <td className="p-2 border">
                                                <div className="flex justify-center gap-4">
                                                    <Link
                                                        to={`/transport/edit/${transport._id}`}
                                                        className='text-2xl text-yellow-600'
                                                    >
                                                        <AiOutlineEdit />
                                                    </Link>
                                                    <Link
                                                        to={generatePath(`/transport/details/${transport._id}`)}
                                                        className='text-2xl text-green-800'
                                                    >
                                                        <BsInfoCircle />
                                                    </Link>
                                                    <Link
                                                        to={`/transport/delete/${transport._id}`}
                                                        className='text-2xl text-red-800'

                                                    >
                                                        <MdOutlineDelete />
                                                    </Link>

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

export default Home;
