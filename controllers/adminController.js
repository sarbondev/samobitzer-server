import Admin from "../models/admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const GetAllAccounts = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const CreateAccount = async (req, res) => {
  try {
    const { phoneNumber, password, name } = req.body;

    if (!phoneNumber || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingAdmin = await Admin.findOne({ phoneNumber });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this phone number already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      name,
      phoneNumber,
      password: hashedPassword,
    });

    newAdmin.password = undefined;

    res.status(201).json({
      message: "Created successfully!",
      data: newAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const LoginToAccount = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    const admin = await Admin.findOne({ phoneNumber });
    if (!admin) {
      return res
        .status(401)
        .json({ message: "Incorrect phone number or password!" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Incorrect phone number or password!" });
    }

    const token = jwt.sign({ userId: admin._id }, process.env.JWTSECRETKEY, {
      expiresIn: "30d",
    });

    res.status(200).json({ message: "Success!", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const UpdateAccount = async (req, res) => {
  try {
    const { phoneNumber, name, password } = req.body;
    const { id } = req.params;

    const updateData = { name, phoneNumber };

    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found!" });
    }

    res.status(200).json({
      message: "Admin updated successfully!",
      data: updatedAdmin,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Phone number already in use by another admin." });
    }
    res.status(500).json({ message: err.message });
  }
};

export const DeleteAccount = async (req, res) => {
  try {
    const removedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!removedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin has been deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
