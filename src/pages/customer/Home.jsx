import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import Navbar from '../../components/Customer/Navbar';
import "../../styles/nav.css"
import axios from "../../services/api/axioConfig";


const Home = () => {
  const context = useContext(MyContext);

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [categoryList, setcategoriesList] = useState([]);

  const fetchProductsByCategoryId = async (id) => {
    try {
      const response = await axios.get(`/admin/categories/${id}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
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

  const fetchCategories = async () => {
    try {
      const responseCategory = await axios.get("/admin/categories"); // Replace with your API endpoint
      setcategoriesList(responseCategory.data);
    } catch (error) {
      console.error("Error fetching product category:", error);
    }
  };

  useEffect(() => {

    fetchCategories();
    fetchProducts();

    context.setisHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    context.setisHideSidebarAndHeader(true);
    return () => {
      context.setisHideSidebarAndHeader(false);
    };
  }, [context]);

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "SHOP",
      slogan: "UY TÍN - CHẤT LƯỢNG - GIÁ RẺ",
      bgColor: "linear-gradient(135deg, #ff8a00, #e52e71)"
    },
    {
      title: "ƯU ĐÃI MÙA HÈ",
      slogan: "GIẢM GIÁ LÊN TỚI 50%",
      bgColor: "linear-gradient(135deg, #00b4db, #0083b0)"
    },
    {
      title: "FREESHIP TOÀN QUỐC",
      slogan: "CHO ĐƠN HÀNG TRÊN 500K",
      bgColor: "linear-gradient(135deg, #11998e, #38ef7d)"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // Chuyển slide mỗi 3 giây

    return () => clearInterval(interval);
  }, [slides.length]);


  return (
    <>
      <Navbar />

      <div className="app-container">
        <div className="main-content">
          <div className="section">
            <div className="promo-slider">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`promo-card ${index === currentSlide ? 'active' : ''}`}
                  style={{ background: slide.bgColor }}
                >
                  <h3 className="shop-name">{slide.title}</h3>
                  <p className="slogan">{slide.slogan}</p>

                  <div className="slider-dots">
                    {slides.map((_, dotIndex) => (
                      <span
                        key={dotIndex}
                        className={`dot ${dotIndex === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(dotIndex)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="product-card">
              <div className="product-card-container">

                {categoryList.map((categoryItem, index) => (
                  <div className="product-card-box" key={index}>
                    <div className="product-content">
                      <div className="product-image">Hình ảnh</div>
                      <h4>{categoryItem.name}</h4> {/* Adjust according to your data structure */}
                      <p>Tài khoản hiện có: { }</p>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default Home;