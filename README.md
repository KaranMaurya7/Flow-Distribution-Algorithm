# Flow Distribution API for Astrologers

## Overview
This API connects users with astrologers by implementing a flow distribution algorithm that ensures a fair allocation of users to astrologers. It also provides a mechanism to adjust flow for top astrologers.

## API Endpoints

### 1. Create an Astrologer
- **POST** `/astrologer`
- **Body**: `{ "id": 1, "name": "Astro One", "maxConnections": 10, "isTopAstrologer": false }`
- **Response**: `"Astrologer Astro One added successfully."`

### 2. Create a User
- **POST** `/user`
- **Body**: `{ "id": "unique_user_id" }`
- **Response**: `"User unique_user_id created successfully."`

### 3. Get all Astrologers
- **GET** `/astrologers`
- **Response**: Returns array of astrologers details.

### 4. Allocate Users
- **POST** `/allocate`
- **Response**: `"Users have been allocated based on weighted round-robin!"`

### 5. Get all Users
- **GET** `/users`
- **Response**: Returns array of users details.

### 6. Get Astrologer by ID
- **GET** `/astrologer/:id`
- **Response**: Returns astrologer details.

### 7. Update Astrologer Settings
- **POST** `/astrologer/:id/update`
- **Body**: `{ "maxConnections": 20}`
- **Response**: `"Astrologer Astro One has been updated."`

## How to Run the API
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Start the server: `node index.js`. It can run test als
4. Use a tool like Postman to interact with the API.

## Testing
- To run tests, use the command: `npm start`. It should start the server and run the specific test cases as well.

1. Creating an Astrologer: Tests the /astrologer endpoint for successful astrologer creation.
2. Creating an Astrologer: Tests the /astrologer endpoint for successful astrologer creation.
3. User Allocation: Tests the /allocate endpoint to ensure users are allocated to astrologers equally.
4. Fetching Astrologers: Tests the /astrologers endpoint to ensure it returns a list of astrologers.
5. Fetching Users: Tests the /users endpoint to confirm it retrieves all users.
6. Updating Astrologer Settings: Tests the /astrologer/:id/update endpoint for updating maximum connections.
7. Fetching Specific Astrologer Details:Tests the /astrologer/:id endpoint for retrieving specific astrologer details.
8. **Load Testing**: Tests the system's ability to handle 250 astrologers and 1000 users, ensuring equitable user distribution.

## Flow Distribution Algorithm
The algorithm uses a **Round-Robin** approach, when a request is made to the POST /allocate endpoint, the function iterates through each user and checks which astrologer can handle more connections by evaluating their capacity. It employs a while loop to skip over astrologers that have reached their maximum connection limit, incrementing the index circularly through the list of astrologers. Once an available astrologer is found, the user is assigned to that astrologer, and the astrologer's connection count is updated accordingly. This process ensures that users are allocated fairly and efficiently across all available astrologers, promoting an equitable distribution of workload among them.
