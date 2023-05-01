// let users = []

// const EditData = (data, id, call) => {
//     const newData = data.map(item =>
//         item.id === id ? { ...item, call } : item
//     )
//     return newData;
// }

// const SocketServer = (socket) => {
//     // Connect - Disconnect
//     socket.on('joinUser', id => {
//         users.push({ id: user._id, socketId: socket.id, followers: user.followers })
//         // users.push({ id, socketId: socket.id })
//         // console.log({users},'connect')
//     })

//     socket.on('disconnect', () => {
//         const data = users.find(user => user.socketId === socket.id)
//         if (data) {
//             const clients = users.filter(user =>
//                 data.followers.find(item => item._id === user.id)
//             )

//             if (clients.length > 0) {
//                 clients.forEach(client => {
//                     socket.to(`${client.socketId}`).emit('CheckUserOffline', data.id)
//                 })
//             }

//             if (data.call) {
//                 const callUser = users.find(user => user.id === data.call)
//                 if (callUser) {
//                     users = EditData(users, callUser.id, null)
//                     socket.to(`${callUser.socketId}`).emit('callerDisconnect')
//                 }
//             }
//         }

//         users = users.filter(user => user.socketId !== socket.id)
//         // console.log({ users }, ' disconect')
//     })


//     // Likes, đầu tiên nhận thông tin những thằng đã like bài post gửi cho server, server nhận và gửi lại thông tin cho thằng chủ bài viết
//     socket.on('likePost', newPost => {
//         // console.log(newPost,' likePost')
//         //lấy danh sách của những thằng follow profile thg post bài, user._id là id của thằng post bài
//         const ids = [...newPost.user.followers, newPost.user._id]
//         // console.log(ids,' id')
//         //lọc ra những thằng đã like bài viết(bao gồm cả thằng đc like, nói chung những thằng nào vừa onl và like bài viết sẽ đc print ra)
//         //=> nói chung cứ hiểu là client là nó sẽ lọc ra những thằng like bài viết, thằng like và thằng post bài đều nhận đc thông báo
//         const clients = users.filter(user => ids.includes(user.id))
//         // console.log(users,' mấy thằng')
//         // console.log(clients,' client')
//         // const clients = users.filter(user => newPost.user.followers.includes(user.id))
//         //user.id này là của thằng auth,=> biến clients để lọc mảng tìm xem ai đang following thằng đăng bài post và emit likeToClient cho thằng auth(báo thông tin đã like)
//         // console.log(clients)

//         //     { id: '6415836d3df245148c385aab', socketId: '8-LZMZIREXFVQGOdAAAD' }
//         //socketId là của thg auth, còn id này id của thg post bài
//         //   ]
//         if (clients.length > 0) {
//             clients.forEach(client => {
//                 //gửi lại để cập nhật thông tin luôn trên giao diện
//                 socket.to(`${client.socketId}`).emit('likeToClient', newPost)
//             })
//         }
//     })

//     socket.on('unLikePost', newPost => {
//         const ids = [...newPost.user.followers, newPost.user._id]
//         const clients = users.filter(user => ids.includes(user.id))

//         if (clients.length > 0) {
//             clients.forEach(client => {
//                 socket.to(`${client.socketId}`).emit('unLikeToClient', newPost)
//             })
//         }
//     })


//     // Comments
//     socket.on('createComment', newPost => {
//         const ids = [...newPost.user.followers, newPost.user._id]
//         const clients = users.filter(user => ids.includes(user.id))

//         if (clients.length > 0) {
//             clients.forEach(client => {
//                 socket.to(`${client.socketId}`).emit('createCommentToClient', newPost)
//             })
//         }
//     })

//     socket.on('deleteComment', newPost => {
//         const ids = [...newPost.user.followers, newPost.user._id]
//         const clients = users.filter(user => ids.includes(user.id))

//         if (clients.length > 0) {
//             clients.forEach(client => {
//                 socket.to(`${client.socketId}`).emit('deleteCommentToClient', newPost)
//             })
//         }
//     })


//     // Follow
//     socket.on('follow', newUser => {
//         const user = users.find(user => user.id === newUser._id)
//         user && socket.to(`${user.socketId}`).emit('followToClient', newUser)
//     })

//     socket.on('unFollow', newUser => {
//         const user = users.find(user => user.id === newUser._id)
//         user && socket.to(`${user.socketId}`).emit('unFollowToClient', newUser)
//     })


//     // Notification
//     socket.on('createNotify', msg => {
//         const client = users.find(user => msg.recipients.includes(user.id))
//         client && socket.to(`${client.socketId}`).emit('createNotifyToClient', msg)
//     })

//     socket.on('removeNotify', msg => {
//         const client = users.find(user => msg.recipients.includes(user.id))
//         client && socket.to(`${client.socketId}`).emit('removeNotifyToClient', msg)

//     })


//     // Message
//     socket.on('addMessage', msg => {
//         console.log(msg)
//         const user = users.find(user => user.id === msg.recipient)
//         user && socket.to(`${user.socketId}`).emit('addMessageToClient', msg)
//     })

//     // Check User Online / Offline
//     socket.on('checkUserOnline', data => {
//         const following = users.filter(user =>
//             data.following.find(item => item._id === user.id)
//         )
//         console.log(following)
//         socket.emit('checkUserOnlineToMe', following)

