import { useState } from "react";
import Form from './../../components/Form2/Form';
import { login } from "../../features/auth/auth";
import { Link } from "react-router-dom";
import useToken from "../../hooks/useToken";
import { useTranslation } from "react-i18next";
// import { useSelector } from "react-redux";

const Login = () => {
    // const {data: auth} = useSelector(state => state.auth)
    // console.log(auth)
    const {t} = useTranslation()
    const {loading, error} = useToken()
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const modalData = [
    {
      title: t("email"),
      name: "email",
      // style: { width: "100% !important" },
      class: "input-group auth-input",
      id: 0,
      unique: false,
      required: true,
      validation: () => {},
      type: "email",
      error: "",
    },
    {
      title: t('password'),
      name: "password",
      // style: { width: "100%" },
      class: "input-group auth-input",
      id: 1,
      unique: false,
      required: true,
      validation: () => {},
      type: "password",
      error: "",
    },
  ];

  return (
    <div className="page-wrapper">
      
      <div className="auth">
        <Form
          data={data}
          setFormData={setData}
          modalType={"page"}
          errors={errors}
          error={error}
          setErrors={setErrors}
          dispatchMethod={login}
          modalData={modalData}
          loader={loading}
          mainClass={"mainClass authWrapper"}
          inputClass={"input"}
        />
        <hr />
        <div className="auth-tail">
          <p>
          {t('noAcc')}{" "}
            <Link to={"https://einvoice.nozzm.com/register"}>{t('crAcc')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
