import mongoose from "mongoose";
import Jobs from "../models/jobsModel.js";
import Companies from "../models/companiesModel.js";

export const createJob = async (req, res, next) => {
  try {
    const {
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      desc,
      requirements,
    } = req.body;

    if (!jobTitle || !jobType || !location || !salary || !requirements || !desc) {
      next("Please Provide All Required Fields");
      return;
    }

    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No Company with id: ${id}`);

    const jobPost = {
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      detail: { desc, requirements },
      company: id,
    };

    const job = new Jobs(jobPost);
    await job.save();

    const company = await Companies.findById(id);
    company.jobPosts.push(job._id);
    await Companies.findByIdAndUpdate(id, company, { new: true });

    res.status(200).json({
      success: true,
      message: "Job Posted Successfully",
      job,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const {
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      desc,
      requirements,
    } = req.body;
    const { jobId } = req.params;

    if (!jobTitle || !jobType || !location || !salary || !desc || !requirements) {
      next("Please Provide All Required Fields");
      return;
    }

    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No Company with id: ${id}`);

    const jobPost = {
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      detail: { desc, requirements },
      _id: jobId,
    };

    await Jobs.findByIdAndUpdate(jobId, jobPost, { new: true });

    res.status(200).json({
      success: true,
      message: "Job Post Updated Successfully",
      jobPost,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getJobPosts = async (req, res, next) => {
  try {
    const { search, location, page, jtype, exp, datePosted } = req.query;

    const query = search ? `${search} jobs` : 'software developer jobs';
    const loc = location || 'united states';
    const currentPage = Number(page) || 1;

    // Map experience filter to JSearch
    let employmentTypes = '';
    if (jtype) {
      const typeMap = {
        'Full-Time': 'FULLTIME',
        'Part-Time': 'PARTTIME',
        'Contract': 'CONTRACTOR',
        'Intern': 'INTERN',
      };
      const types = jtype.split(',').map(t => typeMap[t.trim()]).filter(Boolean);
      employmentTypes = types.join(',');
    }

    // Map date posted
    const dateMap = {
      'today': 'today',
      'week': '3days',
      'month': 'month',
      'all': 'all'
    };
    const dateFilter = dateMap[datePosted] || 'month';

    let url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query + ' in ' + loc)}&page=${currentPage}&num_pages=1&date_posted=${dateFilter}`;

    if (employmentTypes) {
      url += `&employment_types=${employmentTypes}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.JSEARCH_API_KEY,
        'x-rapidapi-host': 'jsearch.p.rapidapi.com',
      }
    });

    const data = await response.json();

    const jobs = data.data?.map(job => ({
      _id: job.job_id,
      jobTitle: job.job_title,
      jobType: job.job_employment_type || 'Full-Time',
      location: `${job.job_city || ''}, ${job.job_country || ''}`,
      salary: job.job_min_salary
        ? `$${job.job_min_salary} - $${job.job_max_salary}`
        : 'Competitive',
      experience: job.job_required_experience?.required_experience_in_months
        ? Math.floor(job.job_required_experience.required_experience_in_months / 12)
        : 0,
      detail: {
        desc: job.job_description?.slice(0, 300) + '...',
        requirements: job.job_highlights?.Qualifications?.join(', ') || '',
      },
      company: {
        name: job.employer_name,
        profileUrl: job.employer_logo || '',
        location: `${job.job_city || ''}, ${job.job_country || ''}`,
      },
      createdAt: job.job_posted_at_datetime_utc || new Date(),
      isExternal: true,
      applyUrl: job.job_apply_link,
    })) || [];

    res.status(200).json({
      success: true,
      totalJobs: jobs.length > 0 ? 100 : 0,
      data: jobs,
      page: currentPage,
      numOfPage: 10,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Jobs.findById({ _id: id }).populate({
      path: "company",
      select: "-password",
    });

    if (!job) {
      return res.status(200).send({
        message: "Job Post Not Found",
        success: false,
      });
    }

    const searchQuery = {
      $or: [
        { jobTitle: { $regex: job?.jobTitle, $options: "i" } },
        { jobType: { $regex: job?.jobType, $options: "i" } },
      ],
    };

    let queryResult = Jobs.find(searchQuery)
      .populate({ path: "company", select: "-password" })
      .sort({ _id: -1 });

    queryResult = queryResult.limit(6);
    const similarJobs = await queryResult;

    res.status(200).json({
      success: true,
      data: job,
      similarJobs,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const deleteJobPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Jobs.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Job Post Deleted Successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
