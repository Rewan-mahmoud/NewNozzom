
import { handlSubmit } from '../utils/submiterr';

import { useNavigate } from "react-router-dom";

const useSubmit = () => {
    const navigate = useNavigate()
    handlSubmit(setErrors, data, modalData, dataSource)
}

export default useSubmit