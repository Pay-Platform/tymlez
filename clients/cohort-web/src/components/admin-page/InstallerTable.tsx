import type { FC } from 'react';
import * as React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Box,
  IconButton,
  TableFooter,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { styled, useTheme } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import axios from 'axios';
import { useQuery } from 'react-query';
import type { IQueryInstaller } from '@tymlez/platform-api-interfaces';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import type { TablePaginationActionsProps } from '@mui/material/TablePagination/TablePaginationActions';
import { AddInstallerModal } from './AddInstallerModal';

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: grey[500],
    fontWeight: 'bold',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    border: '1px solid rgba(224, 224, 224, 1)',
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  '&:nth-of-type(even)': {
    backgroundColor: grey[200],
  },
  // '&:last-child td, &:last-child th': {
  //   // border: 0,
  // },
  '&:hover': {
    backgroundColor: grey[400],
  },
  '&.Mui-selected, &.Mui-selected:hover': {
    backgroundColor: grey[400],
    '& > .MuiTableCell-root': {
      color: 'green',
    },
  },
}));

interface Props {
  refreshTime: Date;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: any) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: any) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: any) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: any) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export const CustomizedIntallerTable: FC<Props> = ({ refreshTime }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [selectedInstaller, setSelectedInstaller] = React.useState('');
  const [updateTime, setUpdateTime] = React.useState(new Date());

  const { data: queryResult = { total: 0, installers: [] }, isLoading } =
    useQuery(
      ['installers', page, rowsPerPage, refreshTime, updateTime],
      async () => {
        const { data } = await axios.get<IQueryInstaller>(
          `${process.env.NEXT_PUBLIC_COHORT_API_URL}/installer`,
          {
            params: { page, pageSize: rowsPerPage },
          },
        );

        return data;
      },
    );

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
              rowsPerPage={rowsPerPage}
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
