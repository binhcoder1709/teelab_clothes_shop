import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkPaymentZalopay } from "../../services/payment.service";
import { Button, Result } from "antd";
import { useLocation, useParams } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { clearCart } from "../../redux/useSlice/cartSlice";

const PayCheck = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [status, setStatus] = useState(false);
  const [pending, setPending] = useState(true);
  const appTransId = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const apptransid = searchParams.get("apptransid");
    return apptransid;
  }, [location]);

  const fetchData = async () => {
    if (appTransId) {
      const response = await dispatch(checkPaymentZalopay(appTransId));
      setStatus(response.payload);
      console.log(response);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  console.log(status);

  useEffect(() => {
    if (status) {
      setPending(false);
      dispatch(clearCart());
    }
  }, [appTransId, status]);

  return (
    <>
      {pending && (
        <div className="h-60 relative">
          <div className="absolute text-3xl z-50 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <LoadingOutlined />
          </div>
        </div>
      )}
      {status && (
        <Result
          status={
            status.return_code === 1
              ? "success"
              : status.return_code === 2
              ? "error"
              : "warning"
          }
          title={status.sub_return_message}
          subTitle={
            status.return_code === 1 &&
            "Mã đơn hàng sẽ được gửi tới email của bạn, Cảm ơn bạn đã tin tưởng và ủng hộ Teelab"
          }
          extra={[
            <Button type="primary">Tiếp tục mua hàng</Button>,
            <Button>Buy Again</Button>,
          ]}
        />
      )}
    </>
  );
};

export default PayCheck;
