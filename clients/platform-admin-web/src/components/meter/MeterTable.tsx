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
import { AddMeterModal } from './AddMeterModal';
import {
  StyledTableCell,
  StyledTableRow,
  TablePaginationActions,
} from '../../layout/CustomizedTable';
import { useMeterData } from '../../api/useFetchData';

interface Props {
  refreshTime: Date;
}

export const CustomizedMeterTable: FC<Props> = ({ refreshTime }) => {
  const {
    queryResult,
    isLoading,
    page,
    pageSize,
    handleChangePage,
    handleChangeRowsPerPage,
    setUpdateTime,
  } = useMeterData(refreshTime);

  const [selectedMeter, setSelectedMeter] = React.useState('');

  return (
    <>
      <Table sx={{ minWidth: 700, marginTop: 8 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Label</StyledTableCell>
            <StyledTableCell>Meter Id</StyledTableCell>
            <StyledTableCell>Description</StyledTableCell>
            <StyledTableCell>Lat</StyledTableCell>
            <StyledTableCell>Lng</StyledTableCell>
            <StyledTableCell>Type</StyledTableCell>
            <StyledTableCell>Interval</StyledTableCell>
            <StyledTableCell>Billing Channel Index</StyledTableCell>
            <StyledTableCell>Is Main</StyledTableCell>
            <StyledTableCell>Site</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && <div>Loading...</div>}
          {queryResult.meters?.map((item) => (
            <StyledTableRow
              key={item.name}
              onClick={() => {
                setSelectedMeter(item.name || '');
              }}
              selected={selectedMeter === item.name}
            >
              <StyledTableCell component="th" scope="row">
                {item.name}
              </StyledTableCell>
              <StyledTableCell>{item.label}</StyledTableCell>
              <StyledTableCell>{item.meter_id}</StyledTableCell>
              <StyledTableCell>{item.description}</StyledTableCell>
              <StyledTableCell>{item.lat}</StyledTableCell>
              <StyledTableCell>{item.lng}</StyledTableCell>
              <StyledTableCell>{item.type}</StyledTableCell>
              <StyledTableCell>{item.interval}</StyledTableCell>
              <StyledTableCell>{item.billingChannelIndex}</StyledTableCell>
              <StyledTableCell>{item.isMain ? 'Yes' : 'No'}</StyledTableCell>
              <StyledTableCell>{item.site}</StyledTableCell>
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

      <AddMeterModal
        open={selectedMeter !== ''}
        onClose={() => {
          setSelectedMeter('');
          setUpdateTime(new Date());
        }}
        meterName={selectedMeter}
      />
    </>
  );
};
