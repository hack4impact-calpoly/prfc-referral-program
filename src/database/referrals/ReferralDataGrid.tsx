"use client"; //marks as a client component (MUI required)

import { DataGrid, GridRowsProp, GridColDef, GridToolbar, GridToolbarQuickFilter } from "@mui/x-data-grid";
import * as React from "react";

//populating with dummy data
const rows: GridRowsProp = [
  {
    id: 1,
    member_name: "John",
    member_email: "john@gmail.com",
    prospect_name: "Alice",
    prospect_email: "alice@gmail.com",
    referral_code: "11111",
    redeemed: true,
  },
  {
    id: 2,
    member_name: "Bob",
    member_email: "bob@gmail.com",
    prospect_name: "Joe",
    prospect_email: "joe@gmail.com",
    referral_code: "11112",
    redeemed: true,
  },
  {
    id: 3,
    member_name: "Bill",
    member_email: "bill@gmail.com",
    prospect_name: "Rob",
    prospect_email: "rob@gmail.com",
    referral_code: "11113",
    redeemed: true,
  },
];

//fields for data
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "member_name", headerName: "MemberName", width: 150, sortable: true },
  { field: "member_email", headerName: "MemberEmail", width: 150, sortable: true },
  { field: "prospect_name", headerName: "ProspectName", width: 150, sortable: true },
  { field: "prospect_email", headerName: "ProspectEmail", width: 150, sortable: true },
  { field: "referral_code", headerName: "Code", width: 150 },
  { field: "redeemed", headerName: "Redeemed", width: 150 },
];

//allowing for searching and sorting
export default function ReferralDataGrid() {
  return (
    <div style={{ height: 300, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />
    </div>
  );
}
