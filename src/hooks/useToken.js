import { useSelector } from "react-redux"

const useToken = () => {
    const { token, data, loading, error, permissions, role } = useSelector(
      (state) => state.auth
    );
    // console.log(data, loading, error, permissions, role);
    
    return { token, loading, data, error, permissions, role };
}

export default useToken