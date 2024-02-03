import Categories from "../../domain/category";

interface ICategories {
    newEntry(categories: Categories): Promise<Categories>;
    findCategory(): Promise<any>;
    updateOne(amenity: Categories, id: string): Promise<any>
    deleteEntry(Data: string, id: string): Promise<any>
}
export default ICategories