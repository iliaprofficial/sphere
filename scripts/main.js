document.addEventListener("DOMContentLoaded", async function() {
	function rotate(){ // Rotate sphere, links and points
		return setInterval(function(){
			sphere.style.transform = "rotateY(" + angleY + "deg)"; // Rotate sphere
			points.forEach(function(item){ // Rotate links and points
				// console.log(window.getComputedStyle(item)["transform"]);
				let transformation = /^([^ ]*)/g.exec(item.style.transform)[0];
				item.style.transform = `${transformation} rotateY(${angleY * -1}deg)`;
			})
			if(angleY == 359) // Update angle
				angleY = 0;
			else
				angleY++;
		}, 40);
	}
	const size = 270; // Size of sphere
	function pointCords(){ // Generate random x, y, z for points and links
		let x = Math.floor(Math.random() * (size + 1)); // (x - 135)^2 + (y - 135)^2 + z^2 = 135^2
		let r = Math.sqrt(size * x - x * x); // r = half of the vertical chord of circle in x
		let y = Math.floor(Math.random() * (1 + 2 * r)) + ((size / 2) - r);
		let z = Math.floor(Math.sqrt((size / 2) * (size / 2) - (x - (size / 2)) * (x - (size / 2)) - (y - (size / 2)) * (y - (size / 2))));
		if(z % 2 == 0) // "Random" hemisphere of the point 
			z *= -1;
		return [x, y, z];
	}
	function addElement(obj, bc){
		let cords = pointCords();
		obj.style.cssText = 
		`margin-left: ${cords[0]}px;
		margin-top: ${cords[1]}px;
		transform: translateZ(${cords[2]}px);
		background-color: ${bc};`;
		sphere.append(obj);
	}
	function linkCreation(text, address){ // Add link to the sphere
		let link = document.createElement('a');
		link.innerHTML = text;
		link.setAttribute("href", address);
		addElement(link, "fff");
	}
	function pointCreation(filled){ // Add point to the sphere
		let point = document.createElement('div');
		point.className = "points";
		let cords = pointCords();
		let bc = "#fff";
		if(filled)
			bc = "#000";
		addElement(point, bc);
	}
	async function getJson(url){ // Get json
		try {
			const response = await fetch(url);
			return await response.json();
		} catch (err) {throw err}
	}
	let sphere = document.getElementById('sphere');
	let json = await getJson('https://next.json-generator.com/api/json/get/VkbVhzKD_');
	for(let i = 0; i < 10; i++){
		let obj = json[i];
		linkCreation(obj.title, obj.link);
	}
	for(let i = 0; i < 50; i++){
		let obj = json[i];
		pointCreation(obj.filled);
	}
	let angleY = 0;
	let points = Array.from(document.getElementsByClassName('points')).concat(Array.from(document.getElementsByTagName('a'))); // Unite points and links to one array
	let rotation = rotate();
	sphere.addEventListener('mouseenter', function () {
		clearInterval(rotation); // Stop rotation
	});
	sphere.addEventListener('mouseleave', function () {
		rotation = rotate(); // Run rotation
	});
	setInterval(function(){ // Update points and links number info
		document.getElementById('pointsText').textContent = document.getElementById('pointsNumber').value + "/100";
		document.getElementById('linksText').textContent = document.getElementById('linksNumber').value + "/100";
	}, 200);
	document.getElementById('update').addEventListener('click', function () { // Create new sphere 
		clearInterval(rotation); // Stop rotation
		angleY = 0; // Update angle
		sphere.innerHTML = ""; // Delete current sphere
		for(let i = 0; i < linksNumber.value; i++){ // Create new links
			let obj = json[i];
			linkCreation(obj.title, obj.link);
		}
		for(let i = 0; i < pointsNumber.value; i++){ // Create new points
			let obj = json[i];
			pointCreation(obj.filled);
		}
		points = Array.from(document.getElementsByClassName('points')).concat(Array.from(document.getElementsByTagName('a'))); // Unite points and links to one array
		rotation = rotate(); // Run rotation
	});
});