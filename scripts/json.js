let getJson = async function(url){ // Get json
	try {
		const response = await fetch(url);
		return await response.json();
	} catch (err) {throw err}
}
module.exports = {getJson}