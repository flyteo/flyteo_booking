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
import FloatingWhatsApp from "./components/FloatingWhatsapp";
import HotelAdminBookings from "./hotelAdmin/HotelAdminBookings";
import VillaAdminDashboard from "./villaAdmin/VillaAdminDashboard";
import VillaAdminBookings from "./villaAdmin/VillaAdminBookings";
import VillaAvailabilityCalendar from "./villaAdmin/VillaAvailabilityCalendar";
import ProtectedVillaAdminRoute from "./villaAdmin/ProtectedVillaAdminRoute";
import AdminVillaAvailability from "./admin/AdminVillaAvailability";
import AdminRoomAvailability from "./admin/AdminRoomAvailability";
import AdminCampingAvailability from "./admin/AdminCampingAvailability";
import ProtectedRoute from "./context/ProtectedRoute";
import RoleRedirect from "./RoleRedirect";

function App() {
  return (
    <div className="bg-sand min-h-screen">
     

      <div className="">
        <Routes>
          <Route element={<MobileLayout/>}>
          <Route element={<DeskTopLayout/>}>
         <Route path="/" element={<RoleRedirect />} />
          <Route path="/home" element={<Home />} />
          <Route path="/hotels" element={<HotelsList />} />
           <Route path="/villas" element={<VillaList />} />
           <Route path="/campings" element={<CampingList />} />
           <Route path="/offers" element={<OfferList />} />
          <Route path="/hotels/:id" element={<HotelDetails />} />
          <Route path="/villas/:id" element={<VillaDetails />} />
          <Route path="/campings/:id" element={<CampingDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/comingsoon" element ={<ComingSoon/>}/>
          <Route path="/register" element={<Register />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/my-bookings" element={<MyBooking />} />
          <Route path="/payment-success" element={<Payment />} />
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
    <ProtectedRoute role="hotel-admin">
      <HotelAdminDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/hotel-admin/rooms"
  element={
    <ProtectedRoute role="hotel-admin">
      <HotelAdminRooms />
    </ProtectedRoute>
  }
/>
<Route
  path="/hotel-admin/check-in"
  element={
    <ProtectedRoute role="hotel-admin">
      <HotelAdminBookings />
    </ProtectedRoute>
  }
/>
<Route path="/villa-admin/dashboard"
       element={
        <ProtectedRoute role="villa-admin">
          <VillaAdminDashboard />
        </ProtectedRoute>
       } 
/>
<Route path="/villa-admin/bookings" 
      element={
        <ProtectedRoute role="villa-admin">
          <VillaAdminBookings/>
          </ProtectedRoute>
      }/>
<Route path="/villa-admin/calendar" 
      element={
        <ProtectedRoute role="villa-admin">
          <VillaAvailabilityCalendar/>
          </ProtectedRoute>
      }/>
<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute role="admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
<Route path="/admin/hotels" element={
  <ProtectedRoute role="admin"> 
    <ManageHotels />
  </ProtectedRoute>
 } />
 <Route path="/admin/villas" element={
  <ProtectedRoute role="admin"> 
    <ManageVilla />
  </ProtectedRoute>
 } />
<Route path="/admin/camping" element={
  <ProtectedRoute role="admin">
  <ManageCamping />
  </ProtectedRoute>
  } />
  <Route path="/admin/bookings" element={
  <ProtectedRoute role="admin">
  <AdminBookings />
  </ProtectedRoute>
  } />
<Route path="/admin/hotels/add" element={
  <ProtectedRoute role="admin">
  <AddHotel />
  </ProtectedRoute>} />
<Route path="/admin/hotels/edit/:id" element={
  <ProtectedRoute role="admin">
  <EditHotel />
  </ProtectedRoute>} />
  <Route path="/admin/villas/add" element={
  <ProtectedRoute role="admin">
  <AddVilla />
  </ProtectedRoute>} />
<Route path="/admin/villas/edit/:id" element={
  <ProtectedRoute role="admin">
  <EditVilla />
  </ProtectedRoute>} />
<Route path="/admin/camping/add" element={
  <ProtectedRoute role="admin">
  <AddCamping />
  </ProtectedRoute>} />
<Route path="/admin/campings/edit/:id" element={
  <ProtectedRoute role="admin">
  <EditCamping />
  </ProtectedRoute>} />
<Route path="/admin/charts" element={
  <ProtectedRoute role="admin">
  <AdminCharts />
  </ProtectedRoute>} />
  <Route path="/admin/coupons" element={
  <ProtectedRoute role="admin"> 
    <AdminCoupons />
  </ProtectedRoute>
 } />
 <Route path="/admin/offers" element={
  <ProtectedRoute role="admin"> 
    <AdminOffers />
  </ProtectedRoute>
 } />
 <Route path="/admin/room-availability" element={
  <ProtectedRoute role="admin"> 
    <AdminRoomAvailability />
  </ProtectedRoute>
 } />
 <Route path="/admin/villa-availability" element={
  <ProtectedRoute role="admin"> 
    <AdminVillaAvailability />
  </ProtectedRoute>
 } />
 <Route path="/admin/camping-availability" element={
  <ProtectedRoute role="admin"> 
    <AdminCampingAvailability />
  </ProtectedRoute>    
 }/>

  </Route>
          </Route>
         
        </Routes>
        <FloatingWhatsApp/>
      </div>
    
    </div>
  );
}

export default App;
