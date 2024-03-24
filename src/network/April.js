export const April = async (
  api,
  method,
  Accept,
  Authorization,
  body = null
) => {
  const options = {
    method,
    headers: {
      // Accept: "*/*",
      // "Content-Type": Accept,
      Authorization,
    },
  };
  // if (body !== null) {
  //   const form = new FormData();
  //   Object.keys(body).forEach((key) => {
  //     form.append(key, body[key]);
  //   });
  //   options.body = form;
  // }
  if (body !== null) options.body = JSON.stringify(body);

  const res = await fetch(`${api}`, options);
  const data = await res.json();
  if (!data || !data.success) throw new Error("Something wrong happened");
  return data;
};
