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
import { useSiteData } from '../../api/useFetchData';
import { AddSiteModal } from './AddSiteModal';
import {
  StyledTableCell,
  StyledTableRow,
  TablePaginationActions,
} from '../../layout/CustomizedTable';

interface Props {
  refreshTime: Date;
}

export const CustomizedSiteTable: FC<Props> = ({ refreshTime }) => {
  const {
    queryResult,
    isLoading,
    page,
    pageSize,
    handleChangePage,
    handleChangeRowsPerPage,
    setUpdateTime,
  } = useSiteData(refreshTime);

  const [selectedSite, setSelectedSite] = React.useState('');
  return (
    <>
      <Table sx={{ minWidth: 700, marginTop: 8 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Label</StyledTableCell>
            <StyledTableCell>Address</StyledTableCell>
            <StyledTableCell>Lat</StyledTableCell>
            <StyledTableCell>Lng</StyledTableCell>
            <StyledTableCell>Has Solar</StyledTableCell>
            <StyledTableCell>Solcast Resource Id</StyledTableCell>
            <StyledTableCell>Region</StyledTableCell>
            <StyledTableCell>Client</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && <div>Loading...</div>}
          {queryResult.sites?.map((item) => (
            <StyledTableRow
              key={item.name}
              onClick={() => {
                setSelectedSite(item.name);
              }}
              selected={selectedSite === item.name}
            >
              <StyledTableCell component="th" scope="row">
                {item.name}
              </StyledTableCell>
              <StyledTableCell>{item.label}</StyledTableCell>
              <StyledTableCell>{item.address}</StyledTableCell>
              <StyledTableCell>{item.lat}</StyledTableCell>
              <StyledTableCell>{item.lng}</StyledTableCell>
              <StyledTableCell>{item.hasSolar ? 'Yes' : 'No'}</StyledTableCell>
              <StyledTableCell>{item.solcastResourceId}</StyledTableCell>
              <StyledTableCell>{item.region}</StyledTableCell>
              <StyledTableCell>{item.client}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 25, 50, 100]}
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

      <AddSiteModal
        open={selectedSite !== ''}
        onClose={() => {
          setSelectedSite('');
          setUpdateTime(new Date());
        }}
        siteName={selectedSite}
      />
    </>
  );
};
