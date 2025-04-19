import ExpandMore from "@mui/icons-material/ExpandMore";
import Breadcrumb from "@mui/material/Breadcrumbs";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import { FaEye, FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import MenuItem from "@mui/material/MenuItem";
import { useContext, useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Pagination from "@mui/material/Pagination";

import { Button, Modal, Box, TextField, Typography, Snackbar } from '@mui/material';

import axios from "../../utils/axioConfig";

import { toast } from "react-toastify";
import { MyContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../../auth/AuthService";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        "&:hover, &focus": {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        "&:active": {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});

const Users = () => {
    const context = useContext(MyContext);

    const { user } = useContext(AuthContext); // Lấy thông tin người dùng từ contex
    const currentUserLogin = user?.id; // Thông tin của người dùng đang đăng nhập

    const [showByStatus, setShowByStatus] = useState("");
    const [showBysetCatBy, setCatBy] = useState("");

    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const resultsPerPage = 5;

    // Lọc danh sách nhân viên theo trạng thái
    const filteredEmployees = users.filter((employee) => {
        if (showByStatus === "") return true; // Hiển thị tất cả nếu không có trạng thái chọn
        return employee.status === Number(showByStatus); // Chuyển đổi trạng thái sang số
    });

    // Phân trang
    const totalResults = filteredEmployees.length;
    const totalPages = Math.ceil(totalResults / resultsPerPage);
    const indexOfLastUser = currentPage * resultsPerPage;
    const indexOfFirstUser = indexOfLastUser - resultsPerPage;
    const currentUsers = filteredEmployees.slice(
        indexOfFirstUser,
        indexOfLastUser
    );

    // Hàm xử lý thay đổi trang
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get("/admin/users"); // Adjust the URL as needed
            setUsers(response.data);
        } catch (error) {
            toast.error(
                "Error fetching users: " + (error.response?.data || error.message)
            );
        }
    };

    useEffect(() => {
        fetchUsers();

        context.setisHideSidebarAndHeader(false);
        window.scrollTo(0, 0);
    }, []);

    const handleDeleteUser = async (id) => {
        try {
            await axios.post(`/admin/users/delete/${id}`);
            toast.success("User deleted successfully!");
            fetchUsers(); // Refresh the user list after deletion
        } catch (error) {
            toast.error(
                "Error deleting user: " + (error.response?.data || error.message)
            );
        }
    };


    const [openAddUser, setOpenAddUser] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const handleCloseAddUser = () => setOpenAddUser(false);
    const handleOpenAddUser = () => setOpenAddUser(true);
    const handleCloseSnackbar = () => setOpenSnackbar(false);

    const handleSaveUser = () => {
        // Thêm logic lưu ở đây
        setOpenSnackbar(true); // Hiển thị snackbar khi lưu thành công
        handleCloseAddUser(); // Đóng modal
    };
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 900,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    return (
        <>
            <div className="right-content w-100">

                <div className="card shadow border-0 p-3 mt-2">
                    <h3 className="hd">Nhân viên đang hoạt động</h3>

                    <div className="col-md-3">
                        <Button variant="contained" className="btn-blue btn-big" onClick={handleOpenAddUser}>Thêm nhân viên</Button>
                        <Modal open={openAddUser} onClose={handleCloseAddUser}>
                            <Box sx={style}>
                                <Typography variant="h6" component="h2">
                                    Thêm nhân viên
                                </Typography>
                                <form>
                                    <TextField label="Tên nhân viên" variant="outlined" fullWidth margin="normal" />
                                    <TextField label="Số điện thoại" variant="outlined" fullWidth margin="normal" />
                                    <TextField label="Email" type="email" variant="outlined" fullWidth margin="normal" />
                                    <TextField label="Ngày sinh" type="date" // Đặt loại là 'date' cho ngày sinh
                                        InputLabelProps={{
                                            shrink: true, // Đảm bảo label không bị chồng lên
                                        }} variant="outlined" fullWidth margin="normal" />
                                    <TextField
                                        label="Giới tính"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        select // Thêm thuộc tính select để tạo dropdown
                                        SelectProps={{
                                            native: true,
                                        }}
                                    >
                                        <option value="">Chọn giới tính</option>
                                        <option value="male">Nam</option>
                                        <option value="female">Nữ</option>
                                        <option value="other">Khác</option>
                                    </TextField>
                                </form>
                                <Button variant="contained" color="secondary" onClick={handleSaveUser}>
                                    Lưu
                                </Button>
                            </Box>
                        </Modal>
                        <Snackbar
                            open={openSnackbar}
                            autoHideDuration={1000} // Thời gian hiển thị snackbar
                            onClose={handleCloseSnackbar}
                            message="Thêm nhân viên thành công!"                        
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        />
                    </div>

                    <div className="row cardFilters mt-3">
                        <div className="col-md-3">
                            <h4>Trạng thái nhân viên</h4>
                            <FormControl size="small" className="w-100">
                                <Select
                                    value={showByStatus}
                                    onChange={(e) => {
                                        setShowByStatus(e.target.value);
                                        setCurrentPage(1); // Reset về trang đầu khi thay đổi trạng thái
                                    }}
                                    displayEmpty
                                    inputProps={{ "aria-label": "Without label" }}
                                    className="w-100"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={1}>Đang làm việc</MenuItem>
                                    <MenuItem value={0}>Đã nghỉ</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className="col-md-3">
                            <h4>Chức danh</h4>
                            <FormControl size="small" className="w-100">
                                <Select
                                    value={showBysetCatBy}
                                    onChange={(e) => setCatBy(e.target.value)}
                                    displayEmpty
                                    inputProps={{ "aria-label": "Without label" }}
                                    className="w-100"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={10}>Admin</MenuItem>

                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Mã nhân viên</th>
                                    <th style={{ width: "300px" }}>Nhân viên</th>
                                    <th>Số điện thoại</th>
                                    <th>Email</th>
                                    <th>Ngày sinh</th>
                                    <th>Giới tính</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.code}</td>
                                        <td>
                                            <div className="d-flex align-items-center productBox">
                                                <div className="imgWrapper">
                                                    <div className="img card shadow m-0">
                                                        <img src={user.image} className="w-100" alt="" />
                                                    </div>
                                                </div>
                                                <div className="info pl-3">
                                                    <h6>{user.name} </h6>
                                                    <p>
                                                        Chức danh: {" "}
                                                        {user.roleName === null
                                                            ? "Không có"
                                                            : user.roleName}{" "}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{user.phone}</td>
                                        <td>{user.email}</td>
                                        <td>{formatTimestamp(user.dateOfBirth)}</td>
                                        <td>
                                            {user.gender === 1
                                                ? "Nam"
                                                : user.gender === 0
                                                    ? "Nữ"
                                                    : "Khác"}
                                        </td>
                                        <td>
                                            <div className="actions d-flex align-items-center">
                                                <Link to={`/admin/users/details/${user.id}`}>
                                                    <Button className="secondary" color="secondary">
                                                        <FaEye />
                                                    </Button>
                                                </Link>
                                                <Link to={`/admin/users/update/${user.id}`}>
                                                    <Button className="success" color="success">
                                                        <FaPencilAlt />
                                                    </Button>
                                                </Link>
                                                {
                                                    user.status === 1 && user.id !== currentUserLogin ? (
                                                        <Button
                                                            className="error"
                                                            color="error"
                                                            onClick={() => handleDeleteUser(user.id)}
                                                        >
                                                            <MdDelete />
                                                        </Button>
                                                    ) : null
                                                }

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="d-flex tableFooter">
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                showFirstButton
                                showLastButton
                                color="primary"
                                className="pagination"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Users;