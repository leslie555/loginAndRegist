// import modelExtend from 'dva-model-extend';

export const commonModel = {
  reducers: {
    updateState(state, { payload }) {
      for (let i in payload) {
        if (payload[i] !== state[i]) {
          return { ...state, ...payload };
        }
      }
      return state;
    },
    replace(state, { payload }) {
      return payload;
    },
    // addArrayItems(state, { payload }) {
    //   if (payload.length === 0) return state;
    //   return state.concat(payload);
    // },
    addArrayItem(state, { payload }) {
      let newState;
      // if (payload instanceof Array) {
      //   if (payload.length === 0) return state;
      //   else newState = state.concat(payload);
      // } else {
      newState = state;
      if (!(newState instanceof Array)) newState = [];
      else newState=[...newState];
      newState.push(payload);
      return newState;
    },
    // delArrayItemById(state, { payload: { id } }) {
    //   for (const i in state) {
    //     if (state[i].id == id) {
    //       state.splice(i, 1);
    //     }
    //   }
    //   return [...state];
    // },

  },
};

// const pageModel = modelExtend(commonModel, {

//   state: {
//     list: [],
//     pagination: {
//       showSizeChanger: true,
//       showQuickJumper: true,
//       showTotal: total => `Total ${total} Items`,
//       current: 1,
//       total: 0,
//     },
//   },

//   reducers: {
//     querySuccess (state, { payload }) {
//       const { list, pagination } = payload
//       return {
//         ...state,
//         list,
//         pagination: {
//           ...state.pagination,
//           ...pagination,
//         },
//       }
//     },
//   },

// })


