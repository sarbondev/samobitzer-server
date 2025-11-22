import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";

export default async function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Ro'yxatdan o'tilmagan: Token mavjud emas!" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWTSECRETKEY);

    const admin = await Admin.findById(decoded.userId).select("-password");
    if (!admin) {
      return res
        .status(401)
        .json({ message: "Ro'yxatdan o'tilmagan: Administrator topilmadi!" });
    }

    req.user = admin;
    req.userId = admin._id;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Ro'yxatdan o'tilmagan: Token yaroqsiz!" });
    }
    return res
      .status(401)
      .json({ message: "Ro'yxatdan o'tilmagan: Token yaroqsiz" });
  }
}
