const Category = require("../models/products/Category.js");

async function createCategoryService(dataSource, { name}) {
  const categoryRepo = dataSource.getRepository(Category);
  const categoryExist = await categoryRepo.findOne({
    where: { name: name },
  });

  if (categoryExist) throw new Error("Ya existe la categoria "+ categoryName);

  category = categoryRepo.create({
    name: name,
  });

  await categoryRepo.save(category);
  return {
    id: category.id,
    name: category.name
  }
}

async function getCategoriesService(dataSource){
    const categoryRepo = dataSource.getRepository(Category);
    return await categoryRepo.find()
}

async function getCategoryService(dataSource, {categoryName}){
    const categoryRepo = dataSource.getRepository(Category);
    const category = await categoryRepo.findOne({
    where: { name: categoryName },
    });
    if(!category)throw new Error("No existe la categoria "+ categoryName);
    return await category
}

module.exports = {
  createCategoryService,
  getCategoriesService,
  getCategoryService
};
