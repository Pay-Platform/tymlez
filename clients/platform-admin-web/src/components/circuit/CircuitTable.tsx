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
import { AddCircuitModal } from './AddCircuitModal';
import {
  StyledTableCell,
  StyledTableRow,
  TablePaginationActions,
} from '../../layout/CustomizedTable';
import { useCircuitData } from '../../api/useFetchData';

interface Props {
  refreshTime: Date;
}

export const CustomizedCircuitTable: FC<Props> = ({ refreshTime }) => {
  const {
    queryResult,
    isLoading,
    page,
    pageSize,
    handleChangePage,
    handleChangeRowsPerPage,
    setUpdateTime,
  } = useCircuitData(refreshTime);

  const [selectedCircuit, setSelectedCircuit] = React.useState('');

  return (
    <>
      <Table sx={{ minWidth: 700, marginTop: 8 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Label</StyledTableCell>
            <StyledTableCell>Meter Name</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && <div>Loading...</div>}
          {queryResult.circuits?.map((item) => (
            <StyledTableRow
              key={item.name}
              onClick={() => {
                setSelectedCircuit(item.name || '');
              }}
              selected={selectedCircuit === item.name}
            >
              <StyledTableCell component="th" scope="row">
                {item.name}
              </StyledTableCell>
              <StyledTableCell>{item.label}</StyledTableCell>
              <StyledTableCell>{item.meter}</StyledTableCell>
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

      <AddCircuitModal
        open={selectedCircuit !== ''}
        onClose={() => {
          setSelectedCircuit('');
          setUpdateTime(new Date());
        }}
        circuitName={selectedCircuit}
      />
    </>
  );
};
