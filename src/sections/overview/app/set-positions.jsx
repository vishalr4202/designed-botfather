import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { _roles, _userList, USER_STATUS_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
    useTable,
    emptyRows,
    TableNoData,
    getComparator,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from 'src/components/table';

import UserTableRow from '../../user/user-table-row';
import DynamicTableRow from '../../user/dynamic-table-row';
import UserTableToolbar from '../../user/user-table-toolbar';
import UserTableFiltersResult from '../../user/user-table-filters-result';
import { useDispatch, useSelector } from 'react-redux';
import { executeACGAction } from 'src/store/slice';
import { acgSelector } from 'src/store/selector';
import { ACTION_CODES, STORE_KEYS } from 'src/constants/apiConstants';
import { createStructuredSelector } from 'reselect';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

// const TABLE_HEAD = [
//   { id: 'name', label: 'Name' },
//   { id: 'phoneNumber', label: 'Phone Number', width: 180 },
//   { id: 'company', label: 'Company', width: 220 },
//   { id: 'role', label: 'Role', width: 180 },
//   { id: 'status', label: 'Status', width: 100 },
//   { id: '', width: 88 },
// ];

const TABLE_HEAD = [
    { id: 'tradingSymbol', label: 'Symbol', alignRight: false },
    { id: 'netQuantity', label: 'Buy Quantity', alignRight: false },
    { id: 'netAveragePrice', label: 'Entry Price', alignRight: false },
    { id: 'unrealizedMTOM', label: 'P&L', alignRight: false },
    { id: 'Close', label: 'Close', width: 88 },
    // { id: 'Action', label: 'Close', alignRight: false }
];
const NON_ADMIN_TABLE_HEAD = [
    { id: 'tradingSymbol', label: 'Symbol', alignRight: false },
    { id: 'netQuantity', label: 'Buy Quantity', alignRight: false },
    { id: 'netAveragePrice', label: 'Entry Price', alignRight: false },
    { id: 'unrealizedMTOM', label: 'P&L', alignRight: false },
]
const defaultFilters = {
    name: '',
    role: [],
    status: 'all',
};

// ----------------------------------------------------------------------

export default function SetPositionsView({ data, admin }) {
    const { enqueueSnackbar } = useSnackbar();

    const table = useTable();

    const settings = useSettingsContext();

    const router = useRouter();

    const confirm = useBoolean();

    const [tableData, setTableData] = useState([]);

    const [filters, setFilters] = useState(defaultFilters);
    const dispatch = useDispatch();
    const acgStateSelector = createStructuredSelector({
        acgSlice: acgSelector()
    });
    const { acgSlice: state } = useSelector(acgStateSelector);

    // useEffect(() => {
    //     dispatch(
    //         executeACGAction({
    //             payload: {
    //                 requestType: 'GET',
    //                 urlPath: ACTION_CODES.ADMIN_DASH
    //             },
    //             storeKey: STORE_KEYS.ADMIN_ALL_USERS
    //         })
    //     );
    // }, [])

    useEffect(() => {
        if (data?.length > 0) {
            setTableData(data)
        }

    }, [data])

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters,
    });

    const dataInPage = dataFiltered.slice(
        table.page * table.rowsPerPage,
        table.page * table.rowsPerPage + table.rowsPerPage
    );

    const denseHeight = table.dense ? 56 : 56 + 20;

    const canReset = !isEqual(defaultFilters, filters);

    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

    const handleFilters = useCallback(
        (name, value) => {
            table.onResetPage();
            setFilters((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        },
        [table]
    );

    const handleResetFilters = useCallback(() => {
        setFilters(defaultFilters);
    }, []);

    const handleDeleteRow = useCallback(

        (email) => {
            console.log(email)
            const deleteRow = tableData.filter((row) => row.email !== email);

            enqueueSnackbar('Delete success!');

            setTableData(deleteRow);
            confirm.onFalse();
            table.onUpdatePageDeleteRow(dataInPage.length);

        },
        [dataInPage.length, enqueueSnackbar, table, tableData]
    );

    const handleDeleteRows = useCallback(() => {
        const deleteRows = tableData.filter((row) => !table.selected.includes(row.email));

        enqueueSnackbar('Delete success!');

        setTableData(deleteRows);

        table.onUpdatePageDeleteRows({
            totalRowsInPage: dataInPage.length,
            totalRowsFiltered: dataFiltered.length,
        });
    }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);

    const handleEditRow = useCallback(
        (email) => {
            router.push(paths.dashboard.user.edit(email));
        },
        [router]
    );

    const handleFilterStatus = useCallback(
        (event, newValue) => {
            handleFilters('status', newValue);
        },
        [handleFilters]
    );

    return (
        <>
            <Container maxWidth={settings.themeStretch ? false : 'xl'} style={{ paddingLeft: '0px', paddingRight: '0px', position: 'relative' }}>

                <Card style={{ borderRadius: '10px' }}>

                    {/* <UserTableToolbar
                        filters={filters}
                        onFilters={handleFilters}
                        roleOptions={_roles}
                    /> */}

                    {/* {canReset && (
                        <UserTableFiltersResult
                            filters={filters}
                            onFilters={handleFilters}
                            //
                            onResetFilters={handleResetFilters}
                            //
                            results={dataFiltered.length}
                            sx={{ p: 2.5, pt: 0 }}
                        />
                    )} */}

                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <TableSelectedAction
                            dense={table.dense}
                            numSelected={table.selected.length}
                            rowCount={dataFiltered.length}
                            onSelectAllRows={(checked) =>
                                table.onSelectAllRows(
                                    checked,
                                    dataFiltered.map((row) => row.email)
                                )
                            }
                            action={
                                <Tooltip title="Delete">
                                    <IconButton color="primary" onClick={confirm.onTrue}>
                                        <Iconify icon="solar:trash-bin-trash-bold" />
                                    </IconButton>
                                </Tooltip>
                            }
                        />

                        <Scrollbar>
                            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                                <TableHeadCustom
                                    selectable={false}
                                    order={table.order}
                                    orderBy={table.orderBy}
                                    headLabel={admin ? TABLE_HEAD : NON_ADMIN_TABLE_HEAD}
                                    rowCount={dataFiltered.length}
                                    numSelected={table.selected.length}
                                    onSort={table.onSort}
                                    onSelectAllRows={(checked) =>
                                        table.onSelectAllRows(
                                            checked,
                                            dataFiltered.map((row) => row.tradingSymbol)
                                        )
                                    }
                                    sx={{
                                        bgcolor: 'primary.lighter',
                                    }}
                                />

                                <TableBody>
                                    {dataFiltered
                                        .slice(
                                            table.page * table.rowsPerPage,
                                            table.page * table.rowsPerPage + table.rowsPerPage
                                        )
                                        .map((row, index) => (
                                            // <UserTableRow
                                            //     type="close"
                                            //     selectable={false}
                                            //     key={row.email}
                                            //     row={row}
                                            //     index={index}
                                            //     // selected={table.selected.includes(row.email)}
                                            //     onSelectRow={() => table.onSelectRow(row.email)}
                                            //     onDeleteRow={() => handleDeleteRow(row.email)}
                                            //     onEditRow={() => handleEditRow(row.email)}
                                            // />
                                            <DynamicTableRow
                                                headers={admin ? TABLE_HEAD : NON_ADMIN_TABLE_HEAD}
                                                type="close"
                                                selectable={false}
                                                key={row.email}
                                                row={row}
                                                index={index}
                                                // selected={table.selected.includes(row.email)}
                                                onSelectRow={() => table.onSelectRow(row.email)}
                                                onDeleteRow={() => handleDeleteRow(row.email)}
                                                onEditRow={() => handleEditRow(row.email)}
                                            />
                                        ))}

                                    <TableEmptyRows
                                        height={denseHeight}
                                        emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                                    />

                                    <TableNoData notFound={notFound} />
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>

                    <TablePaginationCustom
                        count={dataFiltered.length}
                        page={table.page}
                        rowsPerPage={table.rowsPerPage}
                        onPageChange={table.onChangePage}
                        onRowsPerPageChange={table.onChangeRowsPerPage}
                        hideShowDense={true}
                        //
                        dense={table.dense}
                        onChangeDense={table.onChangeDense}
                    />
                </Card>
            </Container>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content={
                    <>
                        Are you sure want to delete <strong> {table.selected.length} </strong> items?
                    </>
                }
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            handleDeleteRows();
                            confirm.onFalse();
                        }}
                    >
                        Delete
                    </Button>
                }
            />
        </>
    );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
    const { name, status, role } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (name) {
        inputData = inputData.filter(
            (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
        );
    }

    if (status !== 'all') {
        inputData = inputData.filter((user) => user.status === status);
    }

    if (role.length) {
        inputData = inputData.filter((user) => role.includes(user.role));
    }

    return inputData;
}
