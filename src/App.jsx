import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import ForgotPassword from "./panels/user/pages/ForgotPassword";
  import ResetPassword from "./panels/user/pages/ResetPassword.jsx";


// USER panel — The Atelier
import UserLayout from "./panels/user/UserLayout";
import Home from "./panels/user/pages/Home";
import ProductListing from "./panels/user/pages/ProductListing";
import ProductDetail from "./panels/user/pages/ProductDetail";
import Cart from "./panels/user/pages/Cart";
import Orders from "./panels/user/pages/Orders";
import OrderDetail from "./panels/user/pages/OrderDetails";
import UserLogin from "./panels/user/pages/Login";
import Address from "./panels/user/pages/Address.jsx";

// SELLER panel — The Merchant Ledger
import SellerLayout from "./panels/seller/SellerLayout";
import SellerLogin from "./panels/seller/pages/Login";
import SellerDashboard from "./panels/seller/pages/Dashboard";
import SellerOrders from "./panels/seller/pages/Orders";
import SellerProducts from "./panels/seller/pages/Products";
import SellerAddProduct from "./panels/seller/pages/AddProduct";

// ADMIN panel — Command Console
import AdminLayout from "./panels/admin/AdminLayout";
import AdminLogin from "./panels/admin/pages/Login";
import AdminDashboard from "./panels/admin/pages/Dashboard";
import AdminOrders from "./panels/admin/pages/Orders";
import AdminOrderDetail from "./panels/admin/pages/OrderDetails";
import AdminSellers from "./panels/admin/pages/Sellers";
import AdminUsers from "./panels/admin/pages/Users";

// SHIPMENT panel — Transit Board
import ShipmentLayout from "./panels/shipment/ShipmentLayout";
import ShipmentLogin from "./panels/shipment/pages/Login";
import Deliveries from "./panels/shipment/pages/Deliveries";
import DeliveryDetail from "./panels/shipment/pages/DeliveryDetail";

