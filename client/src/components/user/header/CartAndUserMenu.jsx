import React from "react";
import { Link } from "react-router-dom";
import { Badge, Avatar, Popover } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import CartList from "./CartList";
import CartEmpty from "./CartEmpty";

const CartAndUserMenu = ({ user, cart }) => {
  return (
    <>
      <div className="h-full w-10 relative group flex items-center justify-center">
        <Link to="/gio-hang" className="m-0">
          <Badge count={cart.length} showZero>
            <Avatar shape="square" icon={<ShoppingCartOutlined />} />
          </Badge>
        </Link>
        <div className="group-hover:block rounded-sm shadow-lg bg-white absolute z-[99] top-[100%] right-0 hidden">
          <div className="w-[400px] max-h-[500px] overflow-scroll flex flex-col items-center text-center p-2">
            {cart.length > 0 ? <CartList cart={cart} /> : <CartEmpty />}
          </div>
        </div>
      </div>
      <div className="w-10 h-full flex items-center justify-center">
        <Popover
          content={
            <>
              <div>
                <p>Content</p>
                <p>Content</p>
              </div>
            </>
          }
          title="Chức năng"
          trigger="hover"
        >
          <img
            src={user?.avatar}
            alt=""
            className="w-full h-full rounded-full object-cover"
          />
        </Popover>
      </div>
    </>
  );
};

export default CartAndUserMenu;
