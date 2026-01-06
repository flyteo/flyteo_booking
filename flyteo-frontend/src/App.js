import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import HotelsList from "./pages/HotelsList";
import HotelDetails from "./pages/HotelDetails";
import CampingDetails from "./pages/CampingDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Booking from "./pages/Booking";
import MyBooking from "./pages/MyBooking";
import Payment from "./pages/Payment";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import ManageHotels from "./admin/ManageHotels";
import ManageCamping from "./admin/ManageCamping";
import AddHotel from "./admin/AddHotel";
import EditHotel from "./admin/EditHotel";
import AddCamping from "./admin/AddCamping";
import EditCamping from "./admin/EditCamping";
import AdminCharts from "./admin/AdminCharts";
import ProtectedAdminRoute from "./admin/ProtectedAdminRoute";
import ProtectedHotelAdminRoute from "./hotelAdmin/ProtectedHotelAdminRoute";
import HotelAdminDashboard from "./hotelAdmin/HotelAdminDashboard";
import HotelAdminRooms from "./hotelAdmin/HotelAdminRooms";
import AdminCoupons from "./admin/AdminCoupons";
import AdminOffers from "./admin/AdminOffers";
import AdminBookings from "./admin/AdminBookings";
import TermsConditions from "./pages/TermsCondition";
import CancellationPolicy from "./pages/CancellationPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AddVilla from "./admin/AddVilla";
import EditVilla from "./admin/EditVilla";
import ManageVilla from "./admin/ManageVilla";
import VillaDetails from "./pages/VillaDetails";
import VillaList from "./pages/VillaList";
import CampingList from "./pages/CampingList";
import SearchedHotels from "./pages/SearchedHotels";
import MobileLayout from "./layouts/MobileLayout";
import DeskTopLayout from "./layouts/DeskTopLayout";
import OfferList from "./pages/OfferList";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import ComingSoon from "./pages/ComingSoon";

function App() {
  return (
    <div className="bg-sand min-h-screen">
     

      <div className="">
        <Routes>
          <Route element={<MobileLayout/>}>
          <Route element={<DeskTopLayout/>}>
         
          <Route path="/" element={<Home />} />
          <Route path="/hotels" element={<HotelsList />} />
           <Route path="/villas" element={<VillaList />} />
           <Route path="/campings" element={<CampingList />} />
           <Route path="/offers" element={<OfferList />} />
          <Route path="/hotels/:id" element={<HotelDetails />} />
          <Route path="/villas/:id" element={<VillaDetails />} />
          <Route path="/campings/:id" element={<CampingDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/comingsoon" element ={<ComingSoon/>}/>
          {/* <Route path="/register" element={<Register />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/my-bookings" element={<MyBooking />} />
          <Route path="/payment" element={<Payment />} /> */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/aboutus" element={<AboutUs/>}/>
          <Route path="/search" element={<SearchedHotels/>}/>
          <Route path="/terms-condition" element={<TermsConditions />} />
 <Route path="/cancellation-policy" element={<CancellationPolicy />} />
 <Route path="/privacy-policy" element={<PrivacyPolicy />} />
         
          <Route
  path="/hotel-admin/dashboard"
  element={
    <ProtectedHotelAdminRoute>
      <HotelAdminDashboard />
    </ProtectedHotelAdminRoute>
  }
/>
<Route
  path="/hotel-admin/rooms"
  element={
    <ProtectedHotelAdminRoute>
      <HotelAdminRooms />
    </ProtectedHotelAdminRoute>
  }
/>
<Route
  path="/admin/dashboard"
  element={
    <ProtectedAdminRoute>
      <AdminDashboard />
    </ProtectedAdminRoute>
  }
/>
<Route path="/admin/hotels" element={
  <ProtectedAdminRoute> 
    <ManageHotels />
  </ProtectedAdminRoute>
 } />
 <Route path="/admin/villas" element={
  <ProtectedAdminRoute> 
    <ManageVilla />
  </ProtectedAdminRoute>
 } />
<Route path="/admin/camping" element={
  <ProtectedAdminRoute>
  <ManageCamping />
  </ProtectedAdminRoute>
  } />
  <Route path="/admin/bookings" element={
  <ProtectedAdminRoute>
  <AdminBookings />
  </ProtectedAdminRoute>
  } />
<Route path="/admin/hotels/add" element={
  <ProtectedAdminRoute>
  <AddHotel />
  </ProtectedAdminRoute>} />
<Route path="/admin/hotels/edit/:id" element={
  <ProtectedAdminRoute>
  <EditHotel />
  </ProtectedAdminRoute>} />
  <Route path="/admin/villas/add" element={
  <ProtectedAdminRoute>
  <AddVilla />
  </ProtectedAdminRoute>} />
<Route path="/admin/villas/edit/:id" element={
  <ProtectedAdminRoute>
  <EditVilla />
  </ProtectedAdminRoute>} />
<Route path="/admin/camping/add" element={
  <ProtectedAdminRoute>
  <AddCamping />
  </ProtectedAdminRoute>} />
<Route path="/admin/campings/edit/:id" element={
  <ProtectedAdminRoute>
  <EditCamping />
  </ProtectedAdminRoute>} />
<Route path="/admin/charts" element={
  <ProtectedAdminRoute>
  <AdminCharts />
  </ProtectedAdminRoute>} />
  <Route path="/admin/coupons" element={
  <ProtectedAdminRoute> 
    <AdminCoupons />
  </ProtectedAdminRoute>
 } />
 <Route path="/admin/offers" element={
  <ProtectedAdminRoute> 
    <AdminOffers />
  </ProtectedAdminRoute>
 } />

  </Route>
          </Route>
 
        </Routes>
      </div>
    </div>
  );
}

export default App;
