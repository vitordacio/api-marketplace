
const welcome = (req, res) => {
    const welcome = {
        'signUp': {
            'path': '/users',
            'method': 'POST'
        },
        'login': {
            'path': '/login',
            'method': 'POST'
        },
        'getUser': {
            'path': '/users',
            'method': 'GET'
        },
        'updateUser': {
            'path': '/users',
            'method': 'PUT'
        },
        'postProduct': {
            'path': '/products',
            'method': 'POST'
        },
        'getProducts': {
            'path': '/products',
            'method': 'GET'
        },
        'getProduct': {
            'path': '/products/:id',
            'method': 'GET'
        },
        'updateProduct': {
            'path': '/products/:id',
            'method': 'PUT'
        },
        'deleteProduct': {
            'path': '/products/:id',
            'method': 'DELETE'
        },

    }

    return res.json(welcome)
}

module.exports = { welcome }