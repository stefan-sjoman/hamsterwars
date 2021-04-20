const express = require('express');
const app = express();
const PORT = 1337;

app.get('/', (req, res) => {
	res.send('Hamsters coming soon!')
});

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
