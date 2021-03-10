const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors())
app.use(express.json());
app.use(routes);

//Cria o servidor HTTP
const server = process.env.NODE_ENV == 'production' ? https.createServer({
	key: fs.readFileSync('/etc/letsencrypt/live/search.vendergas.com.br/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/search.vendergas.com.br/cert.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/search.vendergas.com.br/chain.pem')
}, app) : http.createServer(app);

server.listen(3333, () => {
	console.log('Servidor rodando');
});