const { gemini } = require("../Ai/gemini");

async function aiApi(req, res) {
    try {
        const { promt } = req.body;
        let result = await gemini(promt);
        return res.status(200).json({
            message: result,
            success: true,
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            message: err,
            success: false
        })
    }
}

module.exports = { aiApi };