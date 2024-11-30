import React, { useState, useEffect } from 'react';
import BackButton2 from '../../components/BackButton2';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams,Link } from 'react-router-dom';

const EditVehicle = () => {
    const [year, setYear] = useState('');
    const [model, setModel] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [vehicleNo, setVehicleNo] = useState('');
    const [renteredCompany, setRenteredCompany] = useState('');
    const [rentalFee, setRentalFee] = useState('');
    const [capacity, setCapacity] = useState('');
    const [capacityUnit, setCapacityUnit] = useState('Person'); // Default unit
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:5555/vehicle/${id}`)
            .then((response) => {
                setYear(response.data.year);
                setModel(response.data.model);
                setVehicle(response.data.vehicle);
                setVehicleNo(response.data.vehicleNo);
                setRenteredCompany(response.data.renteredCompany);
                setRentalFee(response.data.rentalFee);
                const [capacityValue, capacityUnitValue] = response.data.capacity.split(' '); // Assuming capacity is stored as "4 Person"
                setCapacity(capacityValue);
                setCapacityUnit(capacityUnitValue || 'Person');
                setDescription(response.data.description);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                alert('An error happened. Please check the console.');
                console.log(error);
            });
    }, [id]);

    // Validation Functions
    const validateStringInput = (value) => /^[A-Za-z\s]+$/.test(value); // Only letters and spaces allowed

    const validateVehicleNo = (value) => /^(?:[A-Z]{2} - \d{4}|[A-Z]{3} - \d{4}|[0-9]{2} - \d{4}|[0-9]{3} - \d{4})$/.test(value);

    const validateYear = (value) => {
        const yearNum = parseInt(value, 10);
        return yearNum >= 1990 && yearNum <= 2024;
    };

    const validateRentalFee = (value) => {
        const feeNum = parseFloat(value);
        return feeNum > 0; // Ensure fee is a positive number
    };

    const validateCapacity = (value) => {
        const capacityNum = parseInt(value, 10);
        return capacityNum > 0; // Ensure capacity is a positive number
    };

    const handleEditVehicle = () => {
        // Validate Vehicle, Model, and Description fields
        if (!validateStringInput(vehicle)) {
            alert('Vehicle field must contain only letters.');
            return;
        }
        if (!validateStringInput(model)) {
            alert('Model field must contain only letters.');
            return;
        }
        if (!validateStringInput(description)) {
            alert('Description field must contain only letters.');
            return;
        }

        // Validate Vehicle No field
        if (!validateVehicleNo(vehicleNo)) {
            alert('Vehicle number must follow one of these formats: AB - 1234, ABC - 1234, 65 - 1234, 123 - 1234.');
            return;
        }

        // Validate Year
        if (!validateYear(year)) {
            alert('Year must be between 1990 and 2024.');
            return;
        }

        // Validate Rental Fee
        if (!validateRentalFee(rentalFee)) {
            alert('Rental Fee must be a positive number.');
            return;
        }

        // Validate Capacity
        if (!validateCapacity(capacity)) {
            alert('Capacity must be a positive number.');
            return;
        }

        const data = {
            year,
            model,
            vehicle,
            vehicleNo,
            renteredCompany,
            rentalFee,
            capacity: `${capacity} ${capacityUnit}`, // Combine capacity and unit
            description,
        };

        setLoading(true);

        axios
            .put(`http://localhost:5555/vehicle/${id}`, data)
            .then(() => {
                setLoading(false);
                alert('Successfully updated');
                navigate('/vehicle');
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
            <BackButton2 />
            <h1 className='text-3xl my-4 text-center font-bold text-dark-blue'>Edit Vehicle</h1>
            {loading ? <Spinner /> : null}
            <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
                <div className='my-4'>
                    <label htmlFor='year' className='text-xl mr-4 text-gray-500'>Year</label>
                    <input
                        id='year'
                        type='number'
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className='border-2 border-gray-500 px-4 py-2 w-full'
                    />
                </div>

                <div className='my-4'>
                    <label htmlFor='model' className='text-xl mr-4 text-gray-500'>Model</label>
                    <input
                        id='model'
                        type='text'
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className='border-2 border-gray-500 px-4 py-2 w-full'
                    />
                </div>

                <div className='my-4'>
                    <label htmlFor='vehicle' className='text-xl mr-4 text-gray-500'>Vehicle</label>
                    <input
                        id='vehicle'
                        type='text'
                        value={vehicle}
                        onChange={(e) => setVehicle(e.target.value)}
                        className='border-2 border-gray-500 px-4 py-2 w-full'
                    />
                </div>

                <div className='my-4'>
                    <label htmlFor='vehicleNo' className='text-xl mr-4 text-gray-500'>Vehicle No</label>
                    <input
                        id='vehicleNo'
                        type='text'
                        value={vehicleNo}
                        onChange={(e) => setVehicleNo(e.target.value)}
                        className='border-2 border-gray-500 px-4 py-2 w-full'
                    />
                </div>

                <div className='my-4'>
                    <label htmlFor='renteredCompany' className='text-xl mr-4 text-gray-500'>Rentered Company</label>
                    <select
                        id='renteredCompany'
                        value={renteredCompany}
                        onChange={(e) => setRenteredCompany(e.target.value)}
                        className='border-2 border-gray-500 px-4 py-2 w-full'
                    >
                        <option value=''>Select Rentered Company</option>
                        <option value='PickMe'>PickMe</option>
                        <option value='Motorcare'>Motorcare</option>
                        <option value='KangarooCabs'>KangarooCabs</option>
                        <option value='CarCare'>CarCare</option>
                        <option value='AutoCare'>AutoCare</option>
                    </select>
                </div>

                <div className='my-4'>
                    <label htmlFor='rentalFee' className='text-xl mr-4 text-gray-500'>Rental Fee</label>
                    <input
                        id='rentalFee'
                        type='number'
                        value={rentalFee}
                        onChange={(e) => setRentalFee(e.target.value)}
                        className='border-2 border-gray-500 px-4 py-2 w-full'
                    />
                </div>

                <div className='my-4'>
                    <label htmlFor='capacity' className='text-xl mr-4 text-gray-500'>Capacity</label>
                    <div className='flex'>
                        <input
                            id='capacity'
                            type='number'
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            className='border-2 border-gray-500 px-4 py-2 w-full'
                        />
                        <select
                            value={capacityUnit}
                            onChange={(e) => setCapacityUnit(e.target.value)}
                            className='border-2 border-gray-500 px-4 py-2 ml-4'
                        >
                            <option value='Person'>Person</option>
                            <option value='Ton'>Ton</option>
                        </select>
                    </div>
                </div>

                <div className='my-4'>
                    <label htmlFor='description' className='text-xl mr-4 text-gray-500'>Description</label>
                    <input
                        id='description'
                        type='text'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className='border-2 border-gray-500 px-4 py-2 w-full'
                    />
                </div>

                <button className='p-2 bg-sky-300 m-8 hover:bg-sky-400 transition-colors duration-300 text-white rounded-lg' onClick={handleEditVehicle}>
                    Update
                </button>
            </div>
        </div>

          
        </div>
    </div>
    );
}

export default EditVehicle;
