import React, { useState, useEffect } from 'react'
import MenuParent from './components/MenuParent';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import FolderIcon from '@mui/icons-material/Folder';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PixIcon from '@mui/icons-material/Pix';
import Person3Icon from '@mui/icons-material/Person3';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import DehazeIcon from '@mui/icons-material/Dehaze';
import Person4Icon from '@mui/icons-material/Person4';
import Marquee from "react-fast-marquee";
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationComponent from '../Notifications';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import ModalLoading from '../../components/ModalLoading';
import notificationApi from '../../api/notificationApi';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import FlagIcon from '@mui/icons-material/Flag';
import WindowIcon from '@mui/icons-material/Window';
import WidgetsIcon from '@mui/icons-material/Widgets';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MenuBook from '@mui/icons-material/MenuBook';
import ManIcon from '@mui/icons-material/Man';
import WarningIcon from '@mui/icons-material/Warning';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import { useDispatch, useSelector } from 'react-redux';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { logoutAccount } from '../../auth/authSlice';
import { unwrapResult } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import DialogChangePassword from './components/DialogChangePassword';
import authApi from '../../api/authApi';
import KeyIcon from '@mui/icons-material/Key';
import LogoutIcon from '@mui/icons-material/Logout';
import './index.css'
import CoPresentIcon from '@mui/icons-material/CoPresent';
import ElevatorIcon from '@mui/icons-material/Elevator';
const Dashboard = ({ user }) => {

  if (!user) {
    return <Navigate to='/login' replace />;
  };

  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [openChangePass, setOpenChangePass] = useState(false);

  //fetch notifications
  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await notificationApi.getNotifications({ thongbao: '' });

        setNotifications(res.data);
      } catch (error) {


      }
    };

    fetchData();
  }, []);

  const handleChangeNotifications = (data) => {
    let items = data.filter(i => i.status === true);
    setNotifications(items)
  };

  const handleLoading = (boolane) => {
    setLoading(boolane)
  };

  const roles = useSelector((state) => state.authReducer.roles_quanlydoanvien);
  const id_user = useSelector((state) => state.authReducer.id_user);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    const action = logoutAccount();
    try {
      const resultAction = await dispatch(action);
      const data = unwrapResult(resultAction);
      Cookies.remove("refreshToken_quanlydoanvien");
      navigate("/login");
      toast.success("Đăng xuất tài khoản thành công.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.log(error);
      toast.error("Lỗi xảy ra khi đăng xuất tài khoản", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleSubmitChangePass = async (values) => {
    const action = logoutAccount();
    try {
      await authApi.changePass({...values, id: id_user});
      const resultAction = await dispatch(action);
      const data = unwrapResult(resultAction);
      Cookies.remove("refreshToken_quanlydoanvien");
      navigate("/login");
      toast.success("Đổi mật khẩu thành công,. Vui lòng đăng nhập lại", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      Cookies.remove("refreshToken_quanlydoanvien");
      navigate("/login");
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleCloseDialogChangePass = () => {
    setOpenChangePass(false)
  }

  return (
    <div>
      {/* menu  */}
      <div data-aos="fade-down-right" data-aos-once="true" className='w-[280px] bg-slate-900 border-r border-t border-white min-h-screen fixed'>
        <div className='flex justify-between bg-slate-800 items-center px-4 py-2'>
          <div className='flex items-center space-x-2'>
            <img src="/cong-an-hieu.png"
              alt="logo" className='w-12' />
            <div className='flex flex-col items-center'>
              <span className='text-white uppercase text-sm'>Công an tỉnh Hưng Yên</span>
              <span className='text-white uppercase text-sm'>PM quản lý đoàn viên</span>
            </div>
          </div>

        </div>
        <ul className='p-2 h-[100vh] overflow-y-scroll no-scrollbar pb-20' data-aos="fade-up-right" data-aos-once="true">
          <li className='rounded-md'>
            {roles.includes("xem phân hệ admin") && (
              <MenuParent groupName="Phân hệ Admin" iconGroup={<ManageAccountsIcon sx={{ color: '#ccc', fontSize: '32px', paddingLeft: "4px" }} />}
                options={[
                  { name: "QL tài khoản và phân quyền", icon: <SupervisorAccountIcon sx={{ color: "white", fontSize: "24px" }} />, link: "/dashboard/tai-khoan" },
                  { name: "QL nhóm quyền", icon: <VpnKeyIcon sx={{ color: "white", fontSize: "24px" }} />, link: "/dashboard/roles" },
                  { name: "QL Slide thông báo", icon: <NotificationsIcon sx={{ color: "white", fontSize: "24px" }} />, link: "/dashboard/notification" },
                  { name: "QL Cấp bậc quân hàm", icon: <MilitaryTechIcon sx={{ color: "white", fontSize: "24px" }} />, link: "/dashboard/bac-ham" },
                  { name: "QL Chức vụ", icon: <LocalActivityIcon sx={{ color: "white", fontSize: "24px" }} />, link: "/dashboard/chuc-vu" },
                  { name: "QL đoàn viên bị xóa mức 1", icon: <VerifiedUserIcon sx={{ color: "white", fontSize: "24px" }} />, link: "/dashboard/delete-doan-vien" },
                  { name: "QL đoàn viên chuyển tỉnh khác", icon: <CoPresentIcon sx={{ color: "white", fontSize: "24px" }} />, link: "/dashboard/doan-vien-chuyen-cong-tac-dia-phuong-khac" },
                ]}
              />
            )}
          </li>
          {roles.includes("xem mô hình tổ chức") && (
            <li className='rounded-md'>
              <MenuParent groupName="Mô hình tổ chức" iconGroup={<FolderIcon sx={{ color: '#ccc', fontSize: '32px', paddingLeft: "4px" }} />}
                options={roles.includes("xem mô hình tổ chức") && [
                  { name: "Khối, hệ, lực lượng", icon: <PixIcon sx={{ color: "white", fontSize: "24px" }} />, link: "/dashboard/khoi" },
                  { name: "Phòng, huyện, TX, TP", icon: <DashboardIcon sx={{ color: "white", fontSize: "24px" }} />, link: "/dashboard/don-vi" },
                  { name: "Đội, xã, phường, thị trấn", icon: <VpnKeyIcon sx={{ color: "white", fontSize: "24px" }} />, link: "/dashboard/doi" },
                  { name: "Chi đoàn, liên chi đoàn", icon: <VerifiedUserIcon sx={{ color: "white", fontSize: "24px" }} />, link: "/dashboard/chi-doan" }
                ]}
              />
            </li>
          )}
          <li className='rounded-md'>
            <MenuParent groupName="Quản lý đoàn viên" iconGroup={<Person3Icon sx={{ color: '#ccc', fontSize: '32px', paddingLeft: "4px" }} />}
              options={roles.includes("thêm đoàn viên") ? (
                [ 
                  { name: "Thêm mới đoàn viên", icon: <PersonAddIcon sx={{ color: "white", fontSize: "24px" }} />, link: "/dashboard/them-moi-doan-vien" },
                  { name: "Quản trị đoàn viên", icon: <RecentActorsIcon sx={{ color: "white", fontSize: "24px" }} />, link: "/dashboard/quan-tri-doan-vien" },
                ]
              ) : (
                [ 
                  { name: "Quản trị đoàn viên", icon: <RecentActorsIcon sx={{ color: "white", fontSize: "24px" }} />, link: "/dashboard/quan-tri-doan-vien" },
                ]
              )
            }
            />
          </li>
          <li className='rounded-md'>
            <MenuParent groupName="Phân hệ khen thưởng" iconGroup={<WidgetsIcon sx={{ color: '#ccc', fontSize: '32px', paddingLeft: "4px" }} />}
              options={[
                { name: "Khen thưởng tập thể", icon: <MenuBook sx={{ color: "white", fontSize: "24px" }} />, link: "/dashboard/khen-thuong-tap-the" },
                { name: "khen thưởng cá nhân", icon: <ManIcon sx={{ color: "white", fontSize: "24px" }} />, link: "/dashboard/khen-thuong-ca-nhan" },
                { name: "Kỉ luật cá nhân", icon: <WarningIcon sx={{ color: "white", fontSize: "24px" }} />, link: "/dashboard/ki-luat-ca-nhan" },
              ]}
            />
          </li>
          <li className='rounded-md'>
            <MenuParent groupName="Theo dõi thi đua" iconGroup={<FlagIcon sx={{ color: '#ccc', fontSize: '32px', paddingLeft: "4px" }} />}
              options={[
                { name: "Thi đua tháng", icon: <FlagIcon sx={{ color: "white", fontSize: "24px" }} />, link: "/dashboard/thi-dua-thang" },
                { name: "Xếp loại đoàn viên năm", icon: <WindowIcon sx={{ color: "white", fontSize: "24px" }} />, link: "/dashboard/thi-dua-nam" },
              ]}
            />
          </li>
          <li className='rounded-md'>
            <MenuParent groupName="Thống kê, báo cáo" iconGroup={<LeaderboardIcon sx={{ color: '#ccc', fontSize: '32px', paddingLeft: "4px" }} />}
              options={[
                { name: "Khen thưởng", icon: <BarChartIcon sx={{ color: "white", fontSize: "24px" }} />, link: "/dashboard/bao-cao/khen-thuong" },
                { name: "Kỉ luật", icon: <BarChartIcon sx={{ color: "white", fontSize: "24px" }} />, link: "/dashboard/bao-cao/ki-luat" },
                { name: "Thi đua tháng", icon: <BarChartIcon sx={{ color: "white", fontSize: "24px" }} />, link: "/dashboard/bao-cao/thi-dua-thang" },
                { name: "Xếp loại đoàn viên năm", icon: <DonutSmallIcon sx={{ color: "white", fontSize: "24px" }} />, link: "/dashboard/bao-cao/thi-dua-nam" },
                { name: "Đoàn viên trưởng thành đoàn", icon: <ElevatorIcon sx={{ color: "white", fontSize: "24px" }} />, link: "/dashboard/bao-cao/truong-thanh-doan" },
              ]}
            />
          </li>
        </ul>
      </div>
      {/* end menu  */}

      <div className='ml-[286px] relative'>
        <div className='flex justify-between absolute z-10 top-0 right-0 left-0 bg-slate-800 h-[60px] items-center px-4 space-x-2'>

          <div>
            <DehazeIcon sx={{ fontSize: "32px", color: "#ccc" }} />
          </div>

          <div className='w-0 md:w-[250px] lg:w-[600px] xl:w-[800px] bg-slate-800 flex items-center py-2 rounded-md'>
            {notifications.length > 0 && (
              <Marquee pauseOnHover={true} speed={100}>
                {notifications.map(notification => (
                  <span key={notification._id} className='ml-[400px] text-lg text-yellow-600 font-extrabold hover:cursor-default font-arial uppercase'>{notification.thongbao}</span>
                ))}
              </Marquee>
            )}
          </div>

          <div className='flex space-x-3 items-center hover:cursor-pointer'
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}>
            <div className='bg-slate-600 w-10 h-10 justify-center items-center flex rounded-full'>
              <Person4Icon sx={{ fontSize: "28px", color: "#fff" }} />
            </div>
            <span className='text-white'>Hello, <span className='text-lg'>{user}</span></span>
          </div>

        </div>

        <ModalLoading open={loading} />
        {/* main right */}
        <div className='pt-[68px]' data-aos="fade-left" data-aos-once="true">
          <Outlet context={[handleChangeNotifications, handleLoading]} />
          
          <div className='bg-slate-300 mx-2 text-center py-6 mb-4 mt-4'>
            <div className='flex justify-center'>
              <img src="/conganhieu.png" alt="logo" className='w-28' />
            </div>
            <h4 className='uppercase text-black font-semibold text-efect'>Công trình thanh niên - ứng dụng chuyển đổi số vào công tác quản lý đoàn viên trong công an nhân dân</h4>
            <p>Thiết kế hệ thống phần mềm: <span className='font-bold italic'>Vũ Văn Tính</span></p>
            <p>Số điện thoại liên hệ: <span className='font-bold underline underline-offset-1'>0976.534.506</span></p>
          </div>

        </div>
      </div>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => {
          setOpenChangePass(true)
          handleClose()
        }}> <KeyIcon style={{marginRight: "8px"}}/> Đổi mật khẩu</MenuItem>
        <MenuItem onClick={handleLogout}><LogoutIcon style={{marginRight: "8px"}}/> Đăng xuất tài khoản</MenuItem>
      </Menu>

      <DialogChangePassword
        open={openChangePass}
        onSubmit={handleSubmitChangePass}
        onCloseDialogChangePass={handleCloseDialogChangePass}
      />
    </div>
  )
}

export default Dashboard
