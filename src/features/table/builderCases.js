export const fetchPend = (state) => {
  state.loading = true;
};

export const fetchFulfilled = (state, action) => {
  state.loading = false;
  state.data = action.payload.data;
  state.perPage = action.payload.per_page
  state.to = action.payload.to
  state.total = action.payload.total
  state.error = "";
};

export const fetchRejected = (state, action) => {
  state.loading = false;
  state.data = [];
  state.error = action.error.message;
};

export const postPend = (state) => {
  state.postLoad = true;
};

export const postFulfilled = (state, action) => {
  // console.log(action);
  state.postLoad = false;
  state.data.unshift({ ...action.meta.arg.body, id: state.data.length + 1 });
  state.error = "";
};

export const postRejected = (state, action) => {
  
  state.postLoad = false;
  state.error = action.error.message;
};

export const updatePend = (state) => {
  state.postLoad = true;
};

export const updateFulfilled = (state, action) => {
  state.postLoad = false;

  const index = state.data.findIndex((item) => item.id === action.meta.arg.id);
  if (index !== -1) {
    state.data = [
      ...state.data.slice(0, index),
      { ...state.data[index], ...action.meta.arg.body },
      ...state.data.slice(index + 1)
      ,
    ];
  console.log("satateee" , state.data )

  }

  state.error = "";
}

export const updateRejected = (state, action) => {
  // console.log(action.error.message);
  state.postLoad = false;
  state.data;
  state.error = action.error.message;
};

export const clearError = (state) => {
  state.error = "";
};