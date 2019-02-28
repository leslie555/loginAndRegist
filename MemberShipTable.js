import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

export default class MemberShipTable extends React.Component{
  render(){
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="right" padding="none">会员类型</TableCell>
            <TableCell align="right" padding="none">条件</TableCell>
            <TableCell align="right" padding="none">折扣率</TableCell>
            <TableCell align="right" padding="none">有效期</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell align="right" padding="none">钻石会员</TableCell>
            <TableCell align="right" padding="none">前5%入驻</TableCell>
            <TableCell align="right" padding="none">5.5折</TableCell>
            <TableCell align="right" padding="none">永久有效</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="right" padding="none">铂金会员</TableCell>
            <TableCell align="right" padding="none">前30%入驻</TableCell>
            <TableCell align="right" padding="none">7折</TableCell>
            <TableCell align="right" padding="none">永久有效</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="right" padding="none">金牌会员</TableCell>
            <TableCell align="right" padding="none">前70%入驻</TableCell>
            <TableCell align="right" padding="none">8折</TableCell>
            <TableCell align="right" padding="none">永久有效</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="right" padding="none">普通会员</TableCell>
            <TableCell align="right" padding="none">其它</TableCell>
            <TableCell align="right" padding="none">无折扣</TableCell>
            <TableCell align="right" padding="none">永久有效</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }
}
