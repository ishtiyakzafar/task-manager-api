const Contact = require('../model/contact');
const Chat = require('../model/chat');


//ADD ONE TO ONE CHAT AND CONTACTS
exports.addContact = async (req, res) => {
    try {
        const { contactId, contactName } = req.body;
        const contactExist = await Contact.findOne(
            {
                $and: [
                    { isGroupContact: { '$eq': false } },
                    { userId: { '$eq': req.user._id } },
                    { user: { '$eq': contactId } }
                ]
            }
        );

        if (contactExist) {
            return res.status(400).json({ message: 'Contact already added' });;
        } else {
            const chatMemberId = [req.user._id, contactId];
            const chatMember = [{ id: req.user._id, name: req.user.name }, { id: contactId, name: contactName }];


            // CREATE ONE TO ONE CHAT
            const newChat = new Chat({ users: chatMemberId });
            const chat = await newChat.save();

            // CREATE ONE TO ONE CONTACT
            for (const members of chatMember) {
                const newContact = new Contact({
                    userId: members.id,
                    chatId: chat._id,
                    user: chatMember.map((mem) => mem.id).filter((item) => item !== members.id),
                    contactName: chatMember.find((mem) => mem.name !== members.name).name,
                });
                await newContact.save();
            };
            return res.status(201).json({ message: 'Contact added successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: "Something went wrong " + error });
    }
};


//ADD GROUP CHAT AND CONTACTS
exports.addGroupContact = async (req, res) => {
    try {
        const { groupName, contactId } = req.body;
        const groupNameExist = await Contact.findOne({ groupName: { '$eq': groupName } });

        if (groupNameExist) {
            return res.status(400).json({ message: 'Group name already exist!' });;
        } else {
            const groupMember = [req.user._id, ...contactId];

            // CREATE GROUP CHAT
            const newChat = new Chat({ users: groupMember });
            const chat = await newChat.save();

            // CREATE GROUP CONTACT
            for (const memberId of groupMember) {
                const newGroup = new Contact({
                    userId: memberId,
                    chatId: chat._id,
                    isGroupContact: true,
                    groupAdmin: req.user._id,
                    groupName,
                    user: groupMember.filter((id) => id !== memberId),
                    aboutGroup: 'this is group description',
                });
                await newGroup.save();
            };
            return res.status(201).json({ message: 'Group added successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: "Something went wrong " + error });
    }
};


//GET CONTACTS
exports.getContacts = async (req, res) => {


    try {
        const keyword = req.query.search
            ? {
                $or: [
                    { contactName: { $regex: req.query.search, $options: "i" } },
                    { groupName: { $regex: req.query.search, $options: "i" } },
                ]
            } : {};

        const contacts = await Contact.find(keyword).find({ userId: req.user._id }).populate('user groupAdmin', '-password');
        return res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong " + error });
    }
};


//UPLOAD GROUP PICTURE
exports.uploadGroupPhoto = async (req, res) => {
    try {
        await Contact.updateMany({ chatId: req.body.chatId }, { groupImage: req.body.groupImage }, { new: true });
        res.status(200).json({ message: 'Group image added successfully' });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong " + error });
    };
};

//REMOVE GROUP PICTURE
exports.removeGroupPhoto = async (req, res) => {
    try {
        await Contact.updateMany({ chatId: req.body.chatId }, { groupImage: null }, { new: true });
        res.status(200).json({ message: 'Group image remove successfully' });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong " + error });
    };
};

//UPLOAD GROUP DESCRIPTION
exports.updateGroupDescription = async (req, res) => {
    try {
        await Contact.updateMany({ chatId: req.body.chatId }, { aboutGroup: req.body.aboutGroup }, { new: true });
        res.status(200).json({ message: 'Group description updated successfully' });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong " + error });
    };
};


//UPDATE GROUP PARTICIPANTS
exports.updateGroupParticipant = async (req, res) => {
    const { chatId, contactId } = req.body;
    const groupMember = [req.user._id, ...contactId];

    try {
        const group = await Contact.findOne({ chatId });
        await Contact.deleteMany({ chatId });

        // CREATE GROUP CONTACT
        for (const memberId of groupMember) {
            const newGroup = new Contact({
                userId: memberId,
                chatId,
                isGroupContact: true,
                groupAdmin: req.user._id,
                groupName: group.groupName,
                user: groupMember.filter((id) => id !== memberId),
                aboutGroup: group.aboutGroup,
                groupImage: group.groupImage,
            });
            await newGroup.save();
        };

        res.status(200).json({ message: 'updated successfully' });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong " + error });
    };
};

