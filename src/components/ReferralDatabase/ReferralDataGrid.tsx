"use client";

import { DataGrid, GridRowsProp, GridColDef, GridToolbar, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import Switch from "@mui/material/Switch";
import jsPDF from "jspdf";

const CustomToolbar = ({ onExport }: { onExport: () => void }) => {
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

      {/* Export to PDF Button */}
      <button
        onClick={onExport}
        style={{
          padding: "8px 16px",
          backgroundColor: "#831002",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Export to PDF
      </button>
    </div>
  );
};

export default function ReferralDataGrid() {
  const [rows, setRows] = useState<GridRowsProp>([]);

  // Handles toggling the 'redeemed' status
  const handleToggleRedeemed = async (id: number) => {
    try {
      const updatedRow = rows.map((row) => (row.id === id ? { ...row, redeemed: !row.redeemed } : row));

      setRows(updatedRow); // Optimistically update the UI

      const response = await fetch(`/api/referral/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ redeemed: !rows.find((row) => row.id === id)?.redeemed }),
      });

      if (!response.ok) throw new Error("Failed to update referral");
    } catch (error) {
      console.error("Error updating referral:", error);
    }
  };

  // Fields for data
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "member_name", headerName: "MemberName", flex: 1, sortable: true },
    { field: "member_email", headerName: "MemberEmail", flex: 1, sortable: true },
    { field: "prospect_name", headerName: "ProspectName", flex: 1, sortable: true },
    { field: "prospect_email", headerName: "ProspectEmail", flex: 1, sortable: true },
    { field: "referral_code", headerName: "Code", flex: 1 },
    {
      field: "redeemed",
      headerName: "Redeemed",
      flex: 1,
      renderCell: (params) => (
        <Switch
          checked={params.value}
          color="primary"
          onChange={() => {
            handleToggleRedeemed(params.id as number);
          }}
        />
      ),
    },
  ];

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

  // Export all rows to PDF
  const exportToPDF = async () => {
    try {
      // Fetch all rows from the database
      const response = await fetch("/api/referral");
      if (!response.ok) throw new Error("Failed to fetch referrals");
      const data = await response.json();

      // Create a new PDF document
      const doc = new jsPDF();

      // Define table columns
      const tableColumns = columns.map((col) => col.headerName);

      // Set initial Y position for the table
      let y = 20;

      // Add title
      doc.setFontSize(14);
      doc.text("Referral Database", 105, y, { align: "center" });
      y += 10;

      // Add table headers
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      let x = 10;
      tableColumns.forEach((header) => {
        doc.text(header, x, y);
        x += 40; // Adjust column width
      });
      y += 10;

      // Add table rows
      doc.setFont("helvetica", "normal");
      data.forEach((row: any) => {
        x = 10;
        columns.forEach((col) => {
          const cellValue = row[col.field as keyof typeof row] || "";
          doc.text(String(cellValue), x, y);
          x += 40; // Adjust column width
        });
        y += 10;

        // Check if the Y position exceeds the page height
        if (y > 280) {
          doc.addPage();
          y = 20; // Reset Y position for the new page
        }
      });

      // Save the PDF
      doc.save("referrals.pdf");
    } catch (error) {
      console.error("Error exporting to PDF:", error);
    }
  };

  return (
    <div style={{ height: 572, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        slots={{ toolbar: () => <CustomToolbar onExport={exportToPDF} /> }}
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
