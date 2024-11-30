import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DesignHome from './pages/Design_Manager/DesignHome.jsx';
import CreateDesign from './pages/Design_Manager/CreateDesign.jsx';
import EditDesign from './pages/Design_Manager/EditDesign.jsx';
import DeleteDesign from './pages/Design_Manager/DeleteDesign.jsx';
import ShowDesign from './pages/Design_Manager/ShowDesign.jsx';

import SizeHome from './pages/Design_Manager/SizeHome.jsx';
import CreateSize from './pages/Design_Manager/CreateSize.jsx';
import EditSize from './pages/Design_Manager/EditSize.jsx';
import DeleteSize from './pages/Design_Manager/DeleteSize.jsx';
import ShowSize from './pages/Design_Manager/ShowSize.jsx';
import SizeChart from './pages/Design_Manager/SizeChart.jsx';

import Home from './pages/Inventory_Manager/Home.jsx';
import CreateBooks from './pages/Inventory_Manager/CreateBooks.jsx';
import ShowBooks from './pages/Inventory_Manager/ShowBooks.jsx';
import EditBooks from './pages/Inventory_Manager/EditBooks.jsx';
import DeleteBooks from './pages/Inventory_Manager/DeleteBooks.jsx';
import ReOrderHome from './pages/Inventory_Manager/ReOrderHome.jsx';
import CreateReOrder from './pages/Inventory_Manager/CreateReOrder.jsx';
import SupplierReOrderHome from './pages/Inventory_Manager/SupplierReOrderHome.jsx';
import DeleteReOrder from './pages/Inventory_Manager/DeleteReOrder.jsx';

import MaterialRequirementHome from './pages/Design_Manager/MaterialRequirementHome.jsx';
import CreateMaterialRequirement from './pages/Design_Manager/CreateMaterialRequirement.jsx';
import EditMaterialRequirement from './pages/Design_Manager/EditMaterialRequirement.jsx';
import DeleteMaterialRequirement from './pages/Design_Manager/DeleteMaterialRequirement.jsx';
import ShowMaterialRequirement from './pages/Design_Manager/ShowMaterialRequirement.jsx';

import MarketingHome from "./pages/Marketing_Manager/MarketingHome.jsx";
import CreateDiscount from "./pages/Marketing_Manager/CreateDiscount.jsx";
import ShowDiscount from "./pages/Marketing_Manager/ShowDiscount.jsx";
import EditDiscount from "./pages/Marketing_Manager/EditDiscount.jsx";
import DeleteDiscount from "./pages/Marketing_Manager/DeleteDiscount.jsx";

import CustomerHome from "./pages/Order_Manager/CustomerHome.jsx";
import CreateCustomer from "./pages/Order_Manager/CreateCustomer.jsx";
import ShowCustomer from "./pages/Order_Manager/ShowCustomer.jsx";
import EditCustomer from "./pages/Order_Manager/EditCustomer.jsx";
import DeleteCustomer from "./pages/Order_Manager/DeleteCustomer.jsx";
import OrderHome from "./pages/Order_Manager/OrderHome.jsx";
import CreateOrder from "./pages/Order_Manager/CreateOrder.jsx";
import EditOrder from "./pages/Order_Manager/EditOrder.jsx";
import DeleteOrder from "./pages/Order_Manager/DeleteOrder.jsx";

import TransportHome from './pages/Transport_Manager/TransportHome.jsx';
import CreateTransportation from './pages/Transport_Manager/CreateTransportation.jsx';
import ShowTransportation from './pages/Transport_Manager/ShowTransportation.jsx';
import EditTransportation from './pages/Transport_Manager/EditTransportation.jsx';
import DeleteTransportation from './pages/Transport_Manager/DeleteTransportation.jsx';
import VehicleHome from './pages/Transport_Manager/VehicleHome.jsx';
import CreateVehicle from './pages/Transport_Manager/CreateVehicle.jsx';
import ShowVehicle from './pages/Transport_Manager/ShowVehicle.jsx';
import EditVehicle from './pages/Transport_Manager/EditVehicle.jsx';
import DeleteVehicle from './pages/Transport_Manager/DeleteVehicle.jsx';

import TransportFinance from './pages/Transport_Manager/TransportFinance.jsx'; 
import FinanceBtn from './pages/Transport_Manager/FinanceBtn.jsx'

// import './App.css';
// import Header from './ItemComponent/header';
import Login from './pages/Login';


import AddSupplier from "./supplier_component/addSupplier";
import AllSupplier from "./supplier_component/allsupplier.jsx";
import UpdateSupplier from "./supplier_component/updatesupplier";

