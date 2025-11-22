import Service from "../models/service.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteOldImage = (imageUrl) => {
  if (!imageUrl) return;
  try {
    const filename = imageUrl.split("/uploads/").pop();
    const filePath = path.join(__dirname, "..", "uploads", filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error("File cleanup error:", err);
  }
};

export const getAllServices = async (req, res) => {
  try {
    const { pageNum = 1, pageSize = 10, title } = req.query;
    const query = title ? { title: new RegExp(title, "i") } : {};

    const [services, total] = await Promise.all([
      Service.find(query)
        .skip((pageNum - 1) * pageSize)
        .limit(Number(pageSize)),
      Service.countDocuments(query),
    ]);

    res.status(200).json({ services, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOneService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Bunday xizmat topilmadi!" });
    }
    res.status(200).json({ data: service });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNewService = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Barcha maydonlar to'ldirilgan bo'lishi shart!" });
    }

    const image = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;

    const newService = await Service.create({ title, description, image });

    res.status(201).json({
      message: "New service created successfully!",
      data: newService,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating service", error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { title, description } = req.body;
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Bunday xizmat topilmadi!" });
    }

    const updateData = { title, description };

    if (req.file) {
      deleteOldImage(service.image);
      updateData.image = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    if (!updateData.title || !updateData.description) {
      return res
        .status(400)
        .json({ message: "Barcha maydonlar to'ldirilgan bo'lishi shart!" });
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedService);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating service", error: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Bunday xizmat topilmadi!" });
    }

    deleteOldImage(service.image);

    res.status(200).json({ message: "Service has been deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
