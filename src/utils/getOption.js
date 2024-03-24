import axios from "axios";

const apiUrl = import.meta.env.VITE_APP_API;

export const getOptions = (path, output, token) => {
  console.log(output)
  return new Promise((resolve, reject) => {
    fetch(`${apiUrl}${path}`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((data) => data.json())
      .then((res) => {
        console.log(res.data);
        resolve(
          res.data[`${output}`].map((item) => {
            // console.log(item)
            if (item.ar_name)
              return {
                name: item.ar_name,
                name_en: item.en_name,
                value: item.id,
              };
            else if (item.name)
              return {
                name: item.name,

                value: item.id,
              };
            else if (output === "Taxesreason")
              return {
                name: item.name_ar,

                value: item.id,
              };
            else if (output === "taxes")
              return {
                name: item.vat === 0 ? String(item.vat) : item.vat,
                value: item.vat === 0 ? String(item.vat) : item.vat,
              };
            else if (item.name_ar)
              return {
                name: item.name_ar,
                name_en: item.name_en,
                value: item.id,
              };
          })
        );
      })
      .catch(reject);
  });
};

export const getOptions2 = (id, path, output, token) => {
  // console.log(id, path, output, token)
  return new Promise((resolve, reject) => {
    fetch(`${apiUrl}${path}`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((data) => data.json())
      .then((res) => {
        // console.log(res)
        resolve(res.data[`${output}`].filter((item) => item.id === id));
      })
      .catch(reject);
  });
};

export const getDetails = async (id, api, token) => {
  const headers= {
        Authorization: `Bearer ${token}`,
      }
  return axios.post(`${apiUrl}${api}`, { id }, { headers }).then((res) => res);
};