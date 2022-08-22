import type { FC } from 'react';
import * as React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TablePagination,
  TableFooter,
} from '@mui/material';
import { AddChannelModal } from './AddChannelModal';
import {
  StyledTableCell,
  StyledTableRow,
  TablePaginationActions,
} from '../../layout/CustomizedTable';
import { useChannelData } from '../../api/useFetchData';

interface Props {
  refreshTime: Date;
}

export const CustomizedChannelTable: FC<Props> = ({ refreshTime }) => {
  const {
    queryResult,
    isLoading,
    page,
    pageSize,
    handleChangePage,
    handleChangeRowsPerPage,
    setUpdateTime,
  } = useChannelData(refreshTime);

  const [selectedChannel, setSelectedChannel] = React.useState('');

  return (
    <>
      <Table sx={{ minWidth: 700, marginTop: 8 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Label</StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Circuit Name</StyledTableCell>
            <StyledTableCell>Meter Name</StyledTableCell>
            <StyledTableCell>Index Override</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && <div>Loading...</div>}
          {queryResult.channels?.map((item) => (
            <StyledTableRow
              key={item.name}
              onClick={() => {
                setSelectedChannel(item.name);
              }}
              selected={selectedChannel === item.name}
            >
              <StyledTableCell component="th" scope="row">
                {item.name}
              </StyledTableCell>
              <StyledTableCell>{item.label}</StyledTableCell>
              <StyledTableCell>{item.circuit}</StyledTableCell>
              <StyledTableCell>{item.meter}</StyledTableCell>
              <StyledTableCell>{item.index_override}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[25, 50, 100]}
              colSpan={5}
              count={queryResult.total}
              rowsPerPage={pageSize}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>

      <AddChannelModal
        open={selectedChannel !== ''}
        onClose={() => {
          setSelectedChannel('');
          setUpdateTime(new Date());
        }}
        channelName={selectedChannel}
      />
    </>
  );
};
