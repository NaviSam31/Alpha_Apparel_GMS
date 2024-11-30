import React, { useState, useEffect } from 'react';
import BackButton from '../../components/MaterialRequirementBAckButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const CreateMaterialRequirement = () => {
  const [designID, setDesignID] = useState('');
  const [sizeID, setSizeID] = useState('');
  const [materials, setMaterials] = useState([{ materialID: '', qtyRequired: '' }]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [designIDs, setDesignIDs] = useState([]);
  const [sizeIDs, setSizeIDs] = useState([]);
  const [itemCodes, setItemCodes] = useState([]);
  const [filteredDesignIDs, setFilteredDesignIDs] = useState([]);
  const [filteredSizeIDs, setFilteredSizeIDs] = useState([]);
  const [filteredItemCodes, setFilteredItemCodes] = useState([]);
  const navigate = useNavigate();

  // Fetch all design IDs
  useEffect(() => {
    axios.get('http://localhost:5555/designs')
      .then((response) => setDesignIDs(response.data))
      .catch((error) => console.error('Error fetching design IDs:', error));
  }, []);

  // Fetch all size IDs
  useEffect(() => {
    axios.get('http://localhost:5555/sizes')
      .then((response) => setSizeIDs(response.data))
      .catch((error) => console.error('Error fetching size IDs:', error));
  }, []);

  // Fetch item codes from inventory
  useEffect(() => {
    axios.get('http://localhost:5555/inventory')
      .then((response) => setItemCodes(response.data.data.map(item => item.itemCode)))
      .catch((error) => console.error('Error fetching item codes:', error));
  }, []);

  // Filter design IDs based on input
  useEffect(() => {
    if (designID) {
      setFilteredDesignIDs(
        designIDs.filter(design => design.designID.toLowerCase().includes(designID.toLowerCase()))
      );
    } else {
      setFilteredDesignIDs([]); // Clear suggestions if input is empty
    }
  }, [designID, designIDs]);

  // Filter size IDs based on input
  useEffect(() => {
    if (sizeID) {
      setFilteredSizeIDs(
        sizeIDs.filter(size => size.sizeID.toLowerCase().includes(sizeID.toLowerCase()))
      );
    } else {
      setFilteredSizeIDs([]); // Clear suggestions if input is empty
    }
  }, [sizeID, sizeIDs]);

  // Filter material IDs based on input
  const handleMaterialChange = (index, field, value) => {
    const newMaterials = [...materials];
    newMaterials[index][field] = value;
    setMaterials(newMaterials);

    // Filter item codes if the field is materialID
    if (field === 'materialID') {
      setFilteredItemCodes(
        itemCodes.filter(code => code.toLowerCase().includes(value.toLowerCase()) &&
          !newMaterials.some(material => material.materialID === code)) // Exclude selected material IDs
      );
    }
  };

  const handleItemCodeSelect = (index, code) => {
    const newMaterials = [...materials];
    newMaterials[index].materialID = code;
    setMaterials(newMaterials);
    setFilteredItemCodes([]); // Clear filtered list after selection
  };

  // Select design ID from filtered list
  const handleDesignIDSelect = (design) => {
    setDesignID(design.designID);
    setFilteredDesignIDs([]); // Clear suggestions after selection
  };

  // Select size ID from filtered list
  const handleSizeIDSelect = (size) => {
    setSizeID(size.sizeID);
    setFilteredSizeIDs([]); // Clear suggestions after selection
  };

  const validateForm = () => {
    const newErrors = {};
    if (!designID.trim()) newErrors.designID = 'Design ID is required';
    if (!sizeID.trim()) newErrors.sizeID = 'Size ID is required';

    materials.forEach((material, index) => {
      if (!material.materialID.trim()) {
        newErrors[`materialID${index + 1}`] = `Material ID ${index + 1} is required`;
      }
      if (!material.qtyRequired.trim() || isNaN(material.qtyRequired) || parseFloat(material.qtyRequired) <= 0) {
        newErrors[`qtyRequired${index + 1}`] = `QTY Required ${index + 1} must be a positive number`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddMaterial = () => {
    setMaterials([...materials, { materialID: '', qtyRequired: '' }]);
  };

  const handleSaveMaterialRequirement = () => {
    if (!validateForm()) return;

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

    axios.post('http://localhost:5555/materialRequirement', data)
      .then(() => navigate('/materialRequirement/home'))
      .catch((error) => {
        console.error('An error occurred:', error);
        alert('An error occurred. Please check the console for more details.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">
          <img src='../public/company-logo.png' className='company-logo' alt='company-logo' />
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
        <br></br>
        <br></br>
        <br></br>
        <div className='main-content p-4'>
          <BackButton />
          <h1 className='text-3xl my-4'>Create Material Requirement Record</h1>
          {loading && <Spinner />}
          <div className='border-2 rounded-xl w-[600px] p-4 mx-auto'>
            {/* Input fields */}
            <div className='my-4'>
              <label className='text-xl text-gray-500'>Design ID</label>
              <input
                type='text'
                value={designID}
                onChange={(e) => setDesignID(e.target.value)}
                className='border-2 w-full'
              />
              {errors.designID && <p className='text-red-500'>{errors.designID}</p>}
              {filteredDesignIDs.length > 0 && (
                <ul className='border'>
                  {filteredDesignIDs.map((design) => (
                    <li key={design._id} onClick={() => handleDesignIDSelect(design)} className='cursor-pointer hover:bg-gray-200'>
                      {design.designID} - {design.DesignName}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className='my-4'>
              <label className='text-xl text-gray-500'>Size ID</label>
              <input
                type='text'
                value={sizeID}
                onChange={(e) => setSizeID(e.target.value)}
                className='border-2 w-full'
              />
              {errors.sizeID && <p className='text-red-500'>{errors.sizeID}</p>}
              {filteredSizeIDs.length > 0 && (
                <ul className='border'>
                  {filteredSizeIDs.map((size) => (
                    <li key={size._id} onClick={() => handleSizeIDSelect(size)} className='cursor-pointer hover:bg-gray-200'>
                      {size.sizeID}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Dynamic Material Fields */}
            {materials.map((material, index) => (
              <div key={index} className='my-4'>
                <label className='text-xl text-gray-500'>Material ID {index + 1}</label>
                <input
                  type='text'
                  value={material.materialID}
                  onChange={(e) => handleMaterialChange(index, 'materialID', e.target.value)}
                  className='border-2 w-full'
                />
                {errors[`materialID${index + 1}`] && <p className='text-red-500'>{errors[`materialID${index + 1}`]}</p>}
                {filteredItemCodes.length > 0 && (
                  <ul className='border'>
                    {filteredItemCodes.map((code) => (
                      <li key={code} onClick={() => handleItemCodeSelect(index, code)} className='cursor-pointer hover:bg-gray-200'>
                        {code}
                      </li>
                    ))}
                  </ul>
                )}

                <label className='text-xl text-gray-500'>QTY Required {index + 1}</label>
                <input
                  type='number'
                  value={material.qtyRequired}
                  onChange={(e) => handleMaterialChange(index, 'qtyRequired', e.target.value)}
                  className='border-2 w-full'
                />
                {errors[`qtyRequired${index + 1}`] && <p className='text-red-500'>{errors[`qtyRequired${index + 1}`]}</p>}
              </div>
            ))}

            <div className='flex flex-col mt-4'>
              <button onClick={handleAddMaterial} className='bg-blue-500 text-white rounded px-4 py-2 mb-2'
                style={{ width: "100%" }}
              >
                Add Material
              </button>

              <button onClick={handleSaveMaterialRequirement} className='bg-green-500 text-white rounded px-4 py-2'
                style={{ width: "100%" }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMaterialRequirement;
