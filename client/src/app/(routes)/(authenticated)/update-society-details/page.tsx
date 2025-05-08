"use client";

import UpdateBankDetails from "@/src/component/modals/UpdateBankDetails";
import UpdateSocietyDetails from "@/src/forms/UpdateSocietyDetails";
import { Box } from "@mui/material";
import React from "react";

const UpdateSocietyDetailsForm = () => {
  return (
    <Box

      className="flex flex-col items-center md:m-[20px] sm:m-[0px] w-full h-full bg-light-background rounded-2xl"
      sx={{
        backgroundImage: "url(/images/register.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        
      }}
    >
      <Box
        className="mx-48 flex flex-col items-center"
        sx={{
          "@media(max-width:768px)": {
            margin: "0 32px",
          },
        }}
      >
        <UpdateSocietyDetails />
      </Box>
    </Box>
  );
};

export default UpdateSocietyDetailsForm;

