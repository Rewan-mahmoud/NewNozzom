import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useToken from "./useToken";

const useAll = (stateName, method, id = null) => {
  const {token} = useToken();
 const {
   data,
   loading,
   error,
   total,
   perPage,
   query,
   name,
   to,
   total_purchers_return,
   total_sales_return,
   total_purchers,
   total_sales,
   opening_balancess,
   totall,
   postLoad
 } = useSelector((state) => state[stateName]);
 const dispatch = useDispatch();
 const dataSource = data ? [...data] : [];
 const [dataToFilter, setDataToFilter] = useState(dataSource);
 console.log("data" , dataSource)

 useEffect(() => {
   setDataToFilter(dataSource);
 }, [data]);

 const filterData = (filteredData) => {
   setDataToFilter(filteredData);
 };

 const resetDataa = () => {
  setDataToFilter(dataSource)
 }

//  console.log(totall)

 useEffect(() => {
   dispatch(method({id, token}));
 }, []);

 return {
   dataSource,
   dataToFilter,
   loading,
   error,
   filterData,
   resetDataa,
   total,
   perPage,
   query,
   to,
   total_purchers_return,
   total_sales_return,
   total_purchers,
   total_sales,
   opening_balancess,
   name,
   totall,
   postLoad
 };
}

export default useAll