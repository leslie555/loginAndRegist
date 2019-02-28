import React from 'react';
import { connect } from 'react-redux';
import { routerRedux } from 'dva/router';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import logoFullShop from '../loginAndRegist/logoFull_shop.png';
import logoFullProducer from '../loginAndRegist/logoFull_producer.png';
import logoFullCustomer from '../loginAndRegist/logoFull_customer.png';

class LoginAndRegistContainer extends React.Component {
  constructor(props){
    super(props);
    this.state={ tabIndex: 0 };
  }
  render() {
    const {title, width, classes, children, dispatch} = this.props;
    const Container = isWidthUp('sm', width)?Paper:'div';
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Button color="inherit" style={{paddingLeft: 0}} onClick={()=>{dispatch(routerRedux.push('/'))}}>
              <ArrowLeft />
              返回
            </Button>
          </Toolbar>
        </AppBar>
        <Container
          style={{
            width: isWidthUp('sm', width)?'26rem':'100%',
            margin: isWidthUp('sm', width)?'4rem auto': '2rem auto',
            backgroundColor: isWidthUp('sm', width)?'#f8f8f8':undefined,
          }}
        >
          {isWidthUp('sm', width)&&
            <div className={classes.headerDiv}>
              <img src={global.realm==='shop'?logoFullShop:(global.realm==='customer'?logoFullCustomer:logoFullProducer)} style={{height: '2.5rem', marginRight: '0.5rem'}}/>
              <Typography variant="h6" color="inherit">{title}</Typography>
            </div>
          }
          <div style={{padding: '0 1.5rem 2rem'}}>
            {children}
          </div>
        </Container>
      </div>
    );
  }
}

const styles=(theme)=>{
  const mainColor = theme.palette.primary.main;
  return {
    headerDiv: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '4rem',
      color: mainColor,
      backgroundColor: mainColor+'20',
    },
    headerText: {
      color: theme.palette.primary.contrastText
    },
  }
}

export default connect()(withStyles(styles)(withWidth()(LoginAndRegistContainer)));
