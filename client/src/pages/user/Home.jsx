import React, { useEffect } from "react";
import Banner from "../../components/user/home/Banner";
import ListProducts from "../../components/user/home/ListProducts";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { getAllProduct } from "../../services/product.service";
import { Button, Result } from "antd";
import { SmileOutlined } from "@ant-design/icons";

const Home = () => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    await dispatch(getAllProduct({ page: 0, limit: 0 }));
  };
  useEffect(() => {
    fetchData();
  }, []);

  const category = useSelector((state) => state.category.data);

  return (
    <>
      <Helmet>
        <title>Trang chủ | TEELAB</title>
      </Helmet>
      <Banner />
      <div className="container mx-auto text-center py-[30px] px-[15px] lg:py-[60px]">
        <div className="mb-[25px] text-[20px] lg:text-[35px]">
          Enjoy Your Youth!
        </div>
        <div className="max-w-[685px] mx-auto mb-[25px] text-sm lg:text-base">
          Không chỉ là thời trang, TEELAB còn là “phòng thí nghiệm” của tuổi trẻ
          - nơi nghiên cứu và cho ra đời nguồn năng lượng mang tên “Youth”.
          Chúng mình luôn muốn tạo nên những trải nghiệm vui vẻ, năng động và
          trẻ trung.
        </div>
      </div>
      {category ? (
        category.map((c) => (
          <ListProducts path={`/${c.path}`} category={c.category_name} />
        ))
      ) : (
        <Result
          icon={<SmileOutlined />}
          title="Website đang bảo trì, xin lỗi vì sự bất tiện này"
          extra={<Button type="primary">Vui lòng quay lại sau</Button>}
        />
      )}
    </>
  );
};

export default Home;
