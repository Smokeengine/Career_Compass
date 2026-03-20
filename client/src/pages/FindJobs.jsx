import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header, Loading } from "../components";
import { BiBriefcaseAlt2 } from "react-icons/bi";
import { BsStars } from "react-icons/bs";
import { MdOutlineWatchLater } from "react-icons/md";
import { experience, jobTypes } from "../utils/data";
import { CustomButton, JobCard, ListBox } from "../components";
import { apiRequest, updateURL } from "../utils";

const datePostedOptions = [
  { label: "Any Time", value: "all" },
  { label: "Today", value: "today" },
  { label: "Last 3 Days", value: "week" },
  { label: "Last Month", value: "month" },
];

const skillChips = [
  "React Developer",
  "Full Stack Engineer",
  "Node.js Developer",
  "TypeScript Engineer",
  "Frontend Engineer",
  "Software Engineer",
];

const FindJobs = () => {
  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("full stack engineer");
  const [jobLocation, setJobLocation] = useState("United States");
  const [filterJobTypes, setFilterJobTypes] = useState([]);
  const [expVal, setExpVal] = useState([]);
  const [datePosted, setDatePosted] = useState("month");
  const [isFetching, setIsFetching] = useState(false);
  const isMounted = useRef(false);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchJobs = async (resetPage = false) => {
    setIsFetching(true);
    const currentPage = resetPage ? 1 : page;

    const newURL = updateURL({
      pageNum: currentPage,
      query: searchQuery,
      cmpLoc: jobLocation,
      sort,
      navigate,
      location,
      jType: filterJobTypes,
      exp: "",
    });

    try {
      const res = await apiRequest({
        url: `/jobs${newURL}&datePosted=${datePosted}`,
        method: "GET",
      });

      const newData = res?.data || [];
      setData(prev => currentPage === 1 ? newData : [...prev, ...newData]);
      setNumPage(res?.numOfPage || 1);
      if (resetPage) setPage(1);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  // Apply experience filter client-side
  useEffect(() => {
    if (expVal.length === 0) {
      setFilteredData(data);
      return;
    }

    // Parse experience ranges
    let minExp = Infinity;
    let maxExp = 0;
    expVal.forEach(val => {
      const parts = val.split('-');
      const min = Number(parts[0]);
      const max = Number(parts[1]);
      if (min < minExp) minExp = min;
      if (max > maxExp) maxExp = max;
    });

    const filtered = data.filter(job => {
      const jobExp = job?.experience || 0;
      return jobExp >= minExp - 1 && jobExp <= maxExp + 1;
    });

    setFilteredData(filtered);
  }, [data, expVal]);

  const filterJobs = (val) => {
    setFilterJobTypes(prev =>
      prev.includes(val) ? prev.filter(el => el !== val) : [...prev, val]
    );
  };

  const filterExperience = (val) => {
    setExpVal(prev =>
      prev.includes(val) ? prev.filter(el => el !== val) : [...prev, val]
    );
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setData([]);
    await fetchJobs(true);
  };

  const handleChipClick = (skill) => {
    setSearchQuery(skill);
    setData([]);
    setPage(1);
  };

  const handleShowMore = (e) => {
    e.preventDefault();
    setPage(prev => prev + 1);
  };

  // Only fetch on mount
  useEffect(() => {
    fetchJobs(true);
  }, []);

  // Fetch when filters change (not on mount)
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    setData([]);
    fetchJobs(true);
  }, [filterJobTypes, datePosted, sort]);

  // Fetch when page changes (load more)
  useEffect(() => {
    if (page === 1) return;
    fetchJobs();
  }, [page]);

  // Fetch when chip search changes
  useEffect(() => {
    if (!isMounted.current) return;
    fetchJobs(true);
  }, [searchQuery]);

  return (
    <div>
      <Header
        title='Connecting Talent with Opportunity..'
        type='home'
        handleClick={handleSearchSubmit}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={jobLocation}
        setLocation={setJobLocation}
      />

      {/* Skill chips */}
      <div className='flex flex-wrap gap-2 px-6 py-3 bg-white border-b border-gray-100 justify-center'>
        {skillChips.map((skill) => (
          <button
            key={skill}
            onClick={() => handleChipClick(skill)}
            className={`px-3 py-1 rounded-full text-sm border transition-colors cursor-pointer ${
              searchQuery === skill
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white'
            }`}
          >
            {skill}
          </button>
        ))}
      </div>

      <div className='container mx-auto flex gap-6 2xl:gap-10 md:px-5 py-0 md:py-6 bg-[#f0f0f0] rounded-lg mb-3'>

        {/* Filter Sidebar */}
        <div className='hidden md:flex flex-col w-1/6 h-fit bg-white shadow-md rounded-xl overflow-hidden sticky top-6'>

          <div className='bg-blue-600 px-4 py-3'>
            <p className='text-white font-semibold text-sm tracking-wide uppercase'>
              Filter Jobs
            </p>
          </div>

          {/* Job Type */}
          <div className='px-4 py-4 border-b border-gray-100'>
            <p className='flex items-center gap-2 font-semibold text-gray-700 text-sm mb-3'>
              <BiBriefcaseAlt2 className='text-blue-600 text-base' />
              Job Type
            </p>
            <div className='flex flex-col gap-2.5'>
              {jobTypes.map((jtype, index) => (
                <label key={index} className='flex items-center gap-2.5 cursor-pointer group'>
                  <input
                    type='checkbox'
                    value={jtype}
                    className='w-4 h-4 accent-blue-600 cursor-pointer rounded'
                    onChange={(e) => filterJobs(e.target.value)}
                  />
                  <span className='text-sm text-gray-600 group-hover:text-blue-600 transition-colors'>
                    {jtype}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className='px-4 py-4 border-b border-gray-100'>
            <p className='flex items-center gap-2 font-semibold text-gray-700 text-sm mb-3'>
              <BsStars className='text-blue-600 text-base' />
              Experience
            </p>
            <div className='flex flex-col gap-2.5'>
              {experience.map((exp) => (
                <label key={exp.title} className='flex items-center gap-2.5 cursor-pointer group'>
                  <input
                    type='checkbox'
                    value={exp?.value}
                    className='w-4 h-4 accent-blue-600 cursor-pointer rounded'
                    onChange={(e) => filterExperience(e.target.value)}
                  />
                  <span className='text-sm text-gray-600 group-hover:text-blue-600 transition-colors'>
                    {exp.title}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Posted */}
          <div className='px-4 py-4'>
            <p className='flex items-center gap-2 font-semibold text-gray-700 text-sm mb-3'>
              <MdOutlineWatchLater className='text-blue-600 text-base' />
              Date Posted
            </p>
            <div className='flex flex-col gap-2.5'>
              {datePostedOptions.map((option) => (
                <label key={option.value} className='flex items-center gap-2.5 cursor-pointer group'>
                  <input
                    type='radio'
                    name='datePosted'
                    value={option.value}
                    checked={datePosted === option.value}
                    className='w-4 h-4 accent-blue-600 cursor-pointer'
                    onChange={(e) => {
                      setDatePosted(e.target.value);
                      setData([]);
                      setPage(1);
                    }}
                  />
                  <span className='text-sm text-gray-600 group-hover:text-blue-600 transition-colors'>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Jobs List */}
        <div className='w-full md:w-5/6 px-5 md:px-0'>

          <div className='flex items-center justify-between mb-4 bg-white rounded-xl px-4 py-3 shadow-sm'>
            <p className='text-sm md:text-base text-gray-600'>
              Showing:{" "}
              <span className='font-semibold text-gray-900'>{filteredData.length}</span>{" "}
              Jobs Available
            </p>
            <div className='flex flex-col md:flex-row gap-0 md:gap-2 md:items-center'>
              <p className='text-sm md:text-base text-gray-500'>Sort By:</p>
              <ListBox sort={sort} setSort={setSort} />
            </div>
          </div>

          <div className='w-full flex flex-wrap gap-4'>
            {filteredData?.map((job, index) => {
              const newJob = {
                name: job?.company?.name,
                logo: job?.company?.profileUrl,
                ...job,
              };
              return <JobCard job={newJob} key={job?._id || index} />;
            })}
          </div>

          {isFetching && (
            <div className='py-10'>
              <Loading />
            </div>
          )}

          {numPage > page && !isFetching && (
            <div className='w-full flex items-center justify-center pt-16'>
              <CustomButton
                onClick={handleShowMore}
                title='Load More'
                containerStyles='text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600 transition-colors'
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindJobs;
