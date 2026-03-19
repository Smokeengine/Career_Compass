import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header, Loading } from "../components";
import { BiBriefcaseAlt2 } from "react-icons/bi";
import { BsStars } from "react-icons/bs";
import { experience, jobTypes } from "../utils/data";
import { CustomButton, JobCard, ListBox } from "../components";
import { apiRequest, updateURL } from "../utils";

const FindJobs = () => {
  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [recordCount, setRecordCount] = useState(0);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [filterJobTypes, setFilterJobTypes] = useState([]);
  const [filterExp, setFilterExp] = useState([]);
  const [expVal, setExpVal] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setIsFetching(true);

    const newURL = updateURL({
      pageNum: page,
      query: searchQuery,
      cmpLoc: jobLocation,
      sort: sort,
      navigate: navigate,
      location: location,
      jType: filterJobTypes,
      exp: filterExp,
    });

    try {
      const res = await apiRequest({
        url: "/jobs" + newURL,
        method: "GET",
      });

      setNumPage(res?.numOfPage);
      setRecordCount(res?.totalJobs);
      setData(res.data);
      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
      console.log(error);
    }
  };

  const filterJobs = (val) => {
    if (filterJobTypes?.includes(val)) {
      setFilterJobTypes(filterJobTypes.filter((el) => el !== val));
    } else {
      setFilterJobTypes([...filterJobTypes, val]);
    }
  };

  const filterExperience = async (e) => {
    if (expVal?.includes(e)) {
      setExpVal(expVal?.filter((el) => el != e));
    } else {
      setExpVal([...expVal, e]);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    await fetchJobs();
  };

  const handleShowMore = async (e) => {
    e.preventDefault();
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (expVal.length > 0) {
      let newExpVal = [];
      expVal?.map((el) => {
        const newEl = el?.split("-");
        newExpVal.push(Number(newEl[0]), Number(newEl[1]));
      });
      newExpVal?.sort((a, b) => a - b);
      setFilterExp(`${newExpVal[0]}-${newExpVal[newExpVal?.length - 1]}`);
    }
  }, [expVal]);

  useEffect(() => {
    fetchJobs();
  }, [sort, filterJobTypes, filterExp, page]);

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

      <div className='container mx-auto flex gap-6 2xl:gap-10 md:px-5 py-0 md:py-6 bg-[#f0f0f0] rounded-lg mb-3'>
        
        {/* Filter Sidebar */}
        <div className='hidden md:flex flex-col w-1/6 h-fit bg-white shadow-md rounded-xl overflow-hidden sticky top-6'>
          
          {/* Sidebar Header */}
          <div className='bg-blue-600 px-4 py-3'>
            <p className='text-white font-semibold text-sm tracking-wide uppercase'>
              Filter Jobs
            </p>
          </div>

          {/* Job Type Section */}
          <div className='px-4 py-4 border-b border-gray-100'>
            <p className='flex items-center gap-2 font-semibold text-gray-700 text-sm mb-3'>
              <BiBriefcaseAlt2 className='text-blue-600 text-base' />
              Job Type
            </p>
            <div className='flex flex-col gap-2.5'>
              {jobTypes.map((jtype, index) => (
                <label
                  key={index}
                  className='flex items-center gap-2.5 cursor-pointer group'
                >
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

          {/* Experience Section */}
          <div className='px-4 py-4'>
            <p className='flex items-center gap-2 font-semibold text-gray-700 text-sm mb-3'>
              <BsStars className='text-blue-600 text-base' />
              Experience
            </p>
            <div className='flex flex-col gap-2.5'>
              {experience.map((exp) => (
                <label
                  key={exp.title}
                  className='flex items-center gap-2.5 cursor-pointer group'
                >
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

        </div>

        {/* Jobs List */}
        <div className='w-full md:w-5/6 px-5 md:px-0'>
          
          {/* Results header */}
          <div className='flex items-center justify-between mb-4 bg-white rounded-xl px-4 py-3 shadow-sm'>
            <p className='text-sm md:text-base text-gray-600'>
              Showing:{" "}
              <span className='font-semibold text-gray-900'>{recordCount}</span>{" "}
              Jobs Available
            </p>
            <div className='flex flex-col md:flex-row gap-0 md:gap-2 md:items-center'>
              <p className='text-sm md:text-base text-gray-500'>Sort By:</p>
              <ListBox sort={sort} setSort={setSort} />
            </div>
          </div>

          {/* Job Cards */}
          <div className='w-full flex flex-wrap gap-4'>
            {data?.map((job, index) => {
              const newJob = {
                name: job?.company?.name,
                logo: job?.company?.profileUrl,
                ...job,
              };
              return <JobCard job={newJob} key={index} />;
            })}
          </div>

          {/* Loading */}
          {isFetching && (
            <div className='py-10'>
              <Loading />
            </div>
          )}

          {/* Load More */}
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
