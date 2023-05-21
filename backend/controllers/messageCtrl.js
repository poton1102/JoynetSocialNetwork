const Conversations = require('../models/conversationModel')
const Messages = require('../models/messageModel')
const User = require('../models/userModel')

class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const messageCtrl = {
    createMessage: async (req, res) => {
        const { content, chatId } = req.body;

        if (!content || !chatId) {
            console.log("Invalid data passed into request");
            return res.sendStatus(400);
        }

        var newMessage = {
            sender: req.user._id,
            content: content,
            chat: chatId,
        };

        try {
            var message = await Messages.create(newMessage);

            message = await message.populate("sender", "-password").execPopulate();
            message = await message.populate("chat").execPopulate();
            message = await User.populate(message, {
                path: "chat.users",
                select: "-password",
            });

            await Conversations.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

            res.json(message);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    },
    getConversations: async (req, res) => {
        try {
            const features = new APIfeatures(Conversations.find({
                users: { $elemMatch: { $eq: req.user._id } }
            }), req.query).paginating()

            const results = await features.query.sort('-updatedAt')
                .populate("users", "-password")
                .populate("groupAdmin", "-password")
                .populate("latestMessage")

            const chats = await User.populate(results, {
                path: "latestMessage.sender",
                select: "-password",
            });

            res.status(200).send({
                chats,
                chatsLength: chats.length
            });

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getMessages: async (req, res) => {
        try {
            const features = new APIfeatures(Messages.find({
                chat: req.params.id
            }), req.query).paginating()

            const messages = await features.query.sort('-updatedAt')
                .populate("sender", "-password")
                .populate("chat")

            res.json({
                messages,
                messagesLength: messages.length
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteMessages: async (req, res) => {
        try {
            await Messages.findOneAndDelete({ _id: req.params.id, sender: req.user._id })
            res.json({ msg: 'Delete Success!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteConversation: async (req, res) => {
        try {
            const newConver = await Conversations.findOneAndDelete({
                $or: [
                    { recipients: [req.user._id, req.params.id] },
                    { recipients: [req.params.id, req.user._id] }
                ]
            })
            await Messages.deleteMany({ conversation: newConver._id })

            res.json({ msg: 'Delete Success!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    accessChat: async (req, res) => {
        const { userId } = req.body;

        if (!userId) {
            console.log("UserId param not sent with request");
            return res.sendStatus(400);
        }

        var isChat = await Conversations.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        })
            .populate("users", "-password")
            .populate("latestMessage");

        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "-password",
        });

        if (isChat.length > 0) {
            res.send(isChat[0]);
        } else {
            var chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId],
            };

            try {
                const createdChat = await Conversations.create(chatData);
                const FullChat = await Conversations.findOne({ _id: createdChat._id }).populate(
                    "users",
                    "-password"
                );
                res.status(200).json(FullChat);
            } catch (error) {
                return res.status(500).json({ msg: error.message })
            }
        }
    },
    createGroupChat: async (req, res) => {
        if (!req.body.users || !req.body.name) {
            return res.status(400).send({ message: "Please Fill all the feilds" });
        }

        var users = JSON.parse(req.body.users);

        if (users.length < 2) {
            return res
                .status(400)
                .json({ msg: "More than 2 users are required to form a group chat" });
        }

        users.push(req.user);

        try {
            const groupChat = await Conversations.create({
                chatName: req.body.name,
                users: users,
                isGroupChat: true,
                groupAdmin: req.user,
            });

            const fullGroupChat = await Conversations.findOne({ _id: groupChat._id })
                .populate("users", "-password")
                .populate("groupAdmin", "-password");

            res.status(200).json(fullGroupChat);
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    renameGroup: async (req, res) => {
        try {
            const { chatId, chatName } = req.body;
            const updatedChat = await Conversations.findByIdAndUpdate(
                chatId,
                {
                    chatName: chatName,
                },
                {
                    new: true,
                }
            )
                .populate("users", "-password")
                .populate("groupAdmin", "-password");

            if (!updatedChat) {
                res.status(404);
                throw new Error("Chat Not Found");
            } else {
                res.json(updatedChat);
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    removeFromGroup: async (req, res) => {
        try {
            const { chatId, userId } = req.body;

            // check if the requester is admin
            const removed = await Conversations.findByIdAndUpdate(
                chatId,
                {
                    $pull: { users: userId },
                },
                {
                    new: true,
                }
            )
                .populate("users", "-password")
                .populate("groupAdmin", "-password");

            if (!removed) {
                res.status(404);
                throw new Error("Chat Not Found");
            } else {
                res.json(removed);
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    addToGroup: async (req, res) => {
        try {
            const { chatId, userId } = req.body;

            // check if the requester is admin

            const added = await Conversations.findByIdAndUpdate(
                chatId,
                {
                    $push: { users: userId },
                },
                {
                    new: true,
                }
            )
                .populate("users", "-password")
                .populate("groupAdmin", "-password");

            if (!added) {
                res.status(404);
                throw new Error("Chat Not Found");
            } else {
                res.json(added);
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    }

}


module.exports = messageCtrl