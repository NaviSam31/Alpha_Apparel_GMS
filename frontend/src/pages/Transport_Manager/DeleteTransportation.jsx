import React, { useState } from 'react';
import BackButton from '../../components/TransportBackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams,Link } from 'react-router-dom';

const DeleteTransportation = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    const handleDeleteTransportation = () => {
        setLoading(true);
        axios
            .delete(`http://localhost:5555/transport/${id}`)
            .then(() => {
                setLoading(false);
                alert('Successfully deleted');  // Add success alert
                navigate('/');
            })
            .catch((error) => {
                setLoading(false);
                alert('An error happened. Please check the console.');
                console.log(error);
            });
    };

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



            <div className='min-h-screen flex flex-col justify-center items-center'>
            <div className='p-4'>
            <BackButton />
            <h1 className='text-xl my-4 font-bold text-dark-blue'>Delete Transport</h1>
            {loading ? <Spinner /> : ''}
            <div className='flex flex-col items-center border-sky-400 rounded-xl w-[600px] p-8 mx-auto bg-red-200 bg-opacity-50'>
                <h3 className='text-2xl'>Are you sure you want to delete this transport?</h3>
                <button
                    className='p-4 bg-red-600 text-white m-8 w-full'
                    onClick={handleDeleteTransportation}
                >
                    Yes, Delete it
                </button>
            </div>
        </div>
        </div>
         
        </div>
    </div>
    );
};

export default DeleteTransportation;
