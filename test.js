// function replaceThirdChar(str, char) {
// 	const arr = [];
// 	str.slice(3);

// 	for (let i = 0; i <= str.length; i += 3) {
// 		let subStr = str.slice(i, i + 3);

// 		if (str.slice(i, i + 3).length === 3) {
// 			subStr = subStr.slice(0, 2) + char;
// 			arr.push(subStr);
// 			continue;
// 		}
// 		arr.push(subStr);
// 	}
// 	return arr.join("");
// }

// function StringChallenge(num) {
// 	return `${Math.trunc(num / 60)}:${num % 60}`;
// }

// function concat(timeStr, token) {
// 	const concatedString = timeStr + token;
// 	return replaceThirdChar(concatedString, "X");
// }

// console.log(StringChallenge(45));
// console.log(concat(StringChallenge(45), "f5sc7akq10"));

function replaceThirdChar(str, char) {
	const arr = [];
	str.slice(3);

	for (let i = 0; i <= str.length; i += 3) {
		let subStr = str.slice(i, i + 3);

		if (str.slice(i, i + 3).length === 3) {
			subStr = subStr.slice(0, 2) + char;
			arr.push(subStr);
			continue;
		}
		arr.push(subStr);
	}

	return arr.join("");
}

function StringChallenge(num) {
	return `${Math.trunc(num / 60)}:${num % 60}`;
}

function concat(timeStr, token) {
	const concatedString = timeStr + token;
	return replaceThirdChar(concatedString, "X");
}

console.log(StringChallenge(45));
console.log(concat(StringChallenge(45), "f5sc7akq10"));
