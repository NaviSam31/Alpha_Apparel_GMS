import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams,Link } from 'react-router-dom';
import BackButton2 from '../../components/BackButton2';
import Spinner from '../../components/Spinner';

// Reusable component to display vehicle detail
const VehicleDetail = ({ label, value }) => (
    <div className='my-2 flex justify-between w-full'>
        <span className='text-lg font-medium mr-4 text-gray-600'>{label}</span>
        <span className='text-lg'>{value}</span>
    </div>
);

const ShowVehicle = () => {
    const [vehicle, setVehicle] = useState({});
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        axios
            .get(`http://localhost:5555/vehicle/${id}`)
            .then((response) => {
                setVehicle(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [id]);

    return (

        <div className="flex min-h-screen">
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

       
        <div className="main-content flex-1 p-6 bg-gray-50">
            <header className="mb-6">
                <h1 className='text-3xl font-bold company-name'>Alpha Apperals PVT LTD</h1>
            </header>

            <div className='button-container mb-4'>
            </div>


             {/* Main Content */}
            <div className='min-h-full flex flex-col'>
            {/* Header */}
            <div className='p-4'>
                <BackButton2 />
                <h1 className='text-3xl my-4 text-center font-bold text-dark-blue'>Show Vehicle</h1>
            </div>
            {/* Main Content */}
            <div className='flex flex-grow justify-center items-center'>
                {loading ? (
                    <Spinner />
                ) : (
                    <div className='w-full max-w-md border border-sky-600 rounded-xl p-4 bg-white shadow-lg bg-blue-300 bg-opacity-50'>
                        <VehicleDetail label='Year' value={vehicle.year} />
                        <VehicleDetail label='Model' value={vehicle.model} />
                        <VehicleDetail label='Vehicle' value={vehicle.vehicle} />
                        <VehicleDetail label='VehicleNo' value={vehicle.vehicleNo} />
                        <VehicleDetail label='RenteredCompany' value={vehicle.renteredCompany} />
                        <VehicleDetail label='RentalFee' value={vehicle.rentalFee} />
                        <VehicleDetail label='Capacity' value={vehicle.capacity} />
                        <VehicleDetail label='Description' value={vehicle.description} />
                    </div>
                )}
            </div>
        </div>
         
        </div>
    </div>
    );
};

export default ShowVehicle;
