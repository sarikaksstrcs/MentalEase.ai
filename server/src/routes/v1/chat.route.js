const express = require("express");
const openai = require("../../utils/open.conf");
const query = require("../../utils/open");
const Replicate = require("replicate");
const router = express.Router();

router.post("/chatbot", async (req, res) => {
  const message = req.body.message;
  console.log(message);
  const answer = await query(message);
  console.log(answer);
  return res.json({ answer });
});

const replicate = new Replicate({
    auth: "r8_dIhZjIKfu43EkRdW6dF6kJHAuvp8arO0OhoPh",
});

const runReplicate = async (inputData) => {
    const output = await replicate.run(
        "joehoover/zephyr-7b-alpha:14ec63365a1141134c41b652fe798633f48b1fd28b356725c4d8842a0ac151ee",
        {
            input: {
                prompt: inputData.prompt,
                system_prompt: inputData.system_prompt,
                max_new_tokens: inputData.max_new_tokens || 256,
            },
        }
    );

    // Concatenate array elements into a single string
    const outputString = output.join('');

    return outputString;
};

router.post("/botResponse", async (req, res) => {
    try {
        const inputData = req.body;

        if (!inputData || !inputData.prompt || !inputData.system_prompt) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        const outputString = await runReplicate(inputData);

        res.json({ output: outputString });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.post("/mentalissuetodb", async (req, res) => {
    try {
        const { user, timestamp, mentalissue } = req.body;
        // Create a new instance of the MentalIssue model
        // console.log(user, timestamp, mentalissue);

        // Save the new mental issue to the database
        const newissue = await MentalIssue.create({ user: user, timestamp: timestamp, mentalissue: mentalissue })

        // Respond with success message
        console.log(newissue);
        if (newissue) {
            res.json({ message: 'Mental issue data saved successfully' });
        }
    } catch (error) {
        // If an error occurs, respond with error message
        res.status(500).json({ error: error.message });
    }
})

router.post("/mentalissueslastweek", async (req, res) => {
    try{
        const {user} = req.body;
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const mentalIssues = await MentalIssue.find({
            user: user,
            timestamp: { $gte: oneWeekAgo } // Filter for timestamps greater than or equal to one week ago
        }).exec();
        res.json({user: user, mentalissueslastweek: mentalIssues});
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router;