import { upload } from "../middlewares/Uploader.js";
import Project from "../models/project.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllProjects = async (req, res) => {
  try {
    const titleRegExp = new RegExp(req.query.title, "i");
    const categoryRegExp = new RegExp(req.query.category, "i");
    const projects = await Project.find({
      title: titleRegExp,
      category: categoryRegExp,
    }).limit(req.query.pageSize);
    res.status(200).json({ data: projects, total: projects.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOneProject = async (req, res) => {
  try {
    const id = req.params.id;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ error: "Project not found!" });
    res.status(200).json({ data: project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNewProject = async (req, res) => {
  try {
    upload.array("images")(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      const { title, description, category } = req.body;
      if (!title || !description || !category) {
        return res.status(400).json({ message: "All fields are required!" });
      }

      const images = req.files.map(
        (file) =>
          `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
      );

      const newProject = await Project({
        title,
        description,
        category,
        images,
      });
      await newProject.save();
      return res.status(201).json({
        message: "New project has been created successfully!",
        data: newProject,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Error with creating",
      error: error.message,
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const updateProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updateProject) return res.status(404).json({ error: "Не найден!" });

    res.status(200).json({
      message: "New project has been updated successfully!",
      data: updateProject,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Not found!" });
    if (project.images && project.images.length > 0) {
      project.images.forEach((image) => {
        const slicedImage = image.slice(30);
        const filePath = path.join(__dirname, "..", "uploads", slicedImage);
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          } else {
            console.warn(`File not found: ${filePath}`);
          }
        } catch (err) {
          console.error(`Failed to delete image: ${filePath}`, err);
        }
      });
    }
    const deletedProduct = await Project.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ message: "Project deleted!", deletedProduct });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
