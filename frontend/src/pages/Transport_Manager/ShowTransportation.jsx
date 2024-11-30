import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams,Link } from 'react-router-dom';
import BackButton from '../../components/TransportBackButton';
import Spinner from '../../components/Spinner';

// Reusable component to display transport detail
const TransportDetail = ({ label, value }) => (
    <div className='my-2 flex justify-between w-full'>
        <span className='text-lg font-medium mr-4 text-gray-600'>{label}</span>
        <span className='text-lg'>{value}</span>
    </div>
);

const ShowTransport = () => {
    const [transport, setTransport] = useState({});
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        axios
            .get(`http://localhost:5555/transport/${id}`)
            .then((response) => {
                setTransport(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [id]);

    return (
        <div className="flex">
        {/* Sidebar */}
        <div className="sidebar w-1/5 p-4 bg-gray-100">
            <div className="brand mb-6">
                <img src='../../public/company-logo.png' className='company-logo' alt='company-logo' />
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


            <div className='min-h-screen flex flex-col'>

                <div className='p-4'>
                    <BackButton />
                    <h1 className='text-3xl font-semibold my-4 text-center font-bold text-dark-blue'>Show Transport</h1>
                </div>
                <div className='flex flex-grow justify-center items-center'>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <div className='w-full max-w-md border border-sky-400 rounded-xl p-4 bg-white shadow-lg bg-blue-300 bg-opacity-50'>
                            <TransportDetail label='Job' value={transport.job} />
                            <TransportDetail label='Vehicle' value={transport.vehicle} />
                            <TransportDetail label='Vehicle No' value={transport.vehicleNo} />
                            <TransportDetail label='DriverNIC' value={transport.driver} />
                            <TransportDetail label='Date' value={transport.date} />
                            <TransportDetail label='Time' value={transport.time} />
                            <TransportDetail label='Cost' value={transport.cost} />
                            <TransportDetail label='Destination' value={transport.destination} />
                        </div>
                    )}
                </div>
                </div>

           
        </div>
    </div>
    );
};

export default ShowTransport;
