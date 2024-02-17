import { Server, Socket } from 'socket.io';
import ConversationRepository from '../repository/conversationRepository';

interface User {
    userId: string;
    socketId: string;
    lastSeen?: Date;
    online?: boolean;
}

// Assuming conversationRepository is a class, you instantiate it here
const conversationRepository = new ConversationRepository();

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

    const removeUser = async (socketId: string) => { // Mark function as async
        const user = users.find(user => user.socketId === socketId);
        if (user) {
            user.lastSeen = new Date();
            user.online = false;
            try {
                await conversationRepository.updateUserLastSeen(user.userId, user.lastSeen);
                io.emit("userStatusChanged", { userId: user.userId, lastSeen: user.lastSeen, online: false });
            } catch (error) {
                console.error("Failed to update user last seen:", error);
            }
        }
        io.emit("usersOnline", users.filter(user => user.online));
    };

    const getUser = (userId: string) => users.find(user => user.userId === userId);

    io.on("connection", (socket: Socket) => {
        socket.on("addUser", (userId) => {
            addUser(userId, socket.id);
            io.emit("getUsers", users);
        });

        socket.on("sendMessage", ({ senderId, receiverId, text ,timestamp}) => {
            const user = getUser(receiverId);
            if (user) {
                io.to(user.socketId).emit("getMessage", { senderId, text,timestamp});
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected");
            removeUser(socket.id).catch(err => console.error("Error during user removal:", err));
            io.emit("usersOnline", users.filter(user => user.online));
        });
    });
}

export default initializeSocket;