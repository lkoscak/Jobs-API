const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors"); // same as '../errors/index'

const getAllJobs = async (req, res) => {
	const jobs = await Job.find({ createdBy: res.locals.user._id }).sort(
		"createdAt"
	);
	res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};
const getJob = async (req, res) => {
	const { user } = res.locals;
	const { id: jobId } = req.params;
	const job = await Job.findOne({ _id: jobId, createdBy: user._id });
	if (!job) {
		throw new NotFoundError(`No job found for provided job id: ${jobId}`);
	}
	res.status(StatusCodes.OK).json({ job });
};
const createJob = async (req, res) => {
	const job = await Job.create({ ...req.body, createdBy: res.locals.user._id });
	res.status(StatusCodes.CREATED).json(job);
};
const updateJob = async (req, res) => {
	const { user } = res.locals;
	const { id: jobId } = req.params;
	const { company, position } = req.body;
	if (company.trim() === "" || position.trim() === "") {
		throw new BadRequestError("Data passed for update is invalid");
	}
	const job = await Job.findOneAndUpdate(
		{ _id: jobId, createdBy: user._id },
		{ company, position },
		{ new: true, runValidators: true } // new: true to get back updated job
	);
	if (!job) {
		throw new NotFoundError(`No job found for provided job id: ${jobId}`);
	}
	res.status(StatusCodes.OK).json({ job });
};
const deleteJob = async (req, res) => {
	const { id: jobId } = req.params;
	const { user } = res.locals;
	const job = await Job.findOneAndDelete({ _id: jobId, createdBy: user._id });
	if (job === null) {
		throw new NotFoundError(`No job found for provided job id: ${jobId}`);
	}
	res.status(200).send();
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
