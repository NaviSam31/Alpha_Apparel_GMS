import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Spinner from '../../components/Spinner'; // Assuming Spinner is available
import BackButton from '../../components/DisplayItemBackButton'; // Assuming BackButton is another component

const EditDisplayItem = () => {
    const [formData, setFormData] = useState({
        productName: '',
        productDescription: '', // Added description field
        unit: '',
        price: '',
        image: null,
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedItemCode, setSelectedItemCode] = useState(''); // Non-editable field

    const { id } = useParams(); // Get the display item ID from the route params
    const navigate = useNavigate();

    // Fetch the item to be edited
    useEffect(() => {
        const fetchDisplayItem = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/items/${id}`);
                const item = response.data;
                setFormData({
                    productName: item.productName,
                    productDescription: item.productDescription, // Set productDescription
                    unit: item.unit,
                    price: item.price,
                    image: null, // Placeholder, since you won't get the image from a GET request
                });
                setSelectedItemCode(item.itemCode); // Display the item code, which should not be editable
                setImagePreview(item.imageUrl); // Set image preview if the image URL is returned from API
            } catch (error) {
                console.error('Error fetching display item:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDisplayItem();
    }, [id]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle file input change for image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
        setImagePreview(URL.createObjectURL(file));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('productName', formData.productName);
        formDataToSend.append('productDescription', formData.productDescription); // Include description
        formDataToSend.append('unit', formData.unit);
        formDataToSend.append('price', formData.price);
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }

        try {
            const response = await axios.put(`http://localhost:5555/items/${id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Item updated successfully!');
            console.log('Item updated:', response.data);
            navigate('/items/home'); // Redirect back to the item list page
        } catch (error) {
            console.error('Error updating display item:', error);
            setMessage('Error updating item.');
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="brand">
                    <img src="/company-logo.png" className='company-logo' alt='company-logo' />
                </div>
                <nav>
                    <div className='nav-dept'><Link to="/"><img src='/public/home.png' className='icon' alt='Home' /> Home</Link></div>
                    <div className='nav-dept'><Link to=""><img src='/public/inventory.png' className='icon' alt='Inventory' /> Inventory</Link></div>
                    <div className='nav-dept'><Link to=""><img src='/public/tshirt.png' className='icon' alt='Design' /> Design</Link></div>
                    <div className='nav-dept'><Link to="/customers/home"><img src='/public/orders.png' className='icon' alt='Orders' /> Orders</Link></div>
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
                    <div className='nav-dept'><Link to=""><img src='/public/transport.png' className='icon' alt='Transport' /> Transport</Link></div>
                </nav>
            </div>
            {/* Main Content */}
            <div className="main-content">
                <header>
                    <h1 className='text-3xl font-bold company-name'>Alpha Apparels PVT LTD</h1>
                </header>
                
                <div className='button-container'></div>
                <div className='main-content p-4'>
                <BackButton />
                <h1 className='text-3xl my-4'>Edit Display Item</h1>
            
                <div className="edit-display-item">
                    {message && <Spinner />}
                    <form onSubmit={handleSubmit}>
                        <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
                            {/* Display Item Code */}
                            <div className='my-4'>
                                <label className='text-xl mr-4 text-gray-500'>Item Code</label>
                                <input
                                    type="text"
                                    id="currentItemCode"
                                    value={selectedItemCode}
                                    className='border-2 border-gray-500 px-4 py-2 w-full'
                                    readOnly
                                />
                            </div>

                            {/* Product Name */}
                            <div className='my-4'>
                                <label className='text-xl mr-4 text-gray-500'>Product Name</label>
                                <input
                                    type="text"
                                    id="productName"
                                    name="productName"
                                    value={formData.productName}
                                    onChange={handleChange}
                                    className='border-2 border-gray-500 px-4 py-2 w-full'
                                    required
                                    readOnly
                                />
                            </div>

                            {/* Product Description */}
                            <div className='my-4'>
                                <label className='text-xl mr-4 text-gray-500'>Product Description</label>
                                <textarea
                                    id="productDescription"
                                    name="productDescription"
                                    value={formData.productDescription}
                                    onChange={handleChange}
                                    required
                                    className='border-2 border-gray-500 px-4 py-2 w-full'
                                    rows={4} // For better description input
                                />
                            </div>

                            {/* Unit */}
                            <div className='my-4'>
                                <label className='text-xl mr-4 text-gray-500'>Unit</label>
                                <input
                                    type="text"
                                    id="unit"
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    className='border-2 border-gray-500 px-4 py-2 w-full'
                                    required
                                    readOnly
                                />
                            </div>

                            {/* Price */}
                            <div className='my-4'>
                                <label className='text-xl mr-4 text-gray-500'>Price</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    className='border-2 border-gray-500 px-4 py-2 w-full'
                                    readOnly
                                />
                            </div>

                            {/* Image Upload Field */}
                            <div className='my-4'>
                                <label className='text-xl mr-4 text-gray-500'>Image</label>
                                <input type="file" onChange={handleImageChange} />
                            </div>

                            {/* Image Preview */}
                            {imagePreview && (
                                <div className='my-4'>
                                    <img src={imagePreview} alt="Preview" width="200px" />
                                </div>
                            )}

                            <button type="submit"
                                className='bg-green-500 text-white px-4 py-2 rounded my-4'
                                style={{ width: "100%" }}>
                                Update Item
                            </button>
                        </div>
                    </form>
                </div>
                </div>
            </div>
        </div>
    );
};

export default EditDisplayItem;