//         const clients = users.filter(user =>
//             data.followers.find(item => item._id === user.id)
//         )

//         if (clients.length > 0) {
//             clients.forEach(client => {
//                 socket.to(`${client.socketId}`).emit('checkUserOnlineToClient', data._id)
//             })
//         }

//     })


//     // Call User
//     socket.on('callUser', data => {
//         users = EditData(users, data.sender, data.recipient)

//         const client = users.find(user => user.id === data.recipient)

//         if (client) {
//             if (client.call) {
//                 socket.emit('userBusy', data)
//                 users = EditData(users, data.sender, null)
//             } else {
//                 users = EditData(users, data.recipient, data.sender)
//                 socket.to(`${client.socketId}`).emit('callUserToClient', data)
//             }
//         }
//     })

//     socket.on('endCall', data => {
//         const client = users.find(user => user.id === data.sender)

//         if (client) {
//             socket.to(`${client.socketId}`).emit('endCallToClient', data)
//             users = EditData(users, client.id, null)

//             if (client.call) {
//                 const clientCall = users.find(user => user.id === client.call)
//                 clientCall && socket.to(`${clientCall.socketId}`).emit('endCallToClient', data)

//                 users = EditData(users, client.call, null)
//             }
//         }
//     })
// }

// module.exports = SocketServer

let users = []

const EditData = (data, id, call) => {
    const newData = data.map(item =>
        item.id === id ? { ...item, call } : item
        // item.id === id ? item : item
    )
    return newData;
}

const SocketServer = (socket) => {
    // Connect - Disconnect
    socket.on('joinUser', user => {
        users.push({ id: user._id, socketId: socket.id, followers: user.followers })
    })

    socket.on('disconnect', () => {
        const data = users.find(user => user.socketId === socket.id)
        if (data) {
            const clients = users.filter(user =>
                data.followers.find(item => item._id === user.id)
            )

            if (clients.length > 0) {
                clients.forEach(client => {
                    socket.to(`${client.socketId}`).emit('CheckUserOffline', data.id)
                })
            }

            if (data.call) {
                const callUser = users.find(user => user.id === data.call)
                if (callUser) {
                    users = EditData(users, callUser.id, null)
                    socket.to(`${callUser.socketId}`).emit('callerDisconnect')
                }
            }
        }

        users = users.filter(user => user.socketId !== socket.id)
    })


    // Likes
    socket.on('likePost', newPost => {
        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('likeToClient', newPost)
            })
        }
    })

    socket.on('unLikePost', newPost => {
        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('unLikeToClient', newPost)
            })
        }
    })


    // Comments
    socket.on('createComment', newPost => {
        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('createCommentToClient', newPost)
            })
        }
    })

    socket.on('deleteComment', newPost => {
        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('deleteCommentToClient', newPost)
            })
        }
    })


    // Follow
    socket.on('follow', newUser => {
        const user = users.find(user => user.id === newUser._id)
        user && socket.to(`${user.socketId}`).emit('followToClient', newUser)
    })

    socket.on('unFollow', newUser => {
        const user = users.find(user => user.id === newUser._id)
        user && socket.to(`${user.socketId}`).emit('unFollowToClient', newUser)
    })


    // Notification
    socket.on('createNotify', msg => {
        const client = users.find(user => msg.recipients.includes(user.id))
        client && socket.to(`${client.socketId}`).emit('createNotifyToClient', msg)
    })

    socket.on('removeNotify', msg => {
        const client = users.find(user => msg.recipients.includes(user.id))
        client && socket.to(`${client.socketId}`).emit('removeNotifyToClient', msg)

    })


    // Message
    socket.on('addMessage', msg => {
        const user = users.find(user => user.id === msg.recipient)
        user && socket.to(`${user.socketId}`).emit('addMessageToClient', msg)
    })


    // Check User Online / Offline
    socket.on('checkUserOnline', data => {
        const following = users.filter(user =>
            data.following.find(item => item._id === user.id)
        )
        socket.emit('checkUserOnlineToMe', following)

        const clients = users.filter(user =>
            data.followers.find(item => item._id === user.id)
        )

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('checkUserOnlineToClient', data._id)
            })
        }

    })

    // const EditData = (data, id, call) => {
    //     const newData = data.map(item =>
    //         item.id === id ? { ...item, call } : item
    //     )
    //     return newData;
    // }
    // Call User
    socket.on('callUser', data => {
        // console.log({ oldUsers: users })
        users = EditData(users, data.sender, data.recipient)

        // console.log({ newUsers: users })

        const client = users.find(user => user.id === data.recipient)
        // console.log({ newUsers: client })
        if (client) {
            if (data.call) {
                socket.emit('userBusy', data)
                users = EditData(users, data.sender, null)
            }
            else {
                users = EditData(users, data.recipient, data.sender)
                socket.to(`${client.socketId}`).emit('callUserToClient', data)
            }
        }
    })

    socket.on('endCall', data => {
        const client = users.find(user => user.id === data.sender)

        if (client) {
            socket.to(`${client.socketId}`).emit('endCallToClient', data)
            users = EditData(users, client.id, null)

            if (client.call) {
                const clientCall = users.find(user => user.id === client.call)
                clientCall && socket.to(`${clientCall.socketId}`).emit('endCallToClient', data)

                users = EditData(users, client.call, null)
            }
        }
    })
}

module.exports = SocketServer