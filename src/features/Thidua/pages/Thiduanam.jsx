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
import { toast } from 'react-toastify';
import Select from 'react-select';

import { CSVLink } from "react-csv";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import canboApi from '../../../api/canboApi';
import TableThiduanam from '../components/TableThiduanam'
import { useSelector } from 'react-redux';


const Thiduanam = () => {
  const [doanviens, setDoanviens] = useState([]);
  const [yearDisplay, setYearDisplay] = useState(1)
  const [year, setYear] = useState(2022);
  const [optionYear, setOptionYear] = useState([]);
  const [handleChangeNotifications, handleLoading] = useOutletContext();
  const [doanviensDisplay, setDoanviensDisplay] = useState([]);
  const [search, setSearch] = useState('')
  
  useEffect(() => {
    const fetchYear = async () => {
      try {
        let res = await canboApi.fetchYearMonth();
        setYear(res.data.year);
        setYearDisplay(res.data.year);
        let arr = [];
        for(let i=res.data.year; i>= 2020; i--){
          arr.push({
            label: i, value: i
          })
        };
        setOptionYear(arr)
      } catch (error) {
        console.log(error.message)
      }
    };
     fetchYear()
  }, []);

  const handleFetchThiduanam = async () => {
    try {
      handleLoading(true);
      let res = await canboApi.fetchThiduanam({year});
      setYearDisplay(year);
      setDoanviensDisplay(res.data)
      setDoanviens(res.data)
        handleLoading(false);
    } catch (error) {
      console.log(error.message)
    }
  };
  //debounced input search
  useEffect(()=>{
    const timer = setTimeout(()=>{
      let arr = [...doanviens];
      let newArr = arr.filter(i=>i.hoten.toLowerCase().includes(search.toLowerCase()));
      setDoanviensDisplay(newArr)
    }, 500);
    return ()=> clearTimeout(timer)
  },[search]);

  const handleChangeAll = (value)=>{
    let arr1 =  [...doanviensDisplay];
    arr1 = arr1.map(i=>({...i, thiduanam: {ghichu: i.thiduanam.ghichu,result: value}}));
    setDoanviensDisplay(arr1);

    // state doanviens phai cap nhat va luu lai cac gia tri tuc thoi cua doanviendisplay de khi submit duoc ket qua dung
    let arr2 = [...doanviens];
    for(let i of arr1){
      let index = arr2.findIndex(e=>e._id.toString() === i._id.toString());
      arr2[index].thiduanam.result = i.thiduanam.result;
    };
    setDoanviens(arr2);
  };

  const handleChangeSelectRow = (row, value) => { //row la moi hang tuong duong thay doi thi dua thang 1 can bo
    let arr1 =  [...doanviensDisplay];
    let index = arr1.findIndex(e=>e._id.toString() === row._id.toString());
    arr1[index].thiduanam.result = value; 

    let arr2 =  [...doanviens];
    let index2 = arr1.findIndex(e=>e._id.toString() === row._id.toString());
    arr2[index2].thiduanam.result = value; 
    setDoanviens(arr2);
    setDoanviensDisplay(arr1);
  };

  const handleChangeText = (row, text) => {
    let arr1 =  [...doanviensDisplay];
    let index = arr1.findIndex(e=>e._id.toString() === row._id.toString());
    arr1[index].thiduanam.ghichu = text; 
    setDoanviensDisplay(arr1);

    let arr2 =  [...doanviens];
    let index2 = arr2.findIndex(e=>e._id.toString() === row._id.toString());
    arr2[index2].thiduanam.ghichu = text; 
    setDoanviens(arr2);
  };

  const saveThiduanam = async () => {
    let data = {doanviens, year: yearDisplay};
    try {
      handleLoading(true);
      let res = await canboApi.updateThiduanam(data);
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
      handleLoading(false)
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
      handleLoading(false);
    }
  };
  const roles = useSelector((state) => state.authReducer.roles_quanlydoanvien);

  return (
    <div className='pr-2' data-aos="fade-left" data-aos-once="true">
      <div className='flex items-center space-x-1'>
        <GridView color='primary' fontSize="large" />
        <h4 className='font-bold text-gray-800 text-lg'>Quản lý xếp loại đoàn viên năm {yearDisplay}</h4>
      </div>

      <div className='flex space-x-2 md:flex-row justify-end items-start'>
          <div className='flex-col flex md:basis-1/6'>
            <label className='underline font-semibold'>Năm:</label>
            <Select
                value={{label: year, value: year}}
                required={true}
                name="nam"
                options={optionYear}
                className="basic-multi-select my-4"
                classNamePrefix="select"
                onChange={(e)=> setYear(e.value)}
              />
          </div>
          <div className='flex-col flex md:basis-1/6'>
          <Button 
          onClick={()=> handleFetchThiduanam()} sx={{ width: "220px", backgroundColor: "gray" }} color="primary" variant='contained'><AddIcon /> Lấy dữ liệu</Button>
          </div>

        </div>

        <div className='mx-8 flex space-x-2 items-center'>
          <input type="text" defaultValue={search} onChange={(e)=>setSearch(e.target.value)} placeholder='Search họ tên' className='p-2 border rounded-md'/>
          {roles && roles.includes("thêm thi đua") && (
          <Button 
          onClick={()=> saveThiduanam()} sx={{ width: "220px", backgroundColor: "gray" }} color="primary" variant='contained'><AddIcon /> Lưu dữ liệu</Button>
          )}
          </div>
        
        <div className='mt-6 mx-8'>
          <TableThiduanam
            list={doanviensDisplay}
            onHandleChangeItem={handleChangeSelectRow}
            onHandleChangeAll={handleChangeAll}
            onHandleChangeText={handleChangeText}
          />
        </div>
    

    </div>
  )
}

export default Thiduanam