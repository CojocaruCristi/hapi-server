'use strict';

const Hapi = require('@hapi/hapi');
const Joi = require('joi');

const data = {
    users: [
        {
            id: 1,
            name: 'Alice',
            email: 'alice@example.com',
        },
        {
            id: 2,
            name: 'Mark',
            email: 'Mark@example.com',
        },
        {
            id: 3,
            name: 'Josh',
            email: 'josh@example.com',
        },
        {
            id: 4,
            name: 'Chris',
            email: 'chris@example.com',
        },
        {
            id: 5,
            name: 'Mike',
            email: 'mike@example.com',
        },
        {
            id: 6,
            name: 'Bob',
            email: 'bob@example.com',
        },
    ],

};

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
    })

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'hello world'
        }
    })

    server.route({
        method: 'GET',
        path: '/users',
        handler: (request, h) => {

            return h.response(data.users).code(200);
        }
    })
    server.route({
        method: 'GET',
        path: '/users/{id}',
        handler: (request, h) => {
            const userId = request.params.id;
            const user = data.users.find((user) => user.id === +userId);
            if(!!user) {
                return h.response(user).code(200);
            }
            return h.response().code(404);

        },
        options: {
            validate: {
                params: Joi.object({
                    id: Joi.string().required()
                }),
            }
        }
    })
    server.route({
        method: 'POST',
        path: '/users',
        handler: (request, h) => {
            const payload = request.payload;

                const newUser = {id: data.users.length + 1, ...payload}
                data.users.push(newUser);
                return h.response(newUser).code(201);


        },
        options: {
            validate: {
                payload: Joi.object({
                    name: Joi.string().required(),
                    email: Joi.string().email().required()
                })
            }
        }
    })

    server.route({
        method: 'PUT',
        path: '/users/{id}',
        handler: (request, h) => {
            const id = parseInt(request.params.id);
            const user = data.users.find((u) => u.id === id);
            if (!user) {
                return h.response().code(404);
            }
            const updatedUser = request.payload;
            updatedUser.id = id;
            data.users = data.users.map((u) => u.id === id ? updatedUser : u);
            return updatedUser;
        },
        options: {
            validate: {
                params: Joi.object({
                    id: Joi.string().required()
                }),
                payload: Joi.object({
                    name: Joi.string().required(),
                    email: Joi.string().email().required()
                })
            }
        }
    })



    await server.start();
    console.log('Server starts on', server.info.uri);
}


process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});


init();