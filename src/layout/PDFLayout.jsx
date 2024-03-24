import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PDFLayout = () => {
  const { ready } = useSelector((state) => state.auth);
  // console.log(data)
  const isLoggedIn = ready;
  const path = useMemo(() => {
    return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
  }, [isLoggedIn]);
  return (
    <>
      {/* <Navbar /> */}
      <div className="pdf-layout" style={{direction: 'rtl'}}>{path}</div>
    </>
  );
};

export default PDFLayout;
