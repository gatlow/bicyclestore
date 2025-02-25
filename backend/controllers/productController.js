const Product = require("../models/Product");
const speakeasy = require("speakeasy");

// Получение всех продуктов
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Поиск продуктов с фильтрами
exports.searchProducts = async (req, res) => {
  const { name, category, minPrice, maxPrice, minStock } = req.query;

  try {
    let query = {};

    // Фильтр по названию (частичное совпадение)
    if (name) {
      query.name = { $regex: name, $options: "i" }; // Поиск по частичному совпадению, без учета регистра
    }

    // Фильтр по категории (точное совпадение)
    if (category) {
      query.category = category;
    }

    // Фильтр по цене (диапазон)
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice); // Цена больше или равна minPrice
      if (maxPrice) query.price.$lte = parseFloat(maxPrice); // Цена меньше или равна maxPrice
    }

    // Фильтр по наличию на складе
    if (minStock) {
      query.stock = { $gte: parseInt(minStock) }; // Количество товара на складе больше или равно minStock
    }

    // Поиск продуктов с учетом фильтров
    const products = await Product.find(query);

    res.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Error searching products", error });
  }
};

// Получение одного продукта по ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).populate("reviews");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Создание нового продукта
exports.createProduct = async (req, res) => {
  const { name, price, category, stock, description, image } = req.body;
  try {
    const product = new Product({ name, price, category, stock, description, image });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error });
  }
};

// Обновление продукта по ID
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, category, stock, description, image } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { name, price, category, stock, description, image },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Удаление продукта по ID
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};