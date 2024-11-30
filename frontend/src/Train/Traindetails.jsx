import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './traindetails.css'; // Ensure your CSS file contains necessary styles
import { useReactToPrint } from 'react-to-print';
import { MdSearch } from 'react-icons/md';

function TrainDetails() {
    const componentPDF = useRef();
    const [showdiscounts, setshowdiscounts] = useState([]);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [searchkey, setsearchkey] = useState('');

    const getfetchdata = async () => {
        try {
            const data = await axios.get('http://localhost:8020/traines');
            if (data.data.success) {
                setshowdiscounts(data.data.data);
            }
        } catch (err) {
            alert(err);
        }
    };

    useEffect(() => {
        getfetchdata();
    }, []);

    const handledelete = async (id) => {
        const data = await axios.delete('http://localhost:5555/trainer_delete/' + id);
        if (data.data.success) {
            getfetchdata();
            alert('Item deleted Successfully!');
        }
    };

    const generatePDF = useReactToPrint({
        content: () => componentPDF.current,
        documentTitle: 'Total Item Report',
        onBeforeGetContent: () => {
            setIsGeneratingPDF(true);
            return Promise.resolve();
        },
        onAfterPrint: () => {
            setIsGeneratingPDF(false);
            alert('Data saved in PDF');
        }
    });

    const handlesearch = (e) => {
        filterdata(searchkey);
    }

    const filterdata = (searchKey) => {
        const filteredData = showdiscounts.filter(customer =>
            customer && customer.usersname && customer.usersname.toLowerCase().includes(searchKey.toLowerCase())
        );
        setshowdiscounts(filteredData);
    }

    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="brand">
                    <img src='../public/company-logo.png' className='logo' alt='company-logo' />
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
                <div className='search-container'>
                    <div className='search-bar-container'>
                        <MdSearch className='search-icon' />
                        <input
                            type='text'
                            placeholder='Search by User Name'
                            value={searchkey}
                            onChange={(e) => setsearchkey(e.target.value)}
                            className='search-bar'
                        />
                        <button onClick={handlesearch} className='button'>Search</button>
                    </div>
                </div>

                <div ref={componentPDF} style={{ width: '100%' }}>
                    <h2>Training Details</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '10px', backgroundColor: '#007BFF', color: '#fff' }}>Users Name</th>
                                <th style={{ padding: '10px', backgroundColor: '#007BFF', color: '#fff' }}>Train Name</th>
                                <th style={{ padding: '10px', backgroundColor: '#007BFF', color: '#fff' }}>Description</th>
                                <th style={{ padding: '10px', backgroundColor: '#007BFF', color: '#fff' }}>Schedule Date</th>
                                <th style={{ padding: '10px', backgroundColor: '#007BFF', color: '#fff' }}>Schedule Time</th>
                                <th style={{ padding: '10px', backgroundColor: '#007BFF', color: '#fff' }}>Relevant Department</th>
                                <th style={{ padding: '10px', backgroundColor: '#007BFF', color: '#fff' }}>Options</th>
                                {!isGeneratingPDF && <th style={{ padding: '10px', backgroundColor: '#007BFF', color: '#fff' }}>Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {showdiscounts.map((e1) => (
                                <tr key={e1._id}>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{e1.usersname}</td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{e1.trainname}</td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{e1.description}</td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{e1.sheduleDate}</td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{e1.sheduleTime}</td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{e1.releventDepartment}</td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{e1.options}</td>
                                    {!isGeneratingPDF && (
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                            <Link to={`/trainerupdate/${e1._id}`}>Edit</Link>
                                            <button onClick={() => handledelete(e1._id)} style={{ marginLeft: '10px', backgroundColor: '#DC3545', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>Delete</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default TrainDetails;
