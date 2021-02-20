import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  makeStyles
} from '@material-ui/core';
import {
  Edit as EditIcon,
  Delete as TrashIcon
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const tableHeaders = [
  { key: 'code', name: 'Category Code', sort: true },
  { key: 'name', name: 'Category Name', sort: true },
  { key: 'description', name: 'Description', sort: true },
  { key: 'created_at', name: 'Created Date', sort: true },
];

const Results = ({
  className,
  category,
  limit,
  page,
  sort,
  total,
  handleEdit,
  handleDelete,
  handleSortChange,
  handlePageChange,
  handleLimitChange,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                {tableHeaders.map((tableHeader) => (
                  <TableCell key={tableHeader.key}>
                    {tableHeader.sort
                      ? (
                        <TableSortLabel
                          active={sort && sort.column === tableHeader.key}
                          direction={sort ? sort.direction : 'asc'}
                          onClick={(e) => handleSortChange(
                            e,
                            tableHeader.key,
                            (sort && sort.direction)
                          )}
                        >
                          {tableHeader.name}
                        </TableSortLabel>
                      ) : tableHeader.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {category.map((cat) => (
                <TableRow
                  hover
                  key={cat.id}
                >
                  <TableCell>
                    {cat.code}
                  </TableCell>
                  <TableCell>
                    {cat.name}
                  </TableCell>
                  <TableCell>
                    {cat.description}
                  </TableCell>
                  <TableCell>
                    {moment(cat.created_at).format('DD/MM/YYYY HH:mm:ss')}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEdit(cat)}
                    >
                      <EditIcon size={20} />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(cat)}
                    >
                      <TrashIcon size={20} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={total}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
        // labelDisplayedRows={() => {
        //   return `${page}-${Math.floor(total / limit)}`;
        // }}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  category: PropTypes.array.isRequired,
  limit: PropTypes.number,
  page: PropTypes.number,
  sort: PropTypes.object,
  total: PropTypes.number,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  handleSortChange: PropTypes.func,
  handlePageChange: PropTypes.func,
  handleLimitChange: PropTypes.func,
};

export default Results;
