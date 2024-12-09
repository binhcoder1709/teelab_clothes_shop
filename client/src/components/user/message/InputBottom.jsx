import React from "react";
import { Input } from "antd";
import { SendOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const InputBottom = () => {
  const handleSend = (e) => {
    e.preventDefault();
  };
  return (
    <>
      <form
        onSubmit={handleSend}
        className="flex items-start mt-5 max-w-[40%] mx-auto"
      >
        <TextArea placeholder="message" autoSize />
        <button type="submit" className="ml-3 text-2xl hover:text-[#108ee9]">
          <SendOutlined />
        </button>
      </form>
    </>
  );
};

export default InputBottom;
