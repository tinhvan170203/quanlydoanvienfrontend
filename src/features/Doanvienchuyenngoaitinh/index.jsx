import React, { useMemo, useState, useEffect } from 'react'
import GridView from '@mui/icons-material/GridView'
import { Button, IconButton, Paper } from '@mui/material';
import { useForm, Controller } from "react-hook-form"
import AddIcon from '@mui/icons-material/Add';
import { useOutletContext, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import TableKhactinh from './components/TableKhactinh';
import canboApi from '../../api/canboApi';




const DoanvienNgoaitinh = () => {

  const [handleChangeNotifications, handleLoading] = useOutletContext();

  const [dataBang, setDataBang] = useState([])

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
      hoten: ""
    },
  });

  const handleFetchDoanvienDelete = async (values) => {
    let params = { ...values }
    try {
      handleLoading(true);
      let res = await canboApi.getDoanvienNgoaitinh(params);
      setDataBang(res.data)
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
useEffect(()=> {
    handleFetchDoanvienDelete({hoten: ""})
}, [])

  const changeStatusDoanvien = async (id) => {
    handleLoading(true)
    try {
       await canboApi.backToCongantinh(id);

       let data = [...dataBang];
       data = data.filter(i=> i._id.toString() !== id);
       setDataBang(data);
      handleLoading(false);
      toast.success("Thay đổi trạng thái thành công", {
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


  return (
    <div className='pr-2' data-aos="fade-left" data-aos-once="true">
      <div className='flex items-center space-x-1'>
        <GridView color='primary' fontSize="large" />
        <h4 className='font-bold text-gray-800 text-lg'>Danh sách đoàn viên đã chuyển công tác khỏi công an tỉnh</h4>
      </div>

      <form onSubmit={handleSubmit(handleFetchDoanvienDelete)}>
        <div className='flex mt-4 px-4 space-x-2 md:flex-row justify-end items-start'>
          <div className='flex-col md:basis-1/3 flex flex-1 px-1'>
            <label className='underline font-semibold'>Họ tên: </label>
            <input {...register("hoten")} type="text" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                    focus:ring-2 focus:border-blue-400'/>
          </div>
          <div className='flex-col flex md:basis-1/6'>
            <Button size='small'
              type="submit" sx={{ width: "220px", backgroundColor: "gray" }} color="primary" variant='contained'><AddIcon /> Lấy dữ liệu</Button>
          </div>
        </div>
      </form>


        <div className='px-4' data-aos="fade-left" data-aos-once="true">
    

          <div className='mt-4'>
            <TableKhactinh list={dataBang} onChangeStatus={changeStatusDoanvien}/>
          </div>
        </div>

    </div>
  )
}

export default DoanvienNgoaitinh