const request = require('supertest');
let app = require('../index.js'); // Correct import

describe('Astrologer Flow Distribution API Tests', () => {

	// Test the /astrologer POST route
	it('should create a new astrologer', async () => {
		const response = await request(app)
			.post('/astrologer')
			.send({ id: 1, name: 'John Doe', maxConnections: 5, isTopAstrologer: true });

		expect(response.statusCode).toBe(201);
		expect(response.text).toBe('Astrologer John Doe added successfully.');
	});

	// Test the /user POST route
	it('should create a new user', async () => {
		const response = await request(app)
			.post('/user')
			.send({ id: '101' });

		expect(response.statusCode).toBe(201);
		expect(response.text).toBe('User 101 created successfully.');
	});


	// Test the /allocate POST route
	it('should allocate users to astrologers equally', async () => {

		await request(app).post('/astrologer').send({ id: 2, name: 'Jane Doe', maxConnections: 5, isTopAstrologer: false });
		await request(app).post('/astrologer').send({ id: 3, name: 'Alex Roe', maxConnections: 5, isTopAstrologer: false });

		await request(app).post('/user').send({ id: '102' });
		await request(app).post('/user').send({ id: '103' });

		const response = await request(app).post('/allocate');

		expect(response.statusCode).toBe(200);
		expect(response.text).toBe('Users have been allocated equally to astrologers!');
	});

	// Test the /astrologers GET route
	it('should return the list of astrologers', async () => {

		const response = await request(app).get('/astrologers');

		expect(response.statusCode).toBe(200);
		expect(Array.isArray(response.body)).toBeTruthy();
		expect(response.body.length).toBeGreaterThan(0);
	});

	// Test the /users GET route
	it('should return the list of users and their assigned astrologers', async () => {
		const response = await request(app).get('/users');

		expect(response.statusCode).toBe(200);
		expect(Array.isArray(response.body)).toBeTruthy();
		expect(response.body.length).toBeGreaterThan(0); // Ensure at least one user is present
	});

	// Test the /astrologer/:id/update POST route
	it('should update the maxConnections for a top astrologer', async () => {

		const response = await request(app)
			.post('/astrologer/1/update')
			.send({ maxConnections: 10 });

		expect(response.statusCode).toBe(200);

		expect(response.text).toBe('Astrologer John Doe has been updated.');
	});

	// Test the /astrologer/:id GET route
	it('should return details of a specific astrologer', async () => {

		const response = await request(app).get('/astrologer/1');

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty('id', 1);
	});
});


describe('API Load Testing', () => {

	// Test for handling 250 astrologers and 1000 users
	it('should handle 250 astrologers and 1000 users with equal distribution', async () => {
		
		//Create 250 astrologers
		const astrologersPromises = [];
		for (let i = 1; i <= 250; i++) {
			astrologersPromises.push(
				request(app)
					.post('/astrologer')
					.send({ id: i, name: `Astrologer ${i}`, maxConnections: 50, isTopAstrologer: i <= 20 }) // First 20 are top astrologers
			);
		}
		await Promise.all(astrologersPromises);

		// Create 1000 users
		const usersPromises = [];
		for (let j = 1; j <= 1000; j++) {
			usersPromises.push(
				request(app)
					.post('/user')
					.send({ id: j })
			);
		}
		await Promise.all(usersPromises);

		// Allocate users to astrologers
		const allocateRes = await request(app).post('/allocate');
		expect(allocateRes.statusCode).toEqual(200);
		expect(allocateRes.text).toBe('Users have been allocated equally to astrologers!');

		//Fetch all astrologers and validate the distribution
		const astrologersRes = await request(app).get('/astrologers');
		expect(astrologersRes.statusCode).toEqual(200);

		//  Since 1000 / 250 = 4 users each,Maximum should not exceed 5
		const minConnections = 3; 
		const maxConnections = 5; 

		astrologersRes.body.forEach((astrologer) => {
			expect(astrologer.currentConnections).toBeGreaterThanOrEqual(minConnections);
			expect(astrologer.currentConnections).toBeLessThanOrEqual(maxConnections);
		});
	});
});