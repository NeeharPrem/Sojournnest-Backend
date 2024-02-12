import { Request, Response } from "express";
import CategoryUsecase from "../use_case/categoryUsecase";

class CategoryController {
    private CategoryUsecase: CategoryUsecase;

    constructor(CategoryUsecase: CategoryUsecase) {
        this.CategoryUsecase = CategoryUsecase
    }

    async newEntry(req: Request, res: Response) {
        try {
            const category = req.body.category
            const data = category.toLowerCase()
            const outData = await this.CategoryUsecase.newEntry(data)
            if (outData) {
                return res.status(outData.status).json(outData.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async findCategory(req: Request, res: Response) {
        try {
            const Data = await this.CategoryUsecase.findCategory()
            if (Data) {
                return res.status(Data.status).json(Data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async deleteEntry(req: Request, res: Response) {
        try {
            const data = req.body.category
            const id = req.body.id
            const Data = await this.CategoryUsecase.deleteEntry(data, id)
            if (Data) {
                return res.status(Data.status).json(Data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async editEntry(req: Request, res: Response) {
        try {
            const id = req.body.id
            const data = req.body
            const Data = await this.CategoryUsecase.editEntry(data, id)
            if (Data) {
                return res.status(Data.status).json(Data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export default CategoryController;