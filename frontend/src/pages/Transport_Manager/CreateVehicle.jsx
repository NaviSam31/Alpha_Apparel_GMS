import React, { useState } from 'react';
import BackButton2 from '../../components/BackButton2';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';

const CreateVehicle = () => {
    const [year, setYear] = useState('');
    const [model, setModel] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [vehicleNo, setVehicleNo] = useState('');
    const [renteredCompany, setRenteredCompany] = useState('');
    const [rentalFee, setRentalFee] = useState('');
    const [capacity, setCapacity] = useState('');
    const [capacityUnit, setCapacityUnit] = useState('Person'); 
    const [description, setDescription] = useState('');
    const [vehicleError, setVehicleError] = useState(false);
    const [modelError, setModelError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [yearError, setYearError] = useState(false);
    const [rentalFeeError, setRentalFeeError] = useState(false);
    const [capacityError, setCapacityError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateText = (text) => /^[a-zA-Z\s]*$/.test(text);
    const validateDescription = (text) => /^[\p{L}\s\p{Emoji_Presentation}]*$/u.test(text); 
    const validateYear = (year) => year >= 1990 && year <= 2024;
    const validateRentalFee = (fee) => fee >= 0; // Ensure non-negative values
    const validateCapacity = (capacity) => capacity > 0; // Ensure positive number

    const handleSaveVehicle = () => {
        // Perform validation
        if (!validateText(vehicle) || !validateText(model) || !validateDescription(description) || !validateYear(year) || !validateRentalFee(rentalFee) || !validateCapacity(capacity)) {
            alert('Please check the fields for invalid values.');
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
            year,
            model,
            vehicle,
            vehicleNo,
            renteredCompany,
            rentalFee,
            capacity: `${capacity} ${capacityUnit}`, 
            description,
        };

        setLoading(true);

        axios
            .post('http://localhost:5555/vehicle', data)
            .then(() => {
                 // Store vehicle and vehicleNo in localStorage
                 localStorage.setItem('vehicle', vehicle);
                 localStorage.setItem('vehicleNo', vehicleNo);

                setLoading(false);
                alert('Successfully created');
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
            <h1 className='text-3xl my-4 text-center font-bold text-dark-blue'>Create Vehicle</h1>
            {loading && <Spinner />}
            <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
                <div className='my-4'>
                    <label htmlFor='year' className='text-xl mr-4 text-gray-500'>Year</label>
                    <input
                        id='year'
                        type='number'
                        value={year}
                        onChange={(e) => {
                            setYear(e.target.value);
                            setYearError(!validateYear(e.target.value));
                        }}
                        onBlur={() => setYearError(!validateYear(year))}
                        className={`border-2 border-gray-500 px-4 py-2 w-full ${yearError ? 'bg-red-200 border-red-500' : ''}`}
                    />
                    {yearError && <p className='text-red-500'>Year must be between 1990 and 2024.</p>}
                </div>

                <div className='my-4'>
                    <label htmlFor='model' className='text-xl mr-4 text-gray-500'>Model</label>
                    <input
                        id='model'
                        type='text'
                        value={model}
                        onChange={(e) => {
                            setModel(e.target.value);
                            setModelError(!validateText(e.target.value));
                        }}
                        onBlur={() => setModelError(!validateText(model))}
                        className={`border-2 px-4 py-2 w-full ${modelError ? 'bg-red-200 border-red-500' : 'border-gray-500'}`}
                    />
                    {modelError && <p className='text-red-500'>Model should only contain letters and spaces.</p>}
                </div>

                <div className='my-4'>
                    <label htmlFor='vehicle' className='text-xl mr-4 text-gray-500'>Vehicle</label>
                    <input
                        id='vehicle'
                        type='text'
                        value={vehicle}
                        onChange={(e) => {
                            setVehicle(e.target.value);
                            setVehicleError(!validateText(e.target.value));
                        }}
                        onBlur={() => setVehicleError(!validateText(vehicle))}
                        className={`border-2 px-4 py-2 w-full ${vehicleError ? 'bg-red-200 border-red-500' : 'border-gray-500'}`}
                    />
                    {vehicleError && <p className='text-red-500'>Vehicle should only contain letters and spaces.</p>}
                </div>

                <div className='my-4'>
                    <label htmlFor='vehicleNo' className='text-xl mr-4 text-gray-500'>VehicleNo</label>
                    <input
                        id='vehicleNo'
                        type='text'
                        value={vehicleNo}
                        onChange={(e) => setVehicleNo(e.target.value)}
                        onBlur={() => {
                            if (!validateVehicleNo(vehicleNo)) {
                                alert('Invalid Vehicle No format');
                            }
                        }}
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
                        onChange={(e) => {
                            const value = e.target.value;
                            setRentalFee(value);
                            setRentalFeeError(!validateRentalFee(value));
                        }}
                        onBlur={() => setRentalFeeError(!validateRentalFee(rentalFee))}
                        className={`border-2 border-gray-500 px-4 py-2 w-full ${rentalFeeError ? 'bg-red-200 border-red-500' : ''}`}
                    />
                    {rentalFeeError && <p className='text-red-500'>Rental Fee must be a non-negative number.</p>}
                </div>

                <div className='my-4'>
                    <label htmlFor='capacity' className='text-xl mr-4 text-gray-500'>Capacity</label>
                    <div className='flex'>
                        <input
                            id='capacity'
                            type='number'
                            value={capacity}
                            onChange={(e) => {
                                setCapacity(e.target.value);
                                setCapacityError(!validateCapacity(e.target.value));
                            }}
                            onBlur={() => setCapacityError(!validateCapacity(capacity))}
                            className={`border-2 px-4 py-2 w-full ${capacityError ? 'bg-red-200 border-red-500' : 'border-gray-500'}`}
                        />
                        <select
                            value={capacityUnit}
                            onChange={(e) => setCapacityUnit(e.target.value)}
                            className='border-2 border-gray-500 px-4 py-2 ml-4'>
                            <option value='Person'>Person</option>
                            <option value='Ton'>Ton</option>
                        </select>
                    </div>
                    {capacityError && <p className='text-red-500'>Capacity must be a positive number.</p>}
                </div>

                <div className='my-4'>
                    <label htmlFor='description' className='text-xl mr-4 text-gray-500'>Description</label>
                    <textarea
                        id='description'
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                            setDescriptionError(!validateDescription(e.target.value));
                        }}
                        onBlur={() => setDescriptionError(!validateDescription(description))}
                        className={`border-2 px-4 py-2 w-full ${descriptionError ? 'bg-red-200 border-red-500' : 'border-gray-500'}`}
                    />
                    {descriptionError && <p className='text-red-500'>Description should only contain letters, spaces</p>}
                </div>

                <button className='p-2 bg-sky-600 m-8 hover:bg-sky-400 transition-colors duration-300 text-white rounded-lg' onClick={handleSaveVehicle}  style={{ width: "500px" }}>
                    Save
                </button>
            </div>
        </div>
        </div>
    </div>
    );
};

export default CreateVehicle;
