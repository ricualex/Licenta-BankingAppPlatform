import React from "react";
import "../../../InternetBankingStyle.css"
import { TableRow, TableCell } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import UpdateIcon from '@mui/icons-material/Update';

const TransactionRow = ({ icon, data }) => {
    return (
        <TableRow>
            <TableCell className="icon-cell">
                {icon === "clock" ? <UpdateIcon sx={{ color: 'white', fontSize: 25 }} /> : <PersonIcon sx={{ color: 'white', fontSize: 25 }} />}
            </TableCell>
            {data.map((cell, index) => (
                <TableCell className="data-cell" key={index} style={{ color: "white", margin: "0px", padding: "0px", fontSize: "1.8vh" }}>{cell}</TableCell>
            ))}
        </TableRow>
    );
}

export default TransactionRow;