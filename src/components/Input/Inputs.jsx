/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-prototype-builtins */
import { useEffect, useState } from "react";
import { BiSolidDownArrow } from "react-icons/bi";
import SelectSearch from "react-select-search";
import excel from "../../assets/excel.png";
import pdf from "../../assets/pdf.png";
import doc from "../../assets/word.png";
import { AiOutlineDown } from "react-icons/ai";
import { BsCheckLg, BsFillTrashFill } from "react-icons/bs";
import { getOptions2 } from "../../utils/getOption";
import useToken from "../../hooks/useToken";
import Select from "react-select";
import bwipjs from "bwip-js";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import print from "print-js";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import AddReason from "../Modal/addReason";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import SSelect from "@mui/material/Select";
import AddProduct from "../../pages/addProduct/addProducts";



/* eslint-disable react/prop-types */
export const InputField = ({
  item,
  data,
  errors,
  disabled,
  setFormData,
  inputClass,
  setErrors,
  required,
}) => {
  const { t, i18n } = useTranslation();
  const ref = useRef();
  const [canva, setCanva] = useState(false);
  const handleChange = (e, item) => {
    const ele = item.name;
    setFormData((prev) => ({ ...prev, [ele]: e }));
  };

  // console.log(item, data[item.name])

  function generateRandomNumber(length) {
    let randomNumber = "";
    // if(length === 12) randomNumber = 'e'
    for (let i = 0; i < length; i++) {
      randomNumber += Math.floor(Math.random() * 10);
    }
    // console.log(randomNumber, length)
    return randomNumber;
  }

  const handleGenerate = (ee, e) => {
    ee.preventDefault();
    // console.log('first')
    if (e === "cyril")
      setFormData((prev) => ({ ...prev, [e]: generateRandomNumber(8) }));
    if (e === "barcode")
      setFormData((prev) => ({ ...prev, [e]: generateRandomNumber(12) }));
    // console.log(data)
  };

  const handlePrint = () => {
    print({
      printable: document.querySelector("#barcode").toDataURL(),
      type: "image",
      imageStyle: "width:50%",
    });
  };

  // console.log(required , required.length , required.map(ele => ele.includes(item.name))[0], item.name);

  useEffect(() => {
    // if (data["barcode"].length >= 12) return
    let err = { ...errors };
    if (data["barcode"] && data["barcode"].length >= 12) {
      try {
        // console.log('barcode')
        setCanva(true);
        let canvas = bwipjs.toCanvas("barcode", {
          bcid: "ean13",
          text: data["barcode"],
          scale: 2,
          height: 6,
          includetext: true,
          textxalign: "center",
        });
      } catch (e) {
        // console.log(e)
        err = {
          ...err,
          [item.name]: {
            title: item.name,
            message: "لا يمكن ادخال اكثر من 12 رقم",
          },
        };
        setErrors((prev) => ({ ...prev, ...err }));
      }
    }
  }, [data]);
  return (
    <div
      className={item.class ? `${item.class}` : "input-group"}
      style={item.style ? item.style : {}}
    >
      <label>
        <span>
          {t(item.title)}{" "}
          {(disabled && disabled.length && disabled.includes(item.name)) ||
          item.disable ? (
            ""
          ) : (
            <span style={{ color: "red" }}>
              {required &&
              required.length &&
              required.includes(`${item.name}.required`)
                ? "*"
                : item.required
                ? "*"
                : ""}
            </span>
          )}
        </span>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems:
              item.name === "barcode" || item.name === "cyril"
                ? "flex-start"
                : "center",
            justifyContent:
              item.name === "barcode" || item.name === "cyril"
                ? "flex-start"
                : "center",
            gap: "30px",
          }}
          className={inputClass ? inputClass : ""}
        >
          <input
            type={item.type}
            // type="year"
            placeholder={item.placeholder ? t(item.placeholder) : t(item.title)}
            value={data[item.name] ? data[item.name] : ""}
            disabled={
              (disabled && disabled.length && disabled.includes(item.name)) ||
              item.disable
                ? true
                : false
            }
            style={{
              width:
                item.name === "cyril" || item.name === "barcode"
                  ? "50%"
                  : "100%",
            }}
            onChange={(e) => handleChange(e.target.value, item)}
          />
          {item.name === "barcode" ? (
            <>
              <button
                className="genBtn"
                onClick={(event) => handleGenerate(event, item.name)}
                type="button"
              >
                {t("genBarcode")}
              </button>
              <canvas
                id="barcode"
                ref={ref}
                onClick={handlePrint}
                style={{ height: "50px" }}
              />
            </>
          ) : null}
          {item.name === "cyril" ? (
            <button
              className="genBtn"
              onClick={(event) => handleGenerate(event, item.name)}
            >
              {t("genSerial")}
            </button>
          ) : null}
        </div>
      </label>
      <span
        style={{
          visibility: errors[item.name] ? "visible" : "hidden",
          color: "red",
          // padding: "13px",
        }}
      >
        {errors[item.name] ? errors[item.name].message : ""}
      </span>
    </div>
  );
};

