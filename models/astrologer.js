
class Astrologer {
		
	constructor(id, name, maxConnections, isTopAstrologer = false, weight = 1) {
		this.id = id;
		this.name = name;
		this.maxConnections = maxConnections;
		this.currentConnections = 0; // Start with 0 connections
		this.isTopAstrologer = isTopAstrologer; // Top astrologer flag
	}

	canHandleMoreConnections() {
		return this.currentConnections < this.maxConnections;
	}

	topAstrologer() {
		return this.isTopAstrologer;
	}

	addConnection() {
		if (this.canHandleMoreConnections()) {
			this.currentConnections += 1;
		}
	}

	// Reset connections for a new day or new round of flow
	resetConnections() {
		this.currentConnections = 0;
	}
}


module.exports = Astrologer;
	