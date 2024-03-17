import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function SetToolbar({
    status,
    backLink,
    createdAt,
    orderNumber,
    statusOptions,
    onChangeStatus,
}) {
    const popover = usePopover();

    return (
        <>
            <Stack
                spacing={3}
                direction={{ xs: 'column', md: 'row' }}
                sx={{
                    mb: { xs: 3, md: 5 },
                    marginBottom: '10px !important'
                }}
            >
                <Stack spacing={1} direction="row" alignItems="flex-start">
                    <IconButton component={RouterLink} href={backLink}>
                        <Iconify icon="eva:arrow-ios-back-fill" />
                    </IconButton>

                    <Stack spacing={0.5}>
                        <Stack spacing={1} direction="row" alignItems="center">
                            <Typography variant="h4">{orderNumber} Set</Typography>
                            {/* <Label
                                variant="soft"
                                color={
                                    (status === 'completed' && 'success') ||
                                    (status === 'pending' && 'warning') ||
                                    (status === 'cancelled' && 'error') ||
                                    'default'
                                }
                            >
                                {status}
                            </Label> */}
                        </Stack>
                    </Stack>
                </Stack>

                {/* <Stack
                    flexGrow={1}
                    spacing={1.5}
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                >
                    <Button
                        color="inherit"
                        variant="outlined"
                        endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                        onClick={popover.onOpen}
                        sx={{ textTransform: 'capitalize' }}
                    >
                        {status}
                    </Button>

                    <Button
                        color="inherit"
                        variant="outlined"
                        startIcon={<Iconify icon="solar:printer-minimalistic-bold" />}
                    >
                        Print
                    </Button>

                    <Button color="inherit" variant="contained" startIcon={<Iconify icon="solar:pen-bold" />}>
                        Edit
                    </Button>
                </Stack> */}
            </Stack>

            {/* <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="top-right"
                sx={{ width: 140 }}
            >
                {statusOptions.map((option) => (
                    <MenuItem
                        key={option.value}
                        selected={option.value === status}
                        onClick={() => {
                            popover.onClose();
                            onChangeStatus(option.value);
                        }}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </CustomPopover> */}
        </>
    );
}

SetToolbar.propTypes = {
    backLink: PropTypes.string,
    orderNumber: PropTypes.string,
};
