import {Categories} from '../model/category'

const getCategories = async() =>{
    const response = await Categories.find();
    return response
}

const createCategory = async (city: string, url: string)=>{
    const category = await Categories.create({city, url});
    return category
}

export default {getCategories, createCategory}