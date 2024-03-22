import React from 'react';
// import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
// import Avatar from '@material-ui/core/Avatar';
// import Chip from '@material-ui/core/Chip';
import { Chip, Avatar } from '@mui/material'
import { styled } from '@mui/material/styles';
// import { createStyles, Theme, makeStyles } from '@mui/core/styles';

// const useStyles = makeStyles((theme) =>
//     createStyles({
//         root: {
//             display: 'flex',
//             justifyContent: 'center',
//             flexWrap: 'wrap',
//             listStyle: 'none',
//             padding: theme.spacing(0.5),
//             margin: 0,
//         },
//         chip: {
//             margin: theme.spacing(0.5),
//         },
//     }),
// );

const StatWrapper = styled('div')(
    ({ theme }) => `
           display: flex;
           justify-content: center;
           flex-wrap: wrap;           
           list-style: none;
           padding:  ${theme.spacing(2)};
           margin: 0;
  `,
);
export default function Chips(props) {
    const { click, active } = props;
    //   const classes = useStyles();

    //   const handleDelete = () => {
    //     console.info('You clicked the delete icon.');
    //   };
    // const classes = useStyles();
    const [chipData, setChipData] = React.useState([
        { key: 0, label: 'Short Straddle' },
        { key: 1, label: 'Short Strangle' },
        { key: 2, label: 'Long Straddle' },
        { key: 3, label: 'Long Strangle' },
        { key: 4, label: 'Bull Spread' },
        { key: 5, label: 'Bear Spread' },
    ]);

    const handleClick = (chipToDelete) => {
        console.info(`You clicked the Chip.${chipToDelete.key}`);
    };
    return (
        <StatWrapper>
            {/* <Chip
        avatar={<Avatar>SS</Avatar>}
        label="Primary clickable"
        clickable
        color="primary"
        onDelete={handleDelete}
        deleteIcon={<DoneIcon />}
      /> */}
            {/* <Paper component="ul" className={classes.root}> */}
            {chipData.map((data) => {
                let sh = data?.label[0] + data?.label[data?.label?.indexOf(" ") + 1];
                return (
                    <li key={data.key}>
                        <Chip
                            avatar={<Avatar style={{ backgroundColor: data?.key == active ? 'rgba(78, 181, 141, 0.67)' : '#9d9a9a', color: 'white' }}>{sh}</Avatar>}
                            label={data.label}
                            clickable
                            style={{ backgroundColor: data?.key == active ? 'rgba(78, 181, 141, 0.67)' : '#e0e0e0', color: data?.key == active ? 'white' : 'black', margin: '10px', borderRadius: '10px' }}
                            onClick={() => click(data)}
                        />
                    </li>
                );
            })}
        </StatWrapper>
    );
}