import SupplierDashBoard from "./supplier_component/supplierDashBoard";
import PlaceOrder from "./supplier_order_comonent/placeOrder";
import AllOrders from "./supplier_order_comonent/allOrders";
import UpdateOrder from "./supplier_order_comonent/updateOrder";
import NavBar from "./supplier_component/NavBar";

import DisplayItemHome from './pages/Order_Manager/DisplayItemHome.jsx';
import CreateDisplayItem from './pages/Order_Manager/CreateDisplayItem.jsx'; // Import CreateItem
import ShowDisplayItem from './pages/Order_Manager/ShowDisplayItem.jsx'; // Import ShowItem
import EditDisplayItem from './pages/Order_Manager/EditDisplayItem.jsx'; // Import EditItem
import DeleteDisplayItem from './pages/Order_Manager/DeleteDisplayItem.jsx'; 
import CustomerItemHome from './pages/Order_Manager/CustomerItemsHome.jsx'; 
import ShowOrder  from './pages/Order_Manager/ShowOrder.jsx';  


import EmployeeHome from './HR_Manager/EmployeeHome.jsx'
import CreateEmployee from './HR_Manager/CreateEmployee.jsx'
import DeleteEmployee from './HR_Manager/DeleteEmployee.jsx'
import EditEmployee from './HR_Manager/EditEmployee.jsx'
import ShowEmployee from './HR_Manager/ShowEmloyee.jsx'

import EmployeeTrainingHome from './HR_Manager/EmployeeTrainingHome.jsx'
import CreateEmployeeTraining from './HR_Manager/CreateTraining.jsx'
import DeleteEmployeeTraining from './HR_Manager/DeleteTraining.jsx'
import EditEmployeeTraining from './HR_Manager/EditTraining.jsx'
import ShowEmployeeTraining from './HR_Manager/ShowTraining.jsx'
import CreateSupplier from './HR_Manager/CreateSupplier.jsx'
import SupplierHome from './HR_Manager/SupplierHome.jsx'
import DeleteSupplier from './HR_Manager/DeleteSupplier.jsx'
import EditSupplier from './HR_Manager/EditSupplier.jsx'
import ShowSupplier from './HR_Manager/ShowSupplier.jsx'

