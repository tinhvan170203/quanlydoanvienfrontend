import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  Box,
  Button,
  IconButton,
  styled,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form"
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import Select from 'react-select';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CancelButton = styled(IconButton)({
  position: "absolute",
  right: "16px",
  top: "4px",
});



export default function DialogEditKhencanhan({
  open,
  onCloseDialogEdit,
  item,
  onSubmit,
}) {

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
      
    },
  });

  const [roleList, setRoleList] = useState([]);
  const handleFormSubmit = async (values) => {
    if (onSubmit) {
      const data = { ...values, id_edit: item._id };
      await onSubmit(data);
      onCloseDialogEdit();
    }
  };

  useEffect(() => {
    if (item) {
        setValue("soQD", item.soQD, { shouldValidate: true });
        setValue("hinhthuc", {label: item.hinhthuc, value: item.hinhthuc}, { shouldValidate: true });
        setValue("capkhen", {label: item.capkhen, value: item.capkhen}, { shouldValidate: true });
        setValue("noidung", item.noidung, { shouldValidate: true });
        setValue("ngayky", item.ngayky, { shouldValidate: true });
        setValue("nguoiky", item.nguoiky, { shouldValidate: true });
    }
}, [item]);

  return (
    <>
      <Dialog
        maxWidth="xl"
        fullWidth={true}
        disableEscapeKeyDown={true}
        onClose={(event, reason) => {
          // bỏ click ở nền đen mà mất dialog
          if (reason !== "backdropClick") {
            onCloseDialogEdit(event, reason);
          }
        }}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          style={{
            display: "flex",
            borderBottom: "1px solid #ccc",
            backgroundColor: "rgb(30, 41, 59 )",
            margin: "0px",
          }}
        >
          <AutoAwesomeMotionIcon style={{ color: "white", fontSize: "24px", marginRight: "8px" }} />
          <span className="text-white text-[18px]">
            Chỉnh sửa khen thưởng đối với cá nhân
          </span>
          <CancelButton onClick={() => onCloseDialogEdit()}>
            <CancelIcon style={{ color: "white" }} />
          </CancelButton>
        </DialogTitle>
        <DialogContent>
          <Box>

            <form className='mt-2 mx-8' onSubmit={handleSubmit(handleFormSubmit)}>
            <div className='flex flex-wrap xl:flex-row flex-col flex-1 p-2'>
              <div className='flex-col md:basis-1/3 flex flex-1 px-1'>
                <label className='underline font-semibold'><span className='text-red-600 font-semibold'> (*)</span> Số QĐ khen thưởng: </label>
                <input {...register("soQD", { required: true })} type="text" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400'/>
              </div>
              <div className='flex-col md:basis-1/3 flex flex-1 px-1'>
                <label className='underline font-semibold'><span className='text-red-600 font-semibold'> (*)</span> Ngày ký: </label>
                <input {...register("ngayky", { required: true })} type="date" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400'/>
              </div>
              <div className='flex-col md:basis-1/3 flex flex-1 px-1'>
                <label className='underline font-semibold'><span className='text-red-600 font-semibold'> (*)</span> Người ký: </label>
                <input {...register("nguoiky", { required: true })} type="text" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400'/>
              </div>
              <div className='flex-col md:basis-full flex flex-1 px-1'>
                <label className='underline font-semibold'><span className='text-red-600 font-semibold'> (*)</span> Nội dung khen thưởng: </label>
                <input {...register("noidung", { required: true })} type="text" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400'/>
              </div>
              <div className='flex-col md:basis-1/2 flex flex-1 px-1'>
                <label className='underline font-semibold'><span className='text-red-600 font-semibold'> (*)</span> Hình thức khen: </label>
                <Controller
              control={control}
              name="hinhthuc"
              render={({ field }) => (
                <Select
                  options={[
                    {label: "Giấy khen", value: "Giấy khen"},
                    {label: "Bằng khen", value: "Bằng khen"},
                    {label: "Cờ", value: "Cờ"},
                    {label: "Huân chương", value: "Huân chương"},
                    {label: "Huy chương", value: "Huy chương"},
                  ]}
                  className="basic-multi-select my-4 p-1"
                  classNamePrefix="select"
                  placeholder="Vui lòng chọn hình thức"
                  required
                  {...field}
                />
              )}
            />
              </div>
              <div className='flex-col md:basis-1/2 flex flex-1 px-1'>
                <label className='underline font-semibold'><span className='text-red-600 font-semibold'> (*)</span>Cấp khen: </label>
                <Controller
              control={control}
              name="capkhen"
              render={({ field }) => (
                <Select
                  options={[
                    {label: "Công an tỉnh", value: "Công an tỉnh"},
                    {label: "UBND tỉnh", value: "UBND tỉnh"},
                    {label: "Tỉnh đoàn", value: "Tỉnh đoàn"},
                    {label: "Ban thanh niên Công an tỉnh", value: "Ban thanh niên Công an tỉnh"},
                    {label: "Bộ Công an", value: "Bộ Công an"},
                    {label: "Trung ương", value: "Trung ương"},
                    {label: "Chính phủ", value: "Chính phủ"},
                    {label: "Khác", value: "Khác"},
                  ]}
                  className="basic-multi-select my-4 p-1"
                  classNamePrefix="select"
                  placeholder="Vui lòng chọn cấp khen"
                  required
                  {...field}
                />
              )}
            />
              </div>
              <DialogActions>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  style={{ margin: "4px auto" }}
                >
                  <AddIcon />
                  <span>Lưu dữ liệu</span>
                </Button>
              </DialogActions>
              </div>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
