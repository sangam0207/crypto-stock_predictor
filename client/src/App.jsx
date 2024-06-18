import { useState, useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import NET from "vanta/dist/vanta.net.min";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { RiExchangeFill } from "react-icons/ri";
const App = () => {
  const [symbol, setSymbol] = useState("");
  const [period, setPeriod] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  useEffect(() => {
    const vantaEffect = NET({
      el: "#effect",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0x0b5ace,
      backgroundColor: 0xf31,
      points: 15.0,
      maxDistance: 25.0,
      spacing: 17.0,
    });

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/predict?symbol=${symbol}&period=${period}`
      );
      console.log(res.data);
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="effect"
      className="h-screen flex items-center justify-center"
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
      }}
    >
      <div className="bg-gray-200 bg-opacity-60 p-4 rounded-lg border border-blue-400 shadow-2xl w-1/2 relative ">
        <div className="absolute top-5 left-1 text-black text-3xl hover:text-4xl">
          <RiExchangeFill onClick={() => setToggle(!toggle)} />
        </div>

        <h1 className="text-center text-black font-bold text-3xl">
          {toggle ? "Stock" : "Crypto"} Predictor
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 my-6 p-6 rounded-lg">
          <div className="flex flex-wrap items-center justify-center space-x-2">
            <label htmlFor="symbol" className="sr-only">
              Symbol
            </label>
            <input
              type="text"
              id="symbol"
              className="appearance-none bg-gray-100 border-2 border-gray-500 rounded-md py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 w-full md:w-auto uppercase"
              placeholder="Enter symbol..."
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              required
            />

            <label htmlFor="period" className="sr-only">
              Period
            </label>
            <input
              type="text"
              id="period"
              className="appearance-none bg-gray-100 border-2 border-gray-500 rounded-md py-3 px-4 leading-tight focus:outline-none uppercase focus:bg-white focus:border-indigo-500 w-full md:w-auto"
              placeholder="Enter period..."
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="font-bold w-full md:w-auto bg-indigo-700 text-white py-3 px-6 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-600"
            >
              Predict
            </button>
          </div>
        </form>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <ClipLoader color="red" loading={isLoading} size={80} />
          </div>
        ) : (
          data.length > 0 && (
            <div
              className="mt-2 border border-blue-800 shadow-2xl"
              style={{ height: "320px" }}
            >
              <Scrollbars style={{ height: "100%" }}>
                <table className="table-auto w-full">
                  <thead>
                    <tr className="bg-blue-500">
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Currency Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-100" : ""}
                      >
                        <td className="border px-4 py-2 text-center">
                          {item[0]}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {item[1]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Scrollbars>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default App;
