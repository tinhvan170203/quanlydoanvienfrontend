import GridView from '@mui/icons-material/GridView'
import React, { useState, useEffect, useMemo } from 'react'
import { Button, IconButton, Paper } from '@mui/material';
import Switch from '@mui/material/Switch';
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form"
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import querystring from "query-string";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import { useOutletContext } from "react-router-dom";
import DialogDelete from '../../components/DialogDelete';
import roleApi from '../../api/roleApi';
import TableBachams from './components/TableCapbac';
import bachamApi from '../../api/bachamApi';
import ModalEditCapbac from './components/ModalEditCapbac';
import { useSelector } from 'react-redux';

const Capbacs = () => {
  const [bachams, setBachams] = useState([]);
  const navigate = useNavigate();
  const [handleChangeNotifications, handleLoading] = useOutletContext();

  const [openDialogEdit, setOpenDialogEdit] = useState({
    status: false,
    item: null,
  });

  const handleCloseDialogEdit = () => {
    setOpenDialogEdit({
      ...openDialogEdit,
      status: false,
    });
  };

  //open dialog edit
  const handleOpenDialogEdit = (item) => {
    setOpenDialogEdit({
      item,
      status: true,
    });
  };

  //state mở hộp thoại delete
  const [openDialogDelete, setOpenDialogDelete] = useState({
    status: false,
    id_Delete: null,
  });

  //open dialog delete
  const handleOpenDialogDelete = (id) => {
    setOpenDialogDelete({
      status: true,
      id_Delete: id,
    });
  };

  const handleCancelDelete = () => {
    setOpenDialogDelete({
      ...openDialogDelete,
      status: false,
    });
  };

  const handleCloseDialogDelete = () => {
    setOpenDialogDelete({
      ...openDialogDelete,
      status: false,
    });
  };

  const roles = useSelector((state) => state.authReducer.roles_quanlydoanvien);

  const {
    register,
    handleSubmit,
    control,
    resetField,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bacham: "",
      thutu: 1,
      nienhan: 2
    },
  });



   //fetch bachams
   useEffect(() => {
    const fetchData = async () => {
      try {
        handleLoading(true);
        let res = await bachamApi.getBachams();
 
        setBachams(res.data);
        setTimeout(() => {
          handleLoading(false);
        }, 400);
      } catch (error) {

        console.log(error.message)
      }
    };

    fetchData();
  }, []);
  //handle submit add bac ham group
  const onSubmit = async (values) => {
    let data = { ...values };
    handleLoading(true);
    try {
        let res = await bachamApi.addBacham(data);
        setBachams(res.data.bachamList);
        setTimeout(() => {
          handleLoading(false);
        }, 400);

        resetField('bacham');
        resetField("nienhan");
        resetField("thutu");
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

   //handle submit edit bac hàm
   const handleSubmitEdit = async (values) => {
    let data = { ...values};
    handleLoading(true);
    try {
      let res = await bachamApi.editBacham(data);
      setBachams(res.data.bachamList);

      setTimeout(() => {
        handleLoading(false);
      }, 400);

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

  // hanle delete bachams 
  const handleConfirmDelete = async () => {
    handleLoading(true);
    try {
      let res = await bachamApi.deleteBacham(openDialogDelete.id_Delete);
      setBachams(res.data.bachamList);

      setTimeout(() => {
        handleLoading(false);
      }, 400);

      setOpenDialogDelete({
        ...openDialogDelete,
        status: false
      });

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
    } catch (error) {
      setOpenDialogDelete({
        ...openDialogDelete,
        status: false
      });
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
  }
  return ( 
    <div className='pr-2' data-aos="fade-left" data-aos-once="true">
      <div className='flex items-center space-x-1'>
        <GridView color='primary' fontSize="large" />
        <h4 className='font-bold text-gray-800 text-lg'>Quản lý Bậc quân hàm</h4>
      </div>
    {roles && roles.includes("thêm bậc hàm") && (
      <form className='mt-2 mx-8' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex-col flex'>
          <label className='underline font-semibold'><span className='text-red-600 font-semibold'> (*)</span> Tên cấp bậc hàm: </label>
          <input {...register("bacham", { required: true })} type="text" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400'/>
        </div>
        <div className='flex space-x-2'>
        <div className='flex-col flex md:basis-1/2'>
          <label className='underline font-semibold'><span className='text-red-600 font-semibold'> (*)</span> Niên hạn lên hàm tiếp theo: </label>
          <input {...register("nienhan", { required: true })} type="number" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400'/>
        </div>
          <div className='flex-col flex md:basis-1/2'>
            <label className='underline font-semibold'><span className='text-red-600 font-semibold'> (*)</span> Thứ tự: </label>
            <input {...register("thutu", { required: true })} type="number" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400'/>
          </div>
        </div>

        <div className='md:space-x-2 space-y-2 md:space-y-0 md:block flex flex-col items-center'>
          <Button type='submit' sx={{ width: "220px", backgroundColor: "gray" }} color="primary" variant='contained'><AddIcon /> Thêm mới</Button>
        </div>
      </form>
    )}
      
      <div className='mt-6 mx-8'>
      <TableBachams 
        list={bachams}
        onClickOpenDialogDelete={handleOpenDialogDelete}
        onClickOpenDialogEdit={handleOpenDialogEdit} />
      </div>
        
        <ModalEditCapbac
           open={openDialogEdit.status}
           item={openDialogEdit.item}
           onCloseDialogEdit={handleCloseDialogEdit}
           onSubmit={handleSubmitEdit}
        />

      <DialogDelete
         open={openDialogDelete.status}
         onCloseDialogDelete={handleCloseDialogDelete}
         onConfirmDelete={handleConfirmDelete}
         onCancelDelete={handleCancelDelete}
      />  
    </div>
  )
}

export default Capbacs
