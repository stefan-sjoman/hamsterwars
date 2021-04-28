function checkNewObject(object, defaultKeys) {
	const keys = Object.keys(object);
	if (keys.length === 0) {
		return false;
	}

	let controlledKeys = [];

	defaultKeys.forEach(defaultKey => {
		keys.forEach(key => {
			if (key === defaultKey) {
				controlledKeys.push(key);
			}
		})
	});
	if (controlledKeys.length === keys.length && 
		defaultKeys.length === keys.length) {
		return true;
	}
	return false;
}

function checkChange(object, defaultKeys) {
	const keys = Object.keys(object);
	if (keys.length === 0) {
		return false;
	}

	let controlledKeys = [];

	defaultKeys.forEach(defaultKey => {
		keys.forEach(key => {
			if (key === defaultKey) {
				controlledKeys.push(key);
			}
		})
	});
	if (controlledKeys.length === keys.length) {
		return true;
	}
	return false;
}

module.exports.checkInputs = { checkNewObject, checkChange }; 