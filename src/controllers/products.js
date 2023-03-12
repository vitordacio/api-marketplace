const knex = require("../connection");

const postProduct = async (req, res) => {
    const { name, stock, price } = req.body
    const { id } = req.user

    if (!name) {
        return res.status(404).json("Name is required");
    }

    if (!stock) {
        return res.status(404).json("Stock is required");
    }

    if (!price) {
        return res.status(404).json("Price is required");
    }

    try {
        const foundProduct = await knex('products').whereILike('name', `%${name}%`)

        if (foundProduct.length) {
            return res.status(400).json("Product already registered");
        }

        const product = await knex('products').insert({ user_id: id, name, stock, price }).returning('*')

        if (product.length === 0) {
            return res.status(400).json("Product couldn't be registered")
        }

        return res.json(product)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const getProducts = async (req, res) => {
    const { id } = req.user

    try {
        const products = await knex('products').where({ user_id: id })

        return res.json(products)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const getProduct = async (req, res) => {
    const { id } = req.params
    const { id: user_id } = req.user

    if (!Number(id)) {
        return res.status(404).json("Invalid input syntax for type integer")
    }

    try {
        const product = await knex('products').where({ id, user_id }).first()

        if (!product) {
            return res.status(404).json('Product not found')
        }

        return res.json(product)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const updateProduct = async (req, res) => {
    const { name, stock, price } = req.body
    const { id } = req.params
    const { id: user_id } = req.user

    if (!Number(id)) {
        return res.status(404).json("Invalid input syntax for type integer")
    }

    if (!name && !stock && !price) {
        return res.status(404).json("Fill name, stock or price field")
    }

    try {
        const product = await knex('products').where({ id, user_id }).first()

        if (!product) {
            return res.status(400).json('Product not found')
        }

        const updatedProduct = await knex('products').update({ name, stock, price }).where({ id, user_id }).returning('*')

        if (updatedProduct.length === 0) {
            return res.status(400).json("Product couldn't be updated")
        }

        return res.json(updatedProduct[0])

    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const deleteProduct = async (req, res) => {
    const { id } = req.params
    const { id: user_id } = req.user

    if (!Number(id)) {
        return res.status(404).json("Invalid input syntax for type integer")
    }

    try {
        const product = await knex('products').where({ id, user_id }).first()

        if (!product) {
            return res.status(400).json('Product not found')
        }

        const deletedProduct = await knex('products').del().where({ id, user_id }).returning('*')

        if (deletedProduct.length === 0) {
            return res.status(400).json("Product couldn't be deleted")
        }

        return res.json('Product deleted')
    } catch (error) {
        return res.status(500).json(error.message)
    }
}


module.exports = {
    postProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
}