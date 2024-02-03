import Categories from "../../domain/category";
import { CategoryModel } from "../database/categoryModel";
import ICategories from "../../use_case/interface/categoryInterface";


class CategoryRepository implements ICategories {
    async newEntry(data: Categories): Promise<Categories> {
        const newData = new CategoryModel({ category: [data] });
        await newData.save();
        return newData;

    }

    async findCategory() {
        try {
            const newData = await CategoryModel.find({})
            return newData
        } catch (error) {
            console.log(error)
        }
    }

    async updateOne(Data: Categories, id: any) {
        try {
            const result = await CategoryModel.updateOne({ _id: id }, { $addToSet: { category: Data } });
            if (result.modifiedCount > 0) {
                return {
                    success: true,
                    message: 'Category added successfully.',
                    data: result
                };
            } else {
                return {
                    success: false,
                    message: 'No changes made.',
                    data: result
                };
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    async deleteEntry(Data: string, id: string) {
        try {
            const result = await CategoryModel.updateOne({ _id: id }, { $pull: { category: Data } });
            if (result.modifiedCount > 0) {
                return {
                    success: true,
                    message: 'Category removed successfully.',
                    data: result
                };
            } else {
                return {
                    success: false,
                    message: 'No document found or no changes made.',
                    data: result
                };
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

}

export default CategoryRepository;
