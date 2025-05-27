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

  // 📤 Subir imagen a Cloudinary
  let imageUrl;
  if (productData.image && productData.image.path) {
    const result = await cloudinary.uploader.upload(productData.image.path, {
      folder: "productos"
    });
    console.log(result.secure_url)
    imageUrl = result.secure_url;

    // Elimina el archivo temporal del servidor si estás usando multer
    await fs.unlink(productData.image.path);
  } else {
    throw new Error("No se proporcionó imagen válida.");
  }
  console.log(imageUrl)
  // 🛠 Crear el producto
  const product = productRepo.create({
    name: productData.name,
    description: productData.description,
    category: productData.category,
    price: productData.price,
    imageUrl: imageUrl,
  });

  await productRepo.save(product);

  // ✅ Verificar duplicados de variantes
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

  // 🛠 Crear variantes
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

/**
 * Realizar compra de una variante (actualiza stock)
 */
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

async function changePriceProductService(dataSource, { productData, newPrice }) {
  const productRepo = dataSource.getRepository(Product);

  const product = await productRepo.findOne({
    where: { id: productData.id },
  });

  if (!product) throw new Error("Producto no encontrado");
  if (typeof newPrice !== "number" || newPrice <= 0) {
    throw new Error("El nuevo precio debe ser un número mayor que cero.");
  }

  product.price = newPrice;
  await productRepo.save(product);

  return {
    message: "Cambio de precio realizado con exito",
    product: { name: product.name, price: product.price }
  };
}

async function getProductsService(dataSource) {
  const productRepo = dataSource.getRepository(Product);
  return await productRepo.find({
    relations: ["variants"]
  });
}

async function getProductByIDService(dataSource, productId) {
  const productRepo = dataSource.getRepository(Product);
  const product = await productRepo.findOne({
    where: { id: parseInt(productId) },
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

module.exports = {
  createProductService,
  purchaseVariantService,
  changePriceProductService,
  getProductsService,
  getProductByIDService,
  getProductsByNameService,
  getProductsByCategoryService,
  getVariantsByProductService
};
