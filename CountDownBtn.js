import React from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';

/*该组件的使用方法如下：
<CountDownBtn
  onClick={clickHandler}
  text="获取验证码"   //按钮未被点击时显示的文字
  newText="重新获取"  //按钮点击后且计时结束后显示的文字
  prefix="regist"     //timeToAvailable存储在appModel，名字为`${regist}TimeToAvailable`
/>
*/

const CountDownBtn = (props) => {
  const { onClick, type, text, newText, timeToAvailable } = props;
  return (
    <Button
      variant="outlined"
      size="small"
      onClick={onClick}
      disabled={!!timeToAvailable}
      style={{marginBottom: '-13px', marginLeft: '6px', width: '6rem'}}
      type={type}
    >{
        timeToAvailable ? `${timeToAvailable}秒` :  (timeToAvailable === 0 ? newText : text)
      }
    </Button>

  );
};

CountDownBtn.propTypes = {
};

function mapStateToProps({appModel}, props) {
  const timeToAvailable = appModel[`${props.prefix}TimeToAvailable`];
  return { timeToAvailable };
}

export default connect(mapStateToProps)(CountDownBtn);
