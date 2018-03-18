const ghpages = require('gh-pages');

const options = {
	push: true,
	message: 'update gh-pages'
}

ghpages.publish('gh-pages', options, (err) => {
	if (err) {
		console.log(err.message);
	} else {
		console.log('Published.');
	}
});
