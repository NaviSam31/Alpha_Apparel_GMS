import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './userupdate.css';

function UpdateUser() {
    const { id } = useParams();
    const [updateorder, setupdateorder] = useState({
        username: "",
        email: "",
        password: "",
        address: "",
        phone: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:8020/user_order/${id}`);
                const data = await response.json();
                if (data.success) {
                    setupdateorder(data.data);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [id]);

    const validate = () => {
        const newErrors = {};

        // Username validation
        if (!updateorder.username.trim()) {
            newErrors.username = "Username is required.";
        }

        // Email validation
        if (!updateorder.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(updateorder.email)) {
            newErrors.email = "Email address is invalid.";
        }

        // Password validation (minimum length of 6)
        if (!updateorder.password.trim()) {
            newErrors.password = "Password is required.";
        } else if (updateorder.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }

        // Address validation
        if (!updateorder.address.trim()) {
            newErrors.address = "Address is required.";
        }

        // Phone validation (must be numeric and of appropriate length)
        if (!updateorder.phone.trim()) {
            newErrors.phone = "Phone number is required.";
        } else if (!/^\d+$/.test(updateorder.phone)) {
            newErrors.phone = "Phone number must be numeric.";
        } else if (updateorder.phone.length < 10) {
            newErrors.phone = "Phone number must be at least 10 digits.";
        }

        return newErrors;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Update state
        setupdateorder((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear individual field errors on change
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleUpdate = async () => {
        const newErrors = validate();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8020/user_update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateorder),
            });

            const data = await response.json();

            if (data.success) {
                alert("User updated successfully");
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div className='item-update'>
            <h2>Update User</h2>

            <label>Username:</label>
            <input
                type="text"
                name="username"
                onChange={handleInputChange}
                value={updateorder.username}
            />
            {errors.username && <span className="error">{errors.username}</span>}
            <br />

            <label>Email:</label>
            <input
                type="email"
                name="email"
                onChange={handleInputChange}
                value={updateorder.email}
            />
            {errors.email && <span className="error">{errors.email}</span>}
            <br />

            <label>Password:</label>
            <input
                type="password"
                name="password"
                onChange={handleInputChange}
                value={updateorder.password}
            />
            {errors.password && <span className="error">{errors.password}</span>}
            <br />

            <label>Address:</label>
            <input
                type="text"
                name="address"
                onChange={handleInputChange}
                value={updateorder.address}
            />
            {errors.address && <span className="error">{errors.address}</span>}
            <br />

            <label>Phone:</label>
            <input
                type="text"
                name="phone"
                onChange={handleInputChange}
                value={updateorder.phone}
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
            <br />

            <button onClick={handleUpdate}>Update</button>
        </div>
    );
}

export default UpdateUser;
