const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const newMessage = new Message({
            sender: req.user,
            receiver: receiverId,
            content
        });
        const savedMessage = await newMessage.save();
        res.json(savedMessage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const messages = await Message.find({
            $or: [
                { sender: req.user, receiver: otherUserId },
                { sender: otherUserId, receiver: req.user }
            ]
        }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
