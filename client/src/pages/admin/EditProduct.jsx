import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import Editor from "../../components/admin/create_product/editor/Editor";
import { LoadingOutlined, PlusOutlined, ShopOutlined } from "@ant-design/icons";
import { Flex, message, Upload, Button, Input, Select, Image } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategory } from "../../services/category.service";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase/firebase.config";
import {
  createProduct,
  getOneProduct,
  updateProduct,
} from "../../services/product.service";
import { useParams } from "react-router-dom";

const EditProduct = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const fetchData = async () => {
    await dispatch(getOneProduct(id));
    await dispatch(getAllCategory());
  };
  useEffect(() => {
    fetchData();
  }, [id]);
  const listImageRef = ref(storage, "products/");
  const categorys = useSelector((state) => state.category.data);
  const product = useSelector((state) => state.product.dataEdit);
  const [loading, setLoading] = useState(false);
  const [selectColor, setSelectColor] = useState();
  const [colors, setColors] = useState([
    { bgColor: "#FCA5A5", color_name: "Đỏ" },
    { bgColor: "#D1D5DB", color_name: "Xám" },
    { bgColor: "#FFFFFF", color_name: "Trắng" },
    { bgColor: "#000000", color_name: "Đen" },
    { bgColor: "#CAB6A0", color_name: "Kem" },
    { bgColor: "#F4C2C2", color_name: "Hồng" },
    { bgColor: "#93C5FD", color_name: "Xanh" },
  ]);
  const [showInput, setShowInput] = useState(false);
  const [newColor, setNewColor] = useState("");
  const [newColorName, setNewColorName] = useState("");
  const [selectedSizes, setSelectedSizes] = useState({});
  const [productVariants, setProductVariants] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [description, setDescription] = useState("");
  console.log(productVariants);

  useLayoutEffect(() => {
    if (product) {
      setImageUrls(product.images || []);
      setDescription(product.description || "");

      const variants =
        product.colorSizes?.map((colorSize) => ({
          color: colorSize.colors.color_name,
          sizes: colorSize.sizes.map((size) => ({
            size: size.size_name,
            quantity: size.quantity,
          })),
          image: colorSize.colors.image,
        })) || [];
      setProductVariants(variants);

      const colors =
        product.colorSizes?.map((colorSize) => ({
          color_id: colorSize.colors.color_id,
          color_name: colorSize.colors.color_name,
        })) || [];
      setSelectColor(colors);
      setSelectedSizes(() => {
        const sizes = product.colorSizes.map((colorSize) =>
          colorSize.sizes.map((size) => size.size_name)
        );
        return sizes;
      });
    }
  }, [product]);

  const options = useMemo(() => {
    return categorys.map((product) => ({
      value: product.category_id,
      label: product.category_name,
    }));
  }, [categorys]);

  // click thêm màu mới
  const handleAddColor = () => {
    setShowInput(true);
  };

  // thêm màu mới
  const handleSaveColor = () => {
    if (newColor && newColorName) {
      setColors([...colors, { bgColor: newColor, color_name: newColorName }]);
      setShowInput(false);
      setNewColor("");
      setNewColorName("");
    }
  };

  // huỷ thêm màu
  const handleCancel = () => {
    setShowInput(false);
    setNewColor("");
    setNewColorName("");
  };

  const initialValues = useMemo(() => {
    const values = product && {
      name: product?.product_name,
      price: product?.price,
      discount: product?.discount,
      thumbnail: product?.thumbnail,
      thumbnail_hover: product?.thumbnail_hover,
      description_image: product?.description_image,
      category: product?.category?.category_id,
      status: false,
      option: [],
      author: "",
    };

    console.log("Initial Values:", values); // Debug here
    return values;
  }, [product]);

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      name: Yup.string().required("Tên sản phẩm không được để trống"),
      category: Yup.string().required("Danh mục sản phẩm không được để trống"),
      price: Yup.number().required("Giá sản phẩm không được để trống"),
      discount: Yup.number().required("Giảm giá sản phẩm không được để trống"),
      thumbnail_hover: Yup.string().required(
        "Ảnh thumbnail hover sản phẩm không được để trống"
      ),
      thumbnail: Yup.string().required(
        "Ảnh thumbnail sản phẩm không được để trống"
      ),
      description_image: Yup.string().required(
        "Ảnh mô tả sản phẩm không được để trống"
      ),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const editProduct = {
          product_name: values.name,
          thumbnail: values.thumbnail,
          thumbnail_hover: values.thumbnail_hover,
          discount: +values.discount,
          images: imageUrls,
          description: description,
          description_image: values.description_image,
          price: +values.price,
          status: 1,
          category: values.category,
          option: productVariants,
          author: "admin",
        };
        const response = await dispatch(
          updateProduct({ id: id, data: editProduct })
        );
        console.log(response);
        if (response.payload.status === 200) {
          message.success("Lưu sản phẩm thành công");
        }
        resetForm();
        setProductVariants([]);
        setDescription("");
        setImageUrls([]);
      } catch (error) {
        message.error("Lỗi");
      }
    },
  });

  //
  const handleChangeCategory = (value) => {
    formik.values.category = value;
  };

  // chọn color cho sp
  const handleSelectColor = (color) => {
    const check = selectColor.find((c) => c.color_name === color.color_name);
    if (check) {
      message.warning("Màu đã chọn");
      return;
    }
    setSelectColor([...selectColor, color]);
  };

  // xoá color đã chọn
  const handleRemoveColor = (color) => {
    setSelectColor(selectColor.filter((c) => c !== color));
    setSelectedSizes((prev) =>
      Object.keys(prev)
        .filter((key) => parseInt(key) !== selectColor.indexOf(color))
        .reduce((obj, key) => {
          obj[key] = prev[key];
          return obj;
        }, {})
    );
    setProductVariants((prev) =>
      prev.filter((v) => v.color !== color.color_name)
    );
  };

  // click chọn size
  const handleSizeClick = (index, size) => {
    setSelectedSizes((prevSelectedSizes) => {
      const currentSizes = prevSelectedSizes[index] || [];
      if (currentSizes.includes(size)) {
        // Nếu kích thước đã có trong danh sách, thì xoá nó
        return {
          ...prevSelectedSizes,
          [index]: currentSizes.filter((s) => s !== size),
        };
      } else {
        // Nếu kích thước chưa có trong danh sách, thì thêm vào
        return {
          ...prevSelectedSizes,
          [index]: [...currentSizes, size],
        };
      }
    });
  };

  // nhập số lượng của size
  const handleQuantityChange = (index, size, quantity) => {
    setProductVariants((prevVariants) => {
      const colorLabel = selectColor[index].color_name;
      const newVariants = [...prevVariants];
      const variantIndex = newVariants.findIndex(
        (variant) => variant.color === colorLabel
      );
      if (variantIndex >= 0) {
        // nếu màu đã tồn tại thì tìm size đã tồn tại chưa
        const sizeIndex = newVariants[variantIndex].sizes.findIndex(
          (s) => s.size === size
        );
        if (sizeIndex >= 0) {
          // nếu size đã tồn tại thì gán cho quantity của size đó
          newVariants[variantIndex].sizes[sizeIndex].quantity = quantity;
        } else {
          // chưa tòn tại size thì tạo mới và push vào
          newVariants[variantIndex].sizes.push({ size, quantity });
        }
      } else {
        // nếu chưa có tên màu thì push vào
        newVariants.push({
          color: colorLabel,
          sizes: [{ size, quantity }],
        });
      }
      return newVariants;
    });
  };

  const handleCustomRequest = async ({
    file,
    onSuccess,
    onError,
    fieldName,
    colorLabel,
  }) => {
    try {
      setLoading(true);
      const imageRef = ref(listImageRef, file.name);
      await uploadBytes(imageRef, file);
      const downloadUrl = await getDownloadURL(imageRef);
      onSuccess({ url: downloadUrl });

      if (colorLabel) {
        setProductVariants((prevVariants) =>
          prevVariants.map((variant) =>
            variant.color_name === colorLabel
              ? { ...variant, image: downloadUrl }
              : variant
          )
        );
      } else {
        formik.setFieldValue(fieldName, downloadUrl);
        // formik.setFieldValue(fieldName, [
        //   ...formik.values[fieldName],
        //   downloadUrl,
        // ]);
      }
      setLoading(false);
    } catch (error) {
      onError(error);
      setLoading(false);
    }
  };

  const getUploadProps = (fieldName, colorLabel) => ({
    name: fieldName,
    onChange: (info) => {
      if (info.file.status === "done") {
        const downloadUrl = info.file.response.url;
        if (colorLabel) {
          setProductVariants((prevVariants) =>
            prevVariants.map((variant) =>
              variant.color === colorLabel
                ? { ...variant, image: downloadUrl }
                : variant
            )
          );
        } else {
          info.fileList.length === 1
            ? formik.setFieldValue(fieldName, downloadUrl)
            : setImageUrls((prevImageUrls) => [...prevImageUrls, downloadUrl]);
        }
        message.success("Tải ảnh thành công.");
      } else if (info.file.status === "error") {
        message.error("Tải ảnh thất bại");
      }
    },
    customRequest: (options) =>
      handleCustomRequest({ ...options, fieldName, colorLabel }),
  });

  return (
    <>
      {initialValues && (
        <form onSubmit={formik.handleSubmit}>
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-2xl font-bold">
              <ShopOutlined /> Chỉnh sửa sản phẩm
            </h3>
            <Button type="primary" htmlType="submit">
              Lưu sản phẩm
            </Button>
          </div>
          <div className="flex gap-6">
            <div className="rounded-[20px] w-1/3">
              <div className="border p-4 border-gray-200 rounded-[20px]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-normal">Thumbnail</h3>
                  {formik.values.thumbnail && (
                    <button
                      type="button"
                      className="border border-red-300 py-1 px-2 rounded-lg "
                    >
                      Xoá
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-center border border-gray-200 rounded-[20px] overflow-hidden">
                  {formik.values.thumbnail ? (
                    <Image
                      className="w-full h-full object-cover"
                      src={formik.values.thumbnail}
                      alt="thumbnail"
                    />
                  ) : (
                    <Upload
                      name="thumbnail"
                      listType="picture-card"
                      className="m-3"
                      showUploadList={false}
                      {...getUploadProps("thumbnail", null)}
                    >
                      <button className="border-0" type="button">
                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                        <div className="mt-2">Upload</div>
                      </button>
                    </Upload>
                  )}
                </div>
                <span className="text-[11px] text-gray-400">
                  Gợi ý: hình ảnh của sản phẩm nên có dạng *png, *jpg hoặc *jpeg
                </span>
                {formik.touched.thumbnail && formik.errors.thumbnail ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.thumbnail}
                  </div>
                ) : null}
              </div>
              <div className="border p-4 border-gray-200 rounded-[20px] mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-normal">Thumbnail mặt sau</h3>
                  {formik.values.thumbnail_hover && (
                    <button
                      type="button"
                      className="border border-red-300 py-1 px-2 rounded-lg "
                    >
                      Xoá
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-center border border-gray-200 rounded-[20px] overflow-hidden">
                  {formik.values.thumbnail_hover ? (
                    <Image
                      className="w-full h-full object-cover"
                      src={formik.values.thumbnail_hover}
                      alt="thumbnail_hover"
                    />
                  ) : (
                    <Upload
                      name="thumbnail_hover"
                      listType="picture-card"
                      className="m-3"
                      {...getUploadProps("thumbnail_hover", null)}
                    >
                      <button className="border-0" type="button">
                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                        <div className="mt-2">Upload</div>
                      </button>
                    </Upload>
                  )}
                </div>
                <span className="text-[11px] text-gray-400">
                  Gợi ý: hình ảnh của sản phẩm nên có dạng *png, *jpg hoặc *jpeg
                </span>
                {formik.touched.thumbnail_hover &&
                formik.errors.thumbnail_hover ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.thumbnail_hover}
                  </div>
                ) : null}
              </div>
              <div className="border p-4 border-gray-200 rounded-[20px] mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-normal">Ảnh mô tả</h3>
                  {formik.values.description_image && (
                    <button
                      type="button"
                      className="border border-red-300 py-1 px-2 rounded-lg "
                    >
                      Xoá
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-center border border-gray-200 rounded-[20px] overflow-hidden">
                  {formik.values.description_image ? (
                    <Image
                      className="w-full h-full object-cover"
                      src={formik.values.description_image}
                      alt="description_image"
                    />
                  ) : (
                    <Upload
                      name="description_image"
                      listType="picture-card"
                      className="m-3"
                      {...getUploadProps("description_image", null)}
                    >
                      <button className="border-0" type="button">
                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                        <div className="mt-2">Upload</div>
                      </button>
                    </Upload>
                  )}
                </div>
                <span className="text-[11px] text-gray-400">
                  Gợi ý: hình ảnh của sản phẩm nên có dạng *png, *jpg hoặc *jpeg
                </span>
                {formik.touched.description_image &&
                formik.errors.description_image ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.description_image}
                  </div>
                ) : null}
              </div>
              <div className="border p-4 border-gray-200 rounded-[20px] mt-4">
                <h3 className="text-xl font-normal mb-2">
                  Danh sách ảnh sản phẩm
                </h3>
                <div className="overflow-scroll gap-1 p-3 flex flex-wrap items-center justify-around border border-gray-200 rounded-[20px]">
                  {imageUrls.map((imageUrl, index) => (
                    <Image
                      key={index}
                      width={100}
                      height={100}
                      src={imageUrl}
                      alt={`Image ${index + 1}`}
                    />
                  ))}
                  <Upload
                    name="images"
                    listType="picture-card"
                    className="m-3"
                    showUploadList={false}
                    multiple
                    {...getUploadProps("images", null)}
                  >
                    <button className="border-0" type="button">
                      {loading ? <LoadingOutlined /> : <PlusOutlined />}
                      <div className="mt-2">Upload</div>
                    </button>
                  </Upload>
                </div>
                <span className="text-[11px] text-gray-400">
                  Gợi ý: hình ảnh của sản phẩm nên có dạng *png, *jpg hoặc *jpeg
                </span>
                {formik.touched.thumbnail_hover &&
                formik.errors.thumbnail_hover ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.thumbnail_hover}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="rounded-[20px] flex-1">
              <div className="border border-gray-200 p-4 rounded-[20px]">
                <h3 className="text-xl font-normal mb-8">Tổng quan</h3>
                <h5 className="text-base font-normal mb-2">Tên sản phẩm</h5>
                <Input
                  placeholder="nhập tên sản phẩm"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.name}
                  </div>
                ) : null}
                <h5 className="text-base font-normal mb-2 mt-5">
                  Chi tiết sản phẩm sản phẩm
                </h5>
                <Editor
                  setDescription={setDescription}
                  description={description}
                />
                {/* {formik.touched.description && formik.errors.description ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.description}
                </div>
              ) : null} */}
                <div className="w-full">
                  <h5 className="text-base font-normal mb-2 mt-5">
                    Màu sản phẩm
                  </h5>
                  <div className="flex items-center gap-3">
                    {colors.map((color, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSelectColor(color)}
                        className={`w-14 h-14 border border-blue-300 flex items-center justify-center bg-[${color.bgColor}] rounded-md shadow-lg hover:bg-gray-200 active:bg-gray-400 `}
                      >
                        {color.color_name}
                      </button>
                    ))}
                    <button
                      className="w-14 h-14 flex items-center justify-center bg-[#f4f5f6] rounded-md shadow-lg hover:bg-blue-200 active:bg-blue-400"
                      onClick={handleAddColor}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
                {showInput && (
                  <div className="flex items-center gap-3 mt-3">
                    <input
                      type="text"
                      placeholder="Nhập tên màu"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      className="p-2 border rounded-md"
                    />
                    <input
                      type="color"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="p-2 border rounded-md"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveColor}
                        className="p-2 bg-green-500 text-white rounded-md shadow-lg hover:bg-green-600"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-2 bg-red-500 text-white rounded-md shadow-lg hover:bg-red-600"
                      >
                        Huỷ
                      </button>
                    </div>
                  </div>
                )}
                {selectColor?.map((color, index) => (
                  <div
                    key={index}
                    className="w-full flex gap-10 items-start justify-between"
                  >
                    <div className="flex-1">
                      <h5 className="text-base font-normal mb-2 mt-5">
                        Màu sản phẩm
                      </h5>
                      <div className="color-size flex items-center gap-3">
                        <button
                          type="button"
                          className={`w-14 h-14 flex items-center justify-center bg-[${color.bgColor}] rounded-md shadow-lg hover:bg-blue-200 active:bg-blue-400`}
                        >
                          {color.color_name}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(color)}
                          className={`w-14 h-14 flex items-center justify-center bg-red-300 rounded-md shadow-lg hover:bg-red-200 active:bg-red-400`}
                        >
                          Xoá
                        </button>
                        <Upload
                          listType="picture-card"
                          showUploadList={false}
                          className="w-14 h-14"
                          {...getUploadProps(null, `${color.color_name}`)}
                        >
                          <button className="w-14 !h-14" type="button">
                            {loading ? <LoadingOutlined /> : <PlusOutlined />}
                          </button>
                        </Upload>
                      </div>
                      <div className="mt-3">
                        <Image
                          width={56}
                          height={56}
                          src={productVariants[index]?.image}
                          alt={`Image ${index + 1}`}
                          fallback="data:image/png;base64,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"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h5 className="text-base font-normal mb-2 mt-5">
                        Size màu
                      </h5>
                      <div className="flex items-start gap-3">
                        {["XS", "S", "M", "L", "XL", "2XL"].map(
                          (size, sizeIndex) => (
                            <div
                              key={sizeIndex}
                              className="flex flex-col gap-3"
                            >
                              <button
                                type="button"
                                className={`w-14 h-14 border flex items-center justify-center rounded-md shadow-lg ${
                                  selectedSizes[index]?.includes(size)
                                    ? "bg-blue-200"
                                    : "bg-[#f4f5f6]"
                                } hover:bg-blue-200 active:bg-blue-400`}
                                onClick={() => handleSizeClick(index, size)}
                              >
                                {size}
                              </button>
                              {selectedSizes[index]?.includes(size) && (
                                <div className="">
                                  <input
                                    type="number"
                                    value={
                                      productVariants[index].sizes[index]
                                        .quantity
                                    }
                                    onChange={(e) =>
                                      handleQuantityChange(
                                        index,
                                        size,
                                        parseInt(e.target.value, 10)
                                      )
                                    }
                                    className="w-14 h-14 text-center flex items-center justify-center bg-[#f4f5f6] rounded-md shadow-lg border border-blue-300"
                                  />
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border border-gray-200 p-4 rounded-[20px] mt-4">
                <h3 className="text-xl font-normal mb-8">Giá và giảm giá</h3>
                <div className="flex items-start justify-between gap-10">
                  <div className="flex-1">
                    <h5 className="text-base font-normal mb-2">Giá sản phẩm</h5>
                    <Input
                      placeholder="nhập giá sản phẩm"
                      name="price"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.price && formik.errors.price ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.price}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <h5 className="text-base font-normal mb-2">Giảm giá (%)</h5>
                    <Input
                      placeholder="nhập % giảm giá sản phẩm"
                      name="discount"
                      value={formik.values.discount}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.discount && formik.errors.discount ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.discount}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="mt-5 flex items-start justify-between gap-10">
                  <div className="flex-1">
                    <h5 className="text-base font-normal mb-2">
                      Giá bán thực tế
                    </h5>
                    <Input
                      placeholder="Giá bán ra"
                      value={
                        formik.values.price * (1 - formik.values.discount / 100)
                      }
                    />
                  </div>
                  <div className="flex-1"></div>
                </div>
              </div>
              <div className="border p-4 border-gray-200 rounded-[20px] mt-4">
                <h3 className="text-xl font-normal mb-2">Danh mục sản phẩm</h3>
                <Select
                  placeholder="Chọn danh mục sản phẩm"
                  className="w-full !text-black"
                  onChange={handleChangeCategory}
                  options={options}
                />
                {formik.touched.category && formik.errors.category ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.category}
                  </div>
                ) : null}
                <Button type="default" className="mt-2">
                  Thêm danh mục
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default EditProduct;
