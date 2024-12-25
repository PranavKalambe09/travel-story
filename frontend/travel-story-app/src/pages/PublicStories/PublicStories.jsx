import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import EmptyCard from "../../components/Cards/EmptyCard";
import FilterInfoTitle from "../../components/Cards/FilterInfoTitle";
import { getEmptyCardImg, getEmptyCardMessage } from "../../utils/helper";
import Modal from "react-modal";
import ViewTravelStory from "../Home/ViewTravelStory"; // Assuming this component handles displaying story details.

const PublicStories = () => {
  const [allStories, setAllStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

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

  const resetFilter = () => {
    setFilterType("");
    getAllPublicStories();
  };

  useEffect(() => {
    getAllPublicStories();
  }, []);

  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data });
  };

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
                    onClick={() => handleViewStory(item)}
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
        </div>
      </div>

      {/* Modal to View Travel Story */}
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => setOpenViewModal((prevState) => ({ ...prevState, isShown: false }))}

        // onRequestClose={() => setOpenViewModal({ isShown: false, data: null })}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <ViewTravelStory
          storyInfo={openViewModal.data || null}
          // onClose={() => setOpenViewModal({ isShown: false, data: null })}
          onClose={() => setOpenViewModal((prevState) => ({ ...prevState, isShown: false }))}

        />
      </Modal>
    </>
  );
};

export default PublicStories;
