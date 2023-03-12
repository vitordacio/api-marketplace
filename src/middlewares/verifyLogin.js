const jwt = require('jsonwebtoken')
const knex = require('../connection')
const jwtPassword = require('../jwtPassword')


const verifyLogin = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json('Not allowed')
    }

    const token = authorization.split(' ')[1]

    try {
        const { id } = jwt.verify(token, jwtPassword)
        const userFound = await knex('users').where({ id }).first()

        if (!userFound) {
            return res.status(404).json('User not found');
        }

        const { password, ...user } = userFound

        req.user = user

        next()
    } catch (error) {
        return res.status(400).json(error.message);
    }

}

module.exports = verifyLogin