/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import Search from '../Search/Search';
import stocks from '../../assets/stocks.svg'
import purchase from '../../assets/purchase.svg'
import sales from '../../assets/sales.svg'
import resale from '../../assets/resale.svg'
import repur from '../../assets/repur.svg'
import { useTranslation } from 'react-i18next';
import Filter from '../Filter/Filter';
import { useEffect, useState } from 'react';

const PageHead = ({
  placeholder,
  btn,
  setModal,
  searchData,
  setDataToFilter,
  navigate,
  total_purchers_return,
  total_sales_return,
  total_purchers,
  total_sales,
  opening_balancess,
  name,
  totall,
  filter,
  resetFilter
}) => {
  const { t, i18n } = useTranslation();
  //filtering
  const [filterValue, setFilterValue] = useState(""); // Add filter state
  // const [filteredDataSource, setFilteredDataSource] = useState([]);

  const handleFilterChange = (option) => {
    console.log(option)
    setFilterValue(option);
  };

  useEffect(() => {
    if (filterValue && filterValue !== "reset") {
      console.log(filterValue);
      const filteredData = searchData.filter(
        (item) => item["group_id"] == Number(filterValue)
      );
      setDataToFilter(filteredData);
    } else if (filterValue && filterValue === "reset") {
      
      resetFilter();
    }
  }, [filterValue]);

  return (
    <>
      {!name && (
        <div className="top">
          {searchData && (
            <div>
              <Search
                placeholder={placeholder}
                searchData={searchData}
                setDataToFilter={setDataToFilter}
              />
            </div>
          )}

          {filter ? (
            <Filter onFilterChange={handleFilterChange} filter={filter} />
          ) : null}
          {/* {(btn || navigate) && ( */}
          {/* <div className="btn"> */}
          {navigate ? (
            <Link to={navigate} className="btn">
              {btn}
            </Link>
          ) : null}
          {btn && !navigate ? (
            <button
              className="btn"
              onClick={() => setModal({ open: true, type: "add" })}
            >
              {btn}
            </button>
          ) : null}
          {/* </div> */}
          {/* )} */}
        </div>
      )}
      {total_purchers ||
      total_purchers_return ||
      total_sales ||
      total_sales_return ||
      opening_balancess ? (
        <div className="pag-bottom">
          <div className="pro-info">
            <p>{t("productName")}: </p>
            {name}
          </div>
          <div className="product-data">
            <div className="s-detail">
              <img src={stocks} />
              <div>
                <p>{t("openeing")}</p>
                {opening_balancess ? opening_balancess : 0}
              </div>
            </div>
            <div className="s-detail">
              <img src={purchase} />
              <div>
                <p>{t("totalSale")}</p>
                {total_sales ? total_sales : 0}
              </div>
            </div>
            <div className="s-detail">
              <img src={repur} alt="" />
              <div>
                <p>{t("totalSaleRe")}</p>
                {total_sales_return ? total_sales_return : 0}
              </div>
            </div>
            <div className="s-detail">
              <img src={sales} />
              <div>
                <p>{t("totalPur")}</p>
                {total_purchers ? total_purchers : 0}
              </div>
            </div>
            <div className="s-detail">
              <img src={resale} alt="" />
              <div>
                <p>{t("totalPurRe")}</p>
                {total_purchers_return ? total_purchers_return : 0}
              </div>
            </div>
            <div className="s-detail">
              <img src={resale} alt="" />
              <div>
                <p>{t("total")}</p>
                {totall ? totall : 0}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default PageHead