export const TextareaInput = ({
  item,
  data,
  errors,
  disabled,
  setFormData,
}) => {
  const [expand, setExpand] = useState(!item.expand ? item.expand : true);
  const { t, i18n } = useTranslation();
  const handleChange = (e, item) => {
    const ele = item.name;
    setFormData((prev) => ({ ...prev, [ele]: e }));
  };

  return (
    <div className="input-group textarea" style={item.style ? item.style : {}}>
      <label>
        {!item.expand && (
          <div className="expand" onClick={() => setExpand(!expand)}>
            <span>{t(item.title)}</span>
            <AiOutlineDown />
          </div>
        )}
        {expand && (
          <>
            <textarea
              type={item.type}
              placeholder={t(item.title)}
              value={data[item.name] ? data[item.name] : ""}
              disabled={
                (disabled && disabled.length && disabled.includes(item.name)) ||
                item.disable
                  ? true
                  : false
              }
              onChange={(e) => handleChange(e.target.value, item)}
            />
            <span
              style={{
                visibility: errors[item.name] ? "visible" : "hidden",
                color: "red",
                // padding: "13px",
              }}
            >
              {errors[item.name] ? errors[item.name].message : ""}
            </span>
          </>
        )}
      </label>
    </div>
  );
};

export const SelectInput = ({
  item,
  data,
  errors,
  setFormData,
  setDetail,
  inputClass,
  // loading,
  // api,
  setLoading,
  disabled,
  setDisabled,
  custom,
}) => {
  const { token } = useToken();
  const { t, i18n } = useTranslation();
  const [loader, setLoader] = useState(false)
  // console.log(data[item.name], item, data)
  const renderOption = (option, data, sn) => {

    return (
      <button
        // onClick={handleClick}
        // tabIndex="-1"
        // type="button"
        className="select-search-option"
        {...option}
      >
        <span style={{textTransform: 'capitalize'}}>{data.name_en || data.en_name}</span>
        <span>{data.name}</span>
      </button>
    );
  };

  // console.log(item.options)


  const handleChange = async (e, item) => {
    // console.log(e)
    const ele = item.name;
    // console.log(e, ele)
    if (typeof e === "object") {
      console.log("ee" , e)
      setFormData((prev) => ({
        ...prev,
        [ele]: e,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [ele]: e  }));
    }
    if (item.details) {
      setLoading(true)
      if (custom && custom.length) {
        // setLoader(true);
        
        getOptions2(e, custom[0], custom[1], token).then((res) => {
          setLoading(false);
          console.log(res[0])
          setDetail(res[0]);
          // setLoading(true)
          // console.log(res);
        });
      }
      // console.log(lo)
    }
    if (item.action) {
      console.log(e)
      let disabledNew = [];
      if (e !== "bank" && e !== "cheque" && e!== '0') {
        disabledNew.push(...item.action);
      } else {
        disabledNew = disabledNew.filter((ele) => !item.action.includes(ele));
      }
      setDisabled(disabledNew);
    }
  };

  return (
    <div
      className={item.class ? `${item.class}` : "input-group"}
      style={item.style ? item.style : {}}
    >
      <label>
        <span>
          {t(item.title)}{" "}
          {(disabled && disabled.length && disabled.includes(item.name)) ||
          item.disable ? (
            ""
          ) : (
            <span style={{ color: "red" }}>{item.required ? "*" : ""}</span>
          )}
        </span>
        {/* <Select
          options={item.options}
          onChange={(e) => handleChange(e, item)}
          placeholder={item.placeholder ? item.placeholder : item.title}
          isDisabled={
            (disabled && disabled.length && disabled.includes(item.name)) ||
            item.disable
              ? true
              : false
          }


        /> */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "30px",
            position: "relative",
          }}
          className={inputClass ? inputClass : ""}
        >
          <SelectSearch
            getOptions={item.getOptions ? item.getOptions : null}
            search={true}
            options={item.options}
            renderOption={renderOption}
            // className={''}
            value={data[item.name] ? data[item.name] : "0"}
            // name="language"
            placeholder={item.placeholder ? t(item.placeholder) : t(item.title)}
            onChange={(e) => handleChange(e, item)}
            disabled={
              (disabled && disabled.length && disabled.includes(item.name)) ||
              item.disable
                ? true
                : false
            }
          />
          <AiOutlineDown
            style={{
              left: i18n.language === "ar" ? "10px" : "unset",
              right: i18n.language === "en" ? "10px" : "unset",
            }}
          />
        </div>
      </label>
      <span
        style={{
          visibility: errors[item.name] ? "visible" : "hidden",
          color: "red",
          // padding: '13px'
        }}
      >
        {errors[item.name] ? errors[item.name].message : ""}
      </span>
    </div>
  );
};



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

// export default function MultipleSelect({
//   item,
//   data,
//   errors,
//   setFormData,
//   setDetail,
//   inputClass,
//   // loading,
//   // api,
//   setLoading,
//   disabled,
//   setDisabled,
//   custom,
// }) {
//   const theme = useTheme();
//   const [personName, setPersonName] = useState([]);
//   const {t} = useTranslation()
//   const [state, setState] = useState('')

//   // console.log(item.options, data[item.name])
//   const handleChange = (event) => {
//     const {
//       target: { value },
//     } = event;

//     let newArr = [];

