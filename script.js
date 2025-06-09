document.addEventListener("DOMContentLoaded", function () {
  const sheetID = "11gRdLuULWFdqkCCcmpUFYigk4yEixjNhAytbThZDz2M";
  const gid = "1194924944";
  const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&gid=${gid}`;

  fetch(url)
    .then(response => response.text())
    .then(dataText => {
      const jsonData = JSON.parse(dataText.substring(47).slice(0, -2));
      const rows = jsonData.table.rows;

      let output = "<table border='1' style='margin:auto;color:white;width:90%'>";
      rows.forEach(row => {
        output += "<tr>";
        row.c.forEach(cell => {
          let value = cell?.v ?? "";

          // Convert raw Google Sheets date objects like Date(1899,11,30,0,0,0)
          if (typeof value === "string" && value.includes("Date(")) {
            try {
              const dateParts = value
                .replace("Date(", "")
                .replace(")", "")
                .split(",")
                .map(x => parseInt(x));
              const [y, m, d, h, mi, s] = dateParts;
              const dateObj = new Date(y, m, d, h, mi, s);
              value = dateObj.toLocaleString();
            } catch (e) {
              // fallback if error
              value = value;
            }
          }

          output += `<td>${value}</td>`;
        });
        output += "</tr>";
      });

      output += "</table>";
      document.getElementById("dashboard-content").innerHTML = output;
    })
    .catch(err => {
      document.getElementById("dashboard-content").innerHTML = "<p>Error loading data. Please check your connection.</p>";
    });
});
