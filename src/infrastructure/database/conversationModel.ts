import mongoose, { Document, Schema } from "mongoose";

interface Member {
    userId: string;
    lastSeen: Date;
}

interface Conversation extends Document {
    members: Array<Member>;
}

const ConversationSchema = new Schema<Conversation>({
    members: {
        type: [
            {
                userId: {
                    type: String,
                },
                lastSeen: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        required: true
    }
}, { timestamps: true });

const ConversationModel = mongoose.model<Conversation>("Conversation", ConversationSchema);

export { Conversation, ConversationModel };