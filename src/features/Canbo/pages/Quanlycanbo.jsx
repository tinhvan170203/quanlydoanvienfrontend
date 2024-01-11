import React, { useMemo, useState, useEffect } from 'react'
import GridViewIcon from '@mui/icons-material/GridView';
import { Button, IconButton, Paper } from '@mui/material';
import Switch from '@mui/material/Switch';
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form"
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import querystring from "query-string";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import { toast } from 'react-toastify';
// import EditModal from './components/EditModal';
import { useOutletContext } from "react-router-dom";
import Select from 'react-select';
import canboApi from '../../../api/canboApi';

const Quanlycanbos = () => {
  const [donvis, setDonvis] = useState([]);
  const [dois, setDois] = useState([]);
  const [display, setDisplay] = useState(false);
  const [bachams, setBachams] = useState([]);
  const [chucvus, setChucvus] = useState([]);
  const [handleChangeNotifications,handleLoading] = useOutletContext();
  const navigate = useNavigate();
  const [tenchidoan, setTenchidoan] = useState('');
  const [gioitinh, setGioitinh] = useState('Nam');
  const [dangvien, setDangvien] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    resetField,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      hoten: "",
      gioitinh: { value: 'Nam', label: "Nam" },
      CCCD: "033",
      quequan: "",
      sohieuCAND: "",
      dangvien: {label: "Có", value: true},
      lyluanchinhtri: { value: 'Trung cấp', label: "Trung cấp" },
      trinhdo: { value: 'Đại học', label: "Đại học" }
    },
  });

  //change doi, cong an xa when donvi option change
  useEffect(()=>{
    const fetch = async () => {
      let id_donvi= watch('donvi');
      setValue('doi', "")
      if(id_donvi){
        try {
          let res = await canboApi.getDoiWhenDonviChange({id_donvi: id_donvi.value});
          setDois(res.data.map(i=>({
            value: i._id, label: i.tendoi
          })))
        } catch (error) {
          console.log(error.message)
        }
      }
    };

    fetch()
  },[watch('donvi')])
  
  //fetch data initial for add person
  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await canboApi.getDataForAddPerson();
        
        setDonvis(res.data.donvis.map(i => ({ value: i._id, label: i.tendonvi })))
        setChucvus(res.data.chucvus.map(i => ({ value: i._id, label: i.chucvu })))
        setBachams(res.data.bachams.map(i => ({ value: i._id, label: i.bacham })))
      } catch (error) {
        console.log(error.message)
      }
    };

    fetchData();
  }, []);


  //   //handle submit add doi
  const onSubmit = async (values) => {
    let data = { ...values};
    handleLoading(true);
    try {
      let res = await canboApi.addPerson(data);
      // setChidoans(res.data.chidoans)
      setTimeout(() => {
        handleLoading(false);
      }, 400)
      resetField('hoten');
      resetField("CCCD");
      resetField("quequan");
      resetField("sohieuCAND");
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

  return (
    <div className='pr-2' data-aos="fade-left" data-aos-once="true">
      <div className='flex items-center space-x-1'>
        <GridViewIcon color='primary' fontSize="large" />
        <h4 className='font-bold text-gray-800 text-lg'>Thêm mới đoàn viên</h4>
      </div>
      <h3 className="my-2 text-red-700 font-bold ml-2 mb-4">
        Lưu ý: Tạo mới đoàn viên chỉ được thực hiện đối với đoàn viên nhận công tác
        tại Công an tỉnh lần đầu tiên, cần kiểm tra kỹ lại xem trong hệ thống có
        dữ liệu của đoàn viên đó chưa để tránh việc trùng lặp dữ liệu.
      </h3>
      <form className='mt-2 mx-8' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex space-x-2 items-start'>
          <img src={gioitinh === "Nam" ? "/namcongan.png" : "/anhnucongan.png"} alt="avatar" className='w-auto h-full' />
          <div className='flex flex-wrap xl:flex-row flex-col flex-1 bg-slate-300 p-2 rounded-md'>
            <div className='flex-col flex md:basis-1/3 flex-1 px-1'>
              <label className='underline font-semibold'><span className='text-red-600 font-semibold'> (*)</span> Họ và tên: </label>
              <input {...register("hoten", { required: true })} type="text" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400'/>
            </div>
            <div className='flex-col flex md:basis-1/3 flex-1 px-1'>
              <label className='underline font-semibold'><span className='text-red-600 font-semibold'> (*)</span> Số CCCD: </label>
              <input {...register("CCCD", { required: true })} type="number" maxLength={12} minLength={12} className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400'/>
            </div>
            <div className='flex-col flex flex-1 md:basis-1/6 px-1'>
              <label className='underline font-semibold'><span className='text-red-600 font-semibold'> (*)</span> Giới tính:</label>
              <Select
              {...register("gioitinh")}
                name="gioitinh"
                options={[
                  { value: "Nam", label: "Nam" },
                  { value: "Nữ", label: "Nữ" }
                ]}
                className="basic-multi-select my-4 p-1"
                classNamePrefix="select"
                defaultValue={{ value: 'Nam', label: "Nam" }}
                onChange={(e) => {
                  setGioitinh(e.value)
                  setValue('gioitinh', e)
                }}
              />
            </div>
            <div className='flex-col flex md:basis-1/6 flex-1 px-1'>
              <label className='underline font-semibold'><span className='text-red-600 font-semibold'> (*)</span> Ngày sinh: </label>
              <input {...register("ngaysinh")} placeholder="dd-mm-yyyy" type="date" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400' required/>
            </div>
            <div className='flex-col flex md:basis-1/3 flex-1 px-1'>
              <label className='underline font-semibold'> Quê quán: </label>
              <input {...register("quequan")} type="text" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400'/>
            </div>
            <div className='flex-col flex md:basis-1/6 flex-1 px-1'>
              <label className='underline font-semibold'> Số hiệu CAND: </label>
              <input {...register("sohieuCAND")} type="text" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400'/>
            </div>
            <div className='flex-col flex flex-1 md:basis-1/6 px-1'>
              <label className='underline font-semibold'>Trình độ học vấn:</label>
              <Controller
                control={control}
                name="trinhdo"
                render={({ field }) => (
                  <Select
                    options={[
                      { value: "Đại học", label: "Đại học" },
                      { value: "Cao đẳng", label: "Cao đẳng" },
                      { value: "Trung cấp", label: "Trung cấp" },
                      { value: "Sơ cấp", label: "Sơ cấp" },
                      { value: "Khác", label: "Khác" },
                    ]}
                    className="basic-multi-select my-4 p-1"
                    classNamePrefix="select"
                    defaultValue={{ value: 'Đại học', label: "Đại học" }}
                    {...field}
                  />
                )}
              />
            </div>
            <div className='flex-col flex flex-1 md:basis-1/6 px-1'>
              <label className='underline font-semibold'>Lý luận chính trị:</label>
              <Controller
                control={control}
                name="lyluanchinhtri"
                render={({ field }) => (
                  <Select
                    options={[
                      { value: "Trung cấp", label: "Trung cấp" },
                      { value: "Sơ cấp", label: "Sơ cấp" },
                      { value: "Cao cấp", label: "Cao cấp" },
                      { value: "Khác", label: "Khác" },
                    ]}
                    className="basic-multi-select my-4 p-1"
                    classNamePrefix="select"
                    defaultValue={{ value: 'Trung cấp', label: "Trung cấp" }}
                    {...field}
                  />
                )}
              />
            </div>
            <div className='flex-col flex flex-1 md:basis-1/6 px-1'>
              <label className='underline font-semibold'>Là đảng viên:</label>
                  <Select
                  required
                  {...register('dangvien')}
                  options={[
                    { value: true, label: "Có" },
                    { value: false, label: "Không" }
                  ]}
                  className="basic-multi-select my-4 p-1"
                  classNamePrefix="select"
                  defaultValue={{ value: true, label: "Có" }}
                  onChange={(e) => {
                    setDangvien(e.value)
                    setValue('dangvien', e)
                  }}    
              />
            </div>
            <div className='flex-col flex flex-1 md:basis-1/4 px-1'>
              <label className='underline font-semibold'>Cấp bậc hàm:</label>
              <Controller
                control={control}
                name="bacham"
                render={({ field }) => (
                  <Select
                  options={bachams}
                  className="basic-multi-select my-4 p-1"
                  classNamePrefix="select"
                  placeholder="Vui lòng chọn cấp hàm"
                  required
                    {...field}
                  />
                )}
              />
            </div>
            <div className='flex-col flex flex-1 md:basis-1/4 px-1'>
              <label className='underline font-semibold'>Chức vụ công tác:</label>
              <Controller
                control={control}
                name="chucvu"
                render={({ field }) => (
                  <Select
                  required
                  options={chucvus}
                  className="basic-multi-select my-4 p-1"
                  classNamePrefix="select"
                  placeholder="Vui lòng chọn chức vụ"
                    {...field}
                  />
                )}
              />
            </div>
            <div className='flex-col flex flex-1 md:basis-1/4 px-1'>
              <label className='underline font-semibold'><span className='text-red-600 font-semibold'> (*)</span> Đơn vị công tác:</label>
              <Controller
                control={control}
                name="donvi"
                render={({ field }) => (
                  <Select
                  options={donvis}
                  className="basic-multi-select my-4 p-1"
                  classNamePrefix="select"
                  placeholder="Vui lòng chọn đơn vị công tác"
                  required
                    {...field}
                  />
                )}
              />
            </div>
            <div className='flex-col flex flex-1 md:basis-1/4 px-1'>
              <label className='underline font-semibold'><span className='text-red-600 font-semibold'> (*)</span> Đội, công an xã:</label>
              <Controller
                control={control}
                name="doi"
                render={({ field }) => (
                  <Select
                  options={dois}
                  className="basic-multi-select my-4 p-1"
                  classNamePrefix="select"
                  placeholder="Vui lòng chọn đội công tác, ca xã"
                  required
                    {...field}
                  />
                )}
              />
            </div>
            <div className='flex-col flex md:basis-1/4 flex-1 px-1'>
              <label className='underline font-semibold'><span className='text-red-600 font-semibold'> (*)</span> Ngày lên quân hàm hiện tại: </label>
              <input {...register("ngaylenham")} placeholder="dd-mm-yyyy" type="date" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400' required/>
            </div>
            <div className='flex-col flex md:basis-1/4 flex-1 px-1'>
              <label className='underline font-semibold'><span className='text-red-600 font-semibold'> (*)</span> Ngày giữ chức vụ hiện tại: </label>
              <input {...register("ngaygiuchucvu")} placeholder="dd-mm-yyyy" type="date" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400' required/>
            </div>
            <div className='flex-col flex md:basis-1/4 flex-1 px-1'>
              <label className='underline font-semibold'><span className='text-red-600 font-semibold'> (*)</span> Ngày nhận QĐ về đơn vị: </label>
              <input {...register("ngayvedonvi")} placeholder="dd-mm-yyyy" type="date" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400' required/>
            </div>
            <div className='flex-col flex md:basis-1/4 flex-1 px-1'>
              <label className='underline font-semibold'><span className='text-red-600 font-semibold'> (*)</span> Ngày nhận QĐ về đội, xã: </label>
              <input {...register("ngayvedoi")} placeholder="dd-mm-yyyy" type="date" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400' required/>
            </div>
            {dangvien === true ?
              (<div className='flex-col flex md:basis-1/4 flex-1 px-1'>
                <label className='underline font-semibold'><span className='text-red-600 font-semibold'> (*)</span> Ngày kết nạp vào đảng: </label>
                <input {...register("ngayvaodang")} placeholder="dd-mm-yyyy" type="date" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400'/>
              </div>) : ""}
          </div>
        </div>
        <div className='md:space-x-2 space-y-2 md:space-y-0 md:block flex flex-col items-center mt-4'>
          <Button type='submit' sx={{ width: "220px", backgroundColor: "gray" }} color="primary" variant='contained'><AddIcon /> Thêm mới</Button>
        </div>
      </form>
    </div>
  )
}

export default Quanlycanbos
