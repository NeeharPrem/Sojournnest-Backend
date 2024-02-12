import { ConversationModel } from "../database/conversationModel";
import IConversationRepoInterface from "../../use_case/interface/conversationInterface";

class conversationRepository implements IConversationRepoInterface{

    async save(membersArray: Array<string>): Promise<any> {
        try {
            const newconversation = new ConversationModel({ members: membersArray });
            const save = await newconversation.save();
            if (save) {
                return save;
            } else {
                return null;
            }
        } catch (error) {
            console.log(error);
        }
    }
    async findByUserId(id: string): Promise<any> {

        const conversations = await ConversationModel.find({ members: { $in: [id] } })
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