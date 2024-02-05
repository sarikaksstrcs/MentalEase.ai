const express = require("express");
const Replicate = require("replicate");
const router = express.Router();

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

module.exports = router;
