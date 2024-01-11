import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from '@mui/icons-material/Search';
import Switch from '@mui/material/Switch';
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
import Select from 'react-select';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CancelButton = styled(IconButton)({
    position: "absolute",
    right: "16px",
    top: "4px",
});



export default function EditModal({
    open,
    item,
    onCloseDialogEdit,
    onSubmit,
    donvis
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
            tendoi: "",
            donvi: "",
            thutu: 1,
            status: true
        },
    });


    useEffect(() => {
        if (item) {
            setValue("tendoi", item.tendoi, { shouldValidate: true });
            setValue("thutu", item.thutu, { shouldValidate: true });
            setValue("status", item.status, { shouldValidate: true });
            setValue("donvi", { label: item.donvi.tendonvi, value: item.donvi._id }, { shouldValidate: true });
        }
    }, [item]);

    const handleFormSubmit = async (values) => {
        if (onSubmit) {
            const data = { ...values, id_edit: item._id };
            await onSubmit(data);
            onCloseDialogEdit();
        }
    };


    return (
        <>
            <Dialog
                maxWidth="lg"
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
                        Chỉnh sửa đội nghiệp vụ, công an cấp xã
                    </span>
                    <CancelButton onClick={() => onCloseDialogEdit()}>
                        <CancelIcon style={{ color: "white" }} />
                    </CancelButton>
                </DialogTitle>
                <DialogContent>
                    <Box>

                        <form className='mt-2 mx-8' onSubmit={handleSubmit(handleFormSubmit)}>
                            <div className='flex-col flex'>
                                <label className='underline font-semibold'><span className='text-red-600 font-semibold'> (*)</span> Tên đội nghiệp vụ, công an cấp xã: </label>
                                <input {...register("tendoi", { required: true })} type="text" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400'/>
                            </div>
                            <div className='flex space-x-2'>
                                <div className='flex-col flex md:basis-1/2'>
                                    <label className='underline font-semibold'><span className='text-red-600 font-semibold'> (*)</span> Thứ tự: </label>
                                    <input {...register("thutu", { required: true })} type="number" className='outline-none my-4 border rounded-md p-2 border-neutral-600
                  focus:ring-2 focus:border-blue-400'/>
                                </div>
                                <div className='flex-col flex md:basis-1/2'>
                                    <label className='underline font-semibold'>Trạng thái sử dụng:</label>
                                    <Controller
                                        name="status"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <Switch
                                                checked={value}
                                                onChange={onChange}
                                            />
                                        )}
                                    />
                                </div>

                            </div>
                            <div className='flex-col flex'>
                                <label className='underline font-semibold'><span className='text-red-600 font-semibold'> (*)</span> Đơn vị cấp trên: </label>
                                <Controller
                                    control={control}
                                    name="donvi"
                                    render={({ field }) => (
                                        <Select
                                            required={true}
                                            name="donvi"
                                            options={donvis}
                                            className="basic-multi-select my-4"
                                            classNamePrefix="select"
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
                                    <span>Cập nhật</span>
                                </Button>
                            </DialogActions>
                        </form>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}
