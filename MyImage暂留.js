import React from 'react';
import LazyImage from '../loginAndRegist/LazyImage';

class MyImage extends React.Component {

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     url: props.src,
  //   };
  // }

  // UNSAFE_componentWillReceiveProps(nextProps){
  //   if(this.src!==nextProps.src) {
  //     this.setState({url: nextProps.src});
  //   }
  // }

  render () {
    const {src, scaleFlag, isLazy} = this.props;
    if(isLazy) return (
      <LazyImage
        {...this.props}
        src={global.scaleImg(global.getUrlOnBos(src), scaleFlag)}
        // onError={this.onError}
      />
    );
    else return (
      <img
        {...this.props}
        src={global.scaleImg(global.getUrlOnBos(src), scaleFlag)}
        // 使用以下代码可以验证bos的有效性
        // src={global.scaleImg(this.state.url, scaleFlag).indexOf('bos')<0?'//www.fkdfjfjfkkcoi.com':global.scaleImg(this.state.url, scaleFlag)}
        // onError={this.onError}
      />
    );
  }

  // onError = () => { // 如果第三方url失败，切换到自有url
  //   if (this.state.url.indexOf('bcebos') > -1) {
  //     console.warn('MyImage 加载失败', this.props.src);
  //     return;
  //   }
  //   this.setState({
  //     url: global.getUrlOnBos(this.props.src),
  //   });
  // }

}

export default MyImage;
