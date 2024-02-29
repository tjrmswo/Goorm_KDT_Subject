const spreadSheetContainer = document.querySelector("#spreadSheet-container");
const exportbtn = document.querySelector("#export-btn");
const rows = 10;
const cols = 10;
const spreadsheet = [];

const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

class Cell {
  constructor(
    isHeader,
    disabled,
    data,
    row,
    column,
    rowName,
    columnName,
    active = false
  ) {
    this.isHeader = isHeader;
    this.disabled = disabled;
    this.data = data;
    this.row = row;
    this.column = column;
    this.active = active;
    this.rowName = rowName;
    this.columnName = columnName;
  }
}
exportbtn.onclick = function (e) {
  let csv = "";
  for (let i = 0; i < spreadsheet.length; i++) {
    csv +=
      spreadsheet[i]
        .filter((item) => !item.isHeader)
        .map((item) => item.data)
        .join(",") + "\r\n";
  }
  console.log(csv);
  const csvObj = new Blob([csv]);
  const csvUrl = URL.createObjectURL(csvObj);
  console.log("csv:", csvUrl);

  const a = document.createElement("a");
  a.href = csvUrl;
  a.download = "Spreadsheet File Name.csv";
  a.click();
};

initSpreadsheet();

function initSpreadsheet() {
  for (let i = 0; i < rows; i++) {
    let spreadsheetRow = [];

    for (let j = 0; j < cols; j++) {
      let cellData = "";
      let isHeader = false;
      let disabled = false;

      if (j === 0) {
        cellData = i;
        isHeader = true;
        disabled = true;
      }

      if (i === 0) {
        cellData = alphabet[j - 1];
        isHeader = true;
        disabled = true;
      }

      if (!cellData) {
        cellData = "";
      }

      const rowName = i;
      const columnName = alphabet[j - 1];
      const cell = new Cell(
        isHeader,
        disabled,
        cellData,
        i,
        j,
        rowName,
        columnName,
        false
      );
      spreadsheetRow.push(cell);
    }
    spreadsheet.push(spreadsheetRow);
  }
  drawSheet();
  console.log(spreadsheet);
}

function createCellEl(cell) {
  const cellEl = document.createElement("input");
  cellEl.className = "cell";
  cellEl.id = "cell_" + cell.row + cell.column;
  cellEl.value = cell.data;
  cellEl.disabled = cell.disabled;

  if (cell.isHeader) {
    cellEl.classList.add("header");
  }

  cellEl.onclick = () => handleCellClick(cell);
  cellEl.onchange = (e) => handleOnChange(e.target.value, cell);

  return cellEl;
}

function handleOnChange(data, cell) {
  cell.data = data;
}
function handleCellClick(cell) {
  clearHeaderActiveStates();
  const columnHeader = spreadsheet[0][cell.column];
  const rowHeader = spreadsheet[cell.row][0];
  console.log(rowHeader, columnHeader);
  const columnHeaderEl = getElFromRowCol(columnHeader.row, columnHeader.column);
  const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column);
  columnHeaderEl.classList.add("active");
  rowHeaderEl.classList.add("active");
}

function getElFromRowCol(Row, Col) {
  return document.querySelector("#cell_" + Row + Col);
}

function clearHeaderActiveStates() {
  const headers = document.querySelectorAll(".header");

  headers.forEach((header) => {
    header.classList.remove("active");
  });
}

function drawSheet() {
  for (let i = 0; i < spreadsheet.length; i++) {
    const rowContainerEl = document.createElement("div");
    rowContainerEl.className = "cell-row";

    for (let j = 0; j < spreadsheet[i].length; j++) {
      rowContainerEl.append(createCellEl(spreadsheet[i][j]));
    }
    spreadSheetContainer.append(rowContainerEl);
  }
}
