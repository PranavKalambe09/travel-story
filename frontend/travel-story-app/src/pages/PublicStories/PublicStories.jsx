import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import EmptyCard from "../../components/Cards/EmptyCard";
import moment from "moment";
import FilterInfoTitle from "../../components/Cards/FilterInfoTitle";
import { getEmptyCardImg, getEmptyCardMessage } from "../../utils/helper";

const PublicStories = () => {
  const [allStories, setAllStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  // Fetch all public stories
  const getAllPublicStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories-noauth");
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  // Search stories
  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get("/search-public-stories", {
        params: { query },
      });
      if (response.data && response.data.stories) {
        setFilterType("search");
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const handleClearSearch = () => {
    setFilterType("");
    getAllPublicStories();
  };

  // Filter stories by date
//   const filterStoriesByDate = async (day) => {
//     try {
//       const startDate = day.from ? moment(day.from).valueOf() : null;
//       const endDate = day.to ? moment(day.to).valueOf() : null;

//       if (startDate && endDate) {
//         const response = await axiosInstance.get("/public-stories/filter", {
//           params: { startDate, endDate },
//         });
//         if (response.data && response.data.stories) {
//           setFilterType("date");
//           setAllStories(response.data.stories);
//         }
//       }
//     } catch (error) {
//       console.log("An unexpected error occurred. Please try again.");
//     }
//   };

//   const handleDayClick = (day) => {
//     setDateRange(day);
//     filterStoriesByDate(day);
//   };

  const resetFilter = () => {
    setDateRange({ from: null, to: null });
    setFilterType("");
    getAllPublicStories();
  };

  useEffect(() => {
    getAllPublicStories();
  }, []);

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto py-10">
        <FilterInfoTitle
          filterType={filterType}
          filterDates={dateRange}
          onClear={resetFilter}
        />

        <div className="flex gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allStories.map((item) => (
                  <TravelStoryCard
                    key={item._id}
                    imgUrl={item.imageUrl}
                    title={item.title}
                    story={item.story}
                    date={item.visitedDate}
                    visitedLocation={item.visitedLocation}
                  />
                ))}
              </div>
            ) : (
              <EmptyCard
                imgSrc={getEmptyCardImg(filterType)}
                message={getEmptyCardMessage(filterType)}
              />
            )}
          </div>

          {/* <div className="w-[350px]">
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
              <div className="p-3">
                <DayPicker
                  captionLayout="dropdown-buttons"
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pagedNavigation
                />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default PublicStories;
