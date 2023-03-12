const knex = require('../connection')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtPassword = require('../jwtPassword')

const signUp = async (req, res) => {
    const { name, email, password } = req.body

    if (!name) {
        return res.status(404).json("Name is required");
    }

    if (!email) {
        return res.status(404).json("Email is required");
    }

    if (!password) {
        return res.status(404).json("Password is required");
    }

    try {
        const user = await knex('users').where({ email })

        if (user.length) {
            return res.status(400).json("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const signedUp = await knex('users').insert({ name, email, password: hashedPassword }).returning('*')

        if (signedUp.length === 0) {
            return res.status(400).json("User couldn't be signed up");
        }

        return res.json(signedUp[0])
    } catch (error) {
        return res.status(400).json(error.message)
    }
}


const login = async (req, res) => {
    const { email, password } = req.body

    if (!email) {
        return res.status(404).json("Email is required");
    }

    if (!password) {
        return res.status(404).json("Password is required");
    }

    try {
        const user = await knex('users').where({ email })

        if (user.length === 0) {
            return res.status(400).json("Email or password does not match");
        }

        const verifyPassword = await bcrypt.compare(password, user[0].password)

        if (!verifyPassword) {
            return res.status(400).json("Email or password does not match");
        }

        const token = await jwt.sign({ id: user[0].id }, jwtPassword, { expiresIn: '24h' })

        const { password: _, ...userData } = user[0]

        return res.json({ user: userData, token })


    } catch (error) {
        return res.status(400).json(error.message)
    }
}

const getUser = async (req, res) => {
    const user = req.user

    if (!user) {
        return res.status(400).json('User not found')
    }

    return res.json(user)
}

const updateUser = async (req, res) => {
    const { name, email, password } = req.body
    const { id } = req.user

    if (!name && !email && !password) {
        return res.status(404).json("Fill name, email or password field")
    }

    try {

        if (password) {
            const updatedPassword = await bcrypt.hash(password, 10)
            const updatedUser = await knex('users').update({ name, email, password: updatedPassword }).where({ id }).returning('*')

            if (updatedUser.length === 0) {
                return res.status(400).json("User couldn't be updated");
            }

            return res.json('User updated')
        }

        const updatedUser = await knex('users').update({ name, email }).where({ id }).returning('*')

        if (updatedUser.length === 0) {
            return res.status(400).json("User couldn't be updated");
        }

        return res.json('User updated')
    } catch (error) {
        return res.status(400).json(error.message)
    }
}



module.exports = {
    signUp,
    login,
    getUser,
    updateUser
}