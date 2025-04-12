import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TableList from './component/ListTable';
import TableListAdmin from './component/AdminTable';
import TableDetail from "./component/TableDetail";
import OrderDetailPage from "./component/OrderDetailPage";
// import RegisterForm from "./component/RegisterForm";
import Home from "./component/Home";
import { ToastContainer } from "react-toastify";
import Dashboard from "./component/Dashboard";
import PrivateRoute from './config/PrivateRoute';
import OrderDetailList from "./component/OrderDetailList";
import UpdateUser from "./component/Employee/UpdateUser";
import {Login} from "./service/UserService";
import Login1 from "./component/login/Login";
import EditUser from "./component/Edituser";
import ChangePassword from "./component/ChangePassword";
import PaymentSuccess from "./component/PaymentSuccess";
import UnauthorizedPage from "./component/protected-route/UnauthorizedPage";
import ExportPage from "./component/ExportPage";
import Register from "./component/sign/Register";
import AdminDashboard from "./component/Dashboard";
import UserList from "./component/Employee/ListUser";
import AddEmployeeForm from "./component/Employee/AddUser";
import CategoryManagement from "./component/CategoryManagement";
import CategoryForm from "./component/AddCategory";
import ProductList from "./component/ProductList";
import TableManager from "./component/Table/TableManager";
import Feedback from "react-bootstrap/Feedback";
import FeedbackList from "./component/FeedbackList";
import IncomeManager from "./component/IncomeManager";
import InvoiceTable from "./component/InvoiceTable";
import DiscountList from "./component/DiscountList";
import EditAdmin from "./component/EditAdmin";
import ChangePasswordAdmin from "./component/ChangePasswordAdmin";
import IngredientList from "./component/IngredientList";

function App() {
  const [resetList, setResetList] = useState(false); // Định nghĩa ở đây

  return (
      <Router>
        <div className="App">
          <Routes>
            {/*<Route path="/login" element={<Login />} />*/}
            <Route path="/login" element={<Login1 />} />
            <Route path="/export" element={<ExportPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product" element={<ProductList />} />
            <Route path="/listTable" element={<TableManager />} />
            <Route path="/feedback" element={<FeedbackList />} />
            <Route path="/income" element={<IncomeManager />} />
            <Route path="/oderdetail" element={<InvoiceTable />} />
            <Route path="/discount" element={<DiscountList />} />
            {/* Route cần bảo vệ */}
            <Route
                path="/user"
                element={
                  <PrivateRoute requiredRole="ROLE_USER">
                    <TableListAdmin />
                  </PrivateRoute>
                }
            />
            <Route
                path="/dashboard"
                element={
                  <PrivateRoute requiredRole="ROLE_ADMIN">
                    <AdminDashboard />
                  </PrivateRoute>
                }
            />
            <Route
                path="/update/:id"
                element={
                  <PrivateRoute requiredRole="ROLE_ADMIN">
                    <UpdateUser />
                  </PrivateRoute>
                }
            />

            <Route
                path="/addUser"
                element={
                  <PrivateRoute requiredRole="ROLE_ADMIN">
                    <AddEmployeeForm />
                  </PrivateRoute>
                }
            />
            <Route
                path="/addCategory"
                element={
                  <PrivateRoute requiredRole="ROLE_ADMIN">
                    <CategoryForm />
                  </PrivateRoute>
                }
            />
            {/* Các route không cần bảo vệ */}
            {/*<Route path="/login" element={<LoginForm />} />*/}
            {/*<Route path="/register" element={<RegisterForm />} />*/}
            {/*<Route path="/home" element={<Home />} />*/}
            <Route path="/home" element={<Home />} />
            <Route path="/tables" element={<TableList />} />
            <Route path="/tables/:id" element={<TableDetail />} />
            <Route path="/oderDetailsList" element={<OrderDetailList />} />
            <Route path="/updateUser" element={<UpdateUser />} />
            <Route path="/category" element={<CategoryManagement />} />
            {/*<Route path="/edit-user" element={<EditUser />} />*/}
            <Route
                path="/edit-user"
                element={
                  <PrivateRoute requiredRole="ROLE_USER">
                    <EditUser />
                  </PrivateRoute>
                }
            />
            <Route
                path="/edit-admin"
                element={
                  <PrivateRoute requiredRole="ROLE_ADMIN">
                    <EditAdmin />
                  </PrivateRoute>
                }
            />
            <Route path="/changePassword" element={<ChangePassword />} />
            <Route path="/vnpay_return" element={<PaymentSuccess />} />
            <Route path="/ingredients" element={<IngredientList />} />

            {/* Các route được bảo vệ */}
            <Route
                path="/order/:tableId"
                element={
                  <OrderDetailPage />
                }
            />

            {/*<Route*/}
            {/*    path="/user"*/}
            {/*    element={*/}
            {/*        <PrivateRoute requiredRole="ROLE_USER">*/}
            {/*            <TableListAdmin />*/}
            {/*        </PrivateRoute>*/}
            {/*    }*/}
            {/*/>*/}

            <Route
                path="/changePasss"
                element={
                  <PrivateRoute requiredRole="ROLE_ADMIN">
                    <ChangePasswordAdmin />
                  </PrivateRoute>
                }
            />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

          </Routes>
          <ToastContainer />

        </div>
      </Router>
  );
}

export default App;
