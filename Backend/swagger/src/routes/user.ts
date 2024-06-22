import { Router } from "express";
import { usersData } from "../constant";

export const userRouter = Router();

/**
 * @swagger
 * /sample:
 *   get:
 *     summary: Returns a sample message
 *     responses:
 *       200:
 *         description: A successful response
 */
userRouter.get('/', (req, res) => {
    return res.json({
        status: true,
        data: usersData
    })
})