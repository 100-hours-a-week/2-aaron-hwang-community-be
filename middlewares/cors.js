import cors from 'cors';

const options = {
    origin: ['http://localhost:3000', 'http://43.201.21.191:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization','Cache-Control'],
    credentials: true,
};

export default cors(options);