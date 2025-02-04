import cors from 'cors';

const options = {
    origin: ['http://localhost:3000', 'https://3.39.24.159:3000', 'http://3.39.24.159'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization','Cache-Control'],
    credentials: true,
};

export default cors(options);