import FundHome from '../src/pages/Finance_Manager/FundHome.jsx'; 
import CreateFund from '../src/pages/Finance_Manager/CreateFund.jsx'; // Import CreateFund
import EditFund from '../src/pages/Finance_Manager/EditFund.jsx'; // Import EditFund
import ShowFund from '../src/pages/Finance_Manager/ShowFund.jsx'; // Import ShowFund
import DeleteFund from '../src/pages/Finance_Manager/DeleteFund.jsx'; 
import FundRequestHome from '../src/pages/Finance_Manager/fundRequestHome.jsx'; 
import RequestFund from '../src/pages/Finance_Manager/RequestFund.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path='/design/home' element={<DesignHome />} />
      <Route path='/designs/create' element={<CreateDesign />} />
      <Route path='/designs/details/:id' element={<ShowDesign />} />
      <Route path='/designs/edit/:id' element={<EditDesign />} />
      <Route path='/designs/delete/:id' element={<DeleteDesign />} />

      <Route path='/sizes/home' element={<SizeHome />} />
      <Route path='/sizes/sizeChart' element={<SizeChart />} />
      <Route path='/sizes/create' element={<CreateSize />} />
      <Route path='/sizes/details/:id' element={<ShowSize />} />
      <Route path='/sizes/edit/:id' element={<EditSize />} />
      <Route path='/sizes/delete/:id' element={<DeleteSize />} />

      <Route path='/materialRequirement/home' element={<MaterialRequirementHome />} />
      <Route path='/materialRequirement/create' element={<CreateMaterialRequirement />} />
      <Route path='/materialRequirement/details/:id' element={<ShowMaterialRequirement />} />
      <Route path='/materialRequirement/edit/:id' element={<EditMaterialRequirement />} />
      <Route path='/materialRequirement/delete/:id' element={<DeleteMaterialRequirement />} />


      <Route path='/inventory/home' element={<Home />} />
      <Route path='/inventory/create' element={<CreateBooks />} />
      <Route path='/inventory/details/:itemCode' element={<ShowBooks />} />
      <Route path='/inventory/edit/:itemCode' element={<EditBooks />} />
      <Route path='/inventory/delete/:itemCode' element={<DeleteBooks />} />
      <Route path='/reOrder/home' element={<ReOrderHome />} />
      <Route path='/reOrder/SupplierHome' element={<SupplierReOrderHome />} />
      <Route path='/reOrder/create' element={<CreateReOrder />} />
      <Route path="/reOrder/delete/:id" element={<DeleteReOrder />} />


      <Route path="/discounts/home" element={<MarketingHome />} />
      <Route path="/discounts/create" element={<CreateDiscount />} />
      <Route path="/discounts/details/:id" element={<ShowDiscount />} />
      <Route path="/discounts/edit/:id" element={<EditDiscount />} />
      <Route path="/discounts/delete/:id" element={<DeleteDiscount />} />

      <Route path="/customers/home" element={<CustomerHome />} />
      <Route path="/customers/create" element={<CreateCustomer />} />
      <Route path="/customers/details/:id" element={<ShowCustomer />} />
      <Route path="/customers/edit/:id" element={<EditCustomer />} />
      <Route path="/customers/delete/:id" element={<DeleteCustomer />} />

      <Route path="/orders/home" element={<OrderHome />} />
      <Route path="/orders/create" element={<CreateOrder />} />
      <Route path="/orders/edit/:id" element={<EditOrder />} />
      <Route path="/orders/delete/:id" element={<DeleteOrder />} />
      <Route path="/orders/details/:id" element={<ShowOrder />} />

      <Route path="/transport/home" element={<TransportHome />} />
      <Route path="/transport/create" element={<CreateTransportation />} />
      <Route path="/transport/details/:id" element={<ShowTransportation />} />
      <Route path="/transport/edit/:id" element={<EditTransportation />} />
      <Route path="/transport/delete/:id" element={<DeleteTransportation />} />
      <Route path="/vehicle" element={<VehicleHome />} />
      <Route path="/vehicle/create" element={<CreateVehicle />} />
      <Route path="/vehicle/details/:id" element={<ShowVehicle />} />
      <Route path="/vehicle/edit/:id" element={<EditVehicle />} />
      <Route path="/vehicle/delete/:id" element={<DeleteVehicle />} />
      <Route path="/transport/finance" element={<TransportFinance />} /> 
      <Route path="/transprt/financeBTN" element={<FinanceBtn/>} />


      <Route path="/suppliers/home" element={<AllSupplier />}></Route>
      <Route path="/update/:id" element={<UpdateSupplier />}></Route>
      <Route path="/order/:id" element={<PlaceOrder />}></Route>
      <Route path="/allorders" element={<AllOrders />}></Route>
      <Route path="/updateorder/:id" element={<UpdateOrder />}></Route>


      <Route path='/items/home' element={<DisplayItemHome />} />
      <Route path='/items/create' element={<CreateDisplayItem />} />
      <Route path='/items/details/:id' element={<ShowDisplayItem />} />
      <Route path='/items/edit/:id' element={<EditDisplayItem />} />
      <Route path='/items/delete/:id' element={<DeleteDisplayItem />} />

      <Route path='/' element={<CustomerItemHome />} />

      <Route path='/employee/home' element={<EmployeeHome />} />
      <Route path='/employee/create' element={<CreateEmployee />} />
      <Route path='/employee/delete/:id' element={<DeleteEmployee />} />
      <Route path='/employee/edit/:id' element={<EditEmployee />} />
      <Route path='/employee/details/:id' element={<ShowEmployee />} />

      <Route path='/training/home' element={<EmployeeTrainingHome />} />
      <Route path='/training/create' element={<CreateEmployeeTraining />} />
      <Route path='/training/delete/:id' element={<DeleteEmployeeTraining />} />
      <Route path='/training/edit/:id' element={<EditEmployeeTraining />} />
      <Route path='/training/details/:id' element={<ShowEmployeeTraining />} />
      <Route path='/supplier/create' element={<CreateSupplier />} />
      <Route path='/supplier/home' element={<SupplierHome />} />
      <Route path='/supplier/delete/:id' element={<DeleteSupplier />} />
      <Route path='/supplier/edit/:id' element={<EditSupplier />} />
      <Route path='/supplier/details/:id' element={<ShowSupplier />} />


      <Route path='/funds/home' element={<FundHome />} />
      <Route path='/funds/details/:id' element={<ShowFund />} />
      <Route path='/funds/create' element={<CreateFund />} />
      <Route path='/funds/edit/:id' element={<EditFund />} />
      <Route path='/funds/delete/:id' element={<DeleteFund />} />

      <Route path='/fundRequests/home' element={<FundRequestHome />} />
      <Route path='/fundRequests/create' element={<RequestFund />} />
    </Routes>
  );
};

export default App;
