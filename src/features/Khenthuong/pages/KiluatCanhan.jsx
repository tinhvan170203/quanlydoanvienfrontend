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
import kiluatApi from '../../../api/kiluatApi';
import { toast } from 'react-toastify';
import Select from 'react-select';
import DialogDelete from '../../../components/DialogDelete';
import DialogEditKhentapthe from '../components/DialogEditKhentapthe';
import { CSVLink } from "react-csv";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import canboApi from '../../../api/canboApi';
import TableKiluatcanhan from '../components/TableKiluatcanhan';
import DialogAddKiluatcanhan from '../components/DialogAddKiluatcanhan';
import DialogEditKiluatcanhan from '../components/DialogEditKiluatcanhan';
import TableDoanvienKiluat from '../components/TableDoanvienKiluat';
import { useSelector } from 'react-redux';

let headers = [
  { label: "STT", key: "stt" },
  { label: "Số quyết định", key: "soQD" },
  { label: "Hình thức", key: "hinhthuc" },
  { label: "Người ký", key: "nguoiky" },
  { label: "Ngày ký", key: "ngayky" },
  { label: "Nội dung khen", key: "noidung" }
];

const KiluatCanhan = () => {
  const [kiluats, setKiluats] = useState([]);
  const [display, setDisplay] = useState(false);
  const [canbo, setCanbo] = useState(null)
  let [excelExport, setExcelExport] = useState([]);
  const [searchCanbo, setSearchCanbo] = useState({
    hoten: "",
    donvi: "",
    sohieuCAND: ""
  });
  const [handleChangeNotifications, handleLoading] = useOutletContext();

  const [donvis, setDonvis] = useState([]);
  const [doanviens, setDoanviens] = useState([]);

  const [openDialogAdd, setOpenDialogAdd] = useState({
    status: false
  });

  const handleOpenDialogAdd = (item) => {
    setOpenDialogAdd({
      status: true,
    });
  };

  const handleCloseDialogAdd = () => {
    setOpenDialogAdd({
      ...openDialogAdd,
      status: false,
    });
  };


  const [openDialogEdit, setOpenDialogEdit] = useState({
    status: false,
    item: null,
  });
  //state mở hộp thoại delete
  const [openDialogDelete, setOpenDialogDelete] = useState({
    status: false,
    id_Delete: null,
  });


  const handleOpenDialogEdit = (item) => {
    setOpenDialogEdit({
      item,
      status: true,
    });
  };
  const handleCloseDialogEdit = () => {
    setOpenDialogEdit({
      ...openDialogEdit,
      status: false,
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


  //open dialog delete
  const handleOpenDialogDelete = (id) => {
    setOpenDialogDelete({
      status: true,
      id_Delete: id,
    });
  };

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
    },
  });
  // handle submit search
  const handleFormSearchSubmit = async (values) => {
    let data = {...values,
      hinhthuc: values.hinhthuc.value,
    };
    try {
      handleLoading(true);
      let res = await kiluatApi.searchKiluatcanhans(canbo._id, data);
      setKiluats(res.data)
      setExcelExport(res.data.map((i, index) => ({
        stt: index + 1,
        soQD: i.soQD,
        ngayky: i.ngayky,
        noidung: i.noidung,
        nguoiky: i.nguoiky,
        hinhthuc: i.hinhthuc,
        capkhen: i.capkhen,
      })));
      setTimeout(() => {
        handleLoading(false);
      }, 400);
    } catch (error) {
      console.log(error.message)
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        handleLoading(true);
        let res = await canboApi.fetchDangvienList(searchCanbo);
        let res1 = await canboApi.getDataForAddPerson();
        
        let options = [{ label: "Tất cả", value: "" }].concat(res1.data.donvis.map(i => ({ value: i._id, label: i.tendonvi })))
        setDonvis(options)
        setDoanviens(res.data);
        setTimeout(() => {
          handleLoading(false);
        }, 400);
      } catch (error) {
        console.log(error.message)
      }
    };

    fetchData();
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        handleLoading(true);
        let res = await kiluatApi.getKiluatcanhans(canbo._id);
        setKiluats(res.data)
        setExcelExport(res.data.map((i, index) => ({
          stt: index + 1,
          soQD: i.soQD,
          ngayky: i.ngayky,
          noidung: i.noidung,
          nguoiky: i.nguoiky,
          hinhthuc: i.hinhthuc,
        })));
        setTimeout(() => {
          handleLoading(false);
        }, 400);
      } catch (error) {
        console.log(error.message)
      }
    };

    if (canbo) {
      fetchData();
    }
  }, [canbo]);

  const handleFormSearchCanboSubmit = async (e) => {
    e.preventDefault();
    try {
      handleLoading(true);
      let res = await canboApi.fetchDangvienList(searchCanbo);
      handleLoading(false);
      setDoanviens(res.data);
    } catch (error) {
      console.log(error.message)
    }
  };

  const handleChoiceCanbo = (canbo) => {
    setCanbo(canbo)
  };

  const handleSubmitAdd = async (values) => {
    let data = {...values, id: canbo._id}
    try {
       handleLoading(true);
      let res1 = await kiluatApi.addKiluatcanhan(data);
      let res = await kiluatApi.getKiluatcanhans(canbo._id);
      setKiluats(res.data)
      setExcelExport(res.data.map((i, index) => ({
        stt: index + 1,
        soQD: i.soQD,
        ngayky: i.ngayky,
        noidung: i.noidung,
        hinhthuc: i.hinhthuc,
        nguoiky: i.nguoiky,
      })));
       handleLoading(false);
      toast.success(res1.data.message, {
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


  const handleConfirmDelete = async () => {
    handleLoading(true);
    try {
      let res = await kiluatApi.deleteKiluatcanhan(openDialogDelete.id_Delete);

      let arr = [...kiluats];

      let newItems = arr.filter(i => i._id.toString() !== openDialogDelete.id_Delete);
      setKiluats(newItems);
      setExcelExport(newItems.map((i, index) => ({
        stt: index + 1,
        soQD: i.soQD,
        ngayky: i.ngayky,
        nguoiky: i.nguoiky,
        noidung: i.noidung,
        hinhthuc: i.hinhthuc,
      })))
      setTimeout(() => {
        handleLoading(false);
      }, 400);

      setOpenDialogDelete({
        ...openDialogDelete,
        status: false
      })
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
  };

  const handleSubmitEdit = async (values) => {
    try {
      handleLoading(true);
      let res = await kiluatApi.editKiluatcanhan(values);

      let arr = [...kiluats];

      let index = kiluats.findIndex(i => i._id.toString() === values.id_edit);
      arr[index].soQD = values.soQD;
      arr[index].ngayky = values.ngayky;
      arr[index].hinhthuc = values.hinhthuc.value;
      arr[index].nguoiky = values.nguoiky;
      arr[index].noidung = values.noidung;
      setKiluats(arr)
      setExcelExport(arr.map((i, index) => ({
        stt: index + 1,
        soQD: i.soQD,
        ngayky: i.ngayky,
        noidung: i.noidung,
        hinhthuc: i.hinhthuc,
        nguoiky: i.nguoiky,
      })));
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
        <h4 className='font-bold text-gray-800 text-lg'>Quản lý kỉ luật đối với cá nhân
          {canbo &&
            (<span className='ml-2 text-blue-600 italic underline underline-offset-4'>
              {canbo?.bachamPopulate[0].bacham} {canbo?.hoten} - {canbo?.chucvuPopulate[0].chucvu}, {canbo?.donviPopulate[0].tendonvi}
            </span>)
            }
        </h4>
      </div>

      <form onSubmit={(e) => handleFormSearchCanboSubmit(e)} className='my-2 mt-4 p-4 rounded-lg shadow-xl'>
        <div className='flex mb-4'>
          <SearchIcon />
          <h3 className='font-semibold'>Tìm kiếm đoàn viên</h3>
        </div>
        <div className='flex flex-wrap xl:flex-row flex-col flex-1 bg-slate-300 p-2 rounded-md'>
          <div className='flex-col flex md:basis-1/3 flex-1 px-1'>
            <label className='underline font-semibold'>Họ và tên: </label>
            <input onChange={(e) => setSearchCanbo({ ...searchCanbo, hoten: e.target.value })} type="text" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400'/>
          </div>
          <div className='flex-col flex md:basis-1/3 flex-1 px-1'>
            <label className='underline font-semibold'> Số hiệu CAND: </label>
            <input onChange={(e) => setSearchCanbo({ ...searchCanbo, sohieuCAND: e.target.value })} type="text" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400'/>
          </div>
          <div className='flex-col flex flex-1 md:basis-1/3 px-1'>
            <label className='underline font-semibold'>Đơn vị công tác:</label>
            <Select
              options={donvis}
              className="basic-multi-select my-4 p-1"
              classNamePrefix="select"
              placeholder="Tất cả"
              onChange={(e) => setSearchCanbo({ ...searchCanbo, donvi: e.value })}
            />
          </div>
        </div>
        <div className='my-2 text-center'>
          <Button sx={{ width: "200px", backgroundColor: "slategray" }} type='submit' color="info" variant='contained'><SearchIcon /> Tìm kiếm</Button>
        </div>
      </form>

      <div className='mt-6 mx-8'>
        <TableDoanvienKiluat
          list={doanviens}
          onHandleChoiceCanbo={handleChoiceCanbo}
        />
      </div>


      {/* form tìm kiếm  */}
      {canbo && (
        <>
          <div className='mt-4 text-end md:space-x-2 space-y-2 md:space-y-0 md:block flex flex-col items-center'>
          {roles && roles.includes('thêm khen thưởng, kỉ luật') && (
            <Button type='submit' sx={{ width: "350px", backgroundColor: "gray" }} onClick={() => handleOpenDialogAdd()} color="primary" variant='contained'><AddIcon /> Thêm mới kỉ luật</Button>
          )}
            <Button sx={{ width: "300px", backgroundColor: "darkgray" }} onClick={() => setDisplay(true)} color="info" variant='contained'><SearchIcon /> Chức năng tìm kiếm nâng cao</Button>
            <IconButton>
              <CSVLink data={excelExport} headers={headers} filename={`danhsachkiluat_${canbo?.hoten}_${watch('tungay')}_${watch('denngay')}`}>
                <div className='flex items-center shadow-md space-x-2 bg-green-300 px-2 py-1 rounded-md'>
                  <FileDownloadIcon />
                  <span className='text-sm text-green-800'>Xuất file excel</span>
                </div>
              </CSVLink>
            </IconButton>
          </div>

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
                  <label className='underline font-semibold'>Số QĐ kỉ luật: </label>
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
                  <label className='underline font-semibold'>Nội dung kỉ luật: </label>
                  <input {...register("noidung")} type="text" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400'/>
                </div>
                <div className='flex-col flex flex-1 px-1'>
                  <label className='underline font-semibold'>Hình thức kỉ luật: </label>
                  <Controller
                    control={control}
                    name="hinhthuc"
                    render={({ field }) => (
                      <Select
                        options={[
                          { label: "Tất cả", value: "" },
                          { label: "Khiển trách", value: "Khiển trách" },
                          { label: "Cảnh cáo", value: "Cảnh cáo" },
                          { label: "Hạ cấp bậc hàm", value: "Hạ cấp bậc hàm" },
                          { label: "Tước quân tịch CAND", value: "Tước quân tịch CAND" },
                        ]}
                        className="basic-multi-select my-4 p-1"
                        classNamePrefix="select"
                        placeholder="Vui lòng chọn hình thức"
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
        </>
      )}


      {canbo && (
        <div className='mt-6 mx-8' data-aos="zoom-in-up" data-aos-once="true">
          <h3 className='text-center my-4 text-xl'>Danh sách kết quả kỉ luật đối với cá nhân</h3>
          <TableKiluatcanhan
            list={kiluats}
            onClickOpenDialogDelete={handleOpenDialogDelete}
            onClickOpenDialogEdit={handleOpenDialogEdit} />
        </div>
      )}

      <DialogAddKiluatcanhan
        open={openDialogAdd.status}
        onSubmit={handleSubmitAdd}
        onCloseDialogAdd={handleCloseDialogAdd}
      />

      <DialogEditKiluatcanhan
        open={openDialogEdit.status}
        item={openDialogEdit.item}
        onSubmit={handleSubmitEdit}
        onCloseDialogEdit={handleCloseDialogEdit}
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

export default KiluatCanhan