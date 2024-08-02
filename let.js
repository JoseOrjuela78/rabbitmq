const axios = require('axios');

oper = {};

oper.fetchData = async(id) => {
    try {

        const response = await axios.get(`http://jsonplaceholder.typicode.com/todos/${id}`);
        return response.data

    } catch (error) {
        console.error('Error al hacer la solicitud GET:', error);
    }
};

oper.reintentos = [];

module.exports = oper;