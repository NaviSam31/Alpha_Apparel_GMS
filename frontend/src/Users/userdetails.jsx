import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './userdetails.css';
import { useReactToPrint } from 'react-to-print';

function UserDetails() {
    const componentPDF = useRef();
    const [showdiscounts, setshowdiscounts] = useState([]);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [searchkey,setsearchkey]=useState('');

    const getfetchdata = async () => {
        try {
            const data = await axios.get('http://localhost:8020/users');
            console.log(data.data.success);
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
        const data = await axios.delete('http://localhost:8020/user_delete/' + id);
        if (data.data.success) {
            getfetchdata();
            console.log(data.data.message);
            alert('Item  deleted Successfully!');
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
            customer && customer.rouly_garbage && customer.rouly_garbage.toLowerCase().includes(searchKey.toLowerCase())
        );
        setshowdiscounts(filteredData);
    }
    
    return (
        <div className="showuserdetails">
            <a href="/traindetails">Training Details</a>
             <h2>Users Details</h2>
            <div ref={componentPDF} style={{ width: '100%' }}>
              
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th> Email</th>
                            <th> Password</th>
                            <th>Address</th>
                            <th>Phone</th>
                          
                           
                            {!isGeneratingPDF && <th>Action</th>}
                        </tr>
                    </thead>
          
                    <tbody>
                        {showdiscounts.map((e1) => (
                            <tr key={e1._id}>
                                <td>{e1.username}</td>
                                <td>{e1.email}</td>
                                <td>{e1.password}</td>
                                <td>{e1.address}</td>
                                <td>{e1.phone}</td>
                               
                               
                                {!isGeneratingPDF && (
                                    <td>
                                        <a href={`/userupdate/${e1._id}`}>Edit </a>
                                        <button onClick={() => handledelete(e1._id)}>Delete </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          
        </div>
    );
}

export default UserDetails;