//     // Check if "all" option is selected
//     if (value.includes("all")) {
//       newArr = item.options.map((name) => name.value);
//       setState('all')
//     } else if (value.includes("")) {
//       // Check if "Clear All" option is selected
//       setState('')
//       newArr = [];
//     } else {
//       newArr = [...value];
//     }

//     // console.log(newArr.length, item.options.length)
//     setFormData((prev) => ({ ...prev, [item.name]: newArr.length === item.options.length ? [0] : newArr }));
//     setPersonName(typeof newArr === "string" ? newArr.split(",") : newArr);
//   };

//   useEffect(() => {
//     if(data[item.name]) {
//       let arr = []
//       item.options.map(ele => {
//         if(data[item.name].includes(ele.value)){
//           arr.push(ele.value)
//         }
//       })
//       setPersonName(arr)
//     }
//   }, [data])

//   console.log(data, personName)

//   return (
//     <div>
//       <FormControl sx={{ m: 1, width: "100%" , direction: 'rtl'}} >
//         <InputLabel id="demo-multiple-name-label">{t(item.title)}</InputLabel>
//         <SSelect
//           labelId="demo-multiple-name-label"
//           id="demo-multiple-name"
//           multiple
//           value={personName}
//           onChange={handleChange}
//           input={<OutlinedInput label={t(item.title)} />}
//           MenuProps={MenuProps}
//         >
//           {state !== 'all' ? <MenuItem value="all" style={getStyles("All", personName, theme)}>
//             {t("Select All")}
//           </MenuItem> : 
//           <MenuItem value="" style={getStyles("None", personName, theme)}>
//             {t("Clear All")}
//           </MenuItem>}
//           {item.options.map((name) => (
//             <MenuItem
//               key={name.value}
//               value={name.value}
//               style={getStyles(name.name, personName, theme)}
//             >
//               {name.name}
//             </MenuItem>
//           ))}
//         </SSelect>
//       </FormControl>
//     </div>
//   );
// }

export default function MultipleSelect({
  item,
  data,
  setFormData,
  setDetail,
  inputClass,
  setLoading,
  disabled,
  setDisabled,
  custom,
}) {
  const theme = useTheme();
  const [personName, setPersonName] = useState([]);
  const { t } = useTranslation();
  const [state, setState] = useState("");

  console.log(data[item.name], data["branche_id"], "kjkjk");

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    let selectedValues = [];

    console.log(event)

    if (value.includes("all")) {
      selectedValues = item.options.map((name) => name.value);
      setState("all");
    } else if (value.includes("")) {
      setState("");
    } else {
      selectedValues = [...value];
    }

    setFormData((prev) => ({
      ...prev,
      [item.name]:
        selectedValues.length === item.options.length ? [0] : selectedValues,
    }));

    // console.log()
    setPersonName(
      typeof selectedValues === "string"
        ? selectedValues.split(",")
        : selectedValues
    );
  };

  useEffect(() => {
    if (data[item.name]?.length && !data[item.name].includes(0)) {
      const selectedOptions = item.options.filter((ele) =>
        data[item.name].includes(ele.value)
      );
      setPersonName(selectedOptions.map((option) => option.value));
    }
  }, [data]);

  console.log(data, personName);

  return (
    <div>
      <FormControl sx={{ m: 1, width: "100%", direction: "rtl" }}>
        <InputLabel id="demo-multiple-name-label">{t(item.title)}</InputLabel>
        <SSelect
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label={t(item.title)} />}
          MenuProps={MenuProps}
          //disabled={disabled}
        >
          {(state !== "all" && personName.length === 0) ? (
            <MenuItem value="all" style={getStyles("All", personName, theme)}>
              {t("Select All")}
            </MenuItem>
          ) : (
            <MenuItem value="" style={getStyles("None", personName, theme)}>
              {t("Clear All")}
            </MenuItem>
          )}
          {item.options.map((name) => (
            <MenuItem
              key={name.value}
              value={name.value}
              style={getStyles(name.name, personName, theme)}
            >
              {name.name}
            </MenuItem>
          ))}
        </SSelect>
      </FormControl>
    </div>
  );
}


export const RadioInput = ({
  item,
  data,
  errors,
  disabled,
  setDisabled,
  setFormData,
}) => {
  let ele = item.name;
  const { t, i18n } = useTranslation();
  console.log(data[item.name], item.name, item.action)
  const handleRadio = (actions, ele, e) => {
    setFormData((prev) => ({
      ...prev,
      [ele]: e.action,
    }));
    // console.log(data[item.name],e.action, e, ele);
    if(actions) {
      let disabledNew = [...disabled];

      if (e.action === 0) {
        // console.log(e, actions);
        disabledNew.push(...actions);
      } else  {
        // console.log(e, actions);
        disabledNew = disabledNew.filter((item) => !actions.includes(item));
        // console.log(disabledNew)
      }
      setDisabled(disabledNew);
    }
  };
  return (
    <div className="input-group-radio" style={item.style ? item.style : {}}>
      <div>
        <span>{t(item.title)}</span>
        <div className="radioGroup">
          {item.info.map((e) => {
            const action = item.action;
            {/* console.log(action, "action", e.action === data[item.name], e, data[item.name]); */}
            return (
              <label key={e.name} style={{ cursor: "pointer" }}>
                <span>{t(e.name)}</span>
                <input
                  style={{ cursor: "pointer" }}
                  type={item.type}
                  name={item.name}
                  checked={ e.action === data[item.name] }
                  onChange={() => handleRadio(action, ele, e)}
                />
              </label>
            );
          })}
        </div>
        <span
          style={{
            visibility: errors[item.title] ? "visible" : "hidden",
            color: "red",
            // padding: "13px",
          }}
        >
          {errors[item.title] ? errors[item.title].message : ""}
        </span>
      </div>
    </div>
  );
};

