import db from '../db/index.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
    try { 
        const { username, password, name, tel} = req.body;

    if (!username || !password || !name || !tel) {
        return res.status(400).json({ message: "NO User Data" });
    }
    //
    const checkUserSql = 'SELECT * FROM users WHERE username = $1';
    const checkUser = await db.query(checkUserSql, [username]);
    // return res.json(checkUser);  

    //
    if (checkUser.rowCount > 0) { 
        return res.status(400).json({ message: "Username already exists."});
    }

    //
    const insertSql = 
        "INSERT INTO users(username, password, name, tel) VALUES ($1, $2, $3, $4)";

    const hash_password = await bcrypt.hash(password, 10);

    const newUser = await db.query(insertSql, [
        username, 
        hash_password, 
        name, 
        tel
    ]);

    const user = newUser.rows[0];
    return res.status(201).json({ message: "User registered.", user });  
    } catch (error) { 
        return res.status(500).json({ message: "error: " + error });
    }

    
};
export const login = async (req, res) => {
    const { username, password } = req.body ??{};
    //ตรวจสอบการรับค่า username และ password ว
    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "Username and password are required" });
    }
    try {
        //ตรวจสอบ user วาสมีอยู่ไหม
        const userSql = "SELECT * FROM users WHERE username = $1 LIMIT 1";
        const { rows } = await db.query(userSql, [username]);
        const user = rows[0];

        // return res.json({user}) //debug ทดสอบ login 
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        //ตรวจสอบ password ว่าถูกต้องไหม
        const checkPass = await bcrypt.compare(password, user.password);
        if (!checkPass) {
            return res.status(400).json({ message: "Wrong password" });
        }
        
        //username และ password ถูกต้องแล้ว สร้าง token
        //สร้าง access token และ refresh token
        const payload = {
            userid: user.id,
            username: user.username,
            tel: user.tel
        };
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: "15m"
        });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: "7d"
        }); 


        //return playload และ token
        return res.status(200).json({payload, accessToken, refreshToken});
         
    } catch (error) {
        return res.status(500).json({ message: "error: " + error });
    }
};
export const refresh = async (req, res) => {
    const { token } = req.body;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); //ถ้้ามี error คือ token หมดอายุแล้ว  //ถ้ามาหน้า 403 กลับไปหน้า login เพื่อ login ใหม่

    const accessToken = jwt.sign(
      { userId: user.userId, username: user.username }, 
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken });
  });
};

