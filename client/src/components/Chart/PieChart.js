import { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";

const PieChart = () => {
    const chartRef = useRef(null); // Reference to the chart instance

    const[userId,setUserId] = useState("");

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
            drawPieChart(chartDataValues,chartLabels);    
          })
          .catch(error => {
            console.error('Error:', error);
          });
        }
      }, [userId]);


    const drawPieChart = (chartDataValues,chartLabels) => {
        const ctx = document.getElementById("myPieChart");
        console.log("ChartLabels",chartLabels);
        chartRef.current = new Chart(ctx, {
            type: "pie",
            data: {
                labels: chartLabels,
                datasets: [{
                    label: "Percentage",
                    data: chartDataValues,
                    backgroundColor: ["green", "#FF6384","red"],
                    
                }],
            },
        });
    };

    return (
        <div  className="w-1/3 rounded-md shadow-md pl-2 hover:scale-100 duration-300">
            <div className="pb-0 ">
                <canvas id="myPieChart"></canvas>
            </div>
            <div className="flext justify-center text-center pt-4 font-bold">
                Mental Report
            </div>
        </div>
    );
};

export default PieChart;
