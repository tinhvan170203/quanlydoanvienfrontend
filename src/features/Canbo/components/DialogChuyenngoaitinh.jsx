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
  Grid,
  IconButton,
  LinearProgress,
  styled,
  Typography,
} from "@mui/material";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form"
import AddIcon from "@mui/icons-material/Add";
import { useEffect } from "react";
import dayjs from "dayjs";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { useState } from "react";
import canboApi from '../../../api/canboApi';
import donviApi from '../../../api/donviApi';
import bachamApi from '../../../api/bachamApi';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import EditIcon from "@mui/icons-material/Edit";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { toast } from 'react-toastify';
import { useOutletContext } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DialogDelete from "../../../components/DialogDelete";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CancelButton = styled(IconButton)({
  position: "absolute",
  right: "16px",
  top: "4px",
});


export default function DialogChuyenCongtacNgoaitinh({
  open,
  item,
  onCloseDialogChuyenCongtackhactinh,
  onSubmit
}) {

  const form = useForm({
    defaultValues: {
      ngayvedonvi: '',
    }
  });

  const [handleChangeNotifications, handleLoading] = useOutletContext();
  const [donvis, setDonvis] = useState([]);
  const [dois, setDois] = useState([]);
  const watch = form.watch;
  const setValue = form.setValue;

  useEffect(() => {
    const getDonvis = async () => {
      try {
        let res = await canboApi.getDonvikhactinh();
        setDonvis(res.data.map(i => ({ value: i._id, label: i.tendonvi })));
      } catch (error) {
        console.log(error.message)
      }
    };

    getDonvis()
  }, []);


  const handleFormSubmit = async (values) => {
    if (onSubmit) {
      const data = { ...values, id: item._id };
      await onSubmit(data);
      onCloseDialogChuyenCongtackhactinh();
    }
  };

  const { register } = form;
  return (
    <>
      <Dialog
        maxWidth="xl"
        fullWidth={true}
        disableEscapeKeyDown={true}
        onClose={(event, reason) => {
          // bỏ click ở nền đen mà mất dialog
          if (reason !== "backdropClick") {
            onCloseDialogChuyenCongtackhactinh(event, reason);
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
          <span className="text-white text-[16px]">
            Chuyển công tác đến địa phương khác đối với đồng chí "{item?.hoten}"
          </span>
          <CancelButton onClick={() => onCloseDialogChuyenCongtackhactinh()}>
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
                  <label className='underline font-semibold'>Đơn vị, địa phương chuyển đến:</label>
                  <Controller
                control={form.control}
                name="donvi"
                render={({ field }) => (
                  <Select
                  options={donvis}
                  className="basic-multi-select my-4 p-1"
                  classNamePrefix="select"
                  placeholder="Vui lòng chọn đơn vị, địa phương"
                  required
                    {...field}
                  />
                )}
              />
                </div>
                <div className='flex-col flex flex-1 px-1'>
                  <label className='underline font-semibold'><span className='text-red-600 font-semibold'> (*)</span> Ngày chuyển công tác: </label>
                  <input {...register("ngayvedonvi")} placeholder="dd-mm-yyyy" type="date" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400' required />
                </div>
              </div>

              <DialogActions>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  style={{ margin: "4px auto" }}
                >
                  <ThumbUpAltIcon />
                  <span>Hoàn tất chuyển công tác</span>
                </Button>
              </DialogActions>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
