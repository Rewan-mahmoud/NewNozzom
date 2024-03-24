/* eslint-disable react/prop-types */
// import { BiDollar } from "react-icons/bi";

import { useTranslation } from "react-i18next";


const Card = ({title, icon, details}) => {
  console.log(details)
  const {i18n, t} = useTranslation()
  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "5px",
          flexDirection: "column-reverse",
          fontSize: "30px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "15px", fontWeight: "800" }}>{t(title)}</p>
        {icon}
      </div>
      {details && (
        <p
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            direction: i18n.language === 'en'? 'ltr' : 'rtl'
          }}
        >
          {/* <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BiDollar />
          </span> */}
          {Number(details).toFixed(2)}{" "} {t('currency')}
        </p>
      )}
    </div>
  );
}

export default Card