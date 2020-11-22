export function getUrlParams(key) {
	//console.log("my url: ",window.location.hash);
	const urlParams = window.location.hash.split('?')[1];
	const Params = urlParams.split('&');
	let desiredValue;
	for(let i=0;i<Params.length;i++){
		const keyUrl = Params[i].split('=')[0];
		const value = Params[i].split('=')[1];
		if(keyUrl === key){
			desiredValue = value;
		}
	}
	return desiredValue;
}

export function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}
