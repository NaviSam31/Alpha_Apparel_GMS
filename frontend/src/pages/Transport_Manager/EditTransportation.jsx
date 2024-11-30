import React, { useState, useEffect } from 'react';
import BackButton from '../../components/TransportBackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams,Link } from 'react-router-dom';

const EditTransportation = () => {
    const [job, setJob] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [vehicleNo, setVehicleNo] = useState('');
    const [driver, setDriver] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [cost, setCost] = useState('');
    const [destination, setDestination] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch transportation data when component loads
    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:5555/transport/${id}`)
            .then((response) => {
                setJob(response.data.job);
                setVehicle(response.data.vehicle);
                setVehicleNo(response.data.vehicleNo);
                setDriver(response.data.driver);
                setDate(response.data.date);
                setTime(response.data.time);
                setCost(response.data.cost);
                setDestination(response.data.destination);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                alert('An error happened. Please check the console.');
                console.log(error);
            });
    }, [id]);

    // Validation logic
    const validateStringInput = (value) => {
        const regex = /^[A-Za-z\s]+$/;  // Only letters and spaces allowed
        return regex.test(value);
    };

    const validateDate = (selectedDate) => {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format
        return selectedDate >= today;
    };

    const validateVehicleNo = (value) => {
        const regex = /^(?:[A-Z]{2} - \d{4}|[A-Z]{3} - \d{4}|[0-9]{2} - \d{4}|[0-9]{3} - \d{4})$/;
        return regex.test(value);
    };

    const handleEditTransportation = () => {
        // Validate Vehicle and Destination fields
        if (!validateStringInput(vehicle)) {
            alert('Vehicle field must contain only letters.');
            return;
        }
        if (!validateStringInput(destination)) {
            alert('Destination field must contain only letters.');
            return;
        }

        // Validate Vehicle No field
        if (!validateVehicleNo(vehicleNo)) {
            alert('Vehicle number must follow one of these formats: AB - 1234, ABC - 1234, 65 - 1234, 123 - 1234.');
            return;
        }

        // Validate Date field
        if (!validateDate(date)) {
            alert('Date must not be in the past.');
            return;
        }

        // Validate Cost field (positive number)
        if (cost <= 0) {
            alert('Cost must be a positive number.');
            return;
        }

        // If all validations pass, send the data
        const data = {
            job,
            vehicle,
            vehicleNo,
            driver,
            date,
            time,
            cost,
            destination,
        };

        setLoading(true);

        axios
            .put(`http://localhost:5555/transport/${id}`, data)
            .then(() => {
                setLoading(false);
                alert('Successfully updated');
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


            <div className='p-4'>
            <BackButton />
            <h1 className='text-3xl my-4 text-center font-bold text-dark-blue'>Edit Transport</h1>
            {loading && <Spinner />}
            <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
                
                {/* Job and Vehicle */}
                <div className='flex gap-8 mb-8'>
                    <div className='flex-1'>
                        <label htmlFor='job' className='text-xl mr-4 text-gray-500'>Job</label>
                        <select
                            id='job'
                            value={job}
                            onChange={(e) => setJob(e.target.value)}
                            className='border-2 border-gray-500 px-4 py-2 w-full'
                        >
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
                            onChange={(e) => setVehicle(e.target.value)}
                            className='border-2 border-gray-500 px-4 py-2 w-full'
                        />
                    </div>
                </div>

                {/* Vehicle No and Driver */}
                <div className='flex gap-8 mb-8'>
                    <div className='flex-1'>
                        <label htmlFor='vehicleNo' className='text-xl mr-4 text-gray-500'>Vehicle No</label>
                        <input
                            id='vehicleNo'
                            type='text'
                            value={vehicleNo}
                            onChange={(e) => setVehicleNo(e.target.value)}
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

                {/* Date and Time */}
                <div className='flex gap-8 mb-8'>
                    <div className='flex-1'>
                        <label htmlFor='date' className='text-xl mr-4 text-gray-500'>Date</label>
                        <input
                            id='date'
                            type='date'
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className='border-2 border-gray-500 px-4 py-2 w-full'
                            min={new Date().toISOString().split('T')[0]} // Minimum date is today
                        />
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

                {/* Cost and Destination */}
                <div className='flex gap-8 mb-8'>
                    <div className='flex-1'>
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
                            onChange={(e) => setDestination(e.target.value)}
                            className='border-2 border-gray-500 px-4 py-2 w-full'
                        />
                    </div>
                </div>

                <button
                    className='p-2 bg-sky-300 m-8 hover:bg-sky-400 transition-colors duration-300 text-white rounded-lg'
                    onClick={handleEditTransportation}
                >
                    Update
                </button>
            </div>
        </div>


        </div>
    </div>
    );
}

export default EditTransportation;
