import React from "react";
import { useNavigate } from "react-router-dom";

const AuthButtons = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center gap-3 ms-3">
        <button
          className="hover:underline hover:underline-offset-8"
          onClick={() => navigate("/dang-nhap")}
        >
          Sign In
        </button>
        <button
          onClick={() => navigate("/dang-ky")}
          className="hover:text-black hover:bg-transparent px-3 py-1 rounded-full bg-stone-700 text-white border border-black"
        >
          Sign Up
        </button>
      </div>
    </>
  );
};

export default AuthButtons;
