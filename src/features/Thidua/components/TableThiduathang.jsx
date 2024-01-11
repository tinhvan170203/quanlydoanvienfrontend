import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import BodyTableThiduathang from "./BodyTableThiduathang";



function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === "rtl" ? (
                    <KeyboardArrowRight />
                ) : (
                    <KeyboardArrowLeft />
                )}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === "rtl" ? (
                    <KeyboardArrowLeft />
                ) : (
                    <KeyboardArrowRight />
                )}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export default function TableThiduathang({
    list,
    onHandleChangeAll,
    onHandleChangeItem,
    onHandleChangeText
}) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    // Avoid a layout jump when reaching the last page with empty list.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - list.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // const roles = useSelector((state) => state.authReducer.roles_x01);
    return (
        <>
            <TableContainer component={Paper} style={{ overflowX: "scroll" }}>
                <Table aria-label="custom pagination table">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                align="left"
                                style={{
                                    fontSize: "14px",
                                    color: "#fff",
                                    padding: "8px 8px",
                                    backgroundColor: "rgb(30, 41, 59 )",
                                    // minWidth: "250px",
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
                                    minWidth: "250px",
                                }}
                            >
                                Họ tên
                            </TableCell>
                            <TableCell
                                align="left"
                                style={{
                                    fontSize: "14px",
                                    color: "#fff",
                                    padding: "8px 8px",
                                    backgroundColor: "rgb(30, 41, 59 )",
                                    minWidth: "120px",
                                }}
                            >
                                Bậc hàm
                            </TableCell>
                            <TableCell
                                align="left"
                                style={{
                                    fontSize: "14px",
                                    color: "#fff",
                                    padding: "8px 8px",
                                    backgroundColor: "rgb(30, 41, 59 )",
                                    minWidth: "300px",
                                }}
                            >
                                Đơn vị công tác
                            </TableCell>
                            <TableCell
                                align="left"
                                style={{
                                    fontSize: "14px",
                                    color: "#fff",
                                    padding: "8px 8px",
                                    backgroundColor: "rgb(30, 41, 59 )",
                                    minWidth: "120px",
                                }}
                            >
                                Phân loại
                            </TableCell>
                            <TableCell
                                align="left"
                                style={{
                                    fontSize: "14px",
                                    color: "#fff",
                                    padding: "8px 8px",
                                    backgroundColor: "rgb(30, 41, 59 )",
                                    minWidth: "300px",
                                }}
                            >
                                Ghi chú
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={4}
                                className="border-r border-slate-300"
                                align="left"
                                style={{ fontWeight: "bold" }}></TableCell>
                            <TableCell
                                className="border-r border-slate-300"
                                align="left"
                                style={{ fontWeight: "bold" }}>
                                <select onChange={(e)=>onHandleChangeAll(e.target.value)} className="outline-none p-2 w-full">
                                    <option value='null'>Chưa phân loại</option>
                                    <option value="red">Cờ đỏ</option>
                                    <option value="blue">Cờ xanh</option>
                                    <option value="yellow">Cờ vàng</option>
                                </select>
                            </TableCell>
                            <TableCell className="border-r border-slate-300"
                                align="left"
                                style={{ fontWeight: "bold" }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : list
                        ).map((row, index) => (
                            <BodyTableThiduathang
                                row={row}
                                key={row._id}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                index={index + 1}
                                onHandleChangeItem={onHandleChangeItem}
                                onHandleChangeText={onHandleChangeText}
                                // all={all}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <div>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100, { label: "Tất cả", value: -1 }]}
                    // colSpan={3}
                    count={list.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                        inputProps: {
                            "aria-label": "rows per page",
                        },
                        native: true,
                    }}
                    component={"div"}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                    labelRowsPerPage="Số cán bộ hiển thị trên mỗi trang"
                    labelDisplayedRows={function defaultLabelDisplayedRows({
                        from,
                        to,
                        count,
                    }) {
                        return `hiển thị ${from} đến ${to} cán bộ trong tổng số ${count !== -1 ? count : `more than ${to}`
                            } cán bộ`;
                    }}
                />
            </div>
        </>
    );
}
