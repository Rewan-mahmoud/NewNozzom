
// eslint-disable-next-line react/prop-types
const LoadSpinner = ({btn}) => {
  return (
    <div className={`${btn ? 'lds-ring btne' : 'lds-ring'}`} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'}}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default LoadSpinner