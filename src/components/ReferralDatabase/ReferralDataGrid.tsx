"use client"; //marks as a client component (MUI required)

import { DataGrid, GridRowsProp, GridColDef, GridToolbar, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { useState, useEffect } from "react";

// Fields for data
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "member_name", headerName: "MemberName", flex: 1, sortable: true },
  { field: "member_email", headerName: "MemberEmail", flex: 1, sortable: true },
  { field: "prospect_name", headerName: "ProspectName", flex: 1, sortable: true },
  { field: "prospect_email", headerName: "ProspectEmail", flex: 1, sortable: true },
  { field: "referral_code", headerName: "Code", flex: 1 },
  { field: "redeemed", headerName: "Redeemed", flex: 1 },
];

const CustomToolbar = () => {
  return (
    <div style={{ padding: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      {/* Search Bar with Border */}
      <div
        style={{
          display: "flex",
          border: "2px solid #831002", // Border color
          borderRadius: "28px",
          padding: "4px 8px",
          backgroundColor: "#fff",
          width: "fit-content",
          marginRight: "16px", // Adds space between search bar and default toolbar
        }}
      >
        <GridToolbarQuickFilter
          sx={{
            border: "none", // Remove default border
            outline: "none", // Remove focus outline
            "& input": {
              textDecoration: "none", // Remove underline from input field
            },
          }}
        />
      </div>

      {/* Styled Default Toolbar */}
      <GridToolbar />
    </div>
  );
};

//allowing for searching and sorting
export default function ReferralDataGrid() {
  const [rows, setRows] = useState<GridRowsProp>([]);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await fetch("/api/referral");
        if (!response.ok) throw new Error("Failed to fetch referrals");
        const data = await response.json();
        setRows(data);
      } catch (error) {
        console.error("Error fetching referrals:", error);
      }
    };

    fetchReferrals();
  }, []);

  return (
    <div style={{ height: 572, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        slots={{ toolbar: CustomToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        sx={{
          border: "2px solid #968676",
          borderRadius: "12px",
          display: "flex",
          gap: "1rem",
          padding: "1rem",
          "& .MuiDataGrid-columnHeader": {
            borderTop: "2px solid #968676", // Border for top of column headers
            backgroundColor: "#EDDDCC !important", // Set the background color of column headers
            color: "#831002", // Set text color of headers
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold", // Force the title text to be bold
            textDecoration: "underline",
          },
          "& .MuiDataGrid-row": {
            "&:nth-of-type(odd)": {
              backgroundColor: "#D9D9D9", // Odd row background color
            },
            "&:nth-of-type(even)": {
              backgroundColor: "#ffffff", // Even row background color
            },
          },
        }}
      />
    </div>
  );
}
