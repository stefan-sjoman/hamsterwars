const url = 'http://localhost:1337/hamsters'

getData(url, showHamsters);

function getData(URL, callback) {
	fetch(URL)
	.then(response => response.json())
	.then(data => { callback(data); })
    .catch(error => console.log(error));
}

function showHamsters(hamsters) {
	const hamsterList = document.getElementById('hamster-list');

	hamsters.forEach(hamster => {
		const liTag = document.createElement('li');
		const h3Tag = document.createElement('h3');
		const imgTag = document.createElement('img');

		h3Tag.innerText = hamster.name;
		imgTag.src = `../img/${hamster.imgName}`;

		hamsterList.appendChild(liTag);
		liTag.appendChild(h3Tag);
		liTag.appendChild(imgTag);
	});
}