const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.send('Hamsters coming soon!');
});

module.exports = router;