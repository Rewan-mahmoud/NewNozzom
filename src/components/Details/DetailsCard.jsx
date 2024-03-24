/* eslint-disable react/prop-types */
import { AiOutlineIdcard } from 'react-icons/ai';
import LoadSpinner from '../LoadSpinner/LoadSpinner';
import { useTranslation } from 'react-i18next';

const DetailsCard = ({loading, detail}) => {
  const { t } = useTranslation();
  return (
    <div className="details">
      {/* <h2>بيانات العميل</h2> */}
      {/* {loading && <LoadSpinner />}
      {!loading && ( */}
        <>
          <h2>
            <AiOutlineIdcard /> {t('cusInfo')}
          </h2>
          {loading ? <LoadSpinner/> : detail && Object.keys(detail).length > 0 ? <><div className="row">
            <span>{t('customerName')}: </span>
            <span>{detail.name}</span>
          </div>
          <div className="row">
            <span>{t('cusAddress')}: </span>
            <span>{detail.address}</span>
          </div>
          <div className="row">
            <span>{t('cusPhone')}: </span>
            <span>{detail.phone}</span>
          </div>
          <div className="row">
            <span>{t('country')}: </span>
            <span>{detail.country}</span>
          </div>
          <div className="row">
            <span>{t('vatNumber')}: </span>
            <span>{detail.tax_card}</span>
          </div></> : <div style={{width: '100%', textAlign: 'center', height: '150px'}}>قم باختيار عميل او مورد</div> }
        </>
      {/* )} */}
    </div>
  );
}

export default DetailsCard