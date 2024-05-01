import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

const Diet = () => {
  const navigate = useNavigate();
  const [diet, setDiet] = useState(null)
  useEffect(() => {
    axios
      .post("http://localhost:5000/diet", {
        email: JSON.parse(localStorage.getItem("data")).email,
      })
      .then((res) => {
        console.log(res.data);
        setDiet(res.data)
      });
  }, []);

  return (
    <div className="flex">
      <Navbar />
      <div className="px-12 py-6 w-3/4 h-screen overflow-auto">
        <h1 className="text-4xl font-semibold mb-12">Diet</h1>
        {!diet?.success ? (
          <div className="mt-6">
            <h1 className="text-2xl">No diet found, take a test</h1>
            <button
              onClick={() => navigate("/quiz")}
              className="col-span-3 bg-gradient-to-bl from-sky-600 to-sky-300 bg-[position:_0%_0%] hover:bg-[position:_100%_100%] bg-[size:_200%] transition-all duration-500 text-[#02203c] p-3 rounded-md mt-2"
            >
              Take test
            </button>
          </div>
        ) : null}
        {diet?.diet?.split("\n").map((item, index) => (
          <div key={index} className="mt-2">
            <h1 className="text-xl">{item}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Diet;
