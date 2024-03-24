export const handleBodyData = (data, exludeData=null, info, nestedData) => {
  const body = { ...data };
  if (exludeData) {
    const additional_data = [];
    exludeData.map((e) => additional_data.push({ name: e, value: data[e] ? data[e] : '' }));
    exludeData.map((e) => delete data[e]);
    body.additional_data = additional_data;
  }
  
  info.map((item) => {
    if (item.type === "group") {
      body[item.name] = nestedData;
    }
  });
  return body;
};