export const FileInput = ({ item, errors, data, setFormData, setErrors }) => {
  const [expand, setExpand] = useState(item.expand && item.expand === false ? item.expand : true);
  const [activeFile, setActiveFile] = useState(false);
  const [res, setRes] = useState(null);
  const { t, i18n } = useTranslation();
  const handleFileChange = (fileSrc, e) => {
    e.preventDefault();
    setActiveFile(false);
    // console.log(errors)
    // console.log(e)
    // console.log( fileSrc)
    let err = { ...errors };
    const file = fileSrc;
    const fileExt = file.name.split(".").pop().toLowerCase();
    // const fileExt = false
    if (
      fileExt === "jpg" ||
      fileExt === "jpeg" ||
      fileExt === "gif" ||
      fileExt === "png"
    ) {
      delete err[item.name];
      // setErrors(prev => delete prev.item.name)
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(",")[1];
        setRes({ res: reader.result, width: "50%" });
        // console.log(base64);
      };
    } else if (fileExt === "pdf") {
      delete err[item.name];
      setRes({ res: pdf, width: "100px" });
    } else if (fileExt === "doc" || fileExt === "docx" || fileExt === "rtf") {
      delete err[item.name];
      setRes({ res: doc, width: "100px" });
    } else if (fileExt === "xls" || fileExt === "xlsx" || fileExt === "csv") {
      delete err[item.name];
      setRes({ res: excel, width: "100px" });
    } else {
      setRes(null);
      err[item.name] = { title: item.name, message: "صيغة غير مدعومة" };
      setErrors((prev) => ({ ...prev, ...err }));
      // return
    }
    // setErrors({});
    setFormData((prev) => ({ ...prev, [item.name]: file }));
    // console.log(err)
    // console.log(data)
  };

  // console.log(data[item.name])

  useEffect(() => {
    if(data[item.name]){
      // console.log(data[item.name])
      let url;
      let newSrc;
      if(typeof data[item.name] === 'string') {
        url = data[item.name].split(".").pop().toLowerCase();
      } else {
        newSrc = data[item.name]
        url = data[item.name].name.split(".").pop().toLowerCase();
      }
      if (
        url === "jpg" ||
        url === "jpeg" ||
        url === "gif" ||
        url === "png"
      ) {
        if(!newSrc) {
          setRes({
            res: `https://einvoice.nozzm.com/${data[item.name]}`,
            width: "50%",
          });
        } else {

          const reader = new FileReader();
          reader.readAsDataURL(newSrc);
          reader.onload = () => {
            const base64 = reader.result.split(",")[1];
            setRes({ res: reader.result, width: "50%" });
            // console.log(base64);
        }
        // delete err[item.name];
        // setErrors(prev => delete prev.item.name)

        }
      } else if (url === "pdf") {
        // delete err[item.name];
        setRes({ res: pdf, width: "100px" });
      } else if (url === "doc" || url === "docx" || url === "rtf") {
        // delete err[item.name];
        setRes({ res: doc, width: "100px" });
      } else if (url === "xls" || url === "xlsx" || url === "csv") {
        // delete err[item.name];
        setRes({ res: excel, width: "100px" });
      } 
      // else {
      //   setRes(null);
      //   err[item.name] = { title: item.name, message: "صيغة غير مدعومة" };
      //   setErrors((prev) => ({ ...prev, ...err }));
      //   // return
      // }
      
      // const newObj = {...data}
      // delete newObj[item.name]
      // setFormData(prev => ({...prev, ...newObj}))
      // console.log(data)
    }
  }, [data])

  return (
    <div
      className={
        errors[item.name] ? "input-group-file-error" : `input-group-file ${item.class}`
      }
      style={item.style ? item.style : null}
    >
      {!item.expand && (
        <div className="expand" onClick={() => setExpand(!expand)}>
          <span>{t(item.title)}</span>
          <AiOutlineDown />
        </div>
      )}
      {expand && (
        <div
          className={activeFile ? "file-input-active" : "file-input"}
          onDragOver={(e) => {
            e.preventDefault();
            setActiveFile(true);
          }}
          onDragEnter={() => {
            setActiveFile(true);
          }}
          onDragLeave={() => {
            setActiveFile(false);
          }}
          onDrop={(e) => handleFileChange(e.dataTransfer.files[0], e)}
        >
          <span>{t('dropFile')}</span>
          {!res && <span>{t('or')}</span>}
          {res  && <img src={res.res} width={res.width} />}
          <label style={{ alignItems: "center", direction: i18n.language === 'ar' ? 'ltr': 'rtl' }}>
            <input
              type="file"
              onChange={(e) => handleFileChange(e.target.files[0], e)}
              style={{ display: "none" }}
            />
            <div className="fileInput">
              <span className="button">{t('choose')}</span>
              <span className="file">
                {data[item.name] ? data[item.name].name : t('YDCFile')}
              </span>
            </div>
            <span style={{ marginTop: "10px" }}>
              {t('supported')} (.jpg, .jpeg, .png, .pdf, .doc, .docx, .xls,
              .csv)
            </span>
            <span
              style={{
                visibility: errors[item.name] ? "visible" : "hidden",
                color: "red",
                // padding: "13px",
              }}
            >
              {errors[item.name] ? errors[item.name].message : ""}
            </span>
          </label>
        </div>
      )}
    </div>
  );
};

