import React, { useMemo, useState, useEffect } from 'react'
import GridView from '@mui/icons-material/GridView'
import chidoanApi from '../../../api/chidoanApi';
import SearchIcon from '@mui/icons-material/Search';
import { Button, IconButton, Paper } from '@mui/material';
import Switch from '@mui/material/Switch';
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form"
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useOutletContext, useSearchParams, useNavigate } from "react-router-dom";
import querystring from "query-string";
import khenthuongApi from '../../../api/khenthuongApi';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { CSVLink } from "react-csv";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import thongkeApi from '../../../api/thongkeApi';
import TableKhenthuongThongke from '../components/TableKhenthuongThongke';
import TableChitietTapthe from '../components/TableChitietTapthe';
import TableChitietCanhan from '../components/TableChitietCanhan';

let headers = [
  { label: "STT", key: "stt" },
  { label: "Số quyết định", key: "soQD" },
  { label: "Hình thức", key: "hinhthuc" },
  { label: "Cấp khen", key: "capkhen" },
  { label: "Người ký", key: "nguoiky" },
  { label: "Tập thể, cá nhân được khen", key: "nhomchidoanduockhenthuong" },
  { label: "Ngày ký", key: "ngayky" },
  { label: "Nội dung khen", key: "noidung" }
];

