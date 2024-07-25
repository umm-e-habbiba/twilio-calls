import React, { useState, useEffect } from "react";

const Main = () => {
  const [number, setNumber] = useState("0011223344");
  const [zipCode, setZipCode] = useState("");
  const [zipCodeError, setZipCodeError] = useState("");

  const transferCall = (e) => {
    e.preventDefault();
    if (zipCode) {
      console.log("zipcode", zipCode);
    } else {
      setZipCodeError("Zip code is required");
    }
  };
  return (
    // <div className="flex h-screen">
    //   <div className="m-auto ">
    //     <p className="mb-2">Phone Number: 123456789</p>
    //     <form
    //       onSubmit={(e) => transferCall(e)}
    //       className="flex flex-col justify-center items-center"
    //     >
    //       <input
    //         type="text"
    //         id="first_name"
    //         className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
    //         placeholder="Enter Zip Code "
    //         required
    //         value={zipCode}
    //         onChange={(e) => setZipCode(e.target.value)}
    //       />
    //       <button
    //         type="submit"
    //         className="text-white bg-green-700 hover:bg-green-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
    //       >
    //         Transfer
    //       </button>
    //     </form>
    //   </div>
    // </div>
    <section class="bg-gray-50">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        {/* <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"> */}
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            {/* <h1 class="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"> */}
            <h1 class="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Transfer Calls
            </h1>
            <form class="space-y-4 md:space-y-6" onSubmit={transferCall}>
              <div>
                <label
                  for="phone_number"
                  class="block mb-2 text-sm font-medium text-gray-900"
                  //   class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone_number"
                  id="phone_number"
                  placeholder="Enter zip code here"
                  class="bg-gray-50 border-b border-gray-300 text-gray-900 block w-full p-2.5 "
                  //   class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={number}
                  disabled
                />
                {zipCodeError && (
                  <span className="text-red-600 mb-2 text-xs">
                    {zipCodeError}
                  </span>
                )}
              </div>
              <div>
                <label
                  for="zipcode"
                  class="block mb-2 text-sm font-medium text-gray-900"
                  //   class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zipcode"
                  id="zipcode"
                  placeholder="Enter zip code here"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  //   class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
                {zipCodeError && (
                  <span className="text-red-600 mb-2 text-xs">
                    {zipCodeError}
                  </span>
                )}
              </div>
              <button
                type="submit"
                class="w-full bg-green-700 hover:bg-green-700 text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                // class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Transfer
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Main;
