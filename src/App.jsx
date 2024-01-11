import React, { Suspense, lazy, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import LoadingComponent from "./components/LoadingComponent";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";
import NotFound from "./components/NotFound";
import Chuyentrang from "./components/Chuyentrang.jsx";

const Login = lazy(() => import("./features/Login"));
const Dashboard = lazy(() => import("./features/Dashboard"));
const NotificationComponent = lazy(() => import("./features/Notifications"));
const Roles = lazy(() => import("./features/Roles"));
const Capbacs = lazy(() => import("./features/Capbac"));
const Chucvus = lazy(() => import("./features/Chucvu"));
const Accounts = lazy(() => import("./features/Account"));
const KhoiComponent = lazy(() => import("./features/Khoi"));
const Donvis = lazy(() => import("./features/Donvi"));
const Conganxas = lazy(() => import("./features/Conganxa"));
const Chidoans = lazy(() => import("./features/Chidoan"));
const Quanlycanbos = lazy(() => import("./features/Canbo/pages/Quanlycanbo"));
const Quantridoanvien = lazy(() => import("./features/Canbo/pages/Quantridoanvien"));
const Khentapthe = lazy(() => import("./features/Khenthuong/pages/Khentapthe"));
const Khencanhan = lazy(() => import("./features/Khenthuong/pages/KhenCanhan"));
const KiluatCanhan = lazy(() => import("./features/Khenthuong/pages/KiluatCanhan"));
const Thiduathang = lazy(() => import("./features/Thidua/pages/Thiduathang"));
const Thiduanam = lazy(() => import("./features/Thidua/pages/Thiduanam"));
const KhenthuongThongke= lazy(() => import("./features/Thongke/pages/KhenthuongThongke"));
const KiluatThongke= lazy(() => import("./features/Thongke/pages/KiluatThongke"));
const ThiduathangThongke= lazy(() => import("./features/Thongke/pages/ThiduathangThongke"));
const ThiduanamThongke= lazy(() => import("./features/Thongke/pages/ThiduanamThongke"));
const TruongthanhdoanThongke= lazy(() => import("./features/Thongke/pages/TruongthanhdoanThongke"));
const DoanvienDelete= lazy(() => import("./features/Canbo/pages/DoanvienDelete"));
const TrangCanhan= lazy(() => import("./features/TrangCanhan.jsx"));
const DoanvienNgoaitinh = lazy(() => import("./features/Doanvienchuyenngoaitinh/index.jsx"));

function App() {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  const user= useSelector((state) => state.authReducer);

  return (
    <Suspense fallback={<Chuyentrang />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/" element={<Dashboard user={user.user}/>}>
          <Route path="notification" element={<NotificationComponent />} />
          <Route path="roles" element={<Roles />} />
          <Route path="bac-ham" element={<Capbacs />} />
          <Route path="chuc-vu" element={<Chucvus />} />
          <Route path="tai-khoan" element={<Accounts />} />
          <Route path="khoi" element={<KhoiComponent />} />
          <Route path="don-vi" element={<Donvis />} />
          <Route path="doi" element={<Conganxas />} />
          <Route path="chi-doan" element={<Chidoans />} />
          <Route path="them-moi-doan-vien" element={<Quanlycanbos />} />
          <Route path="quan-tri-doan-vien" element={<Quantridoanvien />} />
          <Route path="khen-thuong-tap-the" element={<Khentapthe />} />
          <Route path="khen-thuong-ca-nhan" element={<Khencanhan />} />
          <Route path="ki-luat-ca-nhan" element={<KiluatCanhan />} />
          <Route path="thi-dua-thang" element={<Thiduathang />} />
          <Route path="thi-dua-nam" element={<Thiduanam />} />
          <Route path="bao-cao/khen-thuong" element={<KhenthuongThongke />} />
          <Route path="bao-cao/ki-luat" element={<KiluatThongke />} />
          <Route path="bao-cao/thi-dua-thang" element={<ThiduathangThongke />} />
          <Route path="bao-cao/thi-dua-nam" element={<ThiduanamThongke />} />
          <Route path="bao-cao/truong-thanh-doan" element={<TruongthanhdoanThongke />} />
          <Route path="delete-doan-vien" element={<DoanvienDelete />} />
          <Route path="thong-tin-doan-vien/:doanvienId" element={<TrangCanhan />} />
          <Route path="doan-vien-chuyen-cong-tac-dia-phuong-khac" element={<DoanvienNgoaitinh />} />
        </Route>
        <Route path='*' element={<NotFound/>} />
      </Routes>
      <ToastContainer style={{width:'450px'}} />
    </Suspense>
  )
}

export default App
