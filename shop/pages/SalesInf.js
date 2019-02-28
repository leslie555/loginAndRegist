import React from 'react';
import {connect} from 'react-redux';
import CurrentSales from '../components/CurrentSales';
import AnnounceSales from '../components/AnnounceSales';
import { routerRedux } from 'dva/router';


class SalesInf extends React.Component{
  render(){
    return (
      <div>
        <CurrentSales/>
        <AnnounceSales/>
      </div>
    );
  }
}
export default connect()(SalesInf);
