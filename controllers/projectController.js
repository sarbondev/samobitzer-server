import Project from "../models/project.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteFile = (imageUrl) => {
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

export const getAllProjects = async (req, res) => {
  try {
    const { pageNum = 1, pageSize = 10, title, category } = req.query;

    const query = {};
    if (title) query.title = new RegExp(title, "i");
    if (category) query.category = new RegExp(category, "i");

    const [projects, total] = await Promise.all([
      Project.find(query)
        .skip((pageNum - 1) * pageSize)
        .limit(Number(pageSize)),
      Project.countDocuments(query),
    ]);

    res.status(200).json({ projects, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOneProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Loyiha topilmadi!" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNewProject = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    if (!title || !description || !category || !location) {
      return res
        .status(400)
        .json({ message: "Barcha maydonlar to'ldirilgan bo'lishi shart!" });
    }

    const images = req.files
      ? req.files.map(
          (file) =>
            `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
        )
      : [];

    const newProject = await Project.create({
      title,
      description,
      category,
      location,
      images,
    });

    res.status(201).json({
      message: "Loyiha muvaffaqiyatli yaratildi.",
      project: newProject,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating project", error: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Loyiha topilmadi!" });
    }

    const updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      if (project.images && project.images.length > 0) {
        project.images.forEach((img) => deleteFile(img));
      }

      updateData.images = req.files.map(
        (file) =>
          `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
      );
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Loyiha muvaffaqiyatli yangilandi.",
      project: updatedProject,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating project", error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Loyiha topilmadi!" });
    }

    if (project.images && project.images.length > 0) {
      project.images.forEach((image) => deleteFile(image));
    }

    res.status(200).json({ message: "Loyiha muvaffaqiyatli olib tashlandi." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
