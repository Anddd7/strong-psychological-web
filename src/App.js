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

  return (
    <div className="chart-app">
      <div className="inputs">
        <table className="table">
          <thead>
            <tr className="header">
              <th className="column">类别</th>
              {renderHeaders(headers)}
              <th className="column">总计</th>
            </tr>
          </thead>
          <tbody>{renderRows(rows, headers)}</tbody>
        </table>
      </div>
      <div className="result">
        <h1>幸福盘</h1>
        <div>
          <p>让我们一起打开人生的幸福盘</p>
          <p>寻找幸福, 创造幸福, 开启人生的幸福之旅!</p>
        </div>
        <Radar
          width={500}
          height={500}
          padding={70}
          domainMax={10}
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
            sets: rows,
          }}
        />
      </div>
    </div>
  );

  function renderHeaders(headers) {
    return headers.map(renderHeader);
  }

  function renderHeader(header) {
    return <th className="column">{header.label}</th>;
  }

  function renderRows(rows, headers) {
    return rows.map((row, index) => renderRowColumns(row, index, headers));
  }

  function renderRowColumns(row, rowk, headers) {
    const average =
      Object.values(row.values).reduce((a, b) => parseInt(a) + parseInt(b), 0) /
      headers.length;

    return (
      <tr>
        <td className="column">{row.label}</td>
        {headers.map((header) => renderRowColumn(row, rowk, header))}
        <td>{average}</td>
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
          onChange={(e) => onChange(rowk, header.key, e.target.value)}
        />
      </td>
    );
  }
}

export default App;
