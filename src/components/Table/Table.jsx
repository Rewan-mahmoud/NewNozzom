/* eslint-disable react/prop-types */
import "../../styles/Table.css";
import { useEffect, useState } from "react";
import { BiSortDown, BiSortUp } from "react-icons/bi";
import { useDispatch } from "react-redux";
import LoadSpinner from "../LoadSpinner/LoadSpinner";
import { formatDate } from "../../utils/Date";
import useToken from "../../hooks/useToken";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import Filter from "../Filter/Filter";

const Table = ({
  columns,
  dataSource,
  loading,
  total,
  perPage,
  fetch,
  footer,
  footerData,
  filter,
}) => {
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { token } = useToken();
  const { t } = useTranslation();
  const type = useLocation().pathname;

  //pagination
  const totalPages = total && perPage ? Math.ceil(total / perPage) : 1;

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    dispatch(fetch({ page: currentPage - 1, token }));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    dispatch(fetch({ page: currentPage + 1, token }));
  };

  //sorting
  const handleColumnClick = (column) => {
    if (column.dataIndex === sortedColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortedColumn(column.dataIndex);
      setSortDirection("asc");
    }
  };

  const sortedDataSource = dataSource.sort((a, b) => {
    if (sortedColumn) {
      const aValue = a[sortedColumn];
      const bValue = b[sortedColumn];
      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      } else if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      } else {
        return 0;
      }
    } else {
      return a.index - b.index;
    }
  });

  //filtering
  const [filterValue, setFilterValue] = useState(""); // Add filter state
  const [filteredDataSource, setFilteredDataSource] = useState([]);

  // Add a function to handle filter changes
  const handleFilterChange = (option) => {
    // Update the filter value state
    setFilterValue(option);
    // Update the filtered data source

    // console.log(filteredData);
  };

  useEffect(() => {
    if (filterValue) {
      // const filteredData = dataSource.filter(
      //   (item) => item["group_id"] == Number(filterValue)
      // );
      setFilteredDataSource(filteredData);
      console.log(" filteredData" , filteredData)
    } else {
      setFilteredDataSource(sortedDataSource);
    }
  }, [filterValue, dataSource]);

  return (
    <div className="bottom">
      {/* add filter here */}
      {filter ? (
        <Filter onFilterChange={handleFilterChange} filter={filter} />
      ) : null}

      {/* add filter here */}
      <table>
        <thead>
          <tr>
            {columns.map((column, i) => {
              if (column.key !== "actions" && column.key !== "index") {
                if (column.dataIndex === "customers.name") {
                  return (
                    <th
                      key={i}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleColumnClick(column)}
                    >
                      <div className="thead">
                        {column.title}{" "}
                        {column.dataIndex === sortedColumn &&
                          (sortDirection === "asc" ? (
                            <BiSortUp />
                          ) : (
                            <BiSortDown />
                          ))}
                      </div>
                    </th>
                  );
                } else {
                  return (
                    <th
                      key={i}
                      onClick={() => handleColumnClick(column)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="thead">
                        {column.title}{" "}
                        {column.dataIndex === sortedColumn &&
                          (sortDirection === "asc" ? (
                            <BiSortUp />
                          ) : (
                            <BiSortDown />
                          ))}
                      </div>
                    </th>
                  );
                }
              } else {
                return (
                  <th key={i} style={{ cursor: "pointer" }}>
                    <div className="thead">{column.title}</div>
                  </th>
                );
              }
            })}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length}>
                <LoadSpinner />
              </td>
            </tr>
          ) : filteredDataSource.length <= 0 && !loading ? (
            <tr>
              <td colSpan={columns.length}>{t("noRes")}</td>
            </tr>
          ) : (
            filteredDataSource.map((item, index) => (
              <tr key={index}>
                {columns.map((column, i) => {
                  if (column.key === "index") {
                    return <td key="index">{column.render(index)}</td>;
                  } 
                  else if (column.key === "actions") {
                    return <td key="actions">{column.render(item)}</td>;
                  } else if (
                    column.dataIndex === "date" ||
                    column.dataIndex === "created_at"
                  ) {
                    return (
                      <td key={i}>{formatDate(item[column.dataIndex])}</td>
                    );
                  } else if (column.dataIndex === "total - sadads_sum") {
                    return (
                      <td key={i}>{item["total"] - item["sadads_sum"]}</td>
                    );
                  } else if (column.dataIndex === "tranfire") {
                    return (
                      <td key={i}>
                        {Number(item[column.dataIndex])
                          ? t("converted")
                          : t("notConverted")}
                      </td>
                    );
                  } else 
                  if (column.dataIndex === "same") {
                    return (
                      <td key={i}>
                        {Number(item[column.dataIndex])
                          ? t("duplicated")
                          : t("not duplicated")}
                      </td>
                    );
                  } else if (column.dataIndex === "months") {
                    return (
                      <td key={i}>
                        <Link
                          to={`/main/sub/${item.id}`}
                          style={{ color: "black", textDecoration: "none" }}
                        >
                          عرض الاشتراكات
                        </Link>
                      </td>
                    );
                  } else if (column.dataIndex === "type") {
                    return (
                      <td key={i}>
                        {!isNaN(Number(item[column.dataIndex]))
                          ? Number(item[column.dataIndex]) === 0 ||
                            Number(item[column.dataIndex]) === 1
                            ? Number(item[column.dataIndex]) === 0
                              ? t("service")
                              : t("product")
                            : Number(item[column.dataIndex])
                          : null}
                        {isNaN(Number(item[column.dataIndex])) &&
                          item[column.dataIndex]}
                      </td>
                    );
                  } else if (column.dataIndex === "old_new") {
                    return (
                      <td key={i}>
                        {Number(item[column.dataIndex]) &&
                        type === "/creditnote"
                          ? t("orInvoice")
                          : Number(item[column.dataIndex]) &&
                            type === "/debitnote"
                          ? t("orInvoicepur")
                          : "لا يوجد"}
                      </td>
                    );
                  } else {
                    const value = column.dataIndex.includes(".")
                      ? item[column.dataIndex.split(".")[0]][
                          column.dataIndex.split(".")[1]
                        ]
                      : item[column.dataIndex];
                    return <td key={i}>{value}</td>;
                  }
                })}
              </tr>
            ))
          )}
          {/* {} */}
        </tbody>
        {footer && (
          <tfoot>
            <tr>
              <td>{t("total")}</td>
              <td
                colSpan={columns.length - (Object.keys(footerData).length + 1)}
              ></td>
              {Object.keys(footerData).map((item) => {
                return <td key={item}>{footerData[item]}</td>;
              })}
            </tr>
          </tfoot>
        )}
      </table>
      {total && perPage ? (
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            {t("prev")}
          </button>
          {totalPages &&
            [...Array(totalPages)].map((_, page) => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page + 1);
                  dispatch(fetch({ page: page + 1, token }));
                  console.log(page + 1, currentPage);
                }}
                className={currentPage === page + 1 ? "active" : ""}
                disabled={currentPage === page + 1}
              >
                {page + 1}
              </button>
            ))}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            {t("next")}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Table;
