import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';
@connect(({ goods }) => ({ ...goods }))
class Goods extends Component {
  renderStyle = () => {
    const { isActive, type, id, allMight, disabled } = this.props;
    const activeStyle = {
      backgroundColor: '#212632',
      color: '#FFFFFF',
      cursor: 'pointer'
    }
    const unActiveStyle = {
      backgroundColor: '#F5F5F5',
      color: '#212632',
      cursor: 'pointer'
    }
    const disabledStyle = {
      backgroundColor: '#F5F5F5',
      color: '#CCCCCC',
      cursor: 'not-allowed',
      pointerEvents: 'none'
    }
    if (disabled) {
      return disabledStyle;
    } else if (isActive) {
      return activeStyle;
    } else {
      return unActiveStyle;
    }
  }
  render() {
    const { children, onClick } = this.props;
    return (
      <div onClick={onClick} className={styles.box} style={this.renderStyle()} >
        {children}
      </div>
    )
  }
}
export default Goods;