// const express = require('express');
import express from 'express'; // ใช้สำหรับสร้างเว็บเซิร์ฟเวอร์

// const cors = require('cors');
import cors from "cors"; // ใช้สำหรับจัดการ CORS

// require('dotenv').config();
import dotenv from 'dotenv'; // ใช้สำหรับโหลด env จากไฟล์ .env
dotenv.config(); // โหลด env

const app = express(); // สร้าง express app
app.use(cors()); //มีไว้เพื่อให้ข้าม cors ได้
app.use(express.json()); //มีไว้เพื่อให้รับ json ได้

const PORT = process.env.PORT || 3000; // กำหนดพอร์ตจาก env หรือใช้ 3000 เป็นค่าเริ่มต้น

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => { 
 console.log(`Server is running on port http://localhost:${PORT}`); 
});