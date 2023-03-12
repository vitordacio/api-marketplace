const express = require('express')
const { postProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('./controllers/products')
const { signUp, login, getUser, updateUser } = require('./controllers/users')
const { welcome } = require('./controllers/welcome')
const verifyLogin = require('./middlewares/verifyLogin')

const routes = express()

routes.get('/', welcome)
routes.post('/users', signUp)
routes.post('/login', login)

routes.use(verifyLogin)

routes.get('/users', getUser)
routes.put('/users', updateUser)
routes.post('/products', postProduct)
routes.get('/products', getProducts)
routes.get('/products/:id', getProduct)
routes.put('/products/:id', updateProduct)
routes.delete('/products/:id', deleteProduct)

module.exports = routes