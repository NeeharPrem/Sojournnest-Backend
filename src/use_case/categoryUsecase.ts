import Categories from "../domain/category";
import ICategories from "./interface/categoryInterface";

class CategoryUsecase {
    private ICategories: ICategories

    constructor(
        ICategories: ICategories
    ) {
        this.ICategories = ICategories
    }

    async newEntry(Data: Categories) {
        try {
            const outData = await this.ICategories.findCategory()
            if (outData.length > 0) {
                const id = outData[0]._id
                const result = await this.ICategories.updateOne(Data, id);
                if (result.success==true) {
                    return {
                        status: 200,
                        data: {
                            message: "Category added"
                        }
                    }
                } else {
                    return {
                        status: 409,
                        data: {
                            message: "Category already exisist"
                        }
                    }
                }
            } else {
                const amenity = await this.ICategories.newEntry(Data)
                if (amenity) {
                    return {
                        status: 200,
                        data: {
                            message: "Category added"
                        }
                    }
                }
            }
        } catch (error) {
            return {
                status: 400,
                data: {
                    message: "Failed to add"
                }
            }
        }
    }

    async findCategory() {
        try {
            const Data = await this.ICategories.findCategory()
            if (Data.length > 0) {
                return {
                    status: 200,
                    data: {
                        data: Data,
                        message: 'Category'
                    },
                }
            } else {
                return {
                    status: 400,
                    data: {
                        message: "No categories"
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async deleteEntry(data: string, id: string) {
        try {
            const Data = await this.ICategories.deleteEntry(data, id)
            if (Data.success==true) {
                return {
                    status: 200,
                    data: {
                        message: 'Category Deleted'
                    }
                }
            } else {
                return {
                    status: 400,
                    data: {
                        message: "Failed to delete"
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export default CategoryUsecase