import React, { useMemo, useState, useEffect } from 'react'
import GridViewIcon from '@mui/icons-material/GridView';
import { useOutletContext, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import TableKhenthuong from './components/TableKhenthuong';
import TableKiluat from './components/TableKiluat';
import TableThidua from './components/TableThiduanam';
import canboApi from '../../api/canboApi';
import dayjs from 'dayjs';
import StepComponent from './components/StepComponent';
import "./index.css"

const TrangCanhan = () => {
    const [handleChangeNotifications, handleLoading] = useOutletContext();
    let { doanvienId } = useParams();

    const [doanvien, setDoanvien] = useState(null);
    const [khenthuongs, setKhenthuongs] = useState([]);
    const [kiluats, setKiluats] = useState([]);
    const [thiduas, setThiduas] = useState([]);
    const [quatrinhcongtacs, setQuatrinhcongtacs] = useState([]);
    const [quatrinhbachams, setQuatrinhBachams] = useState([]);
    const [quatrinhchucvus, setQuatrinhchucvus] = useState([]);
    //fetch notifications
    useEffect(() => {
        const fetchData = async () => {
            try {
                handleLoading(true)
                let res = await canboApi.detailDoanvien(doanvienId);
                handleLoading(false)
                setDoanvien(res.data.doanvien[0]);
                setKhenthuongs(res.data.khenthuongs);
                setQuatrinhBachams(res.data.quatrinhlenham.map(i => ({
                    date: dayjs(i.tungay).format('DD/MM/YYYY'),
                    label: i.bacham.bacham,
                    ghichu: i.ghichu
                })))
                setQuatrinhcongtacs(res.data.quatrinhcongtac.map(i => ({
                    date: dayjs(i.tungay).format('DD/MM/YYYY'),
                    label: i.donvi.tendonvi,
                    ghichu: i.ghichu
                })))
                setQuatrinhchucvus(res.data.quatrinhchucvu.map(i => ({
                    date: dayjs(i.tungay).format('DD/MM/YYYY'),
                    label: i.chucvu.chucvu,
                    ghichu: i.ghichu
                })))
                setKiluats(res.data.kiluats);
                setThiduas(res.data.thiduas);
            } catch (error) {
                console.log(error.message)
            }
        };

        fetchData();
    }, [doanvienId]);

    const roles = useSelector((state) => state.authReducer.roles_quanlydoanvien);

    return (
        <div className='pr-2' data-aos="fade-left" data-aos-once="true">
            <div className='flex items-center space-x-1'>
                <GridViewIcon color='primary' fontSize="large" />
                <h4 className='font-bold text-gray-800 text-lg'>Trang thông tin cá nhân</h4>
            </div>

            <ul className='p-4 flex flex-col md:flex-row md:flex-wrap shadow-lg'>
                <li className='md:basis-1/3 my-1 flex justify-between pr-8 border-r-slate-100'><span className='font-semibold'>Họ tên:</span> <span className='font-[500] text-orange-500'>{doanvien?.hoten}</span></li>
                <li className='md:basis-1/3 my-1 flex justify-between pr-8 border-r-slate-100'><span className='font-semibold'>Ngày sinh:</span> <span className='font-[500] text-orange-500'>{dayjs(doanvien?.ngaysinh).format('DD/MM/YYYY')}</span></li>
                <li className='md:basis-1/3 my-1 flex justify-between pr-8 border-r-slate-100'><span className='font-semibold'>Số hiệu CAND:</span> <span className='font-[500] text-orange-500'>{doanvien?.sohieuCAND}</span></li>
                <li className='md:basis-1/3 my-1 flex justify-between pr-8 border-r-slate-100'><span className='font-semibold'>Quê quán:</span> <span className='font-[500] text-orange-500'>{doanvien?.quequan}</span></li>
                <li className='md:basis-1/3 my-1 flex justify-between pr-8 border-r-slate-100'><span className='font-semibold'>Số CCCD:</span> <span className='font-[500] text-orange-500'>{doanvien?.CCCD}</span></li>
                <li className='md:basis-1/3 my-1 flex justify-between pr-8 border-r-slate-100'><span className='font-semibold'>Đảng viên:</span> <span className='font-[500] text-orange-500'>{doanvien?.dangvien === true ? "Là đảng viên" : "Chưa kết nạp đảng"}</span></li>
                <li className='md:basis-1/3 my-1 flex justify-between pr-8 border-r-slate-100'><span className='font-semibold'>Bậc hàm:</span> <span className='font-[500] text-orange-500'>{doanvien?.bachamPopulate[0].bacham}</span></li>
                <li className='md:basis-1/3 my-1 flex justify-between pr-8 border-r-slate-100'><span className='font-semibold'>Chức vụ:</span> <span className='font-[500] text-orange-500'>{doanvien?.chucvuPopulate[0].chucvu}</span></li>
                <li className='md:basis-1/3 my-1 flex justify-between pr-8 border-r-slate-100'><span className='font-semibold'>Đơn vị công tác:</span> <span className='font-[500] text-orange-500'>{doanvien?.chuyencongtacngoaitinh === true ? doanvien?.donvidiaphuongkhac[0].tendonvi : doanvien?.donviPopulate[0].tendonvi}</span></li>
                <li className='md:basis-1/3 my-1 flex justify-between pr-8 border-r-slate-100'><span className='font-semibold'>Trình độ:</span> <span className='font-[500] text-orange-500'>{doanvien?.trinhdo}</span></li>
                <li className='md:basis-1/3 my-1 flex justify-between pr-8 border-r-slate-100'><span className='font-semibold'>Lý luận chính trị:</span> <span className='font-[500] text-orange-500'>{doanvien?.lyluanchinhtri}</span></li>
                <li className='md:basis-1/3 my-1 flex justify-between pr-8 border-r-slate-100'><span className='font-semibold'>Trưởng thành đoàn:</span> <span className='font-[500] text-orange-500'>{doanvien?.truongthanhdoan === true ? "Đã trưởng thành đoàn" : "Chưa"}</span></li>
                {doanvien?.truongthanhdoan === true && <li className='md:basis-1/3 my-1 flex justify-between pr-8 border-r-slate-100'><span className='font-semibold'>Ngày trưởng thành đoàn:</span> <span className='font-[500] text-orange-500'>{doanvien?.truongthanhdoan === true && dayjs(doanvien?.ngaytruongthanhdoan).format('DD/MM/YYYY')}</span></li>}
            </ul>

            <div className='mt-8'></div>
            <StepComponent array={quatrinhbachams} />
            <StepComponent array={quatrinhchucvus} />
            <StepComponent array={quatrinhcongtacs} />

            {khenthuongs.length > 0 && (
                <div className='px-4 my-8' data-aos="fade-left" data-aos-once="true">
                    <h4 className='my-2 text-center font-medium text-lg'>Danh sách khen thưởng cá nhân</h4>
                    <TableKhenthuong list={khenthuongs} />
                </div>
            )}

            {kiluats.length > 0 && (
                <div className='px-4 my-8' data-aos="fade-left" data-aos-once="true">
                    <h4 className='my-2 text-center font-medium text-lg'>Danh sách kết quả kỉ luật</h4>
                    <TableKiluat list={kiluats} />
                </div>
            )}
            {thiduas.length > 0 && (

                <div className='px-4 my-8' data-aos="fade-left" data-aos-once="true">
                    <h4 className='my-2 text-center font-medium text-lg'>Bảng theo dõi thi đua qua các năm</h4>
                    <TableThidua list={thiduas} />
                </div>
            )}


        </div>
    )
}

export default TrangCanhan
