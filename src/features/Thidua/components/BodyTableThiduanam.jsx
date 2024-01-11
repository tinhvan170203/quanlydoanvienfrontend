import * as React from "react";
import Button from "@mui/material/Button";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import { useEffect } from "react";

const BodyTableThiduanam = ({
    row,
    page,
    rowsPerPage,
    index,
    onHandleChangeItem,
    onHandleChangeText
    // all
}) => {
    const [value, setValue] = useState('null');
    const [text, setText] = useState('');

    // const roles = useSelector((state) => state.authReducer.roles_x01);
    useEffect(()=>{
        if(row){
            setValue(row.thiduanam.result);
            setText(row.thiduanam.ghichu)
        };
    },[row]);


    const handleChange = (e)=> {
        setValue(e.target.value);
        onHandleChangeItem(row, e.target.value)
    };

    const handleChangeText = (e) => {
        setText(e.target.value);
        onHandleChangeText(row, e.target.value)
    }

    return (
        <TableRow key={row._id}>
            <TableCell
                className="border-r border-slate-300"
                align="left"
                style={{ fontWeight: "bold" }}
            >
                {page * rowsPerPage + index}
            </TableCell>
            <TableCell
                className="border-r border-slate-300"
                align="left"
                style={{ fontWeight: "bold" }}
            >
                {row.hoten}
            </TableCell>
            <TableCell className="border-r border-slate-300" align="left">
                {row.bachamPopulate[0].bacham}
            </TableCell>
            <TableCell className="border-r border-slate-300" align="left">
                <p className="truncate">{row.donviPopulate[0].tendonvi}</p>
            </TableCell>
            <TableCell className="border-r border-slate-300" align="left">
                <select className="outline-none p-2 w-full" onChange={(e)=>handleChange(e)} value={value}>
                <option value='null'>Chưa phân loại</option>
                <option value="Không hoàn thành nhiệm vụ">Không hoàn thành nhiệm vụ</option>
                <option value="Hoàn thành nhiệm vụ">Hoàn thành nhiệm vụ</option>
                <option value="Hoàn thành tốt nhiệm vụ">Hoàn thành tốt nhiệm vụ</option>
                <option value="Hoàn thành xuất sắc nhiệm vụ">Hoàn thành xuất sắc nhiệm vụ</option>
                </select>
            </TableCell>
            <TableCell className="border-r border-slate-300" align="left">
                <input type="text" className="w-full border p-2" 
                    value={text} onChange={(e)=>handleChangeText(e)}
                />
            </TableCell>
        </TableRow>
    );
};

export default BodyTableThiduanam;
