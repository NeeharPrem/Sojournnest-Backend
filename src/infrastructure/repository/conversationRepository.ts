import { ConversationModel } from "../database/conversationModel";
import IConversationRepoInterface from "../../use_case/interface/conversationInterface";

interface Member {
    userId: string;
    lastSeen: Date;
}

class conversationRepository implements IConversationRepoInterface{

    async save(userIds: Array<string>): Promise<any> {
        try {
            const membersArray: Member[] = userIds.map(userId => ({
                userId,
                lastSeen: new Date(),
            }));

            const newConversation = new ConversationModel({ members: membersArray });
            return await newConversation.save();
        } catch (error) {
            console.error(error);
            throw new Error('Failed to save the conversation.');
        }
    }


    async updateUserLastSeen(userId:string,data:Date){
        try {
            console.log(userId,data,"dd")
            const updateResult = await ConversationModel.updateMany(
                { "members.userId": userId },
                { $set: { "members.$.lastSeen": data } },
                { multi: true }
            );
            if (updateResult.matchedCount === 0) {
                return {
                    status: 404,
                    data: "User not found in any conversation."
                };
            }

            return {
                status: 200,
                data: "User's lastSeen updated successfully."
            };
        } catch (error) {
            console.log(error)
            return {
                status: 500,
                data: "Failed to update user's lastSeen."
            };
        }
    }

    async findByUserId(id: string): Promise<any> {
        console.log(id)
        const conversations = await ConversationModel.find({ "members.userId": id })
        console.log(conversations)
        if (conversations) {
            return conversations
        } else {
            return null
        }
    }

    async checkExisting(members: Array<string>) {

        const conversations = await ConversationModel.find({ members: { $all: [members[0], members[1]] } })

        if (conversations) {
            return conversations
        } else {
            return null
        }
    }
}

export default conversationRepository