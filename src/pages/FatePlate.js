import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Radar from "react-d3-radar";

function initValues(dimensions) {
  const values = {};
  dimensions.forEach((dimension) => {
    values[dimension] = 0;
  });
  return values;
}

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

function modifyTargetRow(currentRow, targetRow, callback) {
  if (currentRow.key === targetRow.key) {
    return callback(currentRow);
  }
  return currentRow;
}

const useStyles = makeStyles({
  bg: {
    backgroundColor: "white",
    padding:20
  },
  inputs: {
    margin: "0 10px",
    border: "2px solid",
  },
  table: {
    width: "100%",
    "& th": {
      width: 80,
      textAlign: "center",
    },
    "& td": {
      width: 80,
      textAlign: "center",
    },
  },
  input: {
    fontSize: 20,
    textAlign: "center",
  },
  max: {
    color: "red",
    fontSize: 20,
    height: 35,
  },
  checkbox: {
    float: "left",
  },
  result: {
    margin: 10,
    padding: 10,
    textAlign: "center",
    backgroundColor: "aliceblue",
  },
});

function FatePlate() {
  // const [headers, setHeaders] = useState(dimensions);
  const headers = dimensions;
  const [rows, setRows] = useState(scenarios);
  const classes = useStyles();

  function onChange(targetRow, columnk, value) {
    let number = parseInt(value);
    if (number > 5) {
      number = 5;
    }

    setRows((rows) =>
      rows.map((row) =>
        modifyTargetRow(row, targetRow, (row) => ({
          ...row,
          values: {
            ...row.values,
            [columnk]: number,
          },
        }))
      )
    );
  }
  function onVisibleChange(targetRow) {
    setRows((rows) =>
      rows.map((row) =>
        modifyTargetRow(row, targetRow, (row) => ({
          ...row,
          visible: !row.visible,
        }))
      )
    );
  }

  return (
    <div className={classes.bg}>
      <div className={classes.inputs}>
        <table className={classes.table}>
          <thead>
            <tr className={classes.header}>{renderHeaders(headers)}</tr>
          </thead>
          <tbody>{renderRows(rows, headers)}</tbody>
        </table>
      </div>
      <div className={classes.result}>
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
          onHover={(point) => {}}
          data={{
            variables: headers,
            sets: rows.map((row) => {
              if (row.visible) {
                return row;
              }
              return { ...row, values: initValues(dimensions) };
            }),
          }}
        />
      </div>
    </div>
  );

  function renderHeaders(headers) {
    return (
      <>
        <th>类别</th>
        {headers.map(renderHeader)}
        <th>平均</th>
      </>
    );
  }

  function renderHeader(header) {
    return <th>{header.label}</th>;
  }

  function renderRows(rows, headers) {
    return (
      <>
        {rows.map((row) => renderRowColumns(row, headers))}
        {renderHighestColumns(rows, headers)}
      </>
    );
  }

  function renderRowColumns(row, headers) {
    const average = Math.floor(
      Object.values(row.values).reduce((a, b) => parseInt(a) + parseInt(b), 0) /
        headers.length
    );

    return (
      <tr>
        <td>
          <input
            type="checkbox"
            value={row.visible}
            className={classes.checkbox}
            onChange={(e) => onVisibleChange(row)}
          />
          {row.label}
        </td>
        {headers.map((header) => renderRowColumn(row, header))}
        <td className={classes.input}>{average}</td>
      </tr>
    );
  }

  function renderRowColumn(row, header) {
    return (
      <td>
        <input
          className={classes.input}
          value={row.values[header.key]}
          type="number"
          min={0}
          max={5}
          onChange={(e) => onChange(row, header.key, e.target.value)}
        />
      </td>
    );
  }

  function renderHighestColumns(rows, headers) {
    return (
      <tr>
        <td className={classes.scenario}>
          <input type="checkbox" disabled className={classes.checkbox} />
          最高分
        </td>
        {headers.map((header) => renderHighestColumn(rows, header))}
      </tr>
    );
  }

  function renderHighestColumn(rows, header) {
    const max = Math.max(
      ...rows.map((row) => parseInt(row.values[header.key]) || 0)
    );
    return <td className={classes.max}>{max}</td>;
  }
}

export default FatePlate;
