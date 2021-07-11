const { nanoid } = require('nanoid')

module.exports = async (req, res) => {
    const sleepScore = req.body.sleepScore;

    if(sleepScore > 100){
        return res.status(400).send({
            "code": 1000400,
            "message": "Invalid value"
        });
    }

    if (sleepScore > 80) {
        return res.status(201).send({
            "id": nanoid(),
            "message": "Dang. Nice work! Keep sleeping!"
        });
    }

    if (sleepScore > 50) {
        return res.status(201).send({
            "id": nanoid(),
            "message": "Well... you're average. Maybe sleep more though."
        });
    }

    return res.status(201).send({
        "id": nanoid(),
        "message": "Oh dear... you definitely need to get more sleep"
    });
}