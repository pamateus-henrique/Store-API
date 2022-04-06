require('dotenv').config();

const connectDB = require('./db/connect');
const productSchema = require('./models/products');

const jsonProducts = require('./products.json');


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        await productSchema.deleteMany({});
        await productSchema.create(jsonProducts);
        process.exit(0)
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

start()