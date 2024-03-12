import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const set = [
  {
    question:
      "Nervousness or shakiness inside",
    choices: [
      "Not at all",
      "A little Bit",
      "Moderately",
      "Quite A Bit",
      "Extremely",
    ],
  },
  {
    question: "Faintness or dizziness",
    choices: [
      "Not at all",
      "A little Bit",
      "Moderately",
      "Quite A Bit",
      "Extremely",
    ],
  },
  {
    question: "The idea that someone else can control your thoughts",
    choices: [
      "Not at all",
      "A little Bit",
      "Moderately",
      "Quite A Bit",
      "Extremely",
    ],
  },
  {
    question: "Feeling others are to blame for most of your troubles",
    choices: [
      "Not at all",
      "A little Bit",
      "Moderately",
      "Quite A Bit",
      "Extremely",
    ],
  },
  {
    question: "Feeling easily annoyed or irritated",
    choices: [
      "Not at all",
      "A little Bit",
      "Moderately",
      "Quite A Bit",
      "Extremely",
    ],
  },
  {
    question: "Pains in heart or chest",
    choices: [
      "Not at all",
      "A little Bit",
      "Moderately",
      "Quite A Bit",
      "Extremely",
    ],
  },
  {
    question: "Feeling afraid in open spaces or on the streets",
    choices: [
      "Not at all",
      "A little Bit",
      "Moderately",
      "Quite A Bit",
      "Extremely",
    ],
  },
  {
    question: "Thoughts of ending your life",
    choices: [
      "Not at all",
      "A little Bit",
      "Moderately",
      "Quite A Bit",
      "Extremely",
    ],
  },
  {
    question: "Feeling that most people cannot be trusted",
    choices: [
      "Not at all",
      "A little Bit",
      "Moderately",
      "Quite A Bit",
      "Extremely",
    ],
  },
];

const answers = set.map((item) => ({
  question: item.question,
  answer: "",
}));

const Quiz = () => {
  const [ans, setAns] = useState(answers);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();

  const handleAnswerChange = (choice) => {
    setAns((prevAnswers) =>
      prevAnswers.map((answer, index) =>
        index === currentQuestion ? { ...answer, answer: choice } : answer
      )
    );
  };

  const handleSubmit = () => {
    if (ans.some((answer) => answer.answer === "")) {      
      alert("Please answer all the questions");
      return;
    }
    setLoading(true);
    axios
      .post("http://localhost:5000/report/fetch", {
        quiz: JSON.stringify(ans),
        email: JSON.parse(localStorage.getItem("data")).email,
      })
      .then((res) => {
        console.log(res.data);
        navigate("/reports");
      });
  };

  const isLastQuestion = currentQuestion === set.length - 1;
  useEffect(() => {
    // Delay the addition of the 'opacity-100' class to allow rendering
    const timer = setTimeout(() => {
      document.getElementById("question-container").classList.add("opacity-100");
    }, 100);

    // Clear the timer on component unmount
    return () => clearTimeout(timer);
  }, [currentQuestion]); 
  return (
    <div className="px-[16vw] bg-sky-400">
      <div className="px-[7vw] pt-10 bg-white h-screen">
        <h1 className="text-6xl font-semibold text-sky-600">CBT</h1>
        <h1 className="pt-1 text-md static ">
          Answer the following questions based on how much were you bothered by
          these for the past week:
        </h1>
        <div className="pt-2 ">
      <div id="question-container" className="opacity-0 transition-opacity duration-500">
        <h1 className="text-lg font-semibold mb-2">
          {set[currentQuestion].question}
        </h1>
        <div className="flex flex-col gap-4">
          {set[currentQuestion].choices.map((choice, index) => (
            <div className="flex flex-row items-center justify-center" key={index}>
              <button
                className={`${
                  ans[currentQuestion].answer === choice ? "bg-gray-200" : "bg-white"
                } text-gray-800 px-4 py-2 w-full rounded-md border-gray-200 border gap-2 hover:bg-gray-200 focus:ring-2 focus:ring-sky-600 transition-all duration-300`}
                onClick={() => handleAnswerChange(choice)}
              >
                {choice}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
        <div className="flex w-full gap-4 mt-4">
          <button
            onClick={() => setCurrentQuestion((prev) => prev - 1)}
            disabled={currentQuestion === 0}
            className="col-span-3 bg-gradient-to-bl from-gray-600 to-gray-300 bg-[position:_0%_0%] hover:bg-[position:_100%_100%] bg-[size:_200%] transition-all duration-500 text-[#02203c] p-3 rounded-md"
          >
            Previous
          </button>
          {currentQuestion < set.length - 1 && (
            <button
              onClick={() => setCurrentQuestion((prev) => prev + 1)}
              disabled={ans[currentQuestion].answer === "" || loading}
              className={`col-span-3 ${
                ans[currentQuestion].answer === "" ? "bg-gradient-to-bl from-sky-600 to-sky-300 opacity-10" : "bg-gradient-to-bl from-sky-600 to-sky-300"
              } bg-[position:_0%_0%] hover:bg-[position:_100%_100%] bg-[size:_200%] transition-all duration-500 text-[#02203c] p-3 rounded-md`}
            >
              Next
            </button>
          )}
          {isLastQuestion && (
            <button
              onClick={handleSubmit}
              className="col-span-3 font-bold flex gap-2 bg-gradient-to-bl from-sky-600 to-sky-300 bg-[position:_0%_0%] hover:bg-[position:_100%_100%] bg-[size:_200%] transition-all duration-500 text-[#02203c] p-3 rounded-md"
            >
             {loading && <svg xmlns="http://www.w3.org/2000/svg" 
                fill="none" viewBox="0 0 24 24" 
                stroke-width="1.5" 
                stroke="currentColor" 
                className="w-6 h-6 animate-spin text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>}
          
              Submit
            </button>
          )}
        </div>
        <div className="flex justify-end  ">
          <button
              onClick={() => navigate("/reports")}
              className="col-span-3 font-bold flex gap-2 bg-gradient-to-bl from-sky-600 to-sky-300 bg-[position:_0%_0%] hover:bg-[position:_100%_100%] bg-[size:_200%] transition-all duration-500 text-[#02203c] p-3 rounded-md"
            >
              Go back
              </button>
          </div>
      </div>
    </div>
  );
};

export default Quiz;