export const TableInput = ({
  className,
  item,
  details,
  nestedData,
  disabled,
  total,
  bVat,
  setNestedData,
  tax,
  setBVat,
  setTax,
  nestedError,
  setNestedError,
  info,
  modalData,
  setTotal,
  detail,
  note,
  custom2,
  errors, 
  setErrors
}) => {
  const { t, i18n } = useTranslation();
  // console.log(first)
  
  useEffect(() => {
    // console.log('total')
    let obj = {};
    let totalBtax = 0;
    let totalBbtax = 0;
    let totalBbbtax = 0;

    for (let key in bVat) {
      totalBbtax += Number(bVat[key].bbTax);
      totalBtax += Number(bVat[key].bTax);
      totalBbbtax += Number(bVat[key].bbbTax);
    }
    obj = {
      totalBtax: Number(totalBtax.toFixed(2)),
      totalBbtax: Number(totalBbtax.toFixed(2)),
      totalBbbtax: Number(totalBbbtax.toFixed(2)),
    };
    setTotal({ ...obj });
  }, [bVat]);
  const { token } = useToken();
  const handleChangeNest = async (e, i, name, ele) => {
    const newData = [...nestedData];
    newData[i][name] = e;
    console.log(tax, newData);

    setNestedData(newData);
    if (note && note === "sales") {
      if (ele.details) {
        let vat = { ...tax };
        let b = { ...bVat };
        // console.log(name)
        if (name === "product") {

          if (custom2) {
            // console.log(custom2)
            getOptions2(e, custom2[0], custom2[1], token)
              .then((res) => {
                // console.log(res[0], 'from purch');
                vat = {
                  ...vat,
                  [nestedData[i].product]: {
                    result:
                      Object.keys(detail).length &&
                      detail.hasOwnProperty("taxes_unable") &&
                      detail["tax_card"] !== null
                        ? res[0].vat
                        : 0,
                  },
                };

                nestedData[i]["taxes"] = [{tax: res[0].vat}];

                if (nestedData[i].hasOwnProperty("piece_price")) {
                  // console.log(nestedData, 'nes')
                  res[0].purchaseprice
                    ? (nestedData[i]["piece_price"] = res[0].purchaseprice)
                    : (nestedData[i]["piece_price"] = "");
                }
                b = {
                  ...b,
                  [nestedData[i].product]: {
                    bTax:
                      (Number(nestedData[i].piece_price) -
                        Number(nestedData[i].discount)) *
                      Number(nestedData[i].quantity),
                    bbTax:
                      (Number(nestedData[i].piece_price) -
                        Number(nestedData[i].discount)) *
                      Number(nestedData[i].quantity) *
                      (Number(
                        Object.keys(detail).length &&
                          detail.hasOwnProperty("taxes_unable") &&
                          detail["tax_card"] !== null
                          ? res[0].vat
                          : 0
                      ) /
                        100),

                    bbbTax:
                      (Number(nestedData[i].piece_price) -
                        Number(nestedData[i].discount)) *
                        Number(nestedData[i].quantity) +
                      (Number(nestedData[i].piece_price) -
                        Number(nestedData[i].discount)) *
                        Number(nestedData[i].quantity) *
                        (Number(
                          Object.keys(detail).length &&
                            detail.hasOwnProperty("taxes_unable") &&
                            detail["tax_card"] !== null
                            ? res[0].vat
                            : 0
                        ) /
                          100),
                  },
                };

                console.log(b)
                setBVat({ ...b });
                setTax({ ...vat });
                // console.log(b)
              })
              .catch((err) => console.log(err));
          }
        }
      }
    } else {
      if (ele.details) {
        // console.log(nestedData, 'nn')
        let vat = { ...tax };
        let b = { ...bVat };
        if (name === "product") {
          if (custom2) {
            // console.log(custom2)
            getOptions2(e, custom2[0], custom2[1], token)
              .then((res) => {
                // console.log(res);

                vat = {
                  ...vat,
                  [nestedData[i].product]: { result: res[0].vat },
                };

                nestedData[i]["taxes"] = [{ tax: res[0].vat }];

                if (nestedData[i].hasOwnProperty("piece_price")) {
                  res[0].price
                    ? (nestedData[i]["piece_price"] = res[0].price)
                    : (nestedData[i]["piece_price"] = "");
                  
                }
                b = {
                  ...b,
                  [nestedData[i].product]: {
                    bTax:
                      (Number(nestedData[i].piece_price) -
                        Number(nestedData[i].discount)) *
                      Number(nestedData[i].quantity),
                    bbTax:
                      (Number(nestedData[i].piece_price) -
                        Number(nestedData[i].discount)) *
                      Number(nestedData[i].quantity) *
                      (Number(res[0].vat) / 100),

                    bbbTax:
                      (Number(nestedData[i].piece_price) -
                        Number(nestedData[i].discount)) *
                        Number(nestedData[i].quantity) +
                      (Number(nestedData[i].piece_price) -
                        Number(nestedData[i].discount)) *
                        Number(nestedData[i].quantity) *
                        (Number(res[0].vat) / 100),
                  },

                };
                console.log(b)
                setBVat({ ...b });
                setTax({ ...vat });
              })
              .catch((err) => console.log(err));
          }
        }
      }
    }

    let err = { ...nestedError };
    // console.log(err)
    let dub;
    let unique = false;
    Object.keys(info).map((it) => {
      if (info[it].type === "group") {
        Object.keys(info[it].child).map((child) => {
          const el = info[it].child[child].find((ele) => ele.name === name);
          if (el.unique) {
            unique = true;
            dub = nestedData.find(
              (ell, ind) => Number(ell[name]) === e && ind !== i
            );
          } else {
            unique = false;
            dub = "empty";
          }
        });
      }
    });
    if (dub && unique) {
      err = {
        ...err,
        [i]: { title: name, message: "لقد اخترت هذا المنتج بالفعل" },
      };
    } else if (!dub) {
      delete err[i];
    }
    setNestedError({ ...err });
  };

  // console.log(nestedData)
  // console.log(total)

  const handleAdd = (e) => {
    let initNested = {};
    e.preventDefault();
    // console.log(e.key)
    modalData.map((ele) => {
      if (ele.type === "group") {
        ele.child.item.map((it) => {
          if (it.hasOwnProperty("value")) {
            initNested[it.name] = it.value;
          } else initNested[it.name] = "";
          // console.log(it.value)
        });
      }
    });
    setNestedData([...nestedData, { ...initNested }]);
  };



  const handleRemove = (e, index, i) => {
    // console.log(index, e)
    e.preventDefault();
    if (details) {
      let newTax = { ...tax };
      let newBvat = { ...bVat };
      let err = { ...nestedError };
      delete newBvat[index];
      delete newTax[index];
      delete err[index];
      setTax(newTax);
      setBVat(newBvat);
      setNestedError({ ...err });
      
    }
    const newData = [...nestedData];
    newData.splice(i, 1);
    setNestedData(newData);
  };
  const [modal, setModal] = useState({open: false , type: "view"});
  const [checked, setChecked] = useState(null)
  // useEffect(() => {
  //   console.log(checked)
  // }, [checked])

  // console.log(total)
  return (
    <div key={item.id} className={className ? className : "input-container"}>
      {Object.keys(item.child).map((e) => {
        return (
          <table key={e.id} className="res-table">
            <thead>
              <tr>
                {item.child[e]?.map((ele) => {
                  return (
                    <th
                      key={ele.id}
                      className="null"
                      colSpan={
                        (ele.title === "desc" ||
                          ele.title === "productName") &&
                        2
                      }
                      style={{
                        width:
                          (ele.title !== "desc" ||
                            ele.title !== "productName") &&
                          90,
                      }}
                    >
                      {t(ele.title)}
                    </th>
                  );
                })}
                {details && (
                  <>
                    <th style={{ width: 120 }} className="null">{t("prieceB")}</th>
                    <th style={{ width: 70 }} className="null">{t("vatRate")}</th>
                    <th style={{ width: 120 }} className="null">{t("vatPrice")}</th>
                    <th style={{ width: 120 }} className="null">{t("totalA")}</th>
                  </>
                )}
                <th style={{ width: 50 }} className="null">{t('action')}</th>
              </tr>
            </thead>
            <tbody>
              {nestedData &&
                nestedData.map((i, index) => {
                  return (
                    <>
                      {modal.open && (
                        <>
                       <AddReason
                         setModal={setModal}
                          setDataa={setNestedData}
                          nestedData={nestedData}
                          index={checked}
                       />

</>
                      )}
                      <tr key={index}>
                        {item.child[e]?.map((ele, x) => {
                          if (ele.type === "select") {
                            const renderOption = (option, data, sn) => {
                              {
                                // /* console.log(data); */
                              }

                              return (
                                <button
                                  // onClick={handleClick}
                                  // tabIndex="-1"
                                  // type="button"
                                  className="select-search-option"
                                  {...option}
                                >
                                  <span style={{ textTransform: "capitalize" }}>
                                    {data.name_en || data.en_name}
                                  </span>
                                  <span>{data.name}</span>
                                </button>
                              );
                            };
                            return (
                              <>
                                  <td
                                key={ele.id}
                                colSpan={
                                  (ele.title === "desc" ||
                                    ele.title === "productName") &&
                                  2
                                }
                                style={{
                                  width:
                                    (ele.title === "desc" ||
                                      ele.title === "productName") &&
                                    100,
                                }}
                              >
                                <div className="input-group tables">
                                  <label>
                                    <span>
                                      {t(ele.title)}
                                      {/* {ele.required ? (
                                        <span style={{ color: "red" }}>*</span>
                                      ) : null} */}
                                    </span>
                                    {/* {ele.required ? (
                                      <span
                                      className="star"
                                        style={{
                                          color: "red",
                                          display: "block",
                                        }}
                                      >
                                        *
                                      </span>
                                    ) : null} */}
                                    <SelectSearch
                                      getOptions={
                                        ele.getOptions ? ele.getOptions : null
                                      }
                                      renderOption={renderOption}
                                      disabled={
                                        disabled &&
                                        disabled.length &&
                                        disabled.includes(ele.name)
                                          ? true
                                          : false
                                      }
                                      search={true}
                                      options={ele.options}
                                      value={
                                        nestedData &&
                                        nestedData[index] &&
                                        nestedData[index][`${ele.name}`]
                                          ? nestedData[index][`${ele.name}`]
                                          : ""
                                      }
                                      name={ele.name}
                                      placeholder={
                                        ele.placeholder
                                          ? t(ele.placeholder)
                                          : t(ele.title)
                                      }
                                      onChange={(ev) =>
                                        handleChangeNest(
                                          ev,
                                          index,
                                          ele.name,
                                          ele
                                        )
                                      }
                                      
                                    />
                                    <AiOutlineDown
                                      style={{
                                        left:
                                          i18n.language === "ar"
                                            ? "10px"
                                            : "unset",
                                        right:
                                          i18n.language === "en"
                                            ? "10px"
                                            : "unset",
                                      }}
                                    />
                      {/* {ele.name === "product"?<button className="add-btn"
                      onClick={() => setModal({ open: true, type: "add" })}
                      
                      >

                           +
                      </button> : ""} */}

                                  </label>
                                </div>
                                <span
                                  style={{
                                    visibility:
                                      Object.keys(nestedError).length &&
                                      nestedError[index] &&
                                      nestedError[index]["title"] === ele.name
                                        ? "visible"
                                        : "hidden",
                                    color: "red",
                                    // padding: '13px'
                                  }}
                                >
                                  {Object.keys(nestedError).length &&
                                  nestedError[index] &&
                                  nestedError[index]["title"] === ele.name
                                    ? nestedError[index].message
                                    : ""}
                                </span>
                                

                              </td>
                              
                              </>
                          
                            );
                          } 
                          else if (ele.name === "discount") {
                            return (
                              <td
                                key={ele.id}
                                colSpan={
                                  (ele.title === "desc" ||
                                    ele.title === "productName") &&
                                  2
                                }
                                style={{
                                  width:
                                    (ele.title === "desc" ||
                                      ele.title === "productName") &&
                                    90,
                                }}
                              >
                                <div className="input-group tables">
                                  <label>
                                    <span>
                                      {t(ele.title)}
                                     
                                    </span>
                                 
                                    <input
                                      type={ele.type}
                                      placeholder={t(ele.title)}
                                      value={
                                        nestedData && nestedData[index]
                                          ? nestedData[index][`${ele.name}`]
                                          : ""
                                      }
                                      disabled={
                                        disabled &&
                                        disabled.length &&
                                        disabled.includes(ele.name)
                                          ? true
                                          : false
                                      }
                                      onClick={() => {
                                        setChecked(index);

                                        if (!checked || !checked[index]) {
                                          setModal({ open: true });
                                        }
                                      }}
                                      checked={checked?.index}
                                  
                                    />
                                  </label>
                                  <span
                                    style={{
                                      visibility:
                                        Object.keys(nestedError).length &&
                                        nestedError[index] &&
                                        nestedError[index]["title"] === ele.name
                                          ? "visible"
                                          : "hidden",
                                      color: "red",
                                      // padding: '13px'
                                    }}
                                  >
                                    {Object.keys(nestedError).length &&
                                    nestedError[index] &&
                                    nestedError[index]["title"] === ele.name
                                      ? nestedError[index].message
                                      : ""}
                                  </span>
                                </div>
                              </td>
                            );
                          } else {
                            return (
                              <td
                                key={ele.id}
                                colSpan={
                                  (ele.title === "desc" ||
                                    ele.title === "productName") &&
                                  2
                                }
                                style={{
                                  width:
                                    (ele.title === "desc" ||
                                      ele.title === "productName") &&
                                    90,
                                }}
                              >
                                <div className="input-group tables">
                                  <label>
                                    <span>
                                      {t(ele.title)}
                                      {/* {ele.required ? (
                                        <span style={{ color: "red" }}>*</span>
                                      ) : null} */}
                                    </span>
                                    {/* {ele.required ? (
                                      <span
                                        style={{
                                          color: "red",
                                          display: "block",
                                        }}
                                        className="star"
                                      >
                                        *
                                      </span>
                                    ) : null} */}
                                    <input
                                      type={ele.type}
                                      placeholder={t(ele.title)}
                                      value={
                                        nestedData && nestedData[index]
                                          ? nestedData[index][`${ele.name}`]
                                          : ""
                                      }
                                      disabled={
                                        disabled &&
                                        disabled.length &&
                                        disabled.includes(ele.name)
                                          ? true
                                          : false
                                      }
                                      onChange={(ev) =>
                                        handleChangeNest(
                                          ev.target.value,
                                          index,
                                          ele.name,
                                          ele
                                        )
                                      }
                                    />
                                  </label>
                                  <span
                                    style={{
                                      visibility:
                                        Object.keys(nestedError).length &&
                                        nestedError[index] &&
                                        nestedError[index]["title"] === ele.name
                                          ? "visible"
                                          : "hidden",
                                      color: "red",
                                      // padding: '13px'
                                    }}
                                  >
                                    {Object.keys(nestedError).length &&
                                    nestedError[index] &&
                                    nestedError[index]["title"] === ele.name
                                      ? nestedError[index].message
                                      : ""}
                                  </span>
                                </div>
                              </td>
                            );
                          }
                        })}
                        {details && (
                          <>
                            <td style={{ width: 120 }}>
                              <div className="input-group tables">
                                <label>
                                  <span>{t("prieceB")}</span>
                                  <input
                                    value={
                                      bVat && bVat[nestedData[index].product]
                                        ? bVat[
                                            nestedData[index].product
                                          ].bTax.toFixed(2)
                                        : ""
                                    }
                                    disabled
                                  />
                                </label>
                              </div>
                            </td>
                            <td style={{ width: 70 }}>
                              <div className="input-group tables">
                                <label>
                                  <span>{t("vatRate")}</span>
                                  <input
                                    value={
                                      tax[nestedData[index].product]
                                        ? `${
                                            tax[nestedData[index].product]
                                              .result
                                          } %`
                                        : ""
                                    }
                                    disabled
                                  />
                                </label>
                              </div>
                            </td>
                            <td style={{ width: 120 }}>
                              <div className="input-group tables">
                                <label>
                                  <span>{t("vatPrice")}</span>
                                  <input
                                    value={
                                      bVat && bVat[nestedData[index].product]
                                        ? bVat[
                                            nestedData[index].product
                                          ].bbTax.toFixed(2)
                                        : ""
                                    }
                                    disabled
                                  />
                                </label>
                              </div>
                            </td>

                            <td style={{ width: 120 }}>
                              <div className="input-group tables">
                                <label>
                                  <span>{t("totalA")}</span>
                                  <input
                                    value={
                                      bVat && bVat[nestedData[index].product]
                                        ? bVat[
                                            nestedData[index].product
                                          ].bbbTax.toFixed(2)
                                        : ""
                                    }
                                    disabled
                                  />
                                </label>
                              </div>
                            </td>
                          </>
                        )}
                        {nestedData && nestedData.length > 1 && (
                          <>
                            <td style={{ width: 50 }}>
                              {/* <div className="input-group"> */}
                              {/* <label id="action"> */}
                              {/* <input
                                              className="delete-btn"
                                              onClick={(ev) =>
                                                handleRemove(ev, index, item, e)
                                              }
                                              type="button"
                                              value={"الحذف"}
                                            /> */}
                              {disabled && disabled.length <= 0 && (
                                <div className="trash">
                                  <BsFillTrashFill
                                    onClick={(ev) =>
                                      handleRemove(
                                        ev,
                                        nestedData[index].product,
                                        index,
                                        e
                                      )
                                    }
                                  />
                                </div>
                              )}
                              {/* </label> */}
                              {/* </div> */}
                            </td>
                            {/* <hr className="hr" /> */}
                          </>
                        )}
                      </tr>
                      {Object.keys(errors).length && errors[index] ? (
                        <span style={{ color: "red" }}>
                          {errors[index].message}
                        </span>
                      ) : null}
                    </>
                  );
                })}
              {details && total && (
                <tr className="last">
                  <td>{t('total')}</td>
                  <td colSpan={6}></td>
                  {/* .filter((key) => key.startsWith("totalB")) */}
                  {total && (
                    <>
                      <td>{total.totalBtax}</td>
                      <td></td>
                      <td>{total.totalBbtax}</td>
                      <td>{total.totalBbbtax}</td>
                    </>
                  )}
                </tr>
              )}
            </tbody>
          </table>
        );
      })}
      {disabled && disabled.length <= 0 && (
        <button className="add-btn" type="button" onClick={(e) => handleAdd(e, item)}>
          +
        </button>
      )}
    </div>
  );
};

export const CheckInput = ({
  item,
  data,
  errors,
  disabled,
  setDisabled,
  setFormData,
}) => {
  let ele = item.name;
  const { t, i18n } = useTranslation();
  const [checked, setChecked] = useState([])
  const handleCheck = () => {
    console.log(item, data[item.name])
  }

  useEffect(() => {
    const initChecked = [...checked]
    console.log(item, data)
    Object.keys(data).map(item => {
      // console.log(item)
      if(item === 'on') {
        
        // initChecked.push(data[item])
      }
    })
  }, [])

  return (
    <div className="input-group-radio" style={item.style ? item.style : {}}>
      <div>
        <span>{t(item.title)}</span>
        <div className="radioGroup">
          <div
            className={checked ? "checked" : "not-checked"}
            onClick={handleCheck}
          >
            vbvcncnc
          </div>
        </div>
        <span
          style={{
            visibility: errors[item.title] ? "visible" : "hidden",
            color: "red",
            // padding: "13px",
          }}
        >
          {errors[item.title] ? errors[item.title].message : ""}
        </span>
      </div>
    </div>
  );
};

