const { query } = require('express');
const Product = require('../models/products');

const getAllProductsStatic = async (req,res) => {
    const products = await Product.find({
    }).select('name price');

    res.status(200).json({
        products, nbHits: products.length
    });
}

const getAllProducts = async (req,res) => {
    const {featured, company, name, sort, fields, numericFilters } = req.query;
    const queryObject = {};

    //mouting the object query
    if(featured) {
        queryObject.featured = featured === 'true' ? true : false
    }
    
    if(company){
        queryObject.company = company;
    }

    if(name){
        queryObject.name = {$regex: name, $options: 'i'}; //match all the products that have something like the name in the search, i = case insensetive
    }


    //little hack to transform "< > in something that mongoose will understand"
    if(numericFilters){
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        };

        const regEx = /\b(<|>|>=|=|<|<=)\b/g

        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);
        const options = ['price','rating'];
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-');
            if(options.includes(field)){
                queryObject[field] = {[operator]:Number(value)}
            }
        })
    }
    //passing the query to result but no executing it
    let result = Product.find(queryObject);

    //mouting the sort that will be chained up in the query
    if(sort){
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else {
        result = result.sort('createdAt')
    }

    //selecting fields
    if(fields){
        const fieldList = fields.split(',').join(' ');
        result = result.select(fieldList);
    } 

    //creating the pagination logic
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page-1) * limit
    result = result.skip(skip).limit(limit);


    const products = await result
    res.status(200).json({products, nbHits: products.length});
}

module.exports = {getAllProducts, getAllProductsStatic};