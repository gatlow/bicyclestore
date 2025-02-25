const Bicycle = require("../models/Bicycle");

// Получение всех велосипедов
exports.getAllBicycles = async (req, res) => {
  try {
    const bicycles = await Bicycle.find().populate("reviews");
    res.json(bicycles);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Получение одного велосипеда по ID
exports.getBicycleById = async (req, res) => {
  const { id } = req.params;
  try {
    const bicycle = await Bicycle.findById(id).populate("reviews");
    if (!bicycle) {
      return res.status(404).json({ message: "Bicycle not found" });
    }
    res.json(bicycle);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Создание нового велосипеда
exports.createBicycle = async (req, res) => {
  const { name, price, category, stock, description } = req.body;
  try {
    const bicycle = new Bicycle({ name, price, category, stock, description });
    await bicycle.save();
    res.status(201).json(bicycle);
  } catch (error) {
    res.status(400).json({ message: "Invalid data" });
  }
};

// Обновление велосипеда по ID
exports.updateBicycle = async (req, res) => {
  const { id } = req.params;
  const { name, price, category, stock, description } = req.body;

  try {
    const bicycle = await Bicycle.findByIdAndUpdate(id, { name, price, category, stock, description }, { new: true });

    if (!bicycle) {
      return res.status(404).json({ message: "Bicycle not found" });
    }

    res.json(bicycle);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Удаление велосипеда по ID
exports.deleteBicycle = async (req, res) => {
  const { id } = req.params;
  try {
    const bicycle = await Bicycle.findByIdAndDelete(id);

    if (!bicycle) {
      return res.status(404).json({ message: "Bicycle not found" });
    }

    res.json({ message: "Bicycle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
