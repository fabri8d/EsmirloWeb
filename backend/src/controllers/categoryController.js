const { createCategoryService, getCategoryService, getCategoriesService } = require("../services/categoryService.js");
async function createCategory(req,res) {
  try {
    const dataSource = req.app.get("dataSource");
    console.log("Cuerpo recibido:", req.body); 
    const result = await createCategoryService(dataSource,req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getCategories(req,res){
    try {
        const dataSource = req.app.get("dataSource");
        const categories = await getCategoriesService(dataSource);
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getCategory(req,res){
    try {
        const dataSource = req.app.get("dataSource");
        const category = await getCategoryService(dataSource, req.body);
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


module.exports = {
  createCategory,
  getCategory, 
  getCategories 
};
