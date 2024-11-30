import React, { useState, useEffect } from 'react';
import BackButton from '../../components/TransportBackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const CreateTransportation = () => {
    const [job, setJob] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [vehicleNo, setVehicleNo] = useState('');
    const [driver, setDriver] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [cost, setCost] = useState('');
    const [destination, setDestination] = useState('');
    const [loading, setLoading] = useState(false);
    const [vehicleError, setVehicleError] = useState(false);
    const [destinationError, setDestinationError] = useState(false);
    const [dateError, setDateError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setDate(today); // Set current date on component mount

        // Retrieve vehicle and vehicleNo from localStorage
        const storedVehicle = localStorage.getItem('vehicle');
        const storedVehicleNo = localStorage.getItem('vehicleNo');

        if (storedVehicle) {
            setVehicle(storedVehicle);
        }
        if (storedVehicleNo) {
            setVehicleNo(storedVehicleNo);
        }
    }, []);

    const validateText = (text) => /^[a-zA-Z\s]*$/.test(text);

    const validateDate = (selectedDate) => {
        const today = new Date().toISOString().split('T')[0];
        return selectedDate >= today;
    };

    const handleSaveTransportation = () => {
        // Validate fields
        if (!job || !vehicle || !driver || !date || !time || !destination) {
            alert('Please fill in all required fields.');
            return;
        }

        if (!validateText(vehicle)) {
            setVehicleError(true);
            alert('Vehicle name should contain only letters and spaces.');
            return;
        }

        if (!validateText(destination)) {
            setDestinationError(true);
            alert('Destination should contain only letters and spaces.');
            return;
        }

        if (!validateDate(date)) {
            setDateError(true);
            alert('Please select the current or a future date.');
            return;
        }

        if (!/^\d+(\.\d{1,2})?$/.test(cost)) {
            alert('Cost should be a valid number.');
            return;
        }

       
        const validateVehicleNo = (vehicleNo) => {
            const regex = /^(?:[A-Z]{2} - \d{4}|[A-Z]{3} - \d{4}|\d{2} - \d{4}|\d{3} - \d{4})$/;
            return regex.test(vehicleNo);
        };

       
        if (!validateVehicleNo(vehicleNo)) {
            alert('Vehicle No should follow one of these formats: AB - 1234, ABC - 1234, 65 - 1234, or 123 - 1234.');
            return;
        }

        const data = {
            job,
            vehicle,
            vehicleNo,
            driver,
            date,
            time,
            cost: parseFloat(cost), // Ensure cost is a number
            destination,
        };

        setLoading(true);

        axios
            .post('http://localhost:5555/transport', data)
            .then(() => {
                setLoading(false);
                alert('Successfully created');
                navigate('/transport/home');
            })
            .catch((error) => {
                setLoading(false);
                if (error.response) {
                   
                    alert(`Error: ${error.response.data.message || 'An error occurred.'}`);
                } else {
                    
                    alert('An error occurred. Please check the console.');
                }
                console.error(error);
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



                <div className='p-4'>
                    <BackButton />
                    <h1 className='text-3xl my-4 text-center font-bold text-dark-blue'>Create Transport</h1>
                    {loading && <Spinner />}
                    <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
                        <div className='flex flex-wrap gap-10 mb-8'>
                            <div className='flex-1 mr-4'>
                                <label htmlFor='job' className='text-xl mr-4 text-gray-500'>Job</label>
                                <select
                                    id='job'
                                    value={job}
                                    onChange={(e) => setJob(e.target.value)}
                                    className='border-2 border-gray-500 px-4 py-2 w-full'
                                >
                                    <option value=''>Select Job</option>
                                    <option value='Staff'>Staff</option>
                                    <option value='Production'>Production</option>
                                </select>
                            </div>

                            <div className='flex-1'>
                                <label htmlFor='vehicle' className='text-xl mr-4 text-gray-500'>Vehicle</label>
                                <input
                                    id='vehicle'
                                    type='text'
                                    value={vehicle}
                                    readOnly // Make it read-only since it will be fetched
                                    onChange={(e) => {
                                        setVehicle(e.target.value);
                                        setVehicleError(!validateText(e.target.value));
                                    }}
                                    onBlur={() => setVehicleError(!validateText(vehicle))}
                                    className={`border-2 px-4 py-2 w-full ${vehicleError ? 'bg-red-200 border-red-500' : 'border-gray-500'}`}
                                />
                                {vehicleError && <p className="text-red-500">Vehicle name should contain only letters and spaces.</p>}
                            </div>
                        </div>

                        <div className='flex flex-wrap gap-10 mb-8'>
                            <div className='flex-1 mr-4'>
                                <label htmlFor='vehicleNo' className='text-xl mr-4 text-gray-500'>Vehicle No</label>
                                <input
                                    id='vehicleNo'
                                    type='text'
                                    value={vehicleNo}
                                    readOnly // Make it read-only since it will be fetched
                                    onChange={(e) => setVehicleNo(e.target.value)}
                                    onBlur={() => {
                                        if (!validateVehicleNo(vehicleNo)) {
                                            alert('Invalid Vehicle No format');
                                        }
                                    }}
                                    className='border-2 border-gray-500 px-4 py-2 w-full'

                                />
                            </div>

                            <div className='flex-1'>
                                <label htmlFor='driver' className='text-xl mr-4 text-gray-500'>DriverNIC</label>
                                <select
                                    id='driver'
                                    value={driver}
                                    onChange={(e) => setDriver(e.target.value)}
                                    className='border-2 border-gray-500 px-4 py-2 w-full'
                                >
                                    <option value=''>Select DriverNIC</option>
                                    <option value='200264603365'>200264603365</option>
                                    <option value='200065403079'>200065403079</option>
                                    <option value='200101389321'>200101389321</option>
                                    <option value='196665401588'>196665401588</option>
                                    <option value='687523498V'>687523498V</option>
                                    <option value='698521588V'>698521588V</option>
                                    <option value='688467222V'>688467222V</option>
                                    <option value='666541488V'>666541488V</option>
                                    <option value='699432699V'>699432699V</option>
                                    <option value='197080951233'>197080951233</option>
                                </select>
                            </div>
                        </div>

                        <div className='flex flex-wrap gap-10 mb-8'>
                            <div className='flex-1 mr-4'>
                                <label htmlFor='date' className='text-xl mr-4 text-gray-500'>Date</label>
                                <input
                                    id='date'
                                    type='date'
                                    value={date}
                                    onChange={(e) => {
                                        setDate(e.target.value);
                                        setDateError(!validateDate(e.target.value));
                                    }}
                                    onBlur={() => setDateError(!validateDate(date))}
                                    className={`border-2 px-4 py-2 w-full ${dateError ? 'bg-red-200 border-red-500' : 'border-gray-500'}`}
                                />
                                {dateError && <p className="text-red-500">Please select the current or a future date.</p>}
                            </div>

                            <div className='flex-1'>
                                <label htmlFor='time' className='text-xl mr-4 text-gray-500'>Time</label>
                                <input
                                    id='time'
                                    type='time'
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className='border-2 border-gray-500 px-4 py-2 w-full'
                                />
                            </div>
                        </div>

                        <div className='flex flex-wrap gap-10'>
                            <div className='flex-1 mr-4'>
                                <label htmlFor='cost' className='text-xl mr-4 text-gray-500'>Cost</label>
                                <input
                                    id='cost'
                                    type='number'
                                    value={cost}
                                    onChange={(e) => setCost(e.target.value)}
                                    className='border-2 border-gray-500 px-4 py-2 w-full'
                                />
                            </div>

                            <div className='flex-1'>
                                <label htmlFor='destination' className='text-xl mr-4 text-gray-500'>Destination</label>
                                <input
                                    id='destination'
                                    type='text'
                                    value={destination}
                                    onChange={(e) => {
                                        setDestination(e.target.value);
                                        setDestinationError(!validateText(e.target.value));
                                    }}
                                    onBlur={() => setDestinationError(!validateText(destination))}
                                    className={`border-2 px-4 py-2 w-full ${destinationError ? 'bg-red-200 border-red-500' : 'border-gray-500'}`}
                                />
                                {destinationError && <p className="text-red-500">Destination should contain only letters and spaces.</p>}
                            </div>
                        </div>

                        <button
                            className='p-2 bg-sky-600 m-8 hover:bg-sky-400 transition-colors duration-300 text-white rounded-lg'
                            onClick={handleSaveTransportation} style={{ width: "500px" }}
                        >
                            Save
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default CreateTransportation;
