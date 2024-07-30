import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { Response, Say, Dial } from "react-twiml";
const Main = () => {
  const navigate = useNavigate();
  const [number, setNumber] = useState("");
  const [from, setFrom] = useState("");
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
  const [transferLoader, setTransferLoader] = useState(false);
  const [campaignIds, setCampaignIds] = useState([]);
  const [campaignURLs, setCampaignURLs] = useState([]);
  const [campaignURLsFinal, setCampaignFinal] = useState([]);

  useEffect(() => {
    const isLogin = localStorage.getItem("adminLogin");
    if (!isLogin) {
      navigate("/login");
    } else {
      getStatus(true);
      getAllCampaigns();
      // function with 1s interval that keeps checking Twilio API for an active call.
      // const interval = setInterval(() => {
      //   getStatus(false);
      // }, 1000);
      // return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (activeCalls.length > 0 && activeCalls.length == 1) {
      setFrom(activeCalls[0].from);
      setNumber(activeCalls[0].from_formatted);
      setSid(activeCalls[0].sid);
    }
  }, [activeCalls]);

  useEffect(() => {
    // console.log("campaign ids", campaignIds);

    if (campaignIds.length > 1) {
      callApiInLoop();
    }
  }, [campaignIds]);

  useEffect(() => {
    console.log("campaign urls", campaignURLs);
  }, [campaignURLs]);

  const callApiInLoop = async () => {
    await Promise.all(
      campaignIds.map((id) => {
        getCampaignDetail(id);
      })
    ).then(() => {
      // when all campaign's details is fetched, set loader false
      setLoader(false);
    });
  };

  const logout = () => {
    window.localStorage.removeItem("adminLogin");
    navigate("/login");
  };

  const getAllCampaigns = () => {
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Token ${process.env.REACT_APP_API_TOKEN}`
    );

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://api.ringba.com/v2/${process.env.REACT_APP_RINGBA_ACCOUNTID}/campaigns`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.campaigns) {
          setCampaignIds(result.campaigns?.map((c) => c.id));
        }
      })
      .catch((error) => console.error(error));
  };

  const getCampaignDetail = (id) => {
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Token ${process.env.REACT_APP_API_TOKEN}`
    );

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://api.ringba.com/v2/${process.env.REACT_APP_RINGBA_ACCOUNTID}/campaigns/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then(async (result) => {
        console.log(result);
        if (result.pubNumberEnrichmentUrls) {
          const urls = result.pubNumberEnrichmentUrls;
          if (urls) {
            campaignURLs.push(urls);
            // console.log("campaign urls", campaignURLs);
            // setCampaignURLs(campaignURLs);
          }
        }
      })
      .catch((error) => console.error(error));
  };

  const getStatus = (showLoader) => {
    // if (showLoader) {
    //   setLoader(true);
    // }
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
        // setLoader(false);
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
        // setLoader(false);
      });
  };

  const setNumberAndSid = (e) => {
    const index = e.target.selectedIndex;
    const el = e.target.childNodes[index];
    const id = el.getAttribute("id");
    const number = el.getAttribute("value");
    const from = el.getAttribute("name");
    setNumber(number);
    setFrom(from);
    setSid(id);
  };

  const transferCall = (e) => {
    // e.preventDefault();
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
        setTransferLoader(false);
        // <Response><Dial>${your_predefined_number}</Dial></Response>
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const showallurls = async (e) => {
    e.preventDefault();
    if (zipCode) {
      setTransferLoader(true);
      campaignURLs.map((urls, index) => {
        // console.log("url key", Object.keys(urls));
        if (Object.keys(urls).length > 1) {
          Object.keys(urls).map((key) => {
            // console.log("two values", urls[key]);
            let replaced_number = urls[key].replace(
              "<<E.164-CALLER-NUMBER>>",
              from
            );
            let replaced_zipcode = replaced_number.replace(
              "value1&key2=value2",
              zipCode
            );

            campaignURLsFinal.push(
              // urls[key].replace("<<E.164-CALLER-NUMBER>>", number)
              replaced_zipcode
            );
            // console.log("final array ===", campaignURLsFinal);
          });
        } else {
          // console.log("one value key", Object.keys(urls)[0]);
          let replaced_number = urls[Object.keys(urls)[0]].replace(
            "<<E.164-CALLER-NUMBER>>",
            from
          );
          let replaced_zipcode = replaced_number.replace(
            "value1&key2=value2",
            zipCode
          );
          campaignURLsFinal.push(
            replaced_zipcode
            // urls[Object.keys(urls)[0]].replace("<<E.164-CALLER-NUMBER>>", number)
          );
          // console.log("final array =", campaignURLsFinal);
        }
      });
      // call all apis
      await Promise.all(
        campaignURLsFinal.map((url) => {
          callApiWithUrl(url);
        })
      ).then(() => {
        // when all apis are done
        transferCall();
      });
    } else {
      setZipCodeError("Zip code is required");
    }
  };

  const callApiWithUrl = (url) => {
    const myHeaders = new Headers();
    myHeaders.append("Access-Control-Allow-Origin", "*");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });
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
                <form class="space-y-4 md:space-y-6" onSubmit={showallurls}>
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
                            name={call.from}
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
                    disabled={
                      activeCalls.length > 0 && !transferLoader ? false : true
                    }
                    class={`${
                      activeCalls.length > 0 ? "" : "opacity-60"
                    } w-full bg-green-700 hover:bg-green-700 text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                    // class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    {transferLoader ? (
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          class="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span class="sr-only">Loading...</span>
                      </div>
                    ) : (
                      "Transfer"
                    )}
                  </button>
                </form>
                {/* <button
                  onClick={showallurls}
                  class={`w-full bg-green-700 hover:bg-green-700 text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                  // class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  check
                </button> */}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Main;
