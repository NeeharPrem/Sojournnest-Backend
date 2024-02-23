import IConversationRepoInterface from "./interface/conversationInterface";
import IUserRepo from "./interface/userRepo";
import IMessageInterface from "./interface/messageInterface";

class ChatUseCase {
    private IUserRepo: IUserRepo;
    private IConversation: IConversationRepoInterface;
    private IMessage: IMessageInterface;

    constructor(
        IUserRepo: IUserRepo,
        IConversation: IConversationRepoInterface,
        IMessage: IMessageInterface
    ) {
        (this.IUserRepo = IUserRepo),
       ( this.IConversation = IConversation),
        (this.IMessage = IMessage)
    }
    
    async newConversation(members: Array<{ memberId: string }>, senderId:string) {
        const newConversation = await this.IConversation.save(members, senderId)
        if (newConversation) {
            return {
                status: 200,
                data: newConversation
            }
        } else {
            return {
                status: 401,
                data: "something went wrong"
            }
        }
    }

    async checkExisting(members: Array<{ memberId: string }>,senderId:string) {
        const isExisting = await this.IConversation.checkExisting(members,senderId)
        return isExisting
    }

    async getConversations(id: string) {
        const conversations = await this.IConversation.findByUserId(id)
        const message = await this.IMessage.getLastMessages()
        const data = {
            conv: conversations,
            messages: message,
        };
        if (conversations) {
            return {
                status: 200,
                data: data
            }
        } else {
            return {
                status: 400,
                data: "No conversation found"
            }
        }
    }

    async getMessages(Id: string) {
        console.log(Id)
        const messages = await this.IMessage.findById(Id)
        if (messages) {
            return {
                status: 200,
                data: messages
            }
        } else {
            return {
                status: 401,
                data: "No messages"
            }
        }
    }

    async addMessage(data: { conversationId: string, sender: string, text: string}) {
        try {
            const conversation = await this.IConversation.findByUserId(data.sender);
            if (!conversation || conversation.length === 0) {
                throw new Error('Conversation not found.');
            }
            const receiverId = conversation[0].members.find((id: string) => id !== data.sender);
            if (!receiverId) {
                throw new Error('Receiver not found in the conversation.');
            }
            const message = await this.IMessage.save(data);
            if (!message) {
                return { status: 400, data: "Failed to save message" };
            }
            return { status: 200, data: message };
        } catch (error) {
            console.error('Error adding message:', error);
            return { status: 500, data: "An error occurred" };
        }
    }

}

export default ChatUseCase;
