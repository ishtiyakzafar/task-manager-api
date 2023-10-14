const User = require("../model/user");

const socketEvents = (io) => {
    io.on('connection', socket => {
        socket.on('join', async (userId, workspaceId) => {
            socket.join(userId);
            const user = await User.findOne({ _id: userId });
            if (user) {
                user.status = 'online';
                user.socketId = socket.id;
                user.currentWorkspaceId = workspaceId;
                await user.save();
                socket.broadcast.emit('user_online', user)
            }
        });

        socket.on('leave', async (userId) => {
            socket.leave(userId);
            const user = await User.findOne({ _id: userId });
            if (user) {
                user.status = 'offline';
                user.socketId = '';
                user.currentWorkspaceId = '';
                await user.save();
                socket.broadcast.emit('user_offline', user);
            }
        });

        socket.on('disconnect', async () => {
            const user = await User.findOne({ socketId: socket.id });
            if (user) {
                user.status = 'offline';
                user.socketId = '';
                await user.save();
                socket.broadcast.emit('user_offline', user);
            }
        });

        // socket.on('typing', (data) => {
        //     socket.in(data.recieverId).emit('userTyping', data.senderId)
        // });

        // socket.on('stop_typing', (data) => {
        //     socket.in(data.recieverId).emit('userStopTyping', data.senderId)
        // });

        //SEND COMMENT
        socket.on('send_comment', comment => {
            comment.receivers.map((receiver) => {
                socket.broadcast.to(receiver).emit('receive_comment', comment)
            })
        });

        //UPDATE COMMENT
        socket.on('update_comment', comment => {
            comment.receivers.map((receiver) => {
                socket.broadcast.to(receiver).emit('updated_comment', comment)
            })
        });

        //DELETE COMMENT
        socket.on('delete_comment', comment => {
            comment.receivers.map((receiver) => {
                socket.broadcast.to(receiver).emit('deleted_comment', comment)
            })
        });

        //SEND POST
        socket.on('send_post', post => {
            post.receivers.map((receiver) => {
                socket.broadcast.to(receiver).emit('receive_post', post)
            })
        });

        //DELETE POST
        socket.on('delete_post', post => {
            post.receivers.map((receiver) => {
                socket.broadcast.to(receiver).emit('deleted_post', post)
            })
        });
    })
};

module.exports = socketEvents;
