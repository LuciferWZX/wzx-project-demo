import Server from '../service/goods';
export default {
  namespace: 'goods',
  state: {
    goodsData: null,
    title: "",
    colors: [],
    disabledColor: [],
    disabledSize: [],
    sizes: [],
    allMight: [],
    currentGoods: null
  },
  effects: {
    *queryGoods({ _ }, { call, put }) {
      const res = yield call(Server.QueryGoods);
      if (res.code === 200) {
        let disabledColor = [];
        let disabledSize = [];
        let allMight = res.data.skus.map((item) => {
          return { product_id: item.product_id, sku_code: item.sku_code, color: item.options[0], size: item.options[1], selling_price: item.selling_price, in_stock_num: item.in_stock_num }
        })
        let sizes = res.data.variants[1].options.map((item) => {
          let disabled = true;
          allMight.map((it) => {
            if (it.size === item.option_id) {
              disabled = false;
            }
            return null;
          })
          if (disabled) {
            disabledSize.push(item.option_id)
          }
          return { id: item.option_id, name: item.option_name, isActive: false, disabled: disabled }
        });
        let colors = res.data.variants[0].options.map((item) => {
          let disabled = true;
          allMight.map((it) => {
            if (it.color === item.option_id) {
              disabled = false;
            }
            return null;
          })
          if (disabled) {
            disabledColor.push(item.option_id)
          }
          return { id: item.option_id, name: item.option_name, isActive: false, disabled: disabled }
        });

        yield put({
          type: 'save',
          payload: {
            goodsData: res.data,
            title: res.data.product_info.product_name,
            colors: colors,
            disabledColor,
            disabledSize,
            sizes: sizes,
            allMight: res.data.skus.map((item) => {
              return { product_id: item.product_id, sku_code: item.sku_code, color: item.options[0], size: item.options[1], selling_price: item.selling_price, in_stock_num: item.in_stock_num }
            })
          }
        })
      }
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  }
}