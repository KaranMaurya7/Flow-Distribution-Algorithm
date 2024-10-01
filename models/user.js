
class User {
	constructor(id) {
		this.id = id; 
		this.assignedAstrologerId = null; 
	}

	assignAstrologer(astrologerId) {
		this.assignedAstrologerId = astrologerId;
	}
}

module.exports = User;
	