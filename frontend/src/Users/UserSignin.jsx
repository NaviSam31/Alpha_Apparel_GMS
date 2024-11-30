import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './UserSignIn.css'




export default function UserSignin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Assuming validation is successful, proceed with logging in
        try {
            const response = await fetch('http://localhost:8020/user_signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();
            console.log(response.status);
            if (response.ok) {
                alert(data.message);
                navigate('/userdetails')// Display success message
                // Redirect to the next page or perform any other action
            } else {
                alert(data.message); // Display error message
            }

        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    };


    return (

        <div className='user-login-form'>
            <h2>User SIgn In </h2>
            <form onSubmit={handleSubmit}>
                <lable > Email:</lable>
                <input type="text" id="email" name="email" onChange={handleOnChange} /><br></br>
                <lable>Password:</lable>
                <input type="text" id="password" name="password" onChange={handleOnChange} /><br></br>

                <br></br>
                <button>Log in</button>
                <p id="if-not-register-details"><b>Dont have an account?.please register!</b></p>
                <a id="register-btn" href='/add-user'>Register Now</a>
            </form>



        </div>

    )
}

