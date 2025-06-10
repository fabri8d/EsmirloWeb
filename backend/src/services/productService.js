const cloudinary = require("../cloudinary.js"); // ajusta el path según tu estructura
const fs = require( 'fs/promises');
const Product = require("../models/products/Product.js");
const ProductVariant = require("../models/products/ProductVariant.js");
const Category = require("../models/products/Category.js");

async function createProductService(dataSource, productData) {
  const productRepo = dataSource.getRepository("Product");
  const variantRepo = dataSource.getRepository("ProductVariant");

  const existingProduct = await productRepo.findOne({ where: { name: productData.name } });
  if (existingProduct) {
    throw new Error("Ya existe un producto con ese nombre.");
  }

  let imageUrl;
  if (productData.image && productData.image.path) {
    const result = await cloudinary.uploader.upload(productData.image.path, {
      folder: "productos"
    });
    imageUrl = result.secure_url;

    await fs.unlink(productData.image.path);
  } else {
    throw new Error("No se proporcionó imagen válida.");
  }

  const product = productRepo.create({
    name: productData.name,
    description: productData.description,
    category: productData.category,
    price: productData.price,
    imageUrl: imageUrl,
  });

  await productRepo.save(product);

  for (const variant of productData.variants) {
    const duplicateVariant = await variantRepo.findOne({
      where: {
        product: { id: product.id },
        size: variant.size,
        color: variant.color,
      },
      relations: ["product"],
    });

    if (duplicateVariant) {
      throw new Error(`Ya existe una variante con tamaño "${variant.size}" y color "${variant.color}".`);
    }
  }

  const variants = productData.variants.map(variant =>
    variantRepo.create({
      size: variant.size,
      color: variant.color,
      stock: variant.stock,
      product: product,
    })
  );

  await variantRepo.save(variants);

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    price: product.price,
    image: product.image,
    variants: null,
  };
}


async function purchaseVariantService(dataSource, { productId, variant, quantity }) {
  const productRepo = dataSource.getRepository(Product);
  const variantRepo = dataSource.getRepository(ProductVariant);

  const product = await productRepo.findOne({
    where: { id: productId },
    relations: ["variants"],
  });

  if (!product) throw new Error("Producto no encontrado");

  const selectedVariant = product.variants.find(v =>
    v.size === variant.size && v.color === variant.color
  );

  if (!selectedVariant) throw new Error("Variante no encontrada");

  if (selectedVariant.stock < quantity) throw new Error("Stock insuficiente");

  selectedVariant.stock -= quantity;
  await variantRepo.save(selectedVariant);

  return {
    message: "Compra realizada con éxito",
    product: product.name,
    variant: {
      size: selectedVariant.size,
      color: selectedVariant.color,
      stockRestante: selectedVariant.stock,
    },
  };
}

async function changePriceProductService(dataSource, productId, newPrice) {
  const productRepo = dataSource.getRepository(Product);
  const product = await productRepo.findOne({
    where: { id: parseInt(productId) },
  });
  if (!product) throw new Error("No existe este producto.");

  const parsedPrice = parseFloat(newPrice);
  if (isNaN(parsedPrice)) throw new Error("Precio inválido. Debe ser un número.");

  product.price = parsedPrice;
  await productRepo.save(product);

  return {
    message: "Precio actualizado con éxito",
    product,
  };
}


async function getProductsService(dataSource, page = 1, limit = 10) {
  const productRepo = dataSource.getRepository(Product);

  const [products, total] = await productRepo.findAndCount({
    relations: ["variants"],
    skip: (page - 1) * limit,
    take: limit,
    order: { id: "DESC" },
  });

  return {
    data: products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}


async function getProductByIDService(dataSource, productId) {
  const productRepo = dataSource.getRepository(Product);
  const product = await productRepo.findOne({
    where: { id: parseInt(productId) },
    relations: ["variants", "category"]
  });
  if (!product) throw new Error("No existe este producto.");
  return product;
}


async function getProductsByNameService(dataSource, productName) {
  const productRepo = dataSource.getRepository(Product);
  const products = await productRepo.find({
    where: { name: productName },
  });
  if (!products || products.length === 0)
    throw new Error("No existen productos llamados " + productName);
  return products;
}

async function getProductsByCategoryService(dataSource, categoryName) {
  const productRepo = dataSource.getRepository(Product);
  const categoryRepo = dataSource.getRepository(Category);
  const category = await categoryRepo.findOne({
    where: {
      name: categoryName 
    },
  });
  if (!category) {
    throw new Error("No existe la categoria" + categoryName);
  }
  const products = await productRepo.find({
    where: {
      category: { id: category.id }
    },
  });
  if (!products || products.length === 0) {
    throw new Error("No existen productos en la categoría " + category.name);
  }
  return products;
}


async function getVariantsByProductService(dataSource, productId) {
  const variantRepo = dataSource.getRepository(ProductVariant);
  const variants = await variantRepo.find({
    where: { product: { id: productId } },
  });
  if (!variants) throw new Error("No existen variantes del producto " + productData.name);
  return await variants
}
async function updateVariantStockService(dataSource, variantId ,variantData) {
  const variantRepo = dataSource.getRepository(ProductVariant);
  const variant = await variantRepo.findOne({
    where: { id: variantId },
    relations: ["product"],
  });
  if (!variant) throw new Error("No existe la variante con ID " + variantData.id);

  variant.stock = variantData.stock || variant.stock;

  await variantRepo.save(variant);
  return {
    message: "Variante actualizada con éxito",
    variant,
  };
}
async function deleteVariantService(dataSource, variantId) {
  const variantRepo = dataSource.getRepository(ProductVariant);
  const variant = await variantRepo.findOne({
    where: { id: variantId },
     
  });
  if (!variant) throw new Error("No existe la variante con ID " + variantId);

  await variantRepo.remove(variant);
  return {
    message: "Variante eliminada con éxito",
    variant,
  };
}
async function deleteProductService(dataSource, productId) {
  const productRepo = dataSource.getRepository(Product);
  const product = await productRepo.findOne({
    where: { id: productId },
  });
  if (!product) throw new Error("No existe el producto con ID " + productId);

  await productRepo.remove(product);
  return {
    message: "Producto eliminado con éxito",
    product,
  };
}
async function createVariantService(dataSource, productId, variantData) {
  const productRepo = dataSource.getRepository(Product);
  const variantRepo = dataSource.getRepository(ProductVariant);

  const product = await productRepo.findOne({
    where: { id: productId },
  });
  if (!product) throw new Error("Producto no encontrado");

  const existingVariant = await variantRepo.findOne({
    where: {
      product: { id: product.id },
      size: variantData.size,
      color: variantData.color,
    },
  });
  if (existingVariant) {
    throw new Error(`Ya existe una variante con tamaño "${variantData.size}" y color "${variantData.color}".`);
  }


  const newVariant = variantRepo.create({
    size: variantData.size,
    color: variantData.color,
    stock: variantData.stock,
    product: product,
  });

  await variantRepo.save(newVariant);

  return newVariant;
}
module.exports = {
  createProductService,
  purchaseVariantService,
  changePriceProductService,
  getProductsService,
  getProductByIDService,
  getProductsByNameService,
  getProductsByCategoryService,
  getVariantsByProductService,
  updateVariantStockService,
  deleteVariantService,
  deleteProductService,
  createVariantService
};

