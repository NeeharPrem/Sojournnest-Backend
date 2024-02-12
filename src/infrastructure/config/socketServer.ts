import { Server, Socket } from 'socket.io';

interface User {
    userId: string;
    socketId: string;
    lastSeen?: Date;
    online?:boolean
}

function initializeSocket(server: any) {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5000",
            methods: ["GET", "POST"],
        },
    });

    let users: User[] = [];

    const addUser = (userId: string, socketId: string) => {
        const existingUser = users.find(user => user.userId === userId);
        if (existingUser) {
            existingUser.socketId = socketId;
            existingUser.online = true;
        } else {
            users.push({ userId, socketId, online: true });
        }
        io.emit("usersOnline", users.filter(user => user.online));
    };

    const removeUser = (socketId: string) => {
        const user = users.find(user => user.socketId === socketId);
        if (user) {
            console.log(user)
            user.lastSeen = new Date();
            user.online = false;
            io.emit("userStatusChanged", { userId: user.userId, lastSeen: user.lastSeen, online: false });
            
        }
        io.emit("usersOnline", users.filter(user => user.online)); // If you want to emit the online status immediately
    };

    const getUser = (userId: string) => {
        return users.find((user) => user.userId === userId);
    };

    io.on("connection", (socket: Socket) => {
        socket.on("addUser", (userId) => {
            addUser(userId, socket.id);
            io.emit("getUsers", users); // Consider emitting only necessary data
        });

        socket.on("sendMessage", ({ senderId, receiverId, text }) => {
            const user = getUser(receiverId);
            if (user) {
                io.to(user.socketId).emit("getMessage", {
                    senderId,
                    text,
                });
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected");
            removeUser(socket.id);
            io.emit("usersOnline", users.filter(user => user.online));
        });
    });
}

export default initializeSocket;