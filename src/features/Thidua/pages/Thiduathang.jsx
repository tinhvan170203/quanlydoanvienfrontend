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

import canboApi from '../../../api/canboApi';
import TableThiduathang from '../components/TableThiduathang';
import { useSelector } from 'react-redux';


const Thiduathang = () => {
  const [doanviens, setDoanviens] = useState([]);
  const [monthDisplay, setMonthDisplay] = useState(1)
  const [yearDisplay, setYearDisplay] = useState(1)
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2022);
  const [optionYear, setOptionYear] = useState([]);
  const [handleChangeNotifications, handleLoading] = useOutletContext();
  const [doanviensDisplay, setDoanviensDisplay] = useState([]);
  const [search, setSearch] = useState('')
  
  useEffect(() => {
    const fetchYear = async () => {
      try {
        let res = await canboApi.fetchYearMonth();
        setMonth(res.data.month);
        setMonthDisplay(res.data.month)
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

  const handleFetchThiduathang = async () => {
    try {
      handleLoading(true);
      let res = await canboApi.fetchThiduathang({month, year});
      setDoanviensDisplay(res.data)
      setDoanviens(res.data)
      setMonthDisplay(month)
      setYearDisplay(year);
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
    arr1 = arr1.map(i=>({...i, thiduathang: {ghichu: i.thiduathang.ghichu, result: value}}));
    setDoanviensDisplay(arr1);

    // state doanviens phai cap nhat va luu lai cac gia tri tuc thoi cua doanviendisplay de khi submit duoc ket qua dung
    let arr2 = [...doanviens];
    for(let i of arr1){
      let index = arr2.findIndex(e=>e._id.toString() === i._id.toString());
      arr2[index].thiduathang.result = i.thiduathang.result;
    };
    setDoanviens(arr2);
  };

  const handleChangeSelectRow = (row, value) => { //row la moi hang tuong duong thay doi thi dua thang 1 can bo
    let arr1 =  [...doanviensDisplay];
    let index = arr1.findIndex(e=>e._id.toString() === row._id.toString());
    arr1[index].thiduathang.result = value; 

    let arr2 =  [...doanviens];
    let index2 = arr1.findIndex(e=>e._id.toString() === row._id.toString());
    arr2[index2].thiduathang.result = value; 
    setDoanviens(arr2);
    setDoanviensDisplay(arr1);
  };

  const handleChangeText = (row, text) => {
    let arr1 =  [...doanviensDisplay];
    let index = arr1.findIndex(e=>e._id.toString() === row._id.toString());
    arr1[index].thiduathang.ghichu = text; 
    setDoanviensDisplay(arr1);

    let arr2 =  [...doanviens];
    let index2 = arr2.findIndex(e=>e._id.toString() === row._id.toString());
    arr2[index2].thiduathang.ghichu = text; 
    setDoanviens(arr2);
  };

  const saveThiduathang = async () => {
    let data = {doanviens, month: monthDisplay, year: yearDisplay};
    try {
      handleLoading(true);
      let res = await canboApi.updateThiduathang(data);
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
      console.log(error.message)
    }
  };

  const roles = useSelector((state) => state.authReducer.roles_quanlydoanvien);
  return (
    <div className='pr-2' data-aos="fade-left" data-aos-once="true">
      <div className='flex items-center space-x-1'>
        <GridView color='primary' fontSize="large" />
        <h4 className='font-bold text-gray-800 text-lg'>Quản lý thi đua tháng {monthDisplay} - {yearDisplay}</h4>
      </div>

      <div className='flex space-x-2 md:flex-row justify-end items-start'>
          <div className='flex-col flex md:basis-1/6'>
            <label className='underline font-semibold'>Tháng:</label>
            <Select
              value={{label: month, value: month}}
                required={true}
                name="thang"
                options={[
                  {label: 1, value: 1},
                  {label: 2, value: 2},
                  {label: 3, value: 3},
                  {label: 4, value: 4},
                  {label: 5, value: 5},
                  {label: 6, value: 6},
                  {label: 7, value: 7},
                  {label: 8, value: 8},
                  {label: 9, value: 9},
                  {label: 10, value: 10},
                  {label: 11, value: 11},
                  {label: 12, value: 12}
                ]}
                className="basic-multi-select my-4"
                classNamePrefix="select"
                onChange={(e)=> setMonth(e.value)}
              />
          </div>
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
          onClick={()=> handleFetchThiduathang()} sx={{ width: "220px", backgroundColor: "gray" }} color="primary" variant='contained'><AddIcon /> Lấy dữ liệu</Button>
          </div>

      </div>

        <div className='mx-8 flex space-x-2 items-center'>
          <input type="text" defaultValue={search} onChange={(e)=>setSearch(e.target.value)} placeholder='Search họ tên' className='p-2 border rounded-md'/>
          {roles && roles.includes("thêm thi đua") && (
          <Button 
          onClick={()=> saveThiduathang()} sx={{ width: "220px", backgroundColor: "gray" }} color="primary" variant='contained'><AddIcon /> Lưu dữ liệu</Button>
          )}
          </div>
        
        <div className='mt-6 mx-8'>
          <TableThiduathang 
            list={doanviensDisplay}
            onHandleChangeItem={handleChangeSelectRow}
            onHandleChangeAll={handleChangeAll}
            onHandleChangeText={handleChangeText}
          />
        </div>
    

    </div>
  )
}

export default Thiduathang