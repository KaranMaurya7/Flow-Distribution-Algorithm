const express = require('express');
const app = express();
const Astrologer = require('./models/astrologer.js');
const User = require('./models/user.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// In-memory storage for astrologers and users (could be replaced with a database)
let astrologers = [];
let users = [];

// 1. Create a pool of astrologers
app.post('/astrologer', (req, res) => {

	const { id, name, maxConnections, isTopAstrologer } = req.body;

	if (!id || !name || !maxConnections || !isTopAstrologer) {
		res.status(400).send(`Invalid Details`);
	}

	const newAstrologer = new Astrologer(id, name, maxConnections, isTopAstrologer);

	astrologers.push(newAstrologer);

	res.status(201).send(`Astrologer ${name} added successfully.`);
});

// 2. Create users
app.post('/user', (req, res) => {

	const { id } = req.body;

	if (!id) {
		res.status(400).send(`Invalid Details`);
	}

	const newUser = new User(id);

	users.push(newUser);
	res.status(201).send(`User ${id} created successfully.`);
});

// 3. Get all astrologers
app.get('/astrologers', (req, res) => {
	res.status(200).json(astrologers);
});

// 4. Allocate users to astrologers based on flow algorithm
app.post('/allocate', (req, res) => {
	let index = 0; // To keep track of the current astrologer index.

	// Allocate astrologers in a round-robin manner.
	users.forEach((user) => {

		// Find the next available astrologer 
		while (!astrologers[index].canHandleMoreConnections()) {
			index = (index + 1) % astrologers.length;
		}

		// Allocate the astrologer.
		user.assignAstrologer(astrologers[index].id);
		astrologers[index].addConnection();

		// Move to the next astrologer for the next user.
		index = (index + 1) % astrologers.length;
	});

	res.status(200).send(`Users have been allocated equally to astrologers!`);
});


// 5. Get all users and their assigned astrologers
app.get('/users', (req, res) => {
	res.status(200).json(users);
});


//6. Get details of a specific astrologer
app.get('/astrologer/:id', (req, res) => {
	const { id } = req.params;
	const astrologer = astrologers.find(astro => astro.id == id);

	if (!astrologer) {
		return res.status(404).send("Astrologer not found.");
	}

	res.status(200).json(astrologer);
});

//7. Update settings for a specific astrologer
app.post('/astrologer/:id/update', (req, res) => {
	const { id } = req.params;
	const { maxConnections } = req.body;

	const astrologer = astrologers.find(astro => astro.id == id);

	if (!astrologer || !astrologer.topAstrologer()) {
		return res.status(404).send("Astrologer not found or featue not available.");
	}

	if (maxConnections !== undefined && astrologer.topAstrologer() && maxConnections > 0) astrologer.maxConnections = maxConnections;

	res.status(200).send(`Astrologer ${astrologer.name} has been updated.`);
});


const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;