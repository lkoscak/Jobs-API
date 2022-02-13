const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors"); // same as '../errors/index'

const register = async (req, res) => {
	const user = await User.create({ ...req.body });
	res
		.status(StatusCodes.CREATED)
		.json({ user: { name: user.name }, token: user.generateJWT() });
};
const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email.trim() || !password.trim()) {
		throw new BadRequestError("Please provide both email and password");
	}
	const user = await User.findOne({ email });
	if (!user || !(await user.checkPassword(password))) {
		throw new UnauthenticatedError("Invalid credentials");
	}

	res
		.status(StatusCodes.OK)
		.json({ user: { name: user.name }, token: user.generateJWT() });
};

module.exports = { register, login };
