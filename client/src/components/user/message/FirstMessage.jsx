import React from "react";
import EmployeeMessage from "./EmployeeMessage";

const FirstMessage = () => {
  return (
    <>
      <EmployeeMessage
        message={
          "Teelab xin chào, bạn đang quan tâm đến sản phẩm hay có bất kỳ thắc mắc nào có thể liên hệ tại đây hoặc qua email teelab@gmail.com để được giải đáp"
        }
      />
    </>
  );
};

export default FirstMessage;
