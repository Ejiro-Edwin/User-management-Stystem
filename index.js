const server = require('./server');
const { port } = require('./config/keys')

server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));