import React, { Component } from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Row, Col, Divider, Spin } from 'antd';
import Goods from '../component/Goods';
@connect(({ goods, loading }) => ({ ...goods, dataLoading: loading.effects['goods/queryGoods'] }))
class GoodsDetail extends Component {
  state = {
    currentColor: "",
    currentSize: ""
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/queryGoods'
    })
  }
  clickColor = (colorId) => {
    const { currentSize } = this.state;
    const { dispatch, colors, disabledSize, allMight, sizes } = this.props;
    let theMight = allMight.filter(item => item.color === colorId);
    let ids = theMight.filter((item) => item.in_stock_num === 0);
    dispatch({
      type: 'goods/save',
      payload: {
        colors: colors.map((item) => {
          if (item.id === colorId) {
            item.isActive = true;
          } else {
            item.isActive = false;
          }
          return item;
        }),
        sizes: ids.length > 0 && sizes.map((item) => {
          ids.map((it) => {
            if (item.id === it.size) {
              item.disabled = true;
            }
          })
          return item
        }) || sizes.map((item) => {
          let disabled = false
          if (disabledSize.length > 0) {
            disabledSize.map((it) => {
              if (it === item.id) {
                disabled = true
              }
            })
          }
          item.disabled = disabled;
          return item
        })
      }
    })
    this.setState({
      currentColor: colorId,
    }, () => {
      const { currentColor } = this.state;
      if (currentColor !== "" && currentSize !== "") {
        dispatch({
          type: "goods/save",
          payload: {
            currentGoods: theMight.filter(item => item.color === currentColor && item.size === currentSize)[0]
          }
        })
      }
    })
  }
  clickBgColor = (sizeId) => {
    const { currentColor } = this.state;


    const { dispatch, sizes, currentGoods, allMight, colors, disabledColor, disabledSize } = this.props;
    let theMight = allMight.filter(item => item.size === sizeId);
    let ids = theMight.filter((item) => item.in_stock_num === 0);
    dispatch({
      type: 'goods/save',
      payload: {
        sizes: sizes.map((item) => {
          if (item.id === sizeId) {
            item.isActive = true;
          } else {
            item.isActive = false;
          }
          return item;
        }),
        colors: ids.length > 0 && colors.map((item) => {
          ids.map((it) => {
            if (item.id === it.color) {
              item.disabled = true;
            }
          })
          return item
        }) || colors.map((item) => {
          let disabled = false
          if (disabledColor.length > 0) {
            disabledColor.map((it) => {
              if (it === item.id) {
                disabled = true
              }
            })
          }
          item.disabled = disabled;
          return item
        })
      }
    })
    this.setState({
      currentSize: sizeId,
    }, () => {
      const { currentSize } = this.state;
      if (currentColor !== "" && currentSize !== "") {
        dispatch({
          type: "goods/save",
          payload: {
            currentGoods: theMight.filter(item => item.color === currentColor && item.size === currentSize)[0]
          }
        })
      }
    })
  }
  render() {
    const { title, colors, sizes, goodsData, currentGoods, dataLoading } = this.props;
    return (
      <div className={styles.container}>
        <Spin spinning={dataLoading} tip="正在加载数据...">
          <Row align="middle" type="flex" justify="center"  >
            <Col sx={24} lx={6}>
              <img className={styles.img} src={require('../assets/goods_1.jpg')} alt="goods" />
            </Col>
            <Col sx={24} lx={6}>
              <Col span={24}><label>{title}</label></Col>
              <Divider dashed type="horizontal" />
              {goodsData !== null && goodsData.variants.map((item) => {
                return (
                  <Col key={item.variant_name} span={24} className={styles.itemLine}>
                    <Col span={6} key={item.variant_name}>
                      <label>{item.variant_name}</label>
                    </Col>
                    <Col span={16}>
                      {item.variant_name == "颜色" ? item.options.length > 0 && colors.map((option) => {
                        return <Goods disabled={option.disabled} isActive={option.isActive} onClick={this.clickColor.bind(this, option.id)} type="color" id={option.id} key={option.id}>{option.name}</Goods>
                      }) : sizes.map((option) => {
                        return <Goods disabled={option.disabled} isActive={option.isActive} onClick={this.clickBgColor.bind(this, option.id)} type="size" id={option.id} key={option.id}>{option.name}</Goods>
                      })}
                    </Col>
                  </Col>
                )
              })}
              <Divider dashed type="horizontal" />
              <Col span={24} className={styles.itemLine}>
                <Col span={6}>
                  <label>价格</label>
                </Col>
                <Col span={16}>
                  ¥<span className={styles.price}>{currentGoods !== null && currentGoods.selling_price || " ---"}</span>
                </Col>
              </Col>
              <Col span={24} className={styles.itemLine}>
                <Col span={6}>
                  <label>sku_code</label>
                </Col>
                <Col span={16}>
                  {currentGoods !== null && currentGoods.sku_code || " ---"}
                </Col>
              </Col>
              <Col span={24} className={styles.itemLine}>
                <Col span={6}>
                  <label>剩余库存</label>
                </Col>
                <Col span={16}>
                  {currentGoods !== null && currentGoods.in_stock_num || " ---"}
                </Col>
              </Col>
            </Col>

          </Row>

        </Spin>
      </div>
    )
  }
}
export default GoodsDetail;