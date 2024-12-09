import { DeploymentUnitOutlined } from "@ant-design/icons";
import React from "react";

const SideBar = () => {
  return (
    <>
      <div className="hidden md:flex flex-col w-[30%]">
        {/* <div className="flex gap-2 px-3 py-2 border border-gray-300 mb-2">
          <DeploymentUnitOutlined />
          Filter
        </div> */}
        {/* <div className="space-y-2">
          <details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-2 bg-white p-4 text-gray-900 transition">
              <span className="text-sm font-medium"> Availability </span>
              <span className="transition group-open:-rotate-180">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </span>
            </summary>
            <div className="border-t border-gray-200 bg-white">
              <header className="flex items-center justify-between p-4">
                <span className="text-sm text-gray-700"> 0 Selected </span>
                <button
                  type="button"
                  className="text-sm text-gray-900 underline underline-offset-4"
                >
                  Reset
                </button>
              </header>
              <ul className="space-y-1 border-t border-gray-200 p-4">
                <li>
                  <label
                    htmlFor="FilterInStock"
                    className="inline-flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      id="FilterInStock"
                      className="size-5 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {" "}
                      Set{" "}
                    </span>
                  </label>
                </li>
                <li>
                  <label
                    htmlFor="FilterPreOrder"
                    className="inline-flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      id="FilterPreOrder"
                      className="size-5 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {" "}
                      Pre Order (3+){" "}
                    </span>
                  </label>
                </li>
                <li>
                  <label
                    htmlFor="FilterOutOfStock"
                    className="inline-flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      id="FilterOutOfStock"
                      className="size-5 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {" "}
                      Out of Stock (10+){" "}
                    </span>
                  </label>
                </li>
              </ul>
            </div>
          </details>
          <details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-2 bg-white p-4 text-gray-900 transition">
              <span className="text-sm font-medium"> Price </span>
              <span className="transition group-open:-rotate-180">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </span>
            </summary>
            <div className="border-t border-gray-200 bg-white">
              <header className="flex items-center justify-between p-4">
                <span className="text-sm text-gray-700">
                  {" "}
                  The highest price is $600{" "}
                </span>
                <button
                  type="button"
                  className="text-sm text-gray-900 underline underline-offset-4"
                >
                  Reset
                </button>
              </header>
              <div className="border-t border-gray-200 p-4">
                <div className="flex justify-between gap-4">
                  <label
                    htmlFor="FilterPriceFrom"
                    className="flex items-center gap-2"
                  >
                    <span className="text-sm text-gray-600">$</span>
                    <input
                      type="number"
                      id="FilterPriceFrom"
                      placeholder="From"
                      className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm outline-none"
                    />
                  </label>
                  <label
                    htmlFor="FilterPriceTo"
                    className="flex items-center gap-2"
                  >
                    <span className="text-sm text-gray-600">$</span>
                    <input
                      type="number"
                      id="FilterPriceTo"
                      placeholder="To"
                      className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm outline-none"
                    />
                  </label>
                </div>
              </div>
            </div>
          </details>
        </div> */}
        <img
          src="https://scontent.fhan14-2.fna.fbcdn.net/v/t39.30808-6/449964206_1025131665848789_5234384565054640562_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=6WjNoiCFsKQQ7kNvgF4iO5O&_nc_ht=scontent.fhan14-2.fna&oh=00_AYCB1XAsVg6xfKReC9w4YIGeKBXsOXqeCIcWGM7zhSAJxg&oe=6691B725"
          alt=""
        />
        <img
          src="https://scontent.fhan14-2.fna.fbcdn.net/v/t39.30808-6/438276123_989549559407000_2239771444269997758_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=ndttfn4wEjcQ7kNvgHiMC4-&_nc_ht=scontent.fhan14-2.fna&oh=00_AYCGz2xD-79CH_4cMptnTwcXhT6UIoOjGC3ZMFoHyvSLUA&oe=6691B69E"
          alt=""
        />
        <img
          src="https://scontent.fhan14-3.fna.fbcdn.net/v/t39.30808-6/434651852_963345075360782_6066714139648919570_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=QY6o8RsgKh8Q7kNvgGYPZNu&_nc_ht=scontent.fhan14-3.fna&oh=00_AYBnVLi_qqER6fny-FIRX_0Eo96MVPadmNBXDBXTx6vr6Q&oe=6691C637"
          alt=""
        />
      </div>
    </>
  );
};

export default SideBar;
