import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';


class PanelInSalesSet extends React.Component{
  render(){
    // console.log('SalesInf rendered',new Date(this.props.salesEndDate));
    const {children, title, picSrc, classes} = this.props;
    return (
      <Paper className={classes.root}>
        <div className={classes.header}>
          <Paper className={classes.imgPaper}>
            <img src={picSrc} style={{width: '100%'}}/>
          </Paper>
          <Typography variant="h6" style={{marginTop: '0.5rem'}}>{title}</Typography>
        </div>
        <div className={classes.container}>
          {children}
        </div>
      </Paper>
    );
  }
}
const styles={
  root: {
    paddingBottom:'15px', 
    marginTop:'3rem', 
    marginBottom: '1rem'
  },
  header:{
    display:'flex', 
    flexDirection:'row'
  },
  imgPaper:{
    width:'5rem', 
    height:'5rem', 
    position:'relative', 
    marginLeft: '2rem', 
    marginRight:'1rem', 
    top:'-2rem', 
    display:'flex', 
    alignItems:'center', 
  },
  container:{
    margin:'0 auto',
    padding:'0 0.7rem',
    width:'24rem',
    maxWidth:'100%',
    // display: 'flex', 
    // flexDirection:'column', 
    // alignItems: 'center'
  },

}
export default withStyles(styles)(PanelInSalesSet);
