import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function UpdateOrder() {
    const { id } = useParams();

    const [orderdata, setorderdata] = useState({
        name: "",
        product: "",
        quantity: "",
        date: "",
    });

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await fetch(`http://localhost:5555/supplierOrder/${id}`);
                const data = await response.json();
                console.log(data);

                if (data.success) {
                    setorderdata(data.data);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error('Error fetching order data:', error);
            }
        };

        fetchOrderData();
    }, [id]);

    const handleInputChange = (e) => {
        setorderdata({
            ...orderdata,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://localhost:5555/supplierOrder/${orderdata._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderdata), // Pass the updated order data directly
            });
            
            console.log('Response:', response); // Log the response
            
            const data = await response.json();

            if (data.success) {
                console.log('Order updated successfully');
                alert('Order updated successfully');
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="brand">
                    <img src='../public/company-logo.png' className='company-logo' alt='company-logo' />
                </div>
                <nav>
                    <div className='nav-dept'><Link to="/home"><img src='/public/home.png' className='icon' alt='home' />Home</Link></div>
                    <div className='nav-dept'><Link to="/inventory/home"><img src='/public/inventory.png' className='icon' alt='inventory' />Inventory</Link></div>
                    <div className='nav-dept'><Link to="/"><img src='/public/tshirt.png' className='icon' alt='design' />Design</Link></div>
                    <div className='nav-dept'><Link to="/orders"><img src='/public/orders.png' className='icon' alt='orders' />Orders</Link></div>
                    <div className='nav-dept'><Link to="/supplier"><img src='/public/supplier.png' className='icon' alt='supplier' />Supplier</Link></div>
                    <div className='nav-dept'><Link to="/discounts/home"><img src='/public/marketing.png' className='icon' alt='marketing' />Marketing</Link></div>
                    <div className='nav-dept'><Link to="/hr"><img src='/public/human-resource.png' className='icon' alt='hr' />Human Resource</Link></div>
                    <div className='nav-dept'><Link to="/financial"><img src='/public/financial.png' className='icon' alt='financial' />Financial</Link></div>
                    <div className='nav-dept'><Link to="/transport"><img src='/public/transport.png' className='icon' alt='transport' />Transport</Link></div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <header>
                    <h1 className='text-3xl font-bold company-name'>Alpha Apparels PVT LTD</h1>
                </header>
                <div className='button-container'></div>
                <div className="order-form">
                    <h2>Update Order</h2>

                    <label className="form-label1">Supplier / Company Name : </label>
                    <input
                        type="text"
                        className="update-form-control"
                        id="name"
                        name="name"
                        placeholder="Enter Supplier Name"
                        onChange={handleInputChange}
                        value={orderdata.name}
                    />
                    <br />

                    <label htmlFor="product" className="form-label1">Product</label>
                    <br />
                    <input
                        type="text"
                        id="product"
                        name="product"
                        placeholder="Enter Product "
                        onChange={handleInputChange}
                        value={orderdata.product}
                    />
                    <br /><br />

                    <label htmlFor="quantity" className="form-label1">Quantity Needed</label>
                    <br />
                    <input
                        type="text"
                        id="quantity"
                        name="quantity"
                        placeholder="Enter Quantity Needed"
                        onChange={handleInputChange}
                        value={orderdata.quantity}
                    />
                    <br /><br />

                    <label htmlFor="date" className="form-label1">Date</label>
                    <br />
                    <input
                        type="date"
                        id="date"
                        name="date"
                        placeholder="Enter the date"
                        onChange={handleInputChange}
                        value={orderdata.date}
                    />
                    <br /><br /><br />
                    
                    <center>
                        <button onClick={handleUpdate} className="update-btn-primary" style={{ width: "250px" }} >
                            Update
                        </button>
                    </center>
                </div>
            </div>
        </div>
    );
}

export default UpdateOrder;
