// A server to serve the app

const express = require('express');
const path = require('path');
const App = express();
App.use(express.static(__dirname));

App.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../index.html'));
});

App.listen(3000, () => {
	console.log('listening on port 3000');
});
