/* eslint-disable react/prop-types */
// import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LiaSearchSolid } from "react-icons/lia";
// import { useSelector } from "react-redux";

// eslint-disable-next-line react/prop-types
const Search = ({ placeholder, searchData, setDataToFilter }) => {
  const {i18n} =  useTranslation()
  // const { language } = useSelector((state) => state.ln);
  
  const handleSearch = (e) => {
    if(searchData) {
      const searchTerm = e.target.value.trim().toLowerCase();
      if (searchTerm === "") {
        setDataToFilter(searchData);
        return;
      }
      const filteredData = searchData.filter((item) => {
        return Object.values(item).some((value) => {
          if(value && typeof value === 'string') {
            // console.log(value)
            return value.toLowerCase().includes(searchTerm)
          }
        }
        );
      });
      // console.log(filteredData)
      setDataToFilter(filteredData);
    }
  };

  return (
    <div className="search" style={{flexDirection: i18n.language === 'en' ? 'row' : 'row-reverse'}}>
      <LiaSearchSolid />
      <input type="text" placeholder={placeholder} onChange={handleSearch} />
    </div>
  );
};

export default Search;
