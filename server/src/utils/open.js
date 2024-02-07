const path = require("path");
require("dotenv").config();
const { PythonShell } = require("python-shell");
const data = [];
// const { Configuration, OpenAIApi } = require("openai");
// prompt = []
async function QueryGPT(prompt) {
  data.push({ role: "user", content: prompt });
  try {
    let options = {
      args: [...data.map((x) => JSON.stringify(x))],
    };
    let answer;
    await PythonShell.run("gpt.py", options).then((res) => {
      // answer = res;
      
      console.log(res, "hi");
      answer = res;
      return res
    });
    return answer;
  } catch (err) {
    return err;
  }
}

//     const response = await openai.createCompletion({
//       model: "text-davinci-003",
//       prompt: `
//               ${prompt}

//               The time complexity of this function is
//               ###
//             `,
//       max_tokens: 64,
//       temperature: 0,
//       top_p: 1.0,
//       frequency_penalty: 0.0,
//       presence_penalty: 0.0,
//       stop: ["\n"],
//     });

// }

module.exports = QueryGPT;
