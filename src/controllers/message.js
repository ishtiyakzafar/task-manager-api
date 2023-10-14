const Message = require("../model/message");

//SEND MESSAGE
exports.sendMessage = async (req, res) => {
    try {
        const newMessage = new Message({
            senderId: req.user._id,
            chatId: req.body.chatId,
            text: req.body.text,
            media: req.body.media,
            user: req.user._id,
        });
        await newMessage.save();
        return res.status(201).json({ message: 'message send' });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong " + error });
    }
};

//GET MESSAGE BY CHAT ID
exports.getMessage = async (req, res) => {
    try {
        const messages = await Message.find({ chatId: req.body.chatId }).populate('user', 'name colorCode pic');
        return res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong " + error });
    }
};

// DELETE MESSAGES BY ID
exports.deleteMessages = async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "messages deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong", error });
    }
};