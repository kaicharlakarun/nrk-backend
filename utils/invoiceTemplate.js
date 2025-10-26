function invoiceTemplate({ invoice, trip, company }) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 30px; }
        .invoice-details { font-size: 14px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background-color: #f4f4f4; }

        .website-bar {
          background-color: #234061;
          color: #fff;
          text-align: center;
          font-size: 16px;
          font-weight: bold;
          padding: 10px 20px;
          margin: 0 0 20px 0;
        }

        .logo-container {
          text-align: left;
          margin-bottom: 10px;
        }

        .logo {
          max-height: 120px; /* increased height */
          object-fit: contain;
        }

        .company-info {
          text-align: right;
          margin-bottom: 20px;
        }

        .company-name {
          font-family: 'Poppins', Arial, sans-serif;
          font-size: 32px;
          font-weight: 900;
          color: #234061;
          margin: 0;
        }

        .gst {
          font-size: 14px;
          color: #234061;
          margin-top: 4px;
        }

        .gst span {
          color: #000;
        }
      </style>
    </head>
    <body>
      <!-- Website Bar -->
      <div class="website-bar">
        ${company.website || ""}
      </div>

     <!-- Logo and Company Info in same row -->
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
  <!-- Logo -->
<div style="flex: 0 0 auto;">
  <img 
    src="${company.logo || 'https://via.placeholder.com/150'}" 
    alt="Company Logo"
    style="max-height: 150px; object-fit: contain;" 
  />
</div>


  <!-- Company Info -->
  <div style="flex: 1; text-align: right; margin-left: 20px;">
    <h1 style="font-family: 'Poppins', Arial, sans-serif; font-size: 32px; font-weight: 900; color: #234061; margin: 0;">
      ${company.name}
    </h1>
    <p style="margin: 5px 0;">${(company.address || "").split(",").join("<br/>")}</p>
    <p style="font-size: 14px; color: #234061; margin: 5px 0;">GST: <span style="color:#000;">${company.gst || "N/A"}</span></p>
    ${company.mobile ? `<p style="margin: 5px 0;">Mob no: ${company.mobile}</p>` : ""}
  </div>
</div>

<hr style="border: 1px solid #234061; margin-bottom: 10px;" />
     <!-- Invoice Details -->
<!-- Invoice Heading -->
<h2 style="color: #234061; margin: 0 0 10px 10px;">Invoice</h2>

<!-- Invoice Details Row -->
<div style="display: flex; justify-content: space-between; padding-left: 15px; margin-bottom: 20px;">
  
  <!-- Column 1: Submitted on + Customer -->
  <div style="flex: 1; padding-right: 10px;">
    <p style="margin: 2px 0;"><strong>Submitted on:</strong></p>
    <p style="margin: 2px 0;">${new Date().toLocaleDateString()}</p>
    <p style="margin: 2px 0;"><strong>Customer:</strong></p>
    <p style="margin: 2px 0;">${trip.customerName || 'NA'}</p>
  </div>
  
  <!-- Column 2: Vehicle Type + KM readings -->
  <div style="flex: 1; padding-right: 10px;">
    <p style="margin: 2px 0;"><strong>Type of Vehicle:</strong></p>
    <p style="margin: 2px 0;">${trip.vehicleType || 'NA'}</p>
    <p style="margin: 2px 0;"><strong>Starting KM / Ending KM:</strong></p>
    <p style="margin: 2px 0;">
      ${trip.startingReading !== undefined ? trip.startingReading : 'NA'} &nbsp; / &nbsp;
      ${trip.endingReading !== undefined ? trip.endingReading : 'NA'}
    </p>
  </div>
  
  <!-- Column 3: Invoice Number + Vehicle Number -->
  <div style="flex: 1;">
    <p style="margin: 2px 0;"><strong>Invoice Number:</strong></p>
    <p style="margin: 2px 0;">${invoice.invoiceNumber}</p>
    <p style="margin: 2px 0;"><strong>Vehicle Number:</strong></p>
    <p style="margin: 2px 0;">${trip.vehicleNumber || 'NA'}</p>
  </div>
</div>


      <hr style="border: 1px solid #234061; margin-bottom: 10px;" />



<!-- Description Details Row -->
<div style="display: flex; justify-content: space-between; padding-left: 15px; margin-bottom: 20px;">
  
  <!-- Column 1: Submitted on + Customer -->
  <div style="flex: 1; padding-right: 50px;">
    <p style="margin: 2px 0;"><strong>Description</strong></p>
   <p style="margin: 2px 0;">
  ${trip.fromLocation && trip.endLocation ? `${trip.fromLocation} → ${trip.endLocation} round trip` : 'NA'}
</p>

  </div>
  
  <!-- Column 2: Vehicle Type + KM readings -->
  <div style="flex: 1; padding-right: 10px;">
    <p style="margin: 2px 0;"><strong>HRS/KMS</strong></p>
    <p style="margin: 2px 0;">${trip.vehicleType || 'NA'}</p>
  </div>
  
  <!-- Column 3: Invoice Number + Vehicle Number -->
  <div style="flex: 1;">
    <p style="margin: 2px 0;"><strong>Cost</strong></p>
    <p style="margin: 2px 0;">${trip.tripAmount}</p>
  </div>
  <!-- Column 4: Invoice Number + Vehicle Number -->
  <div style="flex: 1;">
    <p style="margin: 2px 0;"><strong>Total Amount</strong></p>
    <p style="margin: 2px 0;">${trip.tripAmount}</p>
  </div>
</div>

<hr style="border: 1px solid #234061; margin-bottom: 10px;" />

<h2 style="color: #df1a01; font-size:14px; margin: 0 0 10px 10px;">Note :   Including Driver allowances ,tolls and permits.</h2>

<!-- Trip Details Table-like Row -->
<div style="display: flex; flex-direction: column; padding: 15px; margin-bottom: 1px; gap: 5px;">

  <!-- Row 1: Labels -->
  <div style="display: flex; justify-content: space-between;">
    <div style="flex: 1;"><strong>Journey Start Date</strong></div>
    <div style="flex: 1;">${trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-IN').replace(/\//g, '.') : 'NA'}</div>
    <div style="flex: 1; text-align: right;"><strong>Subtotal (Excl. GST)</strong></div>
    <div style="flex: 1; text-align: right;">₹${trip.tripAmount?.toLocaleString() || '0.00'}</div>
  </div>

  <!-- Row 2: Labels/Values -->
  <div style="display: flex; justify-content: space-between;">
    <div style="flex: 1;"><strong>Journey End Date</strong></div>
    <div style="flex: 1;">${trip.endDate ? new Date(trip.endDate).toLocaleDateString('en-IN').replace(/\//g, '.') : 'NA'}</div>
    <div style="flex: 1; text-align: right;"><strong>GST (5%)</strong></div>
    <div style="flex: 1; text-align: right;">₹${trip.tripAmount ? (trip.tripAmount * 0.05).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) : '0.00'}</div>
  </div>

  <!-- Row 3: Advance Received -->
  <div style="display: flex; justify-content: space-between;">
    <div style="flex: 2"></div> <!-- Empty space for the first 2 columns -->
    <div style="flex: 1; text-align: right;"><strong>Advance Received</strong></div>
    <div style="flex: 1; text-align: right;">₹${trip.advanceAmount?.toLocaleString() || '0.00'}</div>
  </div>

  <hr style="border: 1px solid #234061; margin-bottom: 10px; width: 50%; margin-left: auto;  margin-right: 0;"/>
  <!-- Row 3: Grand Total -->
  <div style="display: flex; justify-content: space-between;">
    <div style="flex: 2"></div> <!-- Empty space for the first 2 columns -->
    <div style="flex: 1; text-align: right; font-size:20px"><strong>Grand Total</strong></div>
    <div style="flex: 1; text-align: right;">₹${trip.tripAmount?.toLocaleString() || '0.00'}</div>
    </div>
    <hr style="border: 1px solid #234061; margin-bottom: 10px; width: 50%; margin-left: auto;  margin-right: 0;"/>
</div>

  <!-- Bank Details Section -->
  <div style="margin-top: 15px;">
    <p style="margin: 2px 0;"><strong>Mode of Payment:</strong> ${company.bank?.modeOfPayment || 'NA'}</p>
    <p style="margin: 2px 0;"><strong>Account Holder Name:</strong> ${company.bank?.holder || 'NA'}</p>
    <p style="margin: 2px 0;"><strong>Branch Name:</strong> ${company.bank?.branchAddress || 'NA'}</p>
    <p style="margin: 2px 0;"><strong>Bank Name:</strong> ${company.bank?.bankName || 'NA'}</p>
    <p style="margin: 2px 0;"><strong>Current Account:</strong> ${company.bank?.currentAccount || 'NA'}</p>
    <p style="margin: 2px 0;"><strong>IFSC:</strong> ${company.bank?.ifsc || 'NA'}</p>
  </div>

  <div style="background-color: #234061;
          color: #fff;
          text-align: center;
          font-size: 16px;
          font-weight: bold;
          padding: 10px 20px;
          margin: 20px 0 20px 0;">
        ${company.description || ""}
      </div>
    </body>
  </html>
  `;
}

module.exports = invoiceTemplate;
