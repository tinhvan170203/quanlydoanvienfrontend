import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import CancelIcon from "@mui/icons-material/Cancel";
import Select from 'react-select';
import {
  Box,
  Button,
  IconButton,
  styled,
} from "@mui/material";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form"
import { useEffect } from "react";
import dayjs from "dayjs";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { useState } from "react";
import bachamApi from '../../../api/bachamApi';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CancelButton = styled(IconButton)({
  position: "absolute",
  right: "16px",
  top: "4px",
});


export default function DialogChangeBacHam({
  open,
  item,
  onCloseDialogChangeBacHam,
  onSubmit,
}) {

  const form = useForm({
    defaultValues: {
      ghichu: "",
      ngaylenham: ''
    }
  });

  const [bachams, setBacHams] = useState([]);
  const setValue = form.setValue;
  const watch = form.watch;

  useEffect(() => {
    const getBacHamList = async () => {
      try {
        let res = await bachamApi.getBachams();
     
        setBacHams(res.data.map((i) => ({
          value: i._id,
          label: i.bacham,
        })))
      } catch (error) {
        console.log(error.message)
      }
    }

    getBacHamList()
  }, []);

  useEffect(() => {
    if(item){
      setValue("bacham", { value: item?.bachamPopulate[0]._id, label: item?.bachamPopulate[0].bacham }, { shouldValidate: true });
    }
  }, [item]);

  const handleFormSubmit = async (values) => {
    if (onSubmit) {
      const data = { ...values, id_edit: item._id };
      await onSubmit(data);
      onCloseDialogChangeBacHam();
    }
  };

  const { isSubmitting } = form.formState;
  const { register } = form;
  return (
    <>
      <Dialog
        maxWidth="lg"
        fullWidth={true}
        disableEscapeKeyDown={true}
        onClose={(event, reason) => {
          // bỏ click ở nền đen mà mất dialog
          if (reason !== "backdropClick") {
            onCloseDialogChangeBacHam(event, reason);
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
            Thay đổi cấp bậc hàm đối với đồng chí "{item?.bachamPopulate[0]?.bacham} {item?.hoten}"
          </span>
          <CancelButton onClick={() => onCloseDialogChangeBacHam()}>
            <CancelIcon style={{ color: "white" }} />
          </CancelButton>
        </DialogTitle>
        <DialogContent>
          <Box>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              style={{ width: "100%" }}
            >
 
              <div className='flex flex-wrap flex-col flex-1 p-2'>
                <div className='flex-col flex flex-1 px-1'>
                  <label className='underline font-semibold'>Cấp bậc hàm mới:</label>
                  <Controller
                    control={form.control}
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

                <div className='flex-col flex flex-1 px-1'>
                  <label className='underline font-semibold'><span className='text-red-600 font-semibold'> (*)</span> Ngày lên quân hàm: </label>
                  <input {...register("ngaylenham")} placeholder="dd-mm-yyyy" type="date" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400' required />
                </div>
                <div className='flex-col flex flex-1 px-1'>
                  <label className='underline font-semibold'> Ghi chú: </label>
                  <input {...register("ghichu")} placeholder="Ghi chú" type="text" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400'/>
                </div>
              </div>
              <DialogActions>
                <Button
                  color="primary"
                  variant="contained"
                  disabled={isSubmitting}
                  type="submit"
                  style={{ margin: "4px auto" }}
                >
                  <ThumbUpAltIcon />
                  <span>Lưu dữ liệu</span>
                </Button>
              </DialogActions>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