export default function App() {
  return (
    <Routes>
      {/* ---------- USER (Customer storefront) ---------- */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/login" element={<UserLogin />} />
         <Route path="/forgot-password" element={<ForgotPassword />} />
         <Route path="/reset-password" element={<ResetPassword />} />
<Route path="/addresses" element={<Address />} />
      </Route>

      {/* ---------- SELLER ---------- */}
      <Route path="/seller/login" element={<SellerLogin />} />
      <Route
        element={
          <ProtectedRoute allowedRoles={["SELLER"]} redirectTo="/seller/login">
            <SellerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/orders" element={<SellerOrders />} />
        <Route path="/seller/products" element={<SellerProducts />} />
        <Route path="/seller/products/new" element={<SellerAddProduct />} />
      </Route>

      {/* ---------- ADMIN ---------- */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]} redirectTo="/admin/login">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
        <Route path="/admin/sellers" element={<AdminSellers />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>

      {/* ---------- SHIPMENT / DELIVERY ---------- */}
      <Route path="/shipment/login" element={<ShipmentLogin />} />
      <Route
        element={
          <ProtectedRoute allowedRoles={["DELIVERY_PARTNER", "ADMIN"]} redirectTo="/shipment/login">
            <ShipmentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/shipment/deliveries" element={<Deliveries />} />
        <Route path="/shipment/deliveries/:id" element={<DeliveryDetail />} />
      </Route>
    </Routes>
  );
}

// import { Routes, Route } from "react-router-dom";
// import ProtectedRoute from "./components/ProtectedRoute";
//
//  import ForgotPassword from "./panels/user/pages/ForgotPassword";
//  import ResetPassword from "./panels/user/pages/ResetPassword.jsx";
//
//
// // USER panel — The Atelier
// import UserLayout from "./panels/user/UserLayout";
// import Home from "./panels/user/pages/Home";
// import ProductListing from "./panels/user/pages/ProductListing";
// import ProductDetail from "./panels/user/pages/ProductDetail";
// import Cart from "./panels/user/pages/Cart";
// import Orders from "./panels/user/pages/Orders";
// // import OrderDetail from "./panels/user/pages/OrderDetail";
// import UserLogin from "./panels/user/pages/Login";
//
// // SELLER panel — The Merchant Ledger
// import SellerLayout from "./panels/seller/SellerLayout";
// import SellerLogin from "./panels/seller/pages/Login";
// import SellerDashboard from "./panels/seller/pages/Dashboard";
// import SellerOrders from "./panels/seller/pages/Orders";
// import SellerProducts from "./panels/seller/pages/Products";
// import SellerAddProduct from "./panels/seller/pages/AddProduct";
//
// // ADMIN panel — Command Console
// import AdminLayout from "./panels/admin/AdminLayout";
// import AdminLogin from "./panels/admin/pages/Login";
// import AdminDashboard from "./panels/admin/pages/Dashboard";
// import AdminSellers from "./panels/admin/pages/Sellers";
// import AdminUsers from "./panels/admin/pages/Users";
//
// // SHIPMENT panel — Transit Board
// import ShipmentLayout from "./panels/shipment/ShipmentLayout";
// import ShipmentLogin from "./panels/shipment/pages/Login";
// import Deliveries from "./panels/shipment/pages/Deliveries";
// import DeliveryDetail from "./panels/shipment/pages/DeliveryDetail";
//
// export default function App() {
//   return (
//     <Routes>
//       {/* ---------- USER (Customer storefront) ---------- */}
//       <Route element={<UserLayout />}>
//         <Route path="/" element={<Home />} />
//         <Route path="/products" element={<ProductListing />} />
//         <Route path="/products/:id" element={<ProductDetail />} />
//         <Route path="/cart" element={<Cart />} />
//         <Route path="/orders" element={<Orders />} />
// {/*         <Route path="/orders/:id" element={<OrderDetail />} /> */}
//         <Route path="/login" element={<UserLogin />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         //   <Route path="/reset-password" element={<ResetPassword />} />
//       </Route>
//
//       {/* ---------- SELLER ---------- */}
//       <Route path="/seller/login" element={<SellerLogin />} />
//       <Route
//         element={
//           <ProtectedRoute allowedRoles={["SELLER", "ADMIN"]} redirectTo="/seller/login">
//             <SellerLayout />
//           </ProtectedRoute>
//         }
//       >
//         <Route path="/seller/dashboard" element={<SellerDashboard />} />
//         <Route path="/seller/orders" element={<SellerOrders />} />
//         <Route path="/seller/products" element={<SellerProducts />} />
//         <Route path="/seller/products/new" element={<SellerAddProduct />} />
//       </Route>
//
//       {/* ---------- ADMIN ---------- */}
//       <Route path="/admin/login" element={<AdminLogin />} />
//       <Route
//         element={
//           <ProtectedRoute allowedRoles={["ADMIN"]} redirectTo="/admin/login">
//             <AdminLayout />
//           </ProtectedRoute>
//         }
//       >
//         <Route path="/admin/dashboard" element={<AdminDashboard />} />
//         <Route path="/admin/sellers" element={<AdminSellers />} />
//         <Route path="/admin/users" element={<AdminUsers />} />
//       </Route>
//
//       {/* ---------- SHIPMENT / DELIVERY ---------- */}
//       <Route path="/shipment/login" element={<ShipmentLogin />} />
//       <Route
//         element={
//           <ProtectedRoute allowedRoles={["DELIVERY_PARTNER", "ADMIN"]} redirectTo="/shipment/login">
//             <ShipmentLayout />
//           </ProtectedRoute>
//         }
//       >
//         <Route path="/shipment/deliveries" element={<Deliveries />} />
//         <Route path="/shipment/deliveries/:id" element={<DeliveryDetail />} />
//       </Route>
//     </Routes>
//   );
// }
// // import { Routes, Route } from "react-router-dom";
// // import ProtectedRoute from "./components/ProtectedRoute";
// //
// // import ForgotPassword from "./panels/user/pages/ForgotPassword";
// // import ResetPassword from "./panels/user/pages/ResetPassword";
// //
// // // USER panel — The Atelier
// // import UserLayout from "./panels/user/UserLayout";
// // import Home from "./panels/user/pages/Home";
// // import ProductListing from "./panels/user/pages/ProductListing";
// // import ProductDetail from "./panels/user/pages/ProductDetail";
// // import Cart from "./panels/user/pages/Cart";
// // import Orders from "./panels/user/pages/Orders";
// // import UserLogin from "./panels/user/pages/Login";
// //
// // // SELLER panel — The Merchant Ledger
// // import SellerLayout from "./panels/seller/SellerLayout";
// // import SellerLogin from "./panels/seller/pages/Login";
// // import SellerDashboard from "./panels/seller/pages/Dashboard";
// // import SellerProducts from "./panels/seller/pages/Products";
// // import SellerAddProduct from "./panels/seller/pages/AddProduct";
// //
// // // ADMIN panel — Command Console
// // import AdminLayout from "./panels/admin/AdminLayout";
// // import AdminLogin from "./panels/admin/pages/Login";
// // import AdminDashboard from "./panels/admin/pages/Dashboard";
// // import AdminSellers from "./panels/admin/pages/Sellers";
// // import AdminUsers from "./panels/admin/pages/Users";
// //
// // // SHIPMENT panel — Transit Board
// // import ShipmentLayout from "./panels/shipment/ShipmentLayout";
// // import ShipmentLogin from "./panels/shipment/pages/Login";
// // import Deliveries from "./panels/shipment/pages/Deliveries";
// // import DeliveryDetail from "./panels/shipment/pages/DeliveryDetail";
// //
// // export default function App() {
// //   return (
// //     <Routes>
// //       {/* ---------- USER (Customer storefront) ---------- */}
// //       <Route element={<UserLayout />}>
// //         <Route path="/" element={<Home />} />
// //         <Route path="/products" element={<ProductListing />} />
// //         <Route path="/products/:id" element={<ProductDetail />} />
// //         <Route path="/cart" element={<Cart />} />
// //         <Route path="/orders" element={<Orders />} />
// //         <Route path="/login" element={<UserLogin />} />
// //
// //   <Route path="/forgot-password" element={<ForgotPassword />} />
// //   <Route path="/reset-password" element={<ResetPassword />} />
// //       </Route>
// //
// //       {/* ---------- SELLER ---------- */}
// //       <Route path="/seller/login" element={<SellerLogin />} />
// //       <Route
// //         element={
// //           <ProtectedRoute allowedRoles={["SELLER", "ADMIN"]} redirectTo="/seller/login">
// //             <SellerLayout />
// //           </ProtectedRoute>
// //         }
// //       >
// //         <Route path="/seller/dashboard" element={<SellerDashboard />} />
// //         <Route path="/seller/products" element={<SellerProducts />} />
// //         <Route path="/seller/products/new" element={<SellerAddProduct />} />
// //       </Route>
// //
// //       {/* ---------- ADMIN ---------- */}
// //       <Route path="/admin/login" element={<AdminLogin />} />
// //       <Route
// //         element={
// //           <ProtectedRoute allowedRoles={["ADMIN"]} redirectTo="/admin/login">
// //             <AdminLayout />
// //           </ProtectedRoute>
// //         }
// //       >
// //         <Route path="/admin/dashboard" element={<AdminDashboard />} />
// //         <Route path="/admin/sellers" element={<AdminSellers />} />
// //         <Route path="/admin/users" element={<AdminUsers />} />
// //       </Route>
// //
// //       {/* ---------- SHIPMENT / DELIVERY ---------- */}
// //       <Route path="/shipment/login" element={<ShipmentLogin />} />
// //       <Route
// //         element={
// //           <ProtectedRoute allowedRoles={["DELIVERY_PARTNER", "ADMIN"]} redirectTo="/shipment/login">
// //             <ShipmentLayout />
// //           </ProtectedRoute>
// //         }
// //       >
// //         <Route path="/shipment/deliveries" element={<Deliveries />} />
// //         <Route path="/shipment/deliveries/:id" element={<DeliveryDetail />} />
// //       </Route>
// //     </Routes>
// //   );
// // }
