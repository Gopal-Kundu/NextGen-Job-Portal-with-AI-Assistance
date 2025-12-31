const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    allMessages: {
        type: [{
            message: { type: String },
            time: { type: String },
        }]
    },
    newMessageCount: {
        type: Number,
        default: 0
    }
})

const Notification = mongoose.model("Notifications", notificationSchema);
module.exports = Notification;