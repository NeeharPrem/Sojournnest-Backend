import mongoose, { Document, Schema } from "mongoose";

interface ICategories extends Document {
    category: string[];
}

const categoriesSchema: Schema<ICategories> = new mongoose.Schema({
    category: {
        type: [String],
    },
});

const CategoryModel = mongoose.model<ICategories>("Categories", categoriesSchema);

export { ICategories, CategoryModel };