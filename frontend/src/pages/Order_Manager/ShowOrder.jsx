import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../../components/orderBackButton';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ShowOrders = () => {
    const [orders, setOrders] = useState({ Items: [] });
    const [loading, setLoading] = useState(false);
    const [itemPrices, setItemPrices] = useState({}); // Store prices of items
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:5555/orders/${id}`)
            .then((response) => {
                console.log(response.data);
                setOrders(response.data);
                setLoading(false);
                fetchItemPrices(response.data.Items); // Fetch item prices based on item codes
            }).catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [id]);

    // Fetch item prices from inventory
    const fetchItemPrices = async (items) => {
        try {
            const response = await axios.get('http://localhost:5555/inventory');
            const prices = {};
            response.data.data.forEach(item => {
                prices[item.itemCode] = item.price; // Map item codes to prices
            });
            setItemPrices(prices);
        } catch (error) {
            console.error('Error fetching item prices:', error);
        }
    };

    const calculateTotalPrice = () => {
        let totalPrice = 0;

        if (orders.Items && orders.Items.length > 0) {
            orders.Items.forEach((item) => {
                const price = parseFloat(itemPrices[item.itemCode]) || 0; // Get price from state
                const qty = parseFloat(item.qtyRequired);

                // Check if qty is a finite number
                if (!Number.isFinite(qty) || qty < 0) {
                    console.log(`Invalid quantity for item.`);
                } else {
                    totalPrice += price * qty; // Sum the total price
                }
            });
        }

        return `Rs. ${totalPrice.toFixed(2)}`; // Rounded to two decimal places with currency format
    };


    const handleGenerateReport = () => {
        const doc = new jsPDF('portrait', 'mm', 'a4');
    
        // Set up document styling
        doc.setFontSize(18);
        
        doc.text('Alpha Apparel (PVT) LTD', 105, 20, { align: 'center' });
        doc.setFontSize(16);
       
        doc.text('Order Report', 105, 30, { align: 'center' });
        doc.line(10, 35, 200, 35); // Horizontal line
    
        // Draw card for Order Details
        doc.setFontSize(12);
        doc.rect(10, 40, 190, 50); // Outer card border for order details
        
        doc.text('Order Details', 15, 48);
        doc.text(`Order ID: ${orders.OrderID || 'N/A'}`, 15, 55);
        doc.text(`Customer ID: ${orders.CusID || 'N/A'}`, 15, 62);
        doc.text(`Create Time: ${new Date(orders.createdAt).toLocaleString() || 'N/A'}`, 15, 69);
        doc.text(`Update Time: ${new Date(orders.updatedAt).toLocaleString() || 'N/A'}`, 15, 76);
    
        // Determine the height required for the items card
        const itemCount = orders.Items.length;
        const itemHeight = 28; // Height per item (including margins)
        const itemsCardHeight = itemHeight * itemCount + 10; // Additional space for the header
    
        // Draw card for Items dynamically based on item count
        doc.rect(10, 100, 190, itemsCardHeight); // Dynamic card height for items
       
        doc.text('Items', 15, 108);
    
        let itemYPos = 115; // Starting Y position for item details
        orders.Items.forEach((item, index) => {
            doc.text(`Item ${index + 1}:`, 15, itemYPos);
            doc.text(`Item Code: ${item.itemCode || 'N/A'}`, 25, itemYPos + 7);
            doc.text(`Quantity: ${item.qtyRequired || 'N/A'}`, 25, itemYPos + 14);
            doc.text(`Unit Price: ${itemPrices[item.itemCode] || 'N/A'}`, 25, itemYPos + 21);
            itemYPos += itemHeight; // Adjust for each item
        });
    
        // Total Price
        doc.setFontSize(14);
        doc.text(`Total Price: ${calculateTotalPrice()}`, 15, itemYPos + 10);
    
        // Calculate position for the image
        const imgYPos = itemYPos + 20; // Position the image below the total price
    
        // Ensure image fits on A4 size
        const availableHeight = 297 - imgYPos - 8; // Available space for image with 20mm margin at the bottom
        const imgWidth = 150; // Width of the image
        let imgHeight = 350; // Desired height of the image
    
        if (imgHeight > availableHeight) {
            imgHeight = availableHeight; // Adjust the image height to fit within the page
        }
    
        // Payment Slip (Image)
        if (orders.image) {
            doc.addImage(orders.image, 'JPEG', 15, imgYPos, imgWidth, imgHeight); // Adjusted position and height
        } else {
            doc.text('No Image Available', 15, imgYPos); // Positioning for text
        }
    
        // Save the document
        doc.save(`Order_${orders.OrderID}_Report.pdf`);
    };
    
    
    
    
    return (
        <div className="flex">
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

            <div className="main-content">
                <header>
                    <h1 className='text-3xl font-bold company-name'>Alpha Apperals PVT LTD</h1>
                </header>
                <div className='button-container'></div>

                <div className="main-content flex-1 p-6">
                    <BackButton />
                    <h1 className='text-3xl my-4'>Show Order</h1>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <div className='border border-sky-400 rounded-xl p-6 bg-white shadow-lg'>
                            <div className='my-4'>
                                <h2 className='text-2xl font-bold text-gray-700'>Order Details</h2>
                            </div>
                            <div className='my-4'>
                                <span className='text-lg text-gray-500'>ID: </span>
                                <span>{orders._id}</span>
                            </div>
                            <div className='my-4'>
                                <span className='text-lg text-gray-500'>Order ID: </span>
                                <span>{orders.OrderID}</span>
                            </div>
                            <div className='my-4'>
                                <span className='text-lg text-gray-500'>Customer ID: </span>
                                <span>{orders.CusID}</span>
                            </div>

                            <div className='my-4'>
                                <span className='text-lg text-gray-500'>Items: </span>
                                {orders.Items && orders.Items.length > 0 ? (
                                    <div className="my-4">
                                        {orders.Items.map((item, index) => (
                                            <div key={index} className='border border-gray-300 rounded-lg p-2 mb-2'>
                                                <p className='text-md font-semibold'>Item {index + 1}</p>
                                                <p>Item Code: {item.itemCode}</p>
                                                <p>Unit Price: {itemPrices[item.itemCode] || 'N/A'}</p>
                                                <p>Quantity: {item.qtyRequired}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span>No items in this order.</span>
                                )}
                            </div>

                            <div className='my-4'>
                                <span className='text-xl font-bold text-gray- 700'>Total Price: </span>
                                <span className='text-lg font-bold text-gray-700'>{calculateTotalPrice()}</span>
                            </div>

                           

                            <div className='my-4'>
                                <span className='text-xl text-gray-500'>Payment Slip: </span>
                                {orders.image ? (
                                    <center>
                                        <img
                                            src={orders.image}
                                            alt={orders.DesignName || 'Design Image'}
                                            className="w-full h-auto border border-gray-500 rounded"
                                        />
                                    </center>
                                ) : (
                                    <span>No Image</span>
                                )}
                            </div>
                            <div className='my-4'>
                                <span className='text-lg text-gray-500'>Create Time: </span>
                                <span>{new Date(orders.createdAt).toString()}</span>
                            </div>
                            <div className='my-4'>
                                <span className='text-lg text-gray-500'>Update Time: </span>
                                <span>{new Date(orders.updatedAt).toString()}</span>
                            </div>

                           
                            <button onClick={handleGenerateReport} className='button buttonAddNew'
                            style={{ 
                                width: '100%', 
                                height: '5%', 
                                justifyContent: 'center' ,
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                            }}>
                                <span className='icon'><img src='../../public/pdf.png' alt='PDF' /></span> Generate Report (PDF)
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShowOrders;
