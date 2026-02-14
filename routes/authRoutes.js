import exprcess from "express";
const router = exprcess.Router();

import { register, login, refresh } from "../controllers/authController.js";

router.post("/register", register); //เรียกใช้ฟังก์ชัน register เพื่อสมัครสมาชิก
router.post("/login", login); //เรียกใช้ฟังก์ชัน login เพื่อเข้าสู่ระบบ
router.post("/refresh", refresh); //เรียกใช้ฟังก์ชัน refresh เพื่อรีเฟรช token


export default router;  