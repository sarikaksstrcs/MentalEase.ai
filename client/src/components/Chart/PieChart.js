import { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";

const PieChart = () => {
    const [tasks, setTasks] = useState([]);
    const chartRef = useRef(null); // Reference to the chart instance

    



    useEffect(() => {
        drawPieChart(40, 60);
    }, []);

    const drawPieChart = (trueCount, falseCount) => {
        const ctx = document.getElementById("myPieChart");
        chartRef.current = new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["Completed", "Not Completed"],
                datasets: [{
                    label: "Tasks",
                    data: [trueCount, falseCount],
                    backgroundColor: ["green", "#FF6384"],
                    
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
                Task Progress
            </div>
        </div>
    );
};

export default PieChart;
