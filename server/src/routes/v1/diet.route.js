const express = require("express");
const openai = require("../../utils/open.conf");
const query = require("../../utils/open");
const router = express.Router();
const { getUserFunction } = require("../../controllers/user.controller");
const { User } = require("../../models");
const { log } = require("winston");
const create = (name, age, sex, height, history, condition, report) => {
  const prompt = `based on the provided profile, provide a daily diet plan based on Indian Cuisine that will improve my mental health focus more on medical-report. report : name : ${name}, sex : ${sex},age :${age} , height : ${height} , family-medical-history : ${history} ,medical-condition : ${condition}, medical-report : ${report}. `;
  return prompt;
};

router.post("/diet", async (req, res) => {
  // console.log(req.body.email)
  const user = await getUserFunction(req);
  if(user.diet) {
    res.send({ success: true, diet: user.diet });
  } else {
    // console.log(user)
    const prompt = create(
      user.name,
      user.age,
      user.sex,
      user.height,
      user.history,
      user.condition,
      user.report
    );
    // console.log(prompt)
    const response = await query(prompt);
    const filtered = response.filter(x => x.includes(":") || x.includes("-") || x.match(/\d+\./g)).join("\n")
    console.log("Filtered: ",response);
    if(filtered.length < 3) {
      res.send({ success: false, message: "diet not generated" });
    }

    res.send({ success: true, diet: response});
  
      
  }
});

module.exports = router;
