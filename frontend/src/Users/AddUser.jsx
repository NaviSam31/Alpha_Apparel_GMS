import { useState } from "react";
import axios from "axios";
import './adduser.css';
import { useNavigate } from 'react-router-dom';

function AddUser() {
    const navigate = useNavigate();
    const [order, setOrder] = useState({
        username: "",
        email: "",
        password: "",
        address: "",
        phone: "",
    });

    const [errors, setErrors] = useState({});

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        
        // Clear error messages when input changes
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
        
        setOrder((prevOrder) => ({
            ...prevOrder,
            [name]: value
        }));
    };

    const validate = () => {
        const newErrors = {};

        // Username validation
        if (!order.username.trim()) {
            newErrors.username = "Username is required.";
        }

        // Email validation
        if (!order.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(order.email)) {
            newErrors.email = "Email address is invalid.";
        }

        // Password validation
        if (!order.password.trim()) {
            newErrors.password = "Password is required.";
        } else if (order.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long.";
        }

        // Address validation (if it's a file, handle file input properly)
        if (!order.address) {
            newErrors.address = "Address is required.";
        }

        // Phone validation (checking if it's a valid phone number)
        if (!order.phone.trim()) {
            newErrors.phone = "Phone number is required.";
        } else if (!/^\d{10}$/.test(order.phone)) {
            newErrors.phone = "Phone number must be 10 digits.";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await axios.post("http://localhost:8020/add_user", order);
            console.log(response.data);
            alert("Details added successfully!");
            navigate("/sign-user");

            // Reset form
            setOrder({
                username: "",
                email: "",
                password: "",
                address: "",
                phone: "",
            });
            setErrors({});
        } catch (error) {
            console.error("There was an error adding the details:", error);
        }
    };

    return (
        <div className="add-user">
            <h1>HR Management</h1>
            <br></br>
           <h3>Add User Form</h3>
            <form onSubmit={handleSubmit} id="userform">
                <label>Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={order.username}
                    onChange={handleOnChange}
                />
                {errors.username && <span className="error">{errors.username}</span>}
                <br />

                <label>Email:</label>
                <input
                    type="text"
                    id="email"
                    name="email"
                    value={order.email}
                    onChange={handleOnChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
                <br />

                <label>Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={order.password}
                    onChange={handleOnChange}
                />
                {errors.password && <span className="error">{errors.password}</span>}
                <br />

                <label>Address:</label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    onChange={handleOnChange}
                />
                {errors.address && <span className="error">{errors.address}</span>}
                <br />

                <label>Phone:</label>
                <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={order.phone}
                    onChange={handleOnChange}
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
                <br />

                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default AddUser;
