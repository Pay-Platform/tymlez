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
import { AddInstallerModal } from './AddInstallerModal';
import { useInstallerData } from '../../api/useFetchData';
import {
  StyledTableCell,
  StyledTableRow,
  TablePaginationActions,
} from '../../layout/CustomizedTable';

interface Props {
  refreshTime: Date;
}

export const CustomizedIntallerTable: FC<Props> = ({ refreshTime }) => {
  const {
    queryResult,
    isLoading,
    page,
    pageSize,
    handleChangePage,
    handleChangeRowsPerPage,
    setUpdateTime,
  } = useInstallerData(refreshTime);

  const [selectedInstaller, setSelectedInstaller] = React.useState('');

  return (
    <>
      <Table sx={{ minWidth: 700, marginTop: 8 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Created</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && <div>Loading...</div>}
          {queryResult.installers?.map((item) => (
            <StyledTableRow
              key={item.id}
              onClick={() => {
                setSelectedInstaller(item.id || '');
              }}
              selected={selectedInstaller === item.id}
            >
              <StyledTableCell component="th" scope="row">
                {item.id}
              </StyledTableCell>
              <StyledTableCell>{item.name}</StyledTableCell>
              <StyledTableCell>{item.createdAt}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[25, 50, 100]}
              colSpan={3}
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

      <AddInstallerModal
        open={selectedInstaller !== ''}
        onClose={() => {
          setSelectedInstaller('');
          setUpdateTime(new Date());
        }}
        installerId={selectedInstaller}
      />
    </>
  );
};
