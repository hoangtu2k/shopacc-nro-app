import "../../styles/product.css";
import React, { useContext, useEffect, useState } from "react";
import axios from "../../utils/axioConfig";
import { toast } from "react-toastify";
import { MyContext } from "../../App";
import { storage } from "../../utils/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MdDelete } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { FaEye, FaPencilAlt, FaRegImages } from "react-icons/fa";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Swal from "sweetalert2";
import { confirmAlert } from 'react-confirm-alert';


const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%", // Chiều rộng phản hồi
    maxWidth: 1000,
    maxHeight: "80vh", // Chiều cao tối đa
    overflowY: "auto", // Cho phép cuộn
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
};

const styleImport = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%", // Chiều rộng phản hồi
    maxWidth: 1000,
    maxHeight: "80vh", // Chiều cao tối đa
    overflowY: "auto", // Cho phép cuộn
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
};

const ProductManagement = () => {
    const [id, setId] = useState(null);
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [planet, setPlanet] = useState("");
    const [register, setRegister] = useState("");
    
    const [price, setPrice] = useState("");

    const [category, setCategory] = useState("");
    const [categoryList, setcategoriesList] = useState([]);
    const [server, setServer] = useState("");
    const [serverList, setServerList] = useState([]);

    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState({
        main: [],
        additional: [],
        featured: [],
        secondary: [],
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChangeCategory = (event) => {
        setCategory(event.target.value);
    };

    const handleChangeServer = (event) => {
        setServer(event.target.value);
    };

    const context = useContext(MyContext);

    const [showByStatus, setShowByStatus] = useState("");
    const [showBysetCatBy, setCatBy] = useState("");

    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 5;

    // Lọc danh sách sản phẩm theo trạng thái, thương hiệu và danh mục
    const filteredProducts = Array.isArray(products) ? products.filter((product) => {
        const matchesStatus =
            showByStatus === "" || product.status === Number(showByStatus);
        const matchesCategory =
            showBysetCatBy === "" || product.categoryId === Number(showBysetCatBy); // Giả sử product.categoryId chứa ID danh mục

        return matchesStatus && matchesCategory; // Phải thỏa mãn cả điều kiện
    }) : []; // Nếu không phải là mảng, trả về mảng rỗng

    // Phân trang
    const totalResults = filteredProducts.length;
    const totalPages = Math.ceil(totalResults / resultsPerPage);
    const indexOfLastUser = currentPage * resultsPerPage;
    const indexOfFirstUser = indexOfLastUser - resultsPerPage;
    const currentUsers = filteredProducts.slice(
        indexOfFirstUser,
        indexOfLastUser
    );

    // Hàm xử lý thay đổi trang
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Hàm định dạng giá
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN").format(price); // Thêm "+ VND " vào cuối
    };

    const handleMainImageChange = (event) => {
        const file = event.target.files[0];
        const previewUrl = URL.createObjectURL(file);

        console.log("Main Image:", { file, url: previewUrl });

        setImages((prevImages) => [
            { file, main: true, featured: false, secondary: false },
            ...prevImages.filter((img) => !img.main),
        ]);

        setImagePreviews((prevPreviews) => ({
            main: [
                { url: previewUrl, main: true, featured: false, secondary: false },
            ],
            additional: prevPreviews.additional,
            featured: prevPreviews.featured,
            secondary: prevPreviews.secondary,
        }));
    };

    const handleAdditionalImagesChange = (event) => {
        const files = Array.from(event.target.files);
        const newImages = files.map((file) => ({
            file,
            main: false,
            featured: false,
        }));
        const newImagePreviews = files.map((file) => ({
            url: URL.createObjectURL(file),
            main: false,
            featured: false,
        }));

        console.log("Additional Images:", newImages, newImagePreviews);

        setImages((prevImages) => [...prevImages, ...newImages]);
        setImagePreviews((prevPreviews) => ({
            ...prevPreviews,
            additional: [...prevPreviews.additional, ...newImagePreviews],
        }));
    };

    const handleFeaturedImagesChange = (event) => {
        const files = Array.from(event.target.files);
        const newImages = files.map((file) => ({
            file,
            main: false,
            featured: true,
        }));
        const newImagePreviews = files.map((file) => ({
            url: URL.createObjectURL(file),
            main: false,
            featured: true,
        }));

        console.log("Featured Images:", newImages, newImagePreviews);

        setImages((prev) => [...prev, ...newImages]);
        setImagePreviews((prev) => ({
            ...prev,
            featured: [...prev.featured, ...newImagePreviews],
        }));
    };

    const handleSecondaryImagesChange = (event) => {
        const files = Array.from(event.target.files);
        const newImages = files.map((file) => ({
            file,
            main: false,
            secondary: true,
        }));
        const newImagePreviews = files.map((file) => ({
            url: URL.createObjectURL(file),
            main: false,
            secondary: true,
        }));

        console.log("Secondary Images:", newImages, newImagePreviews);

        setImages((prev) => [...prev, ...newImages]);
        setImagePreviews((prev) => ({
            ...prev,
            secondary: [...prev.secondary, ...newImagePreviews],
        }));
    };

    const removeImage = (type, index) => {
        if (type === "main") {
            setImagePreviews((prev) => ({
                ...prev,
                main: prev.main.filter((_, i) => i !== index),
            }));
        } else if (type === "additional") {
            setImagePreviews((prev) => ({
                ...prev,
                additional: prev.additional.filter((_, i) => i !== index),
            }));
        } else if (type === "featured") {
            setImagePreviews((prev) => ({
                ...prev,
                featured: prev.featured.filter((_, i) => i !== index),
            }));
        } else if (type === "secondary") {
            setImagePreviews((prev) => ({
                ...prev,
                secondary: prev.secondary.filter((_, i) => i !== index),
            }));
        }
    };

    const handleSubmitProductAdd = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            let imageUrls = [];

            if (images && images.length > 0) {
                imageUrls = await Promise.all(
                    images.map(async (image) => {
                        const storageRef = ref(
                            storage,
                            `images/sheepshop/${image.file.name}`
                        );
                        let imageUrl;

                        try {
                            // Kiểm tra xem hình ảnh đã tồn tại chưa
                            imageUrl = await getDownloadURL(storageRef);
                            console.log("Image already exists:", imageUrl);
                            return {
                                url: imageUrl,
                                mainImage: image.main,
                            };
                        } catch (error) {
                            // Nếu chưa tồn tại, upload hình ảnh
                            await uploadBytes(storageRef, image.file);
                            imageUrl = await getDownloadURL(storageRef);
                            console.log("Image uploaded:", imageUrl);
                        }

                        return {
                            url: imageUrl,
                            mainImage: image.main,
                        };
                    })
                );
            }

            // Gửi yêu cầu thêm sản phẩm
            const productResponse = await axios.post(`/admin/products`, {
                code,
                name,
                planet,
                register,
                price,
                categoryId: category,
                serverId: server,
            });

            const productId = productResponse.data.id;

            // Gửi yêu cầu thêm hình ảnh sản phẩm
            await Promise.all(
                imageUrls.map((image) =>
                    axios.post(`/admin/product/image`, {
                        productId,
                        imageUrl: image.url,
                        mainImage: image.mainImage ? 1 : 0, // Chuyển đổi boolean sang 1 hoặc 0
                    })
                )
            );

            handleCloseModelAddAndUpdateProduct();

            // Xác nhận trước khi thêm sản phẩm
            const result = await Swal.fire({
                title: 'Xác nhận',
                text: "Bạn có chắc chắn muốn thêm sản phẩm này không?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Có',
                cancelButtonText: 'Không'
            });

            // Nếu người dùng không xác nhận, dừng lại
            if (!result.isConfirmed) {
                return;
            }

            // Cập nhật danh sách sản phẩm và đặt lại form
            fetchProducts();
            resetFormFields();
        } catch (error) {
            if (error.response) {
                console.error("Server error:", error.response.data);
                Swal.fire({
                    title: 'Lỗi',
                    text: error.response.data.message || "Đã có lỗi xảy ra.",
                    icon: 'error'
                });
            } else if (error.request) {
                console.error("No response received:", error.request);
                Swal.fire({
                    title: 'Lỗi',
                    text: "Không nhận được phản hồi từ máy chủ. Vui lòng thử lại.",
                    icon: 'error'
                });
            } else {
                console.error("Error:", error.message);
                Swal.fire({
                    title: 'Lỗi',
                    text: error.message,
                    icon: 'error'
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitProductUpdate = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            let imageUrls = [];

            // Kết hợp tất cả các loại ảnh từ images và imagePreviews
            const allImages = [
                ...images,
                ...imagePreviews.main,
                ...imagePreviews.additional,
                ...imagePreviews.featured,
                ...imagePreviews.secondary,
            ];

            if (allImages && allImages.length > 0) {
                imageUrls = await Promise.all(
                    allImages.map(async (image) => {
                        // Kiểm tra xem image có tồn tại và có thuộc tính file
                        if (!image || !image.file) {
                            console.warn(
                                "Hình ảnh không được xác định hoặc không hợp lệ, bị bỏ qua..."
                            );
                            return null; // Bỏ qua ảnh không hợp lệ
                        }

                        const storageRef = ref(
                            storage,
                            `images/sheepshop/${image.file.name}`
                        );
                        let imageUrl;

                        try {
                            // Kiểm tra xem ảnh đã tồn tại chưa
                            imageUrl = await getDownloadURL(storageRef);
                            console.log("Hình ảnh đã tồn tại:", imageUrl);
                            return {
                                url: imageUrl,
                                mainImage: image.main,
                            };
                        } catch (error) {
                            // Nếu không tồn tại, tải lên ảnh mới
                            await uploadBytes(storageRef, image.file);
                            imageUrl = await getDownloadURL(storageRef);
                            console.log("Hình ảnh đã được tải lên:", imageUrl);
                            return {
                                url: imageUrl,
                                mainImage: image.main,
                            };
                        }
                    })
                );

                // Lọc ra các giá trị null (các ảnh không hợp lệ)
                imageUrls = imageUrls.filter((url) => url !== null);
            }

            // Update product details
            const productResponse = await axios.put(`/admin/products/${id}`, {
                code,
                name,
                planet,
                register,
                price,
                categoryId: category,
                serverId: server,
            });

            const productId = productResponse.data.id;

            if (imageUrls === null) {
                // Delete existing images
                await axios.delete(`/admin/product/image/${productId}`);
            }

            // Add new images
            await Promise.all(
                imageUrls.map((image) =>
                    axios.post(`/admin/product/image`, {
                        productId,
                        imageUrl: image.url,
                        mainImage: image.mainImage ? 1 : 0, // Convert boolean to 1 or 0
                    })
                )
            );

            handleCloseModelAddAndUpdateProduct();

            const result = await Swal.fire({
                title: 'Xác nhận',
                text: "Bạn có chắc chắn muốn sửa sản phẩm này không?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Có',
                cancelButtonText: 'Không'
            });

            if (!result.isConfirmed) {
                return; // Ngừng nếu người dùng không xác nhận
            }

            fetchProducts();
            resetFormFields();
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenModelUpdateProduct = (product) => {
        setId(product.id);
        setCode(product.code);
        setName(product.name);
        setPlanet(product.planet);
        setServer(product.serverId);
        setRegister(product.register);
        setPrice(product.price);
        setCategory(product.categoryId);

        const mainImage = product.imageUrl
            ? [{ url: product.imageUrl, main: true }]
            : [];
        const listImageNotMain = Array.isArray(product.notMainImages)
            ? product.notMainImages
            : [];

        const additionalImages = listImageNotMain
            .slice(0, 1)
            .map((url) => ({ file: { url }, main: false, additional: true }));
        const featuredImages = listImageNotMain
            .slice(1, 2)
            .map((url) => ({ file: { url }, main: false, featured: true }));
        const secondaryImages = listImageNotMain
            .slice(2, 3)
            .map((url) => ({ file: { url }, main: false, secondary: true }));

        // Set images and previews
        setImages([
            ...mainImage,
            ...additionalImages,
            ...featuredImages,
            ...secondaryImages,
        ]);
        setImagePreviews({
            main: mainImage,
            additional: additionalImages.map((item) => item.file),
            featured: featuredImages.map((item) => item.file),
            secondary: secondaryImages.map((item) => item.file),
        });

        setOpenModelUpdateProduct(true);
    };

    const resetFormFields = () => {
        setCode("");
        setName("");
        setRegister("");
        setPlanet("");
        setServer("");
        setPrice("");
        setCategory("");
        setImages([]);
        setImagePreviews({
            main: [],
            additional: [],
            featured: [],
            secondary: [],
            banner: [],
        });
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get("/admin/products"); // Adjust the URL as needed
            setProducts(response.data);
        } catch (error) {
            toast.error(
                "Error fetching users: " + (error.response?.data || error.message)
            );
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const responseCategory = await axios.get("/admin/categories"); // Replace with your API endpoint
                setcategoriesList(responseCategory.data);
            } catch (error) {
                console.error("Error fetching product category:", error);
            }
        };
        const fetchServers = async () => {
            try {
                const responseServer = await axios.get("/admin/servers"); // Replace with your API endpoint
                setServerList(responseServer.data);
            } catch (error) {
                console.error("Error fetching product category:", error);
            }
        };
        fetchServers();
        fetchCategories();
        fetchProducts();

        context.setisHideSidebarAndHeader(false);
        window.scrollTo(0, 0);
    }, []);

    const [openModelAddProduct, setModelAddProduct] = useState(false);
    const [openModelUpdateProduct, setOpenModelUpdateProduct] = useState(false);
    const [openModelImport, setModelImport] = useState(false);
    const handleOpenModelImport = () => setModelImport(true);
    const handleOpenModelAddProduct = () => setModelAddProduct(true);
    const handleCloseModelAddAndUpdateProduct = () => {
        setModelImport(false);
        setModelAddProduct(false);
        setOpenModelUpdateProduct(false);
        setId(null); // Reset ID sản phẩm
        resetFormFields(); // Reset form fields when closing
    };

    return (
        <>
            <div className="right-content w-100">


                <div className="card shadow border-0 p-3 mt-4">

                    <div className="row">

                        <div className="col-md-3">
                            <h3 className="hd">Danh sách sản phẩm</h3>
                        </div>

                        <div className="col-md-3">
                            <Button
                                className="btn-blue btn-lg btn-big"
                                onClick={handleOpenModelAddProduct} >Thêm sản phẩm mới</Button>
                        </div>

                        <div className="col-md-3">
                            <Button
                                className="btn-blue btn-lg btn-big"
                                onClick={handleOpenModelImport} > Import</Button>
                        </div>

                    </div>

                    <div className="row cardFilters mt-3">
                        <div className="col-md-3">
                            <h4>Hiển thị sản phẩm theo trạng thái</h4>
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
                                    <MenuItem value={1}>Đang kinh doanh</MenuItem>
                                    <MenuItem value={0}>Ngừng kinh doanh</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <div className="col-md-3">
                            <h4>Hiển thị theo danh mục</h4>
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
                                    {categoryList.map((cate) => (
                                        <MenuItem key={cate.id} value={cate.id}>
                                            {cate.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Mã sản phẩm</th>
                                    <th style={{ width: "300px" }}>Sản phẩm</th>
                                    <th>Danh mục</th>
                                    <th>Server</th>
                                    <th>Hành tinh</th>
                                    <th>Đăng ký</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.code}</td>
                                        <td>
                                            <div className="d-flex align-items-center productBox">
                                                <div className="imgWrapper">
                                                    <div className="img card shadow m-0">
                                                        <img
                                                            src={product.imageUrl}
                                                            className="w-100"
                                                            alt={product.name}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="info pl-3">
                                                    <h6>{product.name}</h6>
                                                    <p>{product.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{product.categoryName}</td>
                                        <td>{product.serverName}</td>
                                        <td>{product.planet}</td>
                                        <td>
                                            {product.register === 1
                                                ? "ĐK thật"
                                                : "ĐK ảo"
                                            }
                                        </td>
                                        <td>
                                            {product.status === 1
                                                ? "Cho phép kinh doanh"
                                                : "Ngừng kinh doanh"
                                            }
                                        </td>
                                        <td>
                                            <div className="actions d-flex align-items-center">
                                                <Button className="secondary" color="secondary">
                                                    <FaEye />
                                                </Button>
                                                <Button
                                                    className="success"
                                                    color="success"
                                                    onClick={() => handleOpenModelUpdateProduct(product)}
                                                >
                                                    <FaPencilAlt />
                                                </Button>
                                                <Button className="error" color="error">
                                                    <MdDelete />
                                                </Button>
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

            {/* Import sản phẩm */}
            <Modal
                keepMounted
                open={openModelImport}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={styleImport}>
                    <Typography
                        id="keep-mounted-modal-title"
                        variant="h6"
                        component="span"
                    >
                        Nhập hàng hóa từ file dữ liệu (Tải về file mẫu: Excel file )
                    </Typography>
                    <Typography
                        id="keep-mounted-modal-description"
                        component="span"
                        sx={{ mt: 2 }}
                    >
                        <form className="form  mt-3">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="card p-2 mt-0">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="row">
                                                    <div className="col">


                                                        <div className="form-group">
                                                            <div className="row">
                                                                <div className="col-md-6">

                                                                </div>
                                                                <div className="col-md-6">
                                                                    <Button className="btn-blue mt-2">Chọn file dữ liệu</Button>
                                                                </div>
                                                            </div>
                                                        </div>


                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card p-4 mt-0">
                                <div className="row">
                                    <div className="col mt-2">
                                        <Button
                                            className="btn-blue btn-lg btn-big"
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Đang thực hiện..." : "Thực hiện"}
                                        </Button>
                                    </div>
                                    <div className="col mt-2">
                                        <Button
                                            className="btn-big btn-close"
                                            onClick={handleCloseModelAddAndUpdateProduct}
                                        >
                                            Bỏ qua
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Typography>
                </Box>
            </Modal>

            {/* Thêm sản phẩm */}
            <Modal
                keepMounted
                open={openModelAddProduct}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        id="keep-mounted-modal-title"
                        variant="h6"
                        component="span"
                    >
                        Thêm sản phẩm
                    </Typography>
                    <Typography
                        id="keep-mounted-modal-description"
                        component="span"
                        sx={{ mt: 2 }}
                    >
                        <form className="form" onSubmit={handleSubmitProductAdd}>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="card p-2 mt-0">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="row ">
                                                    <div className="col">
                                                        <div className="form-group">
                                                            <div className="row">
                                                                <div className="col-md-3">
                                                                    <h6 className="mt-2">Mã sản phẩm</h6>
                                                                </div>
                                                                <div className="col-md-9">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Mã sản phẩm"
                                                                        value={code || ""}
                                                                        onChange={(e) => setCode(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="form-group">
                                                            <div className="row">
                                                                <div className="col-md-3">
                                                                    <h6 className="mt-2">Tên sản phẩm</h6>
                                                                </div>
                                                                <div className="col-md-9">
                                                                    <input
                                                                        type="text"
                                                                        value={name || ""}
                                                                        onChange={(e) => setName(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="form-group">
                                                            <div className="row">
                                                                <div className="col-md-3">
                                                                    <h6 className="mt-2">Giá bán</h6>
                                                                </div>
                                                                <div className="col-md-9">
                                                                    <input
                                                                        type="text"
                                                                        value={price || ""}
                                                                        onChange={(e) => setPrice(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>


                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="row">
                                                    <div className="col-sm-6">
                                                        <h6 className="form-select-title">Danh mục</h6>

                                                        <Select
                                                            value={category || ""}
                                                            onChange={handleChangeCategory}
                                                            displayEmpty
                                                            inputProps={{ "aria-label": "Without label" }}
                                                            className="w-100"
                                                        >
                                                            <MenuItem value="">
                                                                <em>None</em>
                                                            </MenuItem>
                                                            {categoryList.map((cate) => (
                                                                <MenuItem key={cate.id} value={cate.id}>
                                                                    {cate.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>

                                                        <h6 className="form-select-title">Server</h6>

                                                        <Select
                                                            value={server || ""}
                                                            onChange={handleChangeServer}
                                                            displayEmpty
                                                            inputProps={{ "aria-label": "Without label" }}
                                                            className="w-100"
                                                        >
                                                            <MenuItem value="">
                                                                <em>None</em>
                                                            </MenuItem>
                                                            {serverList.map((ser) => (
                                                                <MenuItem key={ser.id} value={ser.id}>
                                                                    {ser.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <h6 className="form-select-title">Hành tinh</h6>

                                                        <Select
                                                            value={planet || ""}
                                                            onChange={(e) => setPlanet(e.target.value)}  // Đảm bảo cập nhật giá trị
                                                            displayEmpty
                                                            inputProps={{ "aria-label": "Without label" }}
                                                            className="w-100"
                                                        >
                                                            <MenuItem value={"Xayda"}>Xayda</MenuItem>
                                                            <MenuItem value={"Namek"}>Namek</MenuItem>
                                                            <MenuItem value={"Trái đất"}>Trái đất</MenuItem>
                                                        </Select>

                                                        <h6 className="form-select-title">Đăng ký</h6>

                                                        <Select
                                                            value={register || ""}
                                                            onChange={(e) => setRegister(e.target.value)}  // Đảm bảo cập nhật giá trị
                                                            displayEmpty
                                                            inputProps={{ "aria-label": "Without label" }}
                                                            className="w-100"
                                                        >
                                                            <MenuItem value={1}>Thật</MenuItem>
                                                            <MenuItem value={0}>Ảo</MenuItem>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="imagesUploadSec mt-2 pl-3">
                                                <div className="imgUploadBox d-flex align-items-center">
                                                    <div className="row">
                                                        <div className="col-md-3 pt-3">
                                                            {/* Main Image Upload */}
                                                            {imagePreviews.main.length ? (
                                                                imagePreviews.main.map((preview, index) => (
                                                                    <div key={index} className="uploadBox">
                                                                        <span
                                                                            className="remove"
                                                                            onClick={() => removeImage("main", index)}
                                                                        >
                                                                            <IoCloseSharp />
                                                                        </span>
                                                                        <div className="box">
                                                                            <LazyLoadImage
                                                                                alt="Main image"
                                                                                effect="blur"
                                                                                className="w-100"
                                                                                src={preview.url}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="uploadBox">
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        onChange={handleMainImageChange}
                                                                    />
                                                                    <div className="info">
                                                                        <FaRegImages />
                                                                        <h5>Main Image Upload</h5>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="col-md-3 pt-3">
                                                            {/* Additional Images Upload */}
                                                            {imagePreviews.additional.length ? (
                                                                imagePreviews.additional.map(
                                                                    (preview, index) => (
                                                                        <div key={index} className="uploadBox">
                                                                            <span
                                                                                className="remove"
                                                                                onClick={() =>
                                                                                    removeImage("additional", index)
                                                                                }
                                                                            >
                                                                                <IoCloseSharp />
                                                                            </span>
                                                                            <div className="box">
                                                                                <LazyLoadImage
                                                                                    alt="Additional image"
                                                                                    effect="blur"
                                                                                    className="w-100"
                                                                                    src={preview.url}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                )
                                                            ) : (
                                                                <div className="uploadBox">
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        multiple
                                                                        onChange={handleAdditionalImagesChange}
                                                                    />
                                                                    <div className="info">
                                                                        <FaRegImages />
                                                                        <h5>Additional Images Upload</h5>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="col-md-3 pt-3">
                                                            {/* Featured Images Upload */}
                                                            {imagePreviews.featured.length ? (
                                                                imagePreviews.featured.map((preview, index) => (
                                                                    <div key={index} className="uploadBox">
                                                                        <span
                                                                            className="remove"
                                                                            onClick={() =>
                                                                                removeImage("featured", index)
                                                                            }
                                                                        >
                                                                            <IoCloseSharp />
                                                                        </span>
                                                                        <div className="box">
                                                                            <LazyLoadImage
                                                                                alt="Featured image"
                                                                                effect="blur"
                                                                                className="w-100"
                                                                                src={preview.url}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="uploadBox">
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        multiple
                                                                        onChange={handleFeaturedImagesChange}
                                                                    />
                                                                    <div className="info">
                                                                        <FaRegImages />
                                                                        <h5>Featured Images Upload</h5>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="col-md-3 pt-3">
                                                            {/* Featured Images Upload */}
                                                            {imagePreviews.secondary.length ? (
                                                                imagePreviews.secondary.map(
                                                                    (preview, index) => (
                                                                        <div key={index} className="uploadBox">
                                                                            <span
                                                                                className="remove"
                                                                                onClick={() =>
                                                                                    removeImage("secondary", index)
                                                                                }
                                                                            >
                                                                                <IoCloseSharp />
                                                                            </span>
                                                                            <div className="box">
                                                                                <LazyLoadImage
                                                                                    alt="Secondary image"
                                                                                    effect="blur"
                                                                                    className="w-100"
                                                                                    src={preview.url}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                )
                                                            ) : (
                                                                <div className="uploadBox">
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        multiple
                                                                        onChange={handleSecondaryImagesChange}
                                                                    />
                                                                    <div className="info">
                                                                        <FaRegImages />
                                                                        <h5>Secondary Images Upload</h5>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card p-4 mt-0">
                                <div className="row">
                                    <div className="col mt-2">
                                        <Button
                                            className="btn-blue btn-lg btn-big"
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Đang lưu..." : "Thêm sản phẩm mới"}
                                        </Button>
                                    </div>
                                    <div className="col mt-2">
                                        <Button
                                            className="btn-big btn-close"
                                            onClick={handleCloseModelAddAndUpdateProduct}
                                        >
                                            Bỏ qua
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Typography>
                </Box>
            </Modal>

            {/* Sửa sản phẩm */}
            <Modal
                keepMounted
                open={openModelUpdateProduct}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        id="keep-mounted-modal-title"
                        variant="h6"
                        component="span"
                    >
                        Sửa sản phẩm
                    </Typography>
                    <Typography
                        id="keep-mounted-modal-description"
                        component="span"
                        sx={{ mt: 2 }}
                    >
                        <form className="form" onSubmit={handleSubmitProductUpdate}>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="card p-2 mt-0">
                                        <div className="row">
                                            <div className="col-md-7">
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="form-group">
                                                            <div className="row">
                                                                <div className="col-md-3">
                                                                    <h6 className="mt-2">Mã sản phẩm</h6>
                                                                </div>
                                                                <div className="col-md-9">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Mã sản phẩm"
                                                                        value={code || ""}
                                                                        onChange={(e) => setCode(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="form-group">
                                                            <div className="row">
                                                                <div className="col-md-3">
                                                                    <h6 className="mt-2">Tên sản phẩm</h6>
                                                                </div>
                                                                <div className="col-md-9">
                                                                    <input
                                                                        type="text"
                                                                        value={name || ""}
                                                                        onChange={(e) => setName(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="form-group">
                                                            <div className="row">
                                                                <div className="col-md-3">
                                                                    <h6 className="mt-2">Giá bán</h6>
                                                                </div>
                                                                <div className="col-md-9">
                                                                    <input
                                                                        type="text"
                                                                        value={price || ""}
                                                                        onChange={(e) => setPrice(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-5">
                                                <div className="row">
                                                    <div className="col">
                                                        <h6 className="form-select-title">Danh mục</h6>

                                                        <Select
                                                            value={category || ""}
                                                            onChange={handleChangeCategory}
                                                            displayEmpty
                                                            inputProps={{ "aria-label": "Without label" }}
                                                            className="w-100"
                                                        >
                                                            <MenuItem value="">
                                                                <em>None</em>
                                                            </MenuItem>
                                                            {categoryList.map((cate) => (
                                                                <MenuItem key={cate.id} value={cate.id}>
                                                                    {cate.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </div>
                                                    <div className="col">
                                                        <h6 className="form-select-title">Server</h6>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="imagesUploadSec mt-2 pl-3">
                                                <div className="imgUploadBox d-flex align-items-center">
                                                    <div className="row">
                                                        <div className="col-md-3 pt-3">
                                                            {/* Main Image Upload */}
                                                            {imagePreviews.main.length ? (
                                                                imagePreviews.main.map((preview, index) => (
                                                                    <div key={index} className="uploadBox">
                                                                        <span
                                                                            className="remove"
                                                                            onClick={() => removeImage("main", index)}
                                                                        >
                                                                            <IoCloseSharp />
                                                                        </span>
                                                                        <div className="box">
                                                                            <LazyLoadImage
                                                                                alt="Main image"
                                                                                effect="blur"
                                                                                className="w-100"
                                                                                src={preview.url}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="uploadBox">
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        onChange={handleMainImageChange}
                                                                    />
                                                                    <div className="info">
                                                                        <FaRegImages />
                                                                        <h5>Ảnh đại diện</h5>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="col-md-3 pt-3">
                                                            {/* Additional Images Upload */}
                                                            {imagePreviews.additional.length ? (
                                                                imagePreviews.additional.map(
                                                                    (preview, index) => (
                                                                        <div key={index} className="uploadBox">
                                                                            <span
                                                                                className="remove"
                                                                                onClick={() =>
                                                                                    removeImage("additional", index)
                                                                                }
                                                                            >
                                                                                <IoCloseSharp />
                                                                            </span>
                                                                            <div className="box">
                                                                                <LazyLoadImage
                                                                                    alt="Additional image"
                                                                                    effect="blur"
                                                                                    className="w-100"
                                                                                    src={preview.url}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                )
                                                            ) : (
                                                                <div className="uploadBox">
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        multiple
                                                                        onChange={handleAdditionalImagesChange}
                                                                    />
                                                                    <div className="info">
                                                                        <FaRegImages />
                                                                        <h5>Ảnh phụ</h5>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="col-md-3 pt-3">
                                                            {/* Featured Images Upload */}
                                                            {imagePreviews.featured.length ? (
                                                                imagePreviews.featured.map((preview, index) => (
                                                                    <div key={index} className="uploadBox">
                                                                        <span
                                                                            className="remove"
                                                                            onClick={() =>
                                                                                removeImage("featured", index)
                                                                            }
                                                                        >
                                                                            <IoCloseSharp />
                                                                        </span>
                                                                        <div className="box">
                                                                            <LazyLoadImage
                                                                                alt="Featured image"
                                                                                effect="blur"
                                                                                className="w-100"
                                                                                src={preview.url}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="uploadBox">
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        multiple
                                                                        onChange={handleFeaturedImagesChange}
                                                                    />
                                                                    <div className="info">
                                                                        <FaRegImages />
                                                                        <h5>Ảnh phụ</h5>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="col-md-3 pt-3">
                                                            {/* Featured Images Upload */}
                                                            {imagePreviews.secondary.length ? (
                                                                imagePreviews.secondary.map(
                                                                    (preview, index) => (
                                                                        <div key={index} className="uploadBox">
                                                                            <span
                                                                                className="remove"
                                                                                onClick={() =>
                                                                                    removeImage("secondary", index)
                                                                                }
                                                                            >
                                                                                <IoCloseSharp />
                                                                            </span>
                                                                            <div className="box">
                                                                                <LazyLoadImage
                                                                                    alt="Secondary image"
                                                                                    effect="blur"
                                                                                    className="w-100"
                                                                                    src={preview.url}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                )
                                                            ) : (
                                                                <div className="uploadBox">
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        multiple
                                                                        onChange={handleSecondaryImagesChange}
                                                                    />
                                                                    <div className="info">
                                                                        <FaRegImages />
                                                                        <h5>Ảnh phụ</h5>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card p-4 mt-0">
                                <div className="row">
                                    <div className="col mt-2">
                                        <Button
                                            className="btn-blue btn-lg btn-big"
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Đang lưu..." : "Sửa sản phẩm"}
                                        </Button>
                                    </div>
                                    <div className="col mt-2">
                                        <Button
                                            className="btn-big btn-close"
                                            onClick={handleCloseModelAddAndUpdateProduct}
                                        >
                                            Bỏ qua
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Typography>
                </Box>
            </Modal>
        </>
    );
};

export default ProductManagement;