const KhenthuongThongke = () => {
  const [khenthuongs, setKhenthuongs] = useState([]);
  const [chidoans, setChidoans] = useState([]);
  const [display, setDisplay] = useState(false);
  const [chidoansOption, setChidoansOption] = useState([])
  let [excelExport, setExcelExport] = useState([]);
  const [handleChangeNotifications, handleLoading] = useOutletContext();
  const [khenTapthes, setKhenTapthes] = useState([]);
  const [khenCanhans, setKhenCanhans] = useState([]);
  const [luotkhenTapthes, setLuotKhenTapthes] = useState([]);
  const [luotkhenCanhans, setLuotKhenCanhans] = useState([]);
  const [display1, setDisplay1] = useState(false)
  const [display2, setDisplay2] = useState(false)

  // get danh sách chi đoàn thuộc quyền quản lý của tài khoản
  useEffect(() => {
    const getData = async () => {
      try {
        let res = await chidoanApi.getChidoanOfUser();
        setChidoans(res.data.map(i => ({
          label: i.tenchidoan,
          value: i._id
        })));
        setChidoansOption([{ label: "Tất cả", value: "" }].concat(res.data.map(i => ({ value: i._id, label: i.tenchidoan }))))
      } catch (error) {
        console.log(error.message)
      }
    };

    getData();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    resetField,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      hinhthuc: { label: "Tất cả", value: "" },
      capkhen: { label: "Tất cả", value: "" },
      nhomchidoanduockhenthuong: { label: "Tất cả", value: "" },
      tungay: "",
      denngay: "",
      soQD: "",
      noidung: "",
      nguoiky: "",
      theloai: { label: "Tất cả", value: "" }
    },
  });
  // handle submit search
  const handleFormSearchSubmit = async (values) => {
    let params = {
      ...values, hinhthuc: values.hinhthuc.value,
      capkhen: values.capkhen.value, theloai: values.theloai.value,
      nhomchidoanduockhenthuong: values.nhomchidoanduockhenthuong.value
    };

    handleLoading(true);
    let res = await thongkeApi.getKhenkhenthuongs(params);
    
    setKhenthuongs(res.data.data);
    setExcelExport(res.data.data.map((i, index)=>({
      stt: index + 1,
      soQD: i.soQD,
      ngayky: i.ngayky,
      noidung: i.noidung,
      nguoiky: i.nguoiky,
      hinhthuc: i.hinhthuc,
      capkhen: i.capkhen,
      nhomchidoanduockhenthuong: i.theloai === "Cá nhân" ? i.canhanduockhenthuong.hoten: (i.nhomchidoanduockhenthuong.map(e=> e.tenchidoan)).toString(),
    })));

    setKhenTapthes(res.data.taptheduockhen);
    setKhenCanhans(res.data.canhanduockhen);

    let count = 0;
    res.data.taptheduockhen.forEach(i => count+=i.soluotduockhen);
    setLuotKhenTapthes(count);

    let count_1 = 0;
    res.data.canhanduockhen.forEach(i => count_1+=i.soluotduockhen);
    setLuotKhenCanhans(count_1)

    handleLoading(false);
    toast.success(res.data.message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        handleLoading(true);
        let res = await thongkeApi.getKhenkhenthuongs(
          {
            tungay: "", denngay: "", nhomchidoanduockhenthuong: "",
            hinhthuc: "", capkhen: "", soQD: "", nguoiky: "", noidung: "", theloai: ""
          });
        setKhenthuongs(res.data.data);
        setExcelExport(res.data.data.map((i, index)=>({
          stt: index + 1,
          soQD: i.soQD,
          ngayky: i.ngayky,
          noidung: i.noidung,
          nguoiky: i.nguoiky,
          hinhthuc: i.hinhthuc,
          capkhen: i.capkhen,
          nhomchidoanduockhenthuong: i.theloai === "Cá nhân" ? i.canhanduockhenthuong.hoten: (i.nhomchidoanduockhenthuong.map(e=> e.tenchidoan)).toString(),
        })));

        setKhenTapthes(res.data.taptheduockhen);
        setKhenCanhans(res.data.canhanduockhen);
        let count = 0;
        res.data.taptheduockhen.forEach(i => count+=i.soluotduockhen);
        setLuotKhenTapthes(count);

        let count_1 = 0;
        res.data.canhanduockhen.forEach(i => count_1+=i.soluotduockhen);
        setLuotKhenCanhans(count_1)
    
        setTimeout(() => {
          handleLoading(false);
        }, 400);
      } catch (error) {
        console.log(error.message)
      }
    };

    fetchData();
  }, []);

  return (
    <div className='pr-2' data-aos="fade-left" data-aos-once="true">
      <div className='flex items-center space-x-1'>
        <GridView color='primary' fontSize="large" />
        <h4 className='font-bold text-gray-800 text-lg'>Quản lý khen thưởng đối với tập thể chi đoàn, liên chi đoàn</h4>
      </div>

      <div className='mt-4 text-end md:space-x-2 space-y-2 md:space-y-0 md:block flex flex-col items-center'>
        <Button sx={{ width: "300px", backgroundColor: "darkgray" }} onClick={() => setDisplay(true)} color="info" variant='contained'><SearchIcon /> Chức năng tìm kiếm nâng cao</Button>
        <IconButton>
          <CSVLink data={excelExport} headers={headers} filename={`danhsachkhenthuong_${watch('tungay')}_${watch('denngay')}`}>
            <div className='flex items-center shadow-md space-x-2 bg-green-300 px-2 py-1 rounded-md'>
              <FileDownloadIcon />
              <span className='text-sm text-green-800'>Xuất file excel</span>
            </div>
          </CSVLink>
        </IconButton>
      </div>


      {/* form tìm kiếm  */}
      {display && (
        <form onSubmit={handleSubmit(handleFormSearchSubmit)} className='my-2 mt-4 mx-8 bg-slate-100 p-4 rounded-lg shadow-xl' data-aos="zoom-in-down" data-aos-once="true">
          <div className='flex justify-between'>
            <h5 className='text-[18px] font-semibold'>Tìm kiếm nâng cao</h5>
            <IconButton onClick={() => setDisplay(false)} sx={{ backgroundColor: "#333" }}>
              <CloseIcon sx={{ color: 'white' }} />
            </IconButton>
          </div>
          <div className='flex flex-wrap xl:flex-row flex-col flex-1 p-2'>
            <div className='flex-col md:basis-1/3 flex flex-1 px-1'>
              <label className='underline font-semibold'>Số QĐ khen thưởng: </label>
              <input {...register("soQD")} type="text" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                    focus:ring-2 focus:border-blue-400'/>
            </div>
            <div className='flex-col md:basis-1/6 flex flex-1 px-1'>
              <label className='underline font-semibold'>Từ ngày: </label>
              <input {...register("tungay")} type="date" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400'/>
            </div>
            <div className='flex-col md:basis-1/6 flex flex-1 px-1'>
              <label className='underline font-semibold'>Đến ngày: </label>
              <input {...register("denngay")} type="date" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400'/>
            </div>
            <div className='flex-col md:basis-1/3 flex flex-1 px-1'>
              <label className='underline font-semibold'>Người ký: </label>
              <input {...register("nguoiky")} type="text" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400'/>
            </div>
            <div className='flex-col md:basis-full flex flex-1 px-1'>
              <label className='underline font-semibold'>Nội dung khen thưởng: </label>
              <input {...register("noidung")} type="text" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400'/>
            </div>
            <div className='flex-col md:basis-1/3 flex flex-1 px-1'>
              <label className='underline font-semibold'>Hình thức khen: </label>
              <Controller
                control={control}
                name="hinhthuc"
                render={({ field }) => (
                  <Select
                    options={[
                      { label: "Tất cả", value: "" },
                      { label: "Giấy khen", value: "Giấy khen" },
                      { label: "Bằng khen", value: "Bằng khen" },
                      { label: "Cờ", value: "Cờ" },
                      { label: "Huân chương", value: "Huân chương" },
                      { label: "Huy chương", value: "Huy chương" },
                    ]}
                    className="basic-multi-select my-4 p-1"
                    classNamePrefix="select"
                    placeholder="Vui lòng chọn hình thức"
                    {...field}
                  />
                )}
              />
            </div>
            <div className='flex-col md:basis-1/3 flex flex-1 px-1'>
              <label className='underline font-semibold'>Cấp khen: </label>
              <Controller
                control={control}
                name="capkhen"
                render={({ field }) => (
                  <Select
                    options={[
                      { label: "Tất cả", value: "" },
                      { label: "Công an tỉnh", value: "Công an tỉnh" },
                      { label: "Tỉnh đoàn", value: "Tỉnh đoàn" },
                      { label: "Ban thanh niên Công an tỉnh", value: "Ban thanh niên Công an tỉnh" },
                      { label: "Bộ Công an", value: "Bộ Công an" },
                      { label: "Trung ương", value: "Trung ương" },
                      { label: "Chính phủ", value: "Chính phủ" },
                      { label: "Khác", value: "Khác" },
                    ]}
                    className="basic-multi-select my-4 p-1"
                    classNamePrefix="select"
                    placeholder="Vui lòng chọn cấp khen"
                    {...field}
                  />
                )}
              />
            </div>
            <div className='flex-col md:basis-1/3 flex flex-1 px-1'>
              <label className='underline font-semibold'>Loại khen thưởng: </label>
              <Controller
                control={control}
                name="theloai"
                render={({ field }) => (
                  <Select
                    options={[
                      { label: "Tất cả", value: "" },
                      { label: "Tập thể", value: "Tập thể" },
                      { label: "Cá nhân", value: "Cá nhân" }
                    ]}
                    className="basic-multi-select my-4 p-1"
                    classNamePrefix="select"
                    placeholder="Vui lòng chọn cấp khen"
                    {...field}
                  />
                )}
              />
            </div>
            <div className='flex-col md:basis-1/3 flex flex-1 px-1'>
              <label className='underline font-semibold'>Chi đoàn, liên chi đoàn: </label>
              <Controller
                control={control}
                name="nhomchidoanduockhenthuong"
                render={({ field }) => (
                  <Select
                    // isMulti={true}
                    options={chidoansOption}
                    className="basic-multi-select my-4 p-1"
                    classNamePrefix="select"
                    placeholder="Tất cả"
                    {...field}
                  />
                )}
              />

            </div>
          </div>
          <div className='my-2 text-center'>
            <Button sx={{ width: "200px", backgroundColor: "slategray" }} type='submit' color="info" variant='contained'><SearchIcon /> Tìm kiếm</Button>
          </div>
        </form>
      )}

      <div className='mt-6 mx-8'>
        <h3 className='text-center my-4 text-xl'>Danh sách kết quả khen thưởng</h3>
        
        <div className='my-4'>
            <h4>Tổng số <span className='font-bold text-xl'>{khenTapthes.length}</span> tập thể được khen với <span className='font-bold text-xl'>{luotkhenTapthes}</span> lượt khen thưởng. <span className='cursor-pointer underline text-blue-700' onClick={()=> setDisplay1(true)}>Xem chi tiết</span></h4>
            {display1 && (
            <div className='my-4' data-aos="zoom-in-down" data-aos-once="true">
            <TableChitietTapthe list={khenTapthes}/>
            </div>
            )}
            <h4>Tổng số <span className='font-bold text-xl'>{khenCanhans.length}</span> cá nhân được khen với <span className='font-bold text-xl'>{luotkhenCanhans}</span> lượt khen thưởng. <span className='cursor-pointer underline text-blue-700' onClick={()=> setDisplay2(true)}>Xem chi tiết</span></h4>
            {display2 && (
            <div className='my-4' data-aos="zoom-in-down" data-aos-once="true">
            <TableChitietCanhan list={khenCanhans}/>
            </div>
            )}
        </div>


        <TableKhenthuongThongke 
          list={khenthuongs}
        />
      </div>
    </div>
  )
}

export default KhenthuongThongke
