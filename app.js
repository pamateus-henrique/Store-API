require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const productsRouter = require('./routes/products');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//middleware
app.use(express.json());

//routes
app.get('/', (req,res) =>{
    res.status(200).send('<h1>Store API</h1><a href="/api/v1/products">products route</a>');
})

// products route
app.use('/api/v1/products', productsRouter);

//more middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


//port for the server
const port = process.env.PORT || 8081


//start the server function
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`Server is listening on ${port}...`));
    } catch (error) {
        console.log(error);
    }
}

start();