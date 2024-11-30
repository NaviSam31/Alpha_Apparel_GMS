import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import the hook

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();  // Initialize the navigation function

  // Predefined username and password combinations
  const predefinedCredentials = [
    { username: 'minosh@alpha.lk', password: 'minosh12', link: '/employee/home' },
    { username: 'savinda@alpha.lk', password: 'savinda12', link: '/funds/home' },
    { username: 'isuri@alpha.lk', password: 'isuri12', link: '/design/home' },
    { username: 'deneth@alpha.lk', password: 'deneth12', link: '/inventory/home' },
    { username: 'isini@alpha.lk', password: 'isini12', link: '/customers/home' },
    { username: 'thulani@alpha.lk', password: 'thulani12', link: '/transport/home' },
    { username: 'navindu@alpha.lk', password: 'navindu12', link: '/discounts/home' },
    { username: 'amandi@alpha.lk', password: 'amandi12', link: '/suppliers/home' },
  ];

  // Handle form submit
  const handleLogin = (e) => {
    e.preventDefault();

    // Validate credentials
    let found = false;
    predefinedCredentials.forEach((user) => {
      if (username === user.username && password === user.password) {
        alert('Login successful!');
        navigate(user.link);  // Navigate to the unique route for each user
        found = true;
      }
    });

    if (!found) {
      setErrorMessage('Invalid username or password.');
    }
  };

  return (
    <>
      <div style={{
        position: 'relative', // Make the div a positioning context for the pseudo-element
        display: 'flex',
        flexDirection: 'column', // Column direction to place the heading on top of the form
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full viewport height
        backgroundSize: 'cover', // Ensure the background covers the entire page
        backgroundPosition: 'center', // Center the background image
        backgroundRepeat: 'no-repeat', // Prevent background repetition
      }}>
        {/* Transparent overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("/public/background.jpg")', // Path to your background image
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.6, // Set the transparency for the image
          zIndex: 1 // Ensure the background stays behind the form
        }}></div>

        {/* Heading */}
        <h1 style={{
          zIndex: 2, // Ensure the heading is above the background
          fontSize: '3.5rem', // Large heading
          color: '#000000', // White text
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)', // Subtle shadow for contrast
          marginBottom: '20px', // Space between heading and form
        }}>
          Alpha Apparels PVT LTD
        </h1>

        {/* Form container */}
        <div style={{
          padding: '40px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Light blue with opacity for transparency
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          color:'rgba(255, 255, 255)',
          width: '300px', // Fixed width for the form
          textAlign: 'center',
          position: 'relative', // Ensure the form stays on top
          zIndex: 2, // Form should be above the background
        }}>
          <h2 style={{ marginBottom: '20px' }}>Login Page</h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', marginLeft: '-146px'}}>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  padding: '10px',
                  width: '100%',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  boxSizing: 'border-box', 
                  color:'rgba(0, 0, 0)',
                  // Consistent box model
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', marginLeft: '-146px' }}>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  padding: '10px',
                  width: '100%',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                  color:'rgba(0, 0, 0)'
                }}
              />
            </div>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
