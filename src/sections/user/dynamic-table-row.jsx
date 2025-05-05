import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { _mock } from 'src/_mock';
import UserQuickEditForm from './user-quick-edit-form';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { executeACGAction } from 'src/store/slice';
import { ACTION_CODES, STORE_KEYS } from 'src/constants/apiConstants';

// ----------------------------------------------------------------------

export default function DynamicTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, index, selectable, type, headers, isAdmin, isUser }) {
    const { name, avatarUrl, company, role, status, email, phoneNumber, updated } = row;

    const confirm = useBoolean();
    const params = useParams()
    const quickEdit = useBoolean();
    const dispatch = useDispatch();

    const popover = usePopover();
    const clickedClose = (event) => {
        console.log(event, "evt")
        const newData = [event].map((ele) => {
            return {
                exchange: "NFO",
                tradingsymbol: ele?.tradingSymbol,
                quantity: String(Math.abs(Number(ele?.netQuantity))),
                product: "M",
                transactionType: Number(ele?.netQuantity) > 0 ? 'S' : 'B',
                name: params?.id
            }
        })
        console.log(newData[0])
        if (isAdmin) {
            dispatch(
                executeACGAction({
                    payload: {
                        requestType: 'POST',
                        urlPath: ACTION_CODES.EXIT_SET_ORDER,
                        reqObj: newData[0]
                    },
                    storeKey: STORE_KEYS.EXIT_SET_ORDER,
                    uniqueScreenIdentifier: {
                        tradeRecd: true
                    }
                })
            )
        }

        // window.location.reload();
    }
    return (
        <>
            <TableRow hover selected={selected}>
                {selectable && (
                    <TableCell padding="checkbox">
                        <Checkbox checked={selected} onClick={onSelectRow} />
                    </TableCell>
                )}

                {/* <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar alt={name} src={_mock.image.avatar(index)} sx={{ mr: 2 }} />

                    <ListItemText
                        primary={name}
                        // secondary={email}
                        primaryTypographyProps={{ typography: 'body2' }}
                        secondaryTypographyProps={{
                            component: 'span',
                            color: 'text.disabled',
                        }}
                    />
                </TableCell> */}
                {headers?.map((ele) => {
                    if (ele?.id == 'Close') {
                        return <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap', zIndex: 100 }}>
                            <Button color={row?.unrealizedMTOM > 0 ? "success" : "error"} variant="outlined" onClick={() => clickedClose(row)}>Close</Button>
                        </TableCell>
                    }
                    return (
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row[ele?.id]}</TableCell>
                    )
                })}

                {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.tradingSymbol}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.dayBuyQuantity}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.netAveragePrice}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{Math.abs(Number(row?.RealizedPNL)) !== 0 ? row?.RealizedPNL : row?.unrealizedMTOM}</TableCell> */}
                {/* {type == 'close' ?
                    <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
                        <Button color="error" variant="outlined">Close</Button>
                    </TableCell>
                    :
                    <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
                        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                            <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                    </TableCell>

                } */}
            </TableRow>
            <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="right-top"
                sx={{ width: 140 }}
            >
                <MenuItem
                    onClick={() => {
                        confirm.onTrue();
                        popover.onClose();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Delete
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        onEditRow();
                        popover.onClose();
                    }}
                >
                    <Iconify icon="solar:pen-bold" />
                    Edit
                </MenuItem>
            </CustomPopover>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content="Are you sure want to delete?"
                action={
                    <Button variant="contained" color="error" onClick={() => { onDeleteRow(), confirm.onFalse() }}>
                        Delete
                    </Button>
                }
            />
        </>
    );
}

DynamicTableRow.propTypes = {
    onDeleteRow: PropTypes.func,
    onEditRow: PropTypes.func,
    onSelectRow: PropTypes.func,
    row: PropTypes.object,
    selected: PropTypes.bool,
};
