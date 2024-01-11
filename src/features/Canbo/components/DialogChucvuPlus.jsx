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
import chucvuApi from '../../../api/chucvuApi';
import canboApi from '../../../api/canboApi';
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
import { useSelector } from "react-redux";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CancelButton = styled(IconButton)({
  position: "absolute",
  right: "16px",
  top: "4px",
});


export default function DialogChucvuPlus({
  open,
  item,
  onCloseDialogChucvuPlus,
  onSubmit
}) {

  const form = useForm({
    defaultValues: {
      id_item: null,
      ghichu: "",
      ngaygiuchucvu: ''
    }
  });

  const [handleChangeNotifications, handleLoading] = useOutletContext();
  const [chucvus, setChucvus] = useState([]);
  const [chucvuList, setChucvuList] = useState([]);
  const setValue = form.setValue;
  const watch = form.watch;


  //state mở hộp thoại delete
  const [openDialogDelete, setOpenDialogDelete] = useState({
    status: false,
    id_Delete: null
  });

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
  const handleOpenDialogDelete = (id1) => {
    setOpenDialogDelete({
      status: true,
      id_Delete: id1,
    });
  };

  useEffect(() => {
    const getChucvus = async () => {
      try {
        let res = await chucvuApi.getChucvus();
        setChucvus(res.data.map((i) => ({
          value: i._id,
          label: i.chucvu,
        })))
      } catch (error) {
        console.log(error.message)
      }
    };

    getChucvus()
  }, []);

  useEffect(() => {
    if (item) {
      setValue('id_item', null);
      setValue('ghichu', '')
      setValue('ngaygiuchucvu', '')
      const getData = async () => {
        try {
          let res = await canboApi.getChucvuPlus(item._id);
          setChucvuList(res.data)
        } catch (error) {
          console.log(error.message)
        }
      };

      getData()
    }
  }, [item]);

  const handleFormSubmit = async (values) => {
    if (onSubmit) {
      handleLoading(true)
      const data = { ...values, id: item._id };
      try {
        let res = await canboApi.changeChucvuPlus(data)
        setChucvuList(res.data.data);
        await onSubmit();
        form.reset()
        handleLoading(false)
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
        console.log(error.message)
      }
      // onCloseDialogChangeChucvu();
    }
  };

  const onClickEditItem = (row) => {
    setValue('id_item', row._id)
    setValue('ghichu', row.ghichu)
    setValue('ngaygiuchucvu', row.tungay)
    setValue('chucvu', { label: row.chucvu.chucvu, value: row.chucvu._id })
  };


  const handleConfirmDelete = async () => {
    if (onSubmit) {
      handleLoading(true)
      try {
        let res = await canboApi.deleteChucvuPlus(item._id, openDialogDelete.id_Delete)
        setChucvuList(res.data.data);
        await onSubmit();
        handleLoading(false)
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

        setOpenDialogDelete({
          ...openDialogDelete,
          status: false
        });
      } catch (error) {
        console.log(error.message)
      }
    }
  };

  const { isSubmitting } = form.formState;
  const { register } = form;
  const roles = useSelector((state) => state.authReducer.roles_quanlydoanvien);
  return (
    <>
      <Dialog
        maxWidth="xl"
        fullWidth={true}
        disableEscapeKeyDown={true}
        onClose={(event, reason) => {
          // bỏ click ở nền đen mà mất dialog
          if (reason !== "backdropClick") {
            onCloseDialogChucvuPlus(event, reason);
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
            Quản trị chức vụ nâng cao đối với đồng chí "{item?.bachamPopulate[0]?.bacham} {item?.hoten}" hiện đang là {item?.chucvuPopulate[0]?.chucvu}
          </span>
          <CancelButton onClick={() => onCloseDialogChucvuPlus()}>
            <CancelIcon style={{ color: "white" }} />
          </CancelButton>
        </DialogTitle>
        <DialogContent>
          <Box>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              style={{ width: "100%" }}
            >
              <div className='flex flex-wrap xl:flex-row flex-col flex-1 p-2'>
                <div className='flex-col md:basis-1/3 flex flex-1 px-1'>
                  <label className='underline font-semibold'>Chức vụ công tác chỉnh sửa:</label>
                  <Controller
                    control={form.control}
                    name="chucvu"
                    render={({ field }) => (
                      <Select
                        options={chucvus}
                        className="basic-multi-select my-4 p-1"
                        classNamePrefix="select"
                        placeholder="Vui lòng chọn chức vụ"
                        required
                        {...field}
                      />
                    )}
                  />
                </div>

                <div className='flex-col md:basis-1/3 flex flex-1 px-1'>
                  <label className='underline font-semibold'><span className='text-red-600 font-semibold'> (*)</span> Giữ chức vụ từ ngày: </label>
                  <input {...register("ngaygiuchucvu")} placeholder="dd-mm-yyyy" type="date" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400' required />
                </div>
                <div className='flex-col md:basis-1/3 flex flex-1 px-1'>
                  <label className='underline font-semibold'> Ghi chú chỉnh sửa: </label>
                  <input {...register("ghichu")} placeholder="Ghi chú" type="text" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400'/>
                </div>
              </div>

              <DialogActions>
                <Button
                  color="primary"
                  variant="contained"
                  disabled={!watch('id_item')}
                  type="submit"
                  style={{ margin: "4px auto" }}
                >
                  <ThumbUpAltIcon />
                  <span>Lưu dữ liệu</span>
                </Button>
              </DialogActions>
            </form>
          </Box>

          <div>
            <h3 className="text-center my-4 text-lg font-bold text-blue-500">Quá trình công tác giữ các chức vụ</h3>
          </div>
          <TableContainer style={{ overflowX: "scroll" }}>
            <Table aria-label="custom pagination table">
              <TableHead>
                <TableRow>
                  <TableCell
                    align="left"
                    style={{
                      fontSize: "14px",
                      color: "#fff",
                      padding: "8px 8px",
                      backgroundColor: "rgb(30, 41, 59 )"
                    }}
                  >
                    #
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{
                      fontSize: "14px",
                      color: "#fff",
                      padding: "8px 8px",
                      backgroundColor: "rgb(30, 41, 59 )",
                      minWidth: "100px",
                    }}
                  >
                    Chức vụ công tác
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{
                      fontSize: "14px",
                      color: "#fff",
                      padding: "8px 8px",
                      backgroundColor: "rgb(30, 41, 59 )",
                      minWidth: "150px",
                    }}
                  >
                    Ngày giữ chức vụ
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{
                      fontSize: "14px",
                      color: "#fff",
                      padding: "8px 8px",
                      backgroundColor: "rgb(30, 41, 59 )",
                      minWidth: "150px",
                    }}
                  >
                    Ghi chú
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{
                      fontSize: "14px",
                      color: "#fff",
                      padding: "8px 8px",
                      backgroundColor: "rgb(30, 41, 59 )",
                      // minWidth: "150px",
                    }}
                  >
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {chucvuList.length > 0 ?
                  chucvuList.map((i, index) => (
                    <TableRow key={i._id}>
                      <TableCell>
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        {i.chucvu.chucvu}
                      </TableCell>
                      <TableCell>
                        {dayjs(i.tungay).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell>
                        {i.ghichu}
                      </TableCell>
                      <TableCell align="right"
                        className="bg-gray-300 flex justify-center items-center space-x-1 hover:bg-slate-500 transition duration-300"
                        style={{ width: "180px", }}>
                        {roles && roles.includes("sửa nâng cao") && (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => onClickEditItem(i)}
                          >
                            <EditIcon style={{ fontSize: "20px" }} />
                          </Button>
                        )}
                        {roles && roles.includes("xóa nâng cao") && (
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            style={{ marginLeft: "4px" }}
                            onClick={() => handleOpenDialogDelete(i._id)}
                          >
                            <DeleteOutlineIcon style={{ fontSize: "20px" }} />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                  : (
                    <TableRow>
                      <TableCell>
                        Không có dữ liệu trong hệ thống
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </TableContainer>

          <DialogDelete
            open={openDialogDelete.status}
            onCloseDialogDelete={handleCloseDialogDelete}
            onConfirmDelete={handleConfirmDelete}
            onCancelDelete={handleCancelDelete}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
