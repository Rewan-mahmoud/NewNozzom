import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
    value: {},
    total: '',
    totalA: ''
}

const cartSlise = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearData: (state) => {
            state.data = []
        },
        addData: (state, action) => {
            console.log(action.payload)
            const copy = [...state.data];
            copy.map((ele) => {
              if (ele.id === action.payload.id) ele.quantity++;
            });
            state.data.push({
              product: action.payload.item.id,
              quantity: action.payload.value[action.payload.item.id] ? action.payload.value[action.payload.item.id] : 1,
              piece_price: action.payload.item.price,
              id: action.payload.item.id,
              name: action.payload.item.ar_name,
              category: action.payload.item.category,
              tax: action.payload.item.vat,
            });
            state.value = { ...state.value, [action.payload.item.id]: 1 };
        },
        deleteData: (state, action) => {
            const newData = [...state.data]
            state.data = newData.filter((ele) => ele.id !== action.payload.id);
            let newVal = { ...state.value };
            delete newVal[action.payload.product];
            state.value = {...newVal}
        },
        increaseData: (state, action) => {
            const copy = [...state.data];
            copy.map((ele) => {
              if (ele.id === action.payload.id) ele.quantity++;
            });
            state.data = [...copy]
            state.value = {
              ...state.value,
              [action.payload.product]:
                Number(state.value[action.payload.product]) + 1,
            };
        },
        decreaseData: (state, action) => {
            const copy = [...state.data];
            copy.map((ele) => {
              if (ele.id === action.payload.id) ele.quantity--;
            });
            state.data = [...copy]
            state.value = {
              ...state.value,
              [action.payload.product]: Number(state.value[action.payload.product]) - 1,
            };
        },
        addDiscount: (state, action) => {
            const copy = [...state.data];
            copy.map((ele) => {
              if (ele.id === action.payload.item.id) {
                ele.discount = Number(action.payload.e);
              }
            }); 
        },
        calcTotal: (state, ) => {
            let counter = [];
            let counter2 = [];
            for (let i = 0; i < state.data.length; i++) {
              counter.push(
                state.data[i].piece_price * state.data[i].quantity -
                  (state.data[i].discount ? state.data[i].discount : 0)
              );
              counter2.push(
                state.data[i].piece_price *
                  (1 + state.data[i].tax / 100) *
                  state.data[i].quantity -
                  (state.data[i].discount ? state.data[i].discount : 0)
              );
            }

            const total = counter.reduce((a, b) => {
              if (a && b) {
                a + b;
              }
              return a + b;
            });
            const total2 = counter2.reduce((a, b) => {
              if (a && b) {
                a + b;
              }
              return a + b;
            });
            // setData((prev) => ({ ...prev, items: state.data }));
            state.total = total.toFixed(2);
            state.totalA = total2.toFixed(2);
        }
    }
})

export default cartSlise.reducer
export const {addData, deleteData, increaseData, decreaseData, addDiscount, clearData, calcTotal} = cartSlise.actions