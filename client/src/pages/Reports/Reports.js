import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

const Reports = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  useEffect(() => {
    axios
      .post("http://localhost:5000/report/", {
        email: JSON.parse(localStorage.getItem("data")).email,
      })
      .then((res) => {
        console.log(res.data);
        setReport(res.data);
      });
  }, []);

  return (
    <div className="flex">
      <Navbar />
      <div className="px-12 py-6 w-3/4 h-screen overflow-auto">
        <h1 className="text-4xl font-semibold mb-12">Report</h1>
        {!report?.success ? (
          <div className="mt-6">
            <h1 className="text-2xl">No report found, take a test</h1>
            <button
              onClick={() => navigate("/quiz")}
              className="col-span-3 bg-gradient-to-bl from-sky-600 to-sky-300 bg-[position:_0%_0%] hover:bg-[position:_100%_100%] bg-[size:_200%] transition-all duration-500 text-[#02203c] p-3 rounded-md mt-2"
            >
              Take test
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/quiz")}
            className="col-span-3 bg-gradient-to-bl from-sky-600 to-sky-300 bg-[position:_0%_0%] hover:bg-[position:_100%_100%] bg-[size:_200%] transition-all duration-500 text-[#02203c] p-3 rounded-md mt-2"
          >
            Retake test
          </button>
        )}

        {report?.report?.split("\n").map((item, index) => (
          <div>
            <div key={index} className={`mt-2 ${index === 0 ? 'text-center p-5 text-blue-500 underline   ' : ''}`}>
              <h1 className={`text-xl ${item.endsWith(':') ? 'font-bold' : ''}`}>{item.slice(0, -1)}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
