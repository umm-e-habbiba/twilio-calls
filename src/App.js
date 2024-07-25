import React, { useState, useEffect } from "react";
function App() {
  const [zipCode, setZipCode] = useState("");

  const transferCall = (e) => {
    e.preventDefault();
    console.log("zipcode", zipCode);
  };
  return (
    // <div className="flex flex-col">
    //   <p>Phone Number: 123456789</p>
    //   <input type="text" placeholder="Enter Zip code here" className="" />
    //   <button>Transfer</button>
    // </div>
    <div className="flex h-screen">
      <div className="m-auto ">
        <p className="mb-2">Phone Number: 123456789</p>
        <form
          onSubmit={(e) => transferCall(e)}
          className="flex flex-col justify-center items-center"
        >
          <input
            type="text"
            id="first_name"
            className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter Zip Code "
            required
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
          <button
            type="submit"
            className="text-white bg-green-700 hover:bg-green-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Transfer
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
