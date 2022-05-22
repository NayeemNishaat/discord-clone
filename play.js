// const repl = require("repl");

// const input = repl.start();

// input.on("exit", () => {
// 	console.log("Exit");
// });

// const readline = require("readline").createInterface({
// 	input: process.stdin,
// 	output: process.stdout
// });

// readline.question(`What's your name?`, (name) => {
// 	console.log(`Hi ${name}!`);
// 	readline.close();
// });

// setImmediate(() => console.log(9999));
// console.log(12);
// console.log(13);
// function av() {
// 	console.log(55);
// }
// setTimeout(() => {
// 	console.log(3);
// }, 0);
// console.log(16);
// process.nextTick(() => console.log(100));
// av();

// const baz = () => console.log("baz");
// const foo = () => console.log("foo");
// const zoo = () => console.log("zoo");
// const start = () => {
// 	console.log("start");
// 	setImmediate(baz);
// 	new Promise((resolve, reject) => {
// 		resolve("bar");
// 	}).then((resolve) => {
// 		console.log(resolve);
// 		process.nextTick(zoo);
// 	});
// 	process.nextTick(foo);
// };
// start();
// setTimeout(() => {
// 	console.log(3);
// }, 0);

/* const https = require("https");

const options = {
	host: "jsonplaceholder.typicode.com", // Important: Don't spacify the protocol!
	port: 443,
	path: "/todos/1",
	method: "GET"
};

const req = https.request(options, (res) => {
	console.log(`statusCode: ${res.statusCode}`);

	res.on("data", (d) => {
		process.stdout.write(d);
	});
});

req.on("error", (error) => {
	console.error(error);
});

req.end(); */

/* const https = require("https");

const port = process.env.PORT || 3000;

const server = https.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader("Content-Type", "text/html");
	res.end("<h1>Hello, World!</h1>");
});

server.listen(port, () => {
	console.log(`Server running at port ${port}`);
}); */
