import { useEffect, useState } from 'react';
import axios from 'axios';
import "./allSuppliers.css";

function SupplierDashBoard() {
    const [countlist, setcountlist] = useState(null);
    const [supplierlist, setsupplierlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data from the API
    const getfetchdata = async () => {
        try {
            const response = await axios.get("http://localhost:5555/count_supplier");
            const { count, data } = response.data;
            setcountlist(count);
            setsupplierlist(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        getfetchdata();
    }, []);

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Supplier Dashboard</h1>
            {loading && <p className="loading">Loading...</p>}
            {error && <p className="error">Error: {error}</p>}
            {countlist !== null && !loading && !error ? (
                <div className="total-suppliers">
                    <h2>Total Suppliers</h2>
                    <p className="count">{countlist}</p>
                </div>
            ) : null}
            <h2 className="supplier-list-title">Suppliers / Companies</h2>
            <div className="supplier-list">
                {supplierlist.length > 0 ? (
                    supplierlist.map((e) => (
                        <div key={e.id} className="supplier-item">
                            <p>{e.name}</p>
                        </div>
                    ))
                ) : (
                    <p>No suppliers found</p>
                )}
            </div>
        </div>
    );
}

export default SupplierDashBoard;
