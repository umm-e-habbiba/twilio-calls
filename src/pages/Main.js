import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { Response, Say, Dial } from "react-twiml";
const Main = () => {
  const navigate = useNavigate();
  const [number, setNumber] = useState("");
  const [sid, setSid] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [zipCodeError, setZipCodeError] = useState("");
  const [activeCalls, setActiveCalls] = useState([
    // { from_formatted: "from1", sid: "sid1" },
    // {
    //   from_formatted: "from2",
    //   sid: "sid2",
    // },
  ]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const isLogin = localStorage.getItem("adminLogin");
    if (!isLogin) {
      navigate("/login");
    } else {
      getStatus(true);
      // function with 1s interval that keeps checking Twilio API for an active call.
      // const interval = setInterval(() => {
      //   getStatus(false);
      // }, 1000);
      // return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (activeCalls.length > 0 && activeCalls.length == 1) {
      setNumber(activeCalls[0].from_formatted);
      setSid(activeCalls[0].sid);
    }
  }, [activeCalls]);

  const logout = () => {
    window.localStorage.removeItem("adminLogin");
    navigate("/login");
  };

  const getStatus = (showLoader) => {
    if (showLoader) {
      setLoader(true);
    }
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Basic ${window.btoa(
        `${process.env.REACT_APP_TWILIO_SID}:${process.env.REACT_APP_TWILIO_TOKEN}`
      )}`
    );
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.REACT_APP_TWILIO_SID}/Calls.json?Status=in-progress`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setLoader(false);
        if (result.calls) {
          setActiveCalls(
            result.calls?.filter((call) => call.direction == "inbound")
          );
          // setNumber(result.calls[0]?.from_formatted);
          // setSid(result.calls[0]?.sid);
        }
      })
      .catch((error) => {
        console.error(error);
        setLoader(false);
      });
  };

  const setNumberAndSid = (e) => {
    const index = e.target.selectedIndex;
    const el = e.target.childNodes[index];
    const id = el.getAttribute("id");
    const number = el.getAttribute("value");
    console.log(number, id);
    setNumber(number);
    setSid(id);
  };

  const transferCall = (e) => {
    e.preventDefault();
    if (zipCode) {
      console.log("zipcode", zipCode, "number", number, "sid", sid);
      const myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        `Basic ${window.btoa(
          `${process.env.REACT_APP_TWILIO_SID}:${process.env.REACT_APP_TWILIO_TOKEN}`
        )}`
      );
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${process.env.REACT_APP_TWILIO_SID}/Calls/${sid}.json`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          // <Response><Dial>${your_predefined_number}</Dial></Response>
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setZipCodeError("Zip code is required");
    }
  };
  return (
    <>
      <nav class="bg-gray-50 border-b border-gray-200 ">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div></div>
          <div class="w-full md:block md:w-auto float-right">
            <div
              class="block py-2 px-3 text-gray-900 rounded md:bg-transparent md:p-0 cursor-pointer"
              onClick={logout}
            >
              Logout
            </div>
          </div>
        </div>
      </nav>

      <section class="bg-gray-50 shadow">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          {/* <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"> */}
          {loader ? (
            <Loader />
          ) : (
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
                    {activeCalls.length > 1 ? (
                      <select
                        class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        onChange={setNumberAndSid}
                      >
                        <option selected disabled>
                          Select a phone number
                        </option>
                        {activeCalls.map((call, index) => (
                          <option
                            value={call.from_formatted}
                            id={call.sid}
                            key={index}
                          >
                            {call.from_formatted}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name="phone_number"
                        id="phone_number"
                        placeholder="There is no active call yet"
                        class="bg-gray-50 border-b border-gray-300 text-gray-900 block w-full p-2.5 "
                        //   class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={number}
                        disabled
                      />
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
                    disabled={activeCalls.length > 0 ? false : true}
                    class={`${
                      activeCalls.length > 0 ? "" : "opacity-60"
                    } w-full bg-green-700 hover:bg-green-700 text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                    // class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Transfer
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Main;
