import React from "react";
import Button from "../atoms/Button"; // Adjust the import path as necessary
import { Box, Typography } from "@mui/material";

export interface Month {
  month_num: number;
  selected: boolean;
}

interface ExcelUploaderMonthsProps {
  months: Month[];
  handleMonthSelect: (selected_month: number) => void;
}

export const ExcelUploaderMonths: React.FC<ExcelUploaderMonthsProps> = ({ months, handleMonthSelect }) => {
  return (
    <>
      <Typography variant="h6" component="h2" fontWeight={700} marginBottom={2}>
        🦄 Miesiące:
      </Typography>
      <Box
        justifyContent="flex-start"
        marginBottom={4}
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        gap={2} // Adjust gap to your preference
      >
        {months.length > 0 &&
          months.map(({ month_num, selected }, index) => (
            <Button
              key={index}
              selected={selected}
              label={month_num.toString()} // Convert number to string for label
              onClick={() => handleMonthSelect(month_num)}
            />
          ))}
      </Box>
    </>
  );
};
