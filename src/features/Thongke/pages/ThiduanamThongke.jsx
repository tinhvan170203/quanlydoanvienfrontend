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
import TableBangThiduanam from '../components/TableBangthiduanam';
import TableThiduanam from '../components/TableThiduanam';

const exportFnc = (data) => {
    return data.map(item => ({
      hoten: item.hoten,
      ngaysinh: dayjs(item.ngaysinh).format('DD/MM/YYYY'),
      soluot: item.soluot,
      thoigians: item.thoigians.toString()
    }))
}

const ThiduanamThongke = () => {
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [handleChangeNotifications, handleLoading] = useOutletContext();
  const [chidoans, setChidoans] = useState([]);
  const [chidoanDisplay, setChidoanDisplay] = useState({label: "", value: ""})
  const [display, setDisplay] = useState(false)
  const [excelExport, setExcelExport] = useState([]);
  const [year, setYear] = useState(0);
  const [optionYear, setOptionYear] = useState([]);
  const [dataBang, setDataBang] = useState([]);
  const [search, setSearch] = useState('');
  const [dataDisplay, setDataDisplay] = useState([]);
  const [dataKHTNV, setDataKHTNV] = useState([]);
  const [dataHTNV, setDataHTNV] = useState([]);
  const [dataHTTNV, setDataHTTNV] = useState([]);
  const [dataHTXSNV, setDataHTXSNV] = useState([]);

  const [displayKHTNV, setDisplayKHTNV] = useState(false);
  const [displayHTNV, setDisplayHTNV] = useState(false);
  const [displayHTTNV, setDisplayHTTNV] = useState(false);
  const [displayHTXSNV, setDisplayHTXSNV] = useState(false);

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
      tunam: "",
      dennam: "",
      hoten: ""
    },
  });

  useEffect(() => {
    const fetchYear = async () => {
      try {
        let res = await canboApi.fetchYearMonth();
        let res1 = await chidoanApi.getChidoanOfUser();
        setChidoans([{ label: "Tất cả", value: "" }].concat(res1.data.map(i => ({ value: i._id, label: i.tenchidoan }))))
        setValue('tunam', res.data.year - 1)
        setValue('dennam', res.data.year - 1)
        setYear(res.data.year - 1);
        let arr = [];
        for (let i = (res.data.year - 1); i >= 2020; i--) {
          arr.push({
            label: i, value: i
          })
        };
        setOptionYear(arr)
        setFrom(res.data.year - 1);
        setTo(res.data.year - 1)
      } catch (error) {
        console.log(error.message)
      }
    };
    fetchYear()
  }, []);

 

  const handleFetchThiduanam = async (values) => {
    let params = { ...values, chidoans: values.chidoans.value }
    try {
      // handleLoading(true);
      let res = await thongkeApi.getThiduanams(params);
      setFrom(values.tunam);
      setTo(values.dennam);
      setChidoanDisplay(values.chidoans);
      setDataKHTNV(res.data.dataKHTNV);
      setDataHTNV(res.data.dataHTNV);
      setDataHTTNV(res.data.dataHTTNV);
      setDataHTXSNV(res.data.dataHTXSNV);
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
        let res = await thongkeApi.getBangThiduanams({year, chidoans: chidoanDisplay.value});
        let dataDisplay = res.data.filter(i=> i.hoten.toLowerCase().includes(search.toLowerCase()));
        setDataBang(res.data);
        console.log(res.data)
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
        <h4 className='font-bold text-gray-800 text-lg'>Theo dõi, thống kê xếp loại đoàn viên từ năm {from} đến năm {to} - chi đoàn, liên chi đoàn: {chidoanDisplay?.label}</h4>
      </div>

      <form onSubmit={handleSubmit(handleFetchThiduanam)}>
        <div className='flex flex-col mt-4 px-4 md:flex-row md:flex-wrap justify-end items-start'>
          <div className='flex-col md:basis-1/3 flex flex-1 px-1 w-full'>
            <label className='underline font-semibold'>Họ tên: </label>
            <input {...register("hoten")} type="text" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                    focus:ring-2 focus:border-blue-400'/>
          </div>
          <div className='flex-col md:basis-1/6 flex flex-1 px-1 w-full'>
            <label className='underline font-semibold'>Từ năm: </label>
            <input {...register("tunam")} type="number" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400'/>
          </div>
          <div className='flex-col md:basis-1/6 flex flex-1 px-1 w-full'>
            <label className='underline font-semibold'>Đến năm: </label>
            <input {...register("dennam")} type="number" className='outline-none my-4 border rounded-md p-2 border-neutral-600
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
          <div className='flex-col fle md:basis-1/6 px-1'>
            <Button size='small'
              type="submit" sx={{ width: "220px", backgroundColor: "gray" }} color="primary" variant='contained'><AddIcon /> Lấy dữ liệu</Button>
          </div>
        </div>
      </form>

      {display && (
        <div className='px-4' data-aos="fade-left" data-aos-once="true">
          <h3 className='font-bold'>Thống kê chi tiết xếp loại đoàn viên năm: </h3>
          <div className='pl-8 mb-8'>
            <div className='font-arial text-black'> - Số đoàn viên xếp loại thi đua "Không hoàn thành nhiệm vụ": <span className='text-xl font-bold'>{dataKHTNV.length}</span> đoàn viên. <span className='cursor-pointer underline text-blue-700' onClick={() => setDisplayKHTNV(true)}>Xem chi tiết</span></div>
            {displayKHTNV && (
              <TableThiduanam title={`KHTNV_${watch('tunam')}_${watch('dennam')}`} excelExport={exportFnc(dataKHTNV)} list={dataKHTNV}/>
            )}
            <div className='font-arial text-black'> - Số đoàn viên xếp loại thi đua "Hoàn thành nhiệm vụ": <span className='text-xl font-bold'>{dataHTNV.length}</span> đoàn viên. <span className='cursor-pointer underline text-blue-700' onClick={() => setDisplayHTNV(true)}>Xem chi tiết</span></div>
            {displayHTNV && (
              <TableThiduanam title={`HTNV_${watch('tunam')}_${watch('dennam')}`} excelExport={exportFnc(dataHTNV)} list={dataHTNV}/>
            )}
            <div className='font-arial text-black'> - Số đoàn viên xếp loại thi đua "Hoàn thành tốt nhiệm vụ": <span className='text-xl font-bold'>{dataHTTNV.length}</span> đoàn viên. <span className='cursor-pointer underline text-blue-700' onClick={() => setDisplayHTTNV(true)}>Xem chi tiết</span></div>
            {displayHTTNV && (
              <TableThiduanam title={`HTTNV_${watch('tunam')}_${watch('dennam')}`} excelExport={exportFnc(dataHTTNV)} list={dataHTTNV}/>
            )}
            <div className='font-arial text-black'> - Số đoàn viên xếp loại thi đua "Hoàn thành xuất sắc nhiệm vụ": <span className='text-xl font-bold'>{dataHTXSNV.length}</span> đoàn viên. <span className='cursor-pointer underline text-blue-700' onClick={() => setDisplayHTXSNV(true)}>Xem chi tiết</span></div>
            {displayHTXSNV && (
              <TableThiduanam title={`HTXSNV_${watch('tunam')}_${watch('dennam')}`} excelExport={exportFnc(dataHTXSNV)} list={dataHTXSNV}/>
            )}
          </div> 

        
          <div className='mt-4'>
          </div>
        </div>)}

      <div className='px-4'>
        <h3 className='text-center mt-4 font-mono text-xl font-bold'>Bảng theo dõi xếp loại đoàn viên năm {year} - {chidoanDisplay?.label}</h3>
        <div className='flex flex-col space-x-2 md:flex-row justify-end items-center'>
                  <div className='flex-col md:basis-1/3 flex  px-1 w-full'>
            <label className='underline font-semibold'>Họ tên: </label>
            <input value={search} name="search" onChange={(e)=>setSearch(e.target.value)} type="text" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                    focus:ring-2 focus:border-blue-400'/>
          </div>
          <div className='flex-col flex w-full md:w-auto'>
          <label className='underline font-semibold'>Tùy chỉnh năm để lấy dữ liệu:</label>
            <Select
              value={{ label: year, value: year }}
              required={true}
              name="year"
              options={optionYear}
              className="basic-multi-select my-4"
              classNamePrefix="select"
              onChange={(e) => setYear(e.value)}
            />
          </div>
        </div>

        <div>
          <TableBangThiduanam list={dataDisplay}/>
        </div>

      </div>
    </div>
  )
}

export default ThiduanamThongke