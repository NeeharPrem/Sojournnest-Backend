import mongoose, { Document, Schema, ObjectId } from "mongoose";

interface Wallet extends Document {
    _id: string;
    userId: ObjectId;
    walletAmount: string;
    transactions: [{
        date: string;
        message: string;
        amount: number;
        type: string;
        balance: number;
    }];
}

const walletSchema: Schema<Wallet> = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    walletAmount: {
        type: String,
    },
    transactions: [{
        date: { type: String },
        message: { type: String },
        amount: { type: Number },
        type: { type: String },
        balance: { type: Number }
    }],
});

const WalletModel = mongoose.model<Wallet>("Wallet", walletSchema);

export { Wallet, WalletModel };