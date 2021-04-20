const express = require('express');
const app = express();
const PORT = 1337;

const cors = require('cors');
const path = require('path');

const hamsters = require('./routes/hamsters.js');

app.use('/hamsters', hamsters);

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
