import express from 'express'
import cors from 'cors'

import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { userRouter } from './routes/user'

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Employee API',
            description: 'Employee API Information',
            version: "1.0.0",
            contact: {
                name: 'Sagi Weizmann'
            },
        },
        servers: [
            {
                url: "http://localhost:8080"
            }
        ],
    },
    apis: [
        `${__dirname}/routes/user.ts`,
    ],
}
const swaggerDocs = swaggerJsdoc(swaggerOptions)

const app = express();
app.use(cors());


app.get('/', (req, res) => {
    res.send({
        status: true,
        message: 'Welcome to my server!'
    })
})

app.use('/users', userRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.listen(8000, () => {
    console.log('Server has started on Port', 8000);
})