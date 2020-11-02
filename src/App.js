import "./App.css";
import Radar from "react-d3-radar";
import { useState } from "react";

const initValues = (dimensions) => {
  const values = {};
  dimensions.forEach((dimension) => {
    values[dimension] = 0;
  });
  return values;
};

const dimensions = [
  { key: "a", label: "A 生命" },
  { key: "b", label: "B 生理" },
  { key: "c", label: "C 心理" },
  { key: "d", label: "D 生活" },
  { key: "e", label: "E 经济" },
  { key: "f", label: "F 社会" },
];
const scenarios = [
  { key: "a", label: "职业", values: initValues(dimensions) },
  { key: "b", label: "人际关系", values: initValues(dimensions) },
  { key: "c", label: "工作环境", values: initValues(dimensions) },
  { key: "d", label: "乘客", values: initValues(dimensions) },
  { key: "e", label: "家庭", values: initValues(dimensions) },
];

function App() {
  const [headers, setHeaders] = useState(dimensions);
  const [rows, setRows] = useState(scenarios);

  function onChange(rowk, columnk, value) {
    if (value > 5) {
      return;
    }
    setRows((rows) =>
      rows.map((row, index) => {
        if (index == rowk) {
          return {
            ...row,
            values: {
              ...row.values,
              [columnk]: value,
            },
          };
        }
        return row;
      })
    );
  }
  function onVisibleChange(currentRow) {
    setRows((rows) =>
      rows.map((row) => {
        if (row.key == currentRow.key) {
          return {
            ...row,
            visible: !row.visible,
          };
        }
        return row;
      })
    );
  }

  return (
    <div className="chart-app">
      <div className="inputs">
        <table className="table">
          <thead>
            <tr className="header">{renderHeaders(headers)}</tr>
          </thead>
          <tbody>{renderRows(rows, headers)}</tbody>
        </table>
      </div>
      <div className="result">
        <h2>幸福盘</h2>
        <p>
          让我们一起打开人生的幸福盘
          <br />
          寻找幸福, 创造幸福, 开启人生的幸福之旅!
        </p>
        <Radar
          width={400}
          height={400}
          padding={40}
          domainMax={5}
          highlighted={null}
          onHover={(point) => {
            if (point) {
              console.log("hovered over a data point");
            } else {
              console.log("not over anything");
            }
          }}
          data={{
            variables: headers,
            sets: rows.filter((row) => row.visible),
          }}
        />
      </div>
    </div>
  );

  function renderHeaders(headers) {
    return (
      <>
        <th className="column">类别</th>
        {headers.map(renderHeader)}
        <th className="column">平均</th>
      </>
    );
  }

  function renderHeader(header) {
    return <th className="column">{header.label}</th>;
  }

  function renderRows(rows, headers) {
    return (
      <>
        {rows.map((row, index) => renderRowColumns(row, index, headers))}
        {renderHighestColumns(rows, headers)}
      </>
    );
  }

  function renderRowColumns(row, rowk, headers) {
    const average = Math.floor(
      Object.values(row.values).reduce((a, b) => parseInt(a) + parseInt(b), 0) /
        headers.length
    );

    return (
      <tr>
        <td className="column scenario">
          <input
            type="checkbox"
            value={row.visible}
            onChange={(e) => onVisibleChange(row)}
          />
          {row.label}
        </td>
        {headers.map((header) => renderRowColumn(row, rowk, header))}
        <td className="column input">{average}</td>
      </tr>
    );
  }

  function renderRowColumn(row, rowk, header) {
    return (
      <td className="column">
        <input
          className="input"
          value={row.values[header.key]}
          type="number"
          min={0}
          max={5}
          onChange={(e) => onChange(rowk, header.key, e.target.value)}
        />
      </td>
    );
  }

  function renderHighestColumns(rows, headers) {
    return (
      <tr>
        <td className="column scenario">最高分</td>
        {headers.map((header) => renderHighestColumn(rows, header))}
      </tr>
    );
  }

  function renderHighestColumn(rows, header) {
    const max = Math.max(
      ...rows.map((row) => parseInt(row.values[header.key]) || 0)
    );
    return <td className="column input max">{max}</td>;
  }
}

export default App;
