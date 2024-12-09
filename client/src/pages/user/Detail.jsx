import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext, useParams } from "react-router-dom";
import { getOneProduct } from "../../services/product.service";
import { Carousel, message } from "antd";
import { Link } from "react-router-dom";
import formatPrice from "../../utils/formatPrice";
import { addToCart } from "../../services/cart.service";
import { Helmet } from "react-helmet";
import LastView from "../../components/user/listofproduct/LastView";
import Cookies from "js-cookie";

const Detail = () => {
  const { id } = useParams();
  const user = useOutletContext();
  const dispatch = useDispatch();

  const fetchData = async () => {
    await dispatch(getOneProduct(id));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const product = useSelector((state) => state.product.dataEdit);

  const [option, setOption] = useState(product?.colorSizes[0]);
  const [size, setSize] = useState(product?.colorSizes[0].sizes[0]);

  const [count, setCount] = useState(
    product?.colorSizes[0].sizes[0].quantity > 0 ? 1 : 0
  );
  const [addCart, setAddCart] = useState({
    product: product,
    color: option?.colors.color_name,
    size: size?.size_name,
    count: count,
    quantity: size?.quantity,
  });

  useEffect(() => {
    setOption(product?.colorSizes[0]);
    setSize(product?.colorSizes[0].sizes[0]);
    setCount(product?.colorSizes[0].sizes[0].quantity > 0 ? 1 : 0);
    setAddCart({
      product: product,
      color: option?.colors,
      size: size,
      count: count,
      quantity: size?.quantity,
    });
  }, [product]);

  useEffect(() => {
    setAddCart({
      product: product,
      color: option?.colors,
      size: size,
      count: count,
      quantity: size?.quantity,
    });
  }, [count, size, option, product]);

  // điều chỉnh số lượng sản phẩm
  const handleIncree = (quantity) => {
    count < quantity
      ? setCount((prev) => prev + 1)
      : message.error("Số lượng trong kho đạt giới hạn");
  };
  const handleDecree = () => {
    setCount((prev) => (prev > 1 ? prev - 1 : prev));
  };

  // thêm sản phẩm vào giỏ hàng
  const handleAddToStore = () => {
    if (!user) {
      message.error("Vui lòng đăng nhập");
      return;
    }
    if (addCart.count < 1) {
      console.log("vào if");
      message.error("Sản phẩm hết hàng");
      return;
    }
    message.success("Thêm thành công");
    dispatch(addToCart(addCart));
  };

  return (
    <>
      <Helmet>
        <title>Chi tiết sản phẩm | TEELAB</title>
      </Helmet>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row sm:justify-between sm:flex-wrap">
          <div className="w-full lg:w-[60%] flex-grow-0 flex-shrink-0 px-[15px]">
            <Carousel autoplay arrows autoplaySpeed={3000}>
              {product?.images?.map((img, index) => (
                <div
                  key={index}
                  className="h-[600px] md:h lg:h-[700px] flex justify-center items-center"
                >
                  <img
                    className="object-cover w-full h-full"
                    src={img}
                    alt={product?.name}
                  />
                </div>
              ))}
            </Carousel>
          </div>
          <div className="w-full lg:w-[40%] flex-grow-0 flex-shrink-0 px-[15px]">
            <h1 className="text-[22px] text-[#333] font-sans leading-8 mb-[10px] pb-[10px] border-b-2 border-solid border-[#000]">
              {product?.product_name}
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-[30px] text-[#f81f1f] font-sans ">
                {formatPrice(product?.price * (1 - product?.discount / 100))}
              </span>
              <span className="text-[25px] text-[#9a9a9a] font-sans line-through">
                {formatPrice(product?.price)}
              </span>
              {product?.discount && (
                <span className="text-sm text-white px-2 bg-[#f81f1f] font-sans ">
                  - {product?.discount}%
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span>Màu sắc:</span>
              <span>{option?.colors.color_name}</span>
            </div>
            <div className="flex items-center gap-[10px] mb-[10px]">
              {product?.colorSizes?.map((size) => (
                <div
                  key={size?.color_size_id}
                  onClick={() => {
                    setOption(size);
                    setSize(size.sizes[0]);
                    setCount(size.sizes[0].quantity > 0 ? 1 : 0);
                  }}
                  className={`flex justify-center items-center w-8 h-8 border ${
                    option?.colors.color_name === size?.colors.color_name
                      ? "border-red-600"
                      : "border-black"
                  } rounded-full cursor-pointer`}
                >
                  <img
                    src={size?.colors.image}
                    className="w-7 h-7 rounded-[100%] object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span>Kích thước:</span>
              <span>{size?.size_name}</span>
            </div>
            <div className="flex items-center gap-[10px] mb-[10px]">
              {option?.sizes.map((s) => (
                <div
                  key={s.size_id}
                  onClick={() => {
                    setSize(s);
                    setCount(s.quantity > 0 ? 1 : 0);
                  }}
                  className={`flex justify-center items-center w-8 h-8 border ${
                    size.size_id === s.size_id
                      ? "border-red-600"
                      : "border-black"
                  } rounded-full cursor-pointer`}
                >
                  {s?.size_name}
                </div>
              ))}
            </div>
            <Link
              to="/bang-size"
              target="blank"
              className="text-base text-[#0158da] hover:text-[#f81f1f]"
            >
              + Hướng dẫn chọn size
            </Link>
            <div className="my-[10px]">
              <span>Số lượng</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => handleDecree()}
                  className="w-[30px] h-[35px] border-[1px] border-solid border-[#000] px-3 flex justify-center items-center rounded-s-lg"
                >
                  -
                </button>
                <span className="w-[90px] h-[35px] border-[1px] border-x-0 border-solid border-[#000] flex justify-center items-center">
                  {count}
                </span>
                <button
                  type="button"
                  onClick={() => handleIncree(size.quantity)}
                  className="w-[30px] h-[35px] border-[1px] border-solid border-[#000] px-3 flex justify-center items-center rounded-e-lg"
                >
                  +
                </button>
              </div>
              <span className={1 > 0 ? "text-black" : "text-[#f81f1f]"}>
                {1 > 0
                  ? "Còn hàng"
                  : "Hết hàng! Vui lòng chọn màu hoặc size khác"}
              </span>
            </div>
            <button
              type="button"
              disabled={0 ? true : false}
              onClick={() => handleAddToStore()}
              className="h-[47px] w-full cursor-pointer rounded-md bg-black mt-[15px] text-white uppercase hover:opacity-80"
            >
              THÊM VÀO GIỎ HÀNG
            </button>
          </div>
        </div>
        <div className="w-full lg:w-[60%] px-2 md:px-0 flex flex-col md:flex-row items-center gap-3 my-8">
          <div className="flex-1 w-full h-[52px] border-1 border border-black rounded-md text-center cursor-pointer uppercase py-3 text-black">
            Mô tả sản phẩm
          </div>
          <div className="flex-1 w-full h-[52px] border-1 border border-black rounded-md text-center cursor-pointer uppercase py-3 text-black">
            Đánh giá sản phẩm
          </div>
        </div>
        <div className="py-[15px] px-2 md:px-0">
          <p className="text-[#333] text-sm leading-6">Thông tin sản phẩm</p>
          <p className="text-[#333] text-sm leading-6">
            <div
              dangerouslySetInnerHTML={{ __html: product?.description }}
            ></div>
            <img
              src={product?.description_image}
              alt=""
              className="h-full w-[60%] my-1 border-x-[1px] border-solid border-[#b9b9b9]"
            />
            Về TEELAB:
          </p>
          <br />
          <p className="text-[#333] text-sm leading-6">
            You will never be younger than you are at this very moment “Enjoy
            Your Youth!”
            <br />
            <br />
            Không chỉ là thời trang, TEELAB còn là “phòng thí nghiệm” của tuổi
            trẻ - nơi nghiên cứu và cho ra đời năng lượng mang tên “Youth”.
            Chúng mình luôn muốn tạo nên những trải nghiệm vui vẻ, năng động và
            trẻ trung.
            <br />
            <br />
            Lấy cảm hứng từ giới trẻ, sáng tạo liên tục, bắt kịp xu hướng và
            phát triển đa dạng các dòng sản phẩm là cách mà chúng mình hoạt động
            để tạo nên phong cách sống hằng ngày của bạn. Mục tiêu của TEELAB là
            cung cấp các sản phẩm thời trang chất lượng cao với giá thành hợp
            lý.
            <br />
            Chẳng còn thời gian để loay hoay nữa đâu youngers ơi! Hãy nhanh chân
            bắt lấy những những khoảnh khắc tuyệt vời của tuổi trẻ. TEELAB đã
            sẵn sàng trải nghiệm cùng bạn!
            <br />
            <br />
            “Enjoy Your Youth”, now!
            <br />
            <br />
            Hướng dẫn sử dụng sản phẩm Teelab:
            <br />
            - Ngâm áo vào NƯỚC LẠNH có pha giấm hoặc phèn chua từ trong 2 tiếng
            đồng hồ
            <br />
            - Giặt ở nhiệt độ bình thường, với đồ có màu tương tự.
            <br />
            - Không dùng hóa chất tẩy.
            <br />- Hạn chế sử dụng máy sấy và ủi (nếu có) thì ở nhiệt độ thích
            hợp.
            <br />
            <br />
            Chính sách bảo hành:
            <br />
            - Miễn phí đổi hàng cho khách mua ở TEELAB trong trường hợp bị lỗi
            từ nhà sản xuất, giao nhầm hàng, bị hư hỏng trong quá trình vận
            chuyển hàng.
            <br />
            - Sản phẩm đổi trong thời gian 3 ngày kể từ ngày nhận hàng
            <br />- Sản phẩm còn mới nguyên tem, tags và mang theo hoá đơn mua
            hàng, sản phẩm chưa giặt và không dơ bẩn, hư hỏng bởi những tác nhân
            bên ngoài cửa hàng sau khi mua hàng.
          </p>
        </div>
      </div>
      <LastView />
    </>
  );
};

export default Detail;
