import React, { useMemo, useState, useEffect } from 'react'
import GridView from '@mui/icons-material/GridView'
import chidoanApi from '../../../api/chidoanApi';
import SearchIcon from '@mui/icons-material/Search';
import { Button, IconButton, Paper } from '@mui/material';
import Switch from '@mui/material/Switch';
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form"
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddIcon from '@mui/icons-material/Add';
import { useOutletContext, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Select from 'react-select';
import { CSVLink } from "react-csv";
import canboApi from '../../../api/canboApi';
import dayjs from 'dayjs';
import thongkeApi from '../../../api/thongkeApi';
import TableChitietThiduathang from '../components/TableChitietThiduathang';
import TableBangThiduathang from '../components/TableBangthiduathang';

let headers = [
  { label: "STT", key: "stt" },
  { label: "Họ tên", key: "hoten" },
  { label: "Số lượt cờ xanh", key: "blue" },
  { label: "Số lượt cờ vàng", key: "yellow" }
];

const ThiduathangThongke = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [handleChangeNotifications, handleLoading] = useOutletContext();
  const [chidoans, setChidoans] = useState([]);
  const [chidoanDisplay, setChidoanDisplay] = useState({label: "", value: ""})
  const [totalCB, setTotalCB] = useState(null);
  const [totalBlue, setTotalBlue] = useState(null);
  const [totalYellow, setTotalYellow] = useState(null);
  const [totalNotRed, setTotalNotRed] = useState([]);
  const [display, setDisplay] = useState(false)
  const [excelExport, setExcelExport] = useState([]);
  const [year, setYear] = useState(0);
  const [optionYear, setOptionYear] = useState([]);
  const [dataBang, setDataBang] = useState([]);
  const [search, setSearch] = useState('');
  const [dataDisplay, setDataDisplay] = useState([]);

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
      chidoans: { label: "Tất cả", value: "" },
      tungay: "",
      denngay: "",
      hoten: ""
    },
  });

  useEffect(() => {
    const fetchYear = async () => {
      try {
        let res = await canboApi.fetchYearMonth();
        let res1 = await chidoanApi.getChidoanOfUser();
        setChidoans([{ label: "Tất cả", value: "" }].concat(res1.data.map(i => ({ value: i._id, label: i.tenchidoan }))))
        setValue('tungay', res.data.year + `-01-01`)
        setValue('denngay', res.data.year + "-" + res.data.month + `-15`)
        setYear(res.data.year);
        let arr = [];
        for (let i = res.data.year; i >= 2020; i--) {
          arr.push({
            label: i, value: i
          })
        };
        setOptionYear(arr)
        setFrom(res.data.year + `-01-01`);
        setTo(res.data.year + "-" + res.data.month + `-15`)
      } catch (error) {
        console.log(error.message)
      }
    };
    fetchYear()
  }, []);

 

  const handleFetchThiduathang = async (values) => {
    let params = { ...values, chidoans: values.chidoans.value }
    try {
      handleLoading(true);
      setFrom(watch('tungay'));
      setTo(watch('denngay'));
      let res = await thongkeApi.getThiduathangs(params);
      setTotalCB(res.data.tongsocanbo);
      setTotalNotRed(res.data.data_not_red);
      setTotalBlue(res.data.total_blue)
      setTotalYellow(res.data.total_yellow);
      setChidoanDisplay(values.chidoans);
      setExcelExport(res.data.data_not_red.map((i, index) => ({
        stt: index + 1,
        hoten: i.hoten,
        blue: i.blue,
        yellow: i.yellow
      })));
      setDisplay(true);
    } catch (error) {
      console.log(error.message)
    }
  };

  // handle lấy dữ liệu thi đua tháng trong năm
  useEffect(()=>{
    const fetchBangtheodoi = async () => {
      handleLoading(true);
      try {
        let res = await thongkeApi.getBangThiduathangs({year, chidoans: chidoanDisplay.value});
        let dataDisplay = res.data.filter(i=> i.hoten.toLowerCase().includes(search.toLowerCase()));
        setDataBang(res.data);
        setDataDisplay(dataDisplay)
        handleLoading(false);
      } catch (error) {
        console.log(error.message)
      }
    };

    if(year !==0){
      fetchBangtheodoi()
    };
  },[year, chidoanDisplay]);

     //debounced input search
     useEffect(()=>{
       let data = [...dataBang];
      if(data.length > 0){
        const timer = setTimeout(()=>{
          let dataDisplay = data.filter(i=> i.hoten.toLowerCase().includes(search.toLowerCase()));
          setDataDisplay(dataDisplay)
        }, 500);
        return ()=> clearTimeout(timer)
      }
    },[search]);


  return (
    <div className='pr-2' data-aos="fade-left" data-aos-once="true">
      <div className='flex items-center space-x-1'>
        <GridView color='primary' fontSize="large" />
        <h4 className='font-bold text-gray-800 text-lg'>Theo dõi, thống kê thi đua tháng từ ngày {dayjs(from).format('DD/MM/YYYY')} đến ngày {dayjs(to).format('DD/MM/YYYY')} - chi đoàn, liên chi đoàn: {chidoanDisplay?.label}</h4>
      </div>

      <form onSubmit={handleSubmit(handleFetchThiduathang)}>
        <div className='flex flex-col mt-4 px-4 md:flex-row md:flex-wrap justify-end items-start'>
          <div className='flex-col md:basis-1/3 flex flex-1 px-1 w-full'>
            <label className='underline font-semibold'>Họ tên: </label>
            <input {...register("hoten")} type="text" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                    focus:ring-2 focus:border-blue-400'/>
          </div>
          <div className='flex-col md:basis-1/6 flex flex-1 px-1 w-full'>
            <label className='underline font-semibold'>Từ ngày: </label>
            <input {...register("tungay")} type="date" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400'/>
          </div>
          <div className='flex-col md:basis-1/6 flex flex-1 px-1 w-full'>
            <label className='underline font-semibold'>Đến ngày: </label>
            <input {...register("denngay")} type="date" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400'/>
          </div>
          <div className='flex-col md:basis-1/6 flex flex-1 px-1 w-full'>
            <label className='underline font-semibold'>Chi đoàn, liên chi đoàn: </label>
            <Controller
              control={control}
              name="chidoans"
              render={({ field }) => (
                <Select
                  options={chidoans}
                  className="basic-multi-select my-4 p-1"
                  classNamePrefix="select"
                  placeholder="Tất cả"
                  {...field}
                />
              )}
            />

          </div>
          <div className='flex-col flex md:basis-1/6 px-1'>
            <Button size='small'
              type="submit" sx={{ width: "220px", backgroundColor: "gray" }} color="primary" variant='contained'><AddIcon /> Lấy dữ liệu</Button>
          </div>
        </div>
      </form>

      {display && (
        <div className='px-4' data-aos="fade-left" data-aos-once="true">
          <h3 className='font-bold'>Phần mềm phát hiện {totalNotRed.length} đoàn viên xếp loại thi đua tháng cờ xanh hoặc vàng với tổng số lượt: </h3>
          <div className='pl-8 mb-8'>
            <div className='font-arial'> - Cờ xanh: {totalBlue} lượt</div>
            <div className='font-arial'> - Cờ vàng: {totalYellow} lượt</div>
          </div>

          <Button color="info" variant='contained' size='small'>
            <CSVLink data={excelExport} headers={headers} filename={`canhancoxanh_vang_${watch('tungay')}_${watch('denngay')}`}>
              <div className='flex items-center'>
                <FileDownloadIcon />
                <span className='text-sm'>Xuất file excel</span>
              </div>
            </CSVLink>
          </Button>

          <div className='mt-4'>
            <TableChitietThiduathang list={totalNotRed} />
          </div>
        </div>)}

      <div className='px-4'>
        <h3 className='text-center mt-4 font-mono text-xl font-bold'>Bảng theo dõi thi đua năm {year} - {chidoanDisplay?.label}</h3>
        <div className='flex space-x-2 md:flex-row justify-end items-center'>
                  <div className='flex-col md:basis-1/3 flex  px-1'>
            <label className='underline font-semibold'>Họ tên: </label>
            <input value={search} name="search" onChange={(e)=>setSearch(e.target.value)} type="text" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                    focus:ring-2 focus:border-blue-400'/>
          </div>
          <div className='flex-col flex'>
          <label className='underline font-semibold'>Tùy chỉnh năm để lấy dữ liệu:</label>
            <Select
              value={{ label: year, value: year }}
              required={true}
              name="nam"
              options={optionYear}
              className="basic-multi-select my-4"
              classNamePrefix="select"
              onChange={(e) => setYear(e.value)}
            />
          </div>
        </div>

        <div>
          <TableBangThiduathang list={dataDisplay}/>
        </div>

      </div>
    </div>
  )
}

export default ThiduathangThongke