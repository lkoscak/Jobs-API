const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");
const User = require("../models/User");

const auth = async (req, res, next) => {
	const { authorization } = req.headers;
	if (!authorization || !authorization.startsWith("Bearer ")) {
		throw new UnauthenticatedError("No token provided");
	}
	const token = authorization.split(" ")[1];
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		res.locals.user = await User.findById(payload.userId).select("-password");
		next();
	} catch (error) {
		throw new UnauthenticatedError("Not authorized to access this route");
	}
};

module.exports = auth;
