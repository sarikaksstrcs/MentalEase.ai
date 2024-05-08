import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import PieChart from "../../components/Chart/PieChart";

// import { Pie } from 'react-chartjs-2';

const Reports = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const[userId,setUserId] = useState("");
  const [chartData, setChartData] = useState({});

  const fetchData = (url, options) => {
    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
  };

  
  useEffect(() => {
    setUserId(JSON.parse(localStorage.getItem("data")).id)
    console.log(userId);
    axios
      .post("http://localhost:5000/report/", {
        email: JSON.parse(localStorage.getItem("data")).email,
      })
      .then((res) => {
        console.log(res.data);
        setReport(res.data);
      });

  }, []);
  
  

  useEffect(() => {
    if (userId) {
      console.log("samdas",userId);
      fetchData('http://localhost:5000/mentalissueslastweek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: userId,
        })
      })
      .then(data => {
        console.log("Success");
        console.log(data.mentalissueslastweek);
        const mentalIssuesLastWeek = data.mentalissueslastweek;
        const totalIssues = mentalIssuesLastWeek.length;
        const issueCounts = mentalIssuesLastWeek.reduce((counts, issue) => {
          counts[issue.mentalissue] = (counts[issue.mentalissue] || 0) + 1;
          return counts;
        }, {});
        
        const percentages = {};
        for (const issue in issueCounts) {
          percentages[issue] = parseFloat(((issueCounts[issue] / totalIssues) * 100).toFixed(2));
        }
        
        console.log("Data to be ploted",percentages);
        // setChartData(percentages)
        const chartLabels = Object.keys(percentages);
        const chartDataValues = Object.values(percentages);

        setChartData({
          labels: chartLabels,
          datasets: [
            {
              data: chartDataValues,
              backgroundColor: ['#FF6384', '#36A2EB'],
              hoverBackgroundColor: ['#FF6384', '#36A2EB']
            }
          ]
        });
        console.log("chartdata",chartData);

      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  }, [userId]);
  

  return (
    <div className="flex">
      <Navbar />
      <div className="w-3/4 h-screen overflow-auto pb-5">
        <h1 className="text-4xl font-semibold px-5 fixed w-full py-5 bg-gradient-to-r to-sky-600 from-sky-400">
          Report
        </h1>
        {!report?.success ? (
          <div className="mt-20">
            <h1 className="text-2xl">No report found, take a test</h1>
            <button
              onClick={() => navigate("/quiz")}
              className="col-span-3 bg-gradient-to-bl from-sky-600 to-sky-300 hover:bg-[position:_100%_100%] bg-[size:_200%] transition-all duration-500 text-[#02203c] p-3 rounded-md mt-28"
            >
              Take test
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/quiz")}
            className="col-span-3 bg-gradient-to-bl from-sky-600 to-sky-300 bg-[position:_0%_0%] hover:bg-[position:_100%_100%] bg-[size:_200%] transition-all duration-500 text-[#02203c] p-3 rounded-md mt-28  mx-5 "
          >
            Retake test
          </button>
        )}
        <div>
        {report?.report ? (
            report.report.split("\n").map((item, index) => (
          <div>
            <div key={index} className={`px-5   mt-2 ${index === 0 ? 'text-center p-5 text-blue-500 underline   ' : 'text-justify'}`}>
              <h1 className={`text-xl ${item.endsWith(':') ? 'font-bold' : ''}`}>{item.slice(0, -1)}</h1>
            </div>            
          </div>
          
        ))
      ): (
        <div>Loading...</div>
      )}
      <p className="px-5 py-10 text-red-600 font-bold ">Please note that the above report is AI generated and not conclusive. Contact a professional therapist if your issue persists</p>
      </div>
      <PieChart/>
      </div>
      {/* <div className="flex-grow">
        {chartData ? (
          <Pie data={chartData} />
          // <p>slaj</p>
        ) : (
          <div>No data available</div>
        )}
      </div> */}
      
    </div>
  );
};

export default Reports;
