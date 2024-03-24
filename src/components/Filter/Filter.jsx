// Filter.js
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { ThemeProvider, createTheme } from "@mui/material/styles";
const theme = createTheme({
  palette: {
    primary: {
      main: "#2f3a8e", 
    },
    secondary: {
      main: "#2f3a8e", 
    },
  },
});

const Filter = ({ onFilterChange, filter }) => {
  const [filterOption, setFilterOption] = useState(""); 
  const {t} = useTranslation()

  const handleFilterChange = () => {
    onFilterChange(filterOption);
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel htmlFor="filterOption">{t("Select Group:")}</InputLabel>
            <Select
              id="filterOption"
              value={filterOption}
              fullWidth
              onChange={(e) => setFilterOption(e.target.value)}
              label={t("Select Group:")}
              sx={{ borderRadius: "10px", p: 0, height: "50px" }}
            >
              <MenuItem value="" disabled>
                {t("Select an option")}
              </MenuItem>
              <MenuItem value="reset">
                {t("Reset")}
              </MenuItem>
              {filter.map((item) => (
                <MenuItem value={item.value} key={item.value}>
                  {item.name}
                </MenuItem>
              ))}
              {/* Add other options as needed */}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            onClick={handleFilterChange}
            sx={{ p: 2, height: "45px", color: 'white' }}
          >
            {t("Filter")}
          </Button>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Filter;
