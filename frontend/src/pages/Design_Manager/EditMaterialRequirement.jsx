import React, { useState, useEffect } from 'react';
import BackButton from '../../components/MaterialRequirementBAckButton'; // Fixed typo in import path
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const EditMaterialRequirement = () => {
  const [designID, setDesignID] = useState('');
  const [sizeID, setSizeID] = useState('');
  const [materials, setMaterials] = useState([{ materialID: '', qtyRequired: '' }]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [itemCodes, setItemCodes] = useState([]);
  const [filteredItemCodes, setFilteredItemCodes] = useState([]);
  const [availableDesignIDs, setAvailableDesignIDs] = useState([]);
  const [availableSizeIDs, setAvailableSizeIDs] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch item codes from inventory
  useEffect(() => {
    axios.get('http://localhost:5555/inventory')
      .then((response) => {
        const codes = response.data.map(item => item.itemCode); // Adjust based on your data structure
        setItemCodes(codes);
      })
      .catch((error) => {
        console.error('Error fetching item codes:', error);
      });
  }, []);

  // Fetch existing material requirement
  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/materialRequirement/${id}`)
      .then((response) => {
        const requirement = response.data;
        setDesignID(requirement.designID);
        setSizeID(requirement.sizeID);
        setMaterials(requirement.materials);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching material requirement:', error);
        alert('An error occurred. Please check the console for details.');
        setLoading(false);
      });
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!designID.trim()) newErrors.designID = 'Design ID is required';
    if (!sizeID.trim()) newErrors.sizeID = 'Size ID is required';
  
    materials.forEach((material, index) => {
      if (!material.materialID.trim()) {
        newErrors[`materialID${index + 1}`] = `Material ID ${index + 1} is required`;
      }
  
      // Check if qtyRequired is a number and positive
      const qty = material.qtyRequired;
      if (
        typeof qty === 'string' && !qty.trim() || 
        isNaN(qty) || 
        parseFloat(qty) <= 0
      ) {
        newErrors[`qtyRequired${index + 1}`] = `QTY Required ${index + 1} must be a positive number`;
      }
    });
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleMaterialChange = (index, field, value) => {
    const newMaterials = [...materials];
    newMaterials[index][field] = value;
    setMaterials(newMaterials);

    // Filter item codes if the field is materialID
    if (field === 'materialID') {
      const filteredCodes = itemCodes.filter(code =>
        code.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredItemCodes(filteredCodes);
    }
  };

  const handleItemCodeSelect = (index, code) => {
    const newMaterials = [...materials];
    newMaterials[index].materialID = code;
    setMaterials(newMaterials);
    setFilteredItemCodes([]); // Clear the filtered list
  };

  const handleSaveMaterialRequirement = () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const materialRequirements = materials.map(({ materialID, qtyRequired }) => ({
      materialID,
      qtyRequired: parseFloat(qtyRequired),
    }));

    const data = {
      designID,
      sizeID,
      materials: materialRequirements,
    };

    axios.put(`http://localhost:5555/materialRequirement/${id}`, data)
      .then(() => {
        navigate('/materialRequirement/home'); // Adjusted to a correct route
      })
      .catch((error) => {
        console.error('An error occurred:', error);
        alert('An error occurred. Please check the console for more details.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">
          <img src='/public/company-logo.png' className='company-logo' alt='company-logo' />
        </div>
        <nav>
          <div className='nav-dept'><Link to="/"><img src='/public/home.png' className='icon' alt='Home' /> Home</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/inventory.png' className='icon' alt='Inventory' /> Inventory</Link></div>
          <div className='nav-dept'><Link to="/design/home"><img src='/public/tshirt.png' className='icon' alt='Design' /> Design</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/orders.png' className='icon' alt='Orders' /> Orders</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/supplier.png' className='icon' alt='Supplier' /> Supplier</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/marketing.png' className='icon' alt='Marketing' /> Marketing</Link></div>
          <div className='nav-dept'><Link to= ""><img src='/public/human-resource.png' className='icon' alt='Human Resource' /> Human Resource</Link></div>
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
        <div className='button-container'>
        </div>
        <div className='main-content p-4'>
          <BackButton />
          <h1 className='text-3xl my-4'>Edit Material Requirement Record</h1>
          {loading && <Spinner />}
          <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
            {/* Input fields */}
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Design ID</label>
              <input
                type='text'
                value={designID}
                onChange={(e) => setDesignID(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {errors.designID && <p className='text-red-500'>{errors.designID}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Size ID</label>
              <input
                type='text'
                value={sizeID}
                onChange={(e) => setSizeID(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {errors.sizeID && <p className='text-red-500'>{errors.sizeID}</p>}
            </div>

            {/* Dynamic Material Fields */}
            {materials.map((material, index) => (
              <div key={index} className='my-4'>
                <label className='text-xl mr-4 text-gray-500'>Material ID {index + 1}</label>
                <input
                  type='text'
                  value={material.materialID}
                  onChange={(e) => handleMaterialChange(index, 'materialID', e.target.value)}
                  className='border-2 border-gray-500 px-4 py-2 w-full'
                />
                {errors[`materialID${index + 1}`] && <p className='text-red-500'>{errors[`materialID${index + 1}`]}</p>}
                {filteredItemCodes.length > 0 && (
                  <ul className='border border-gray-300 mt-2'>
                    {filteredItemCodes.map((code) => (
                      <li key={code} className='p-1 cursor-pointer hover:bg-gray-200' onClick={() => handleItemCodeSelect(index, code)}>
                        {code}
                      </li>
                    ))}
                  </ul>
                )}

                <label className='text-xl mr-4 text-gray-500'>QTY Required {index + 1}</label>
                <input
                  type='number'
                  value={material.qtyRequired}
                  onChange={(e) => handleMaterialChange(index, 'qtyRequired', e.target.value)}
                  className='border-2 border-gray-500 px-4 py-2 w-full'
                />
                {errors[`qtyRequired${index + 1}`] && <p className='text-red-500'>{errors[`qtyRequired${index + 1}`]}</p>}
              </div>
            ))}

            {/* Save Button */}
            <button onClick={handleSaveMaterialRequirement} className='bg-green-500 text-white px-4 py-2 rounded my-4'style={{ width: "100%" }}>
              Save Material Requirement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMaterialRequirement;
