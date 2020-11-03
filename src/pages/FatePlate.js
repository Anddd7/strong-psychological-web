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
  { key: "live", label: "A 生命" },
  { key: "physiological", label: "B 生理" },
  { key: "psychological", label: "C 心理" },
  { key: "life", label: "D 生活" },
  { key: "economic", label: "E 经济" },
  { key: "social", label: "F 社会" },
];
const scenarios = [
  { key: "job", label: "职业", values: initValues(dimensions) },
  { key: "relationship", label: "人际关系", values: initValues(dimensions) },
  { key: "workspace", label: "工作环境", values: initValues(dimensions) },
  { key: "passenger", label: "乘客", values: initValues(dimensions) },
  { key: "family", label: "家庭", values: initValues(dimensions) },
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
    padding: 20,
  },
  inputs: {
    margin: "0 10px",
    // border: "2px solid blanchedalmond",
    boxShadow: "0px 0px 5px 5px blanchedalmond",
  },
  table: {
    width: "100%",
    "& th": {
      width: 80,
      height: 30,
      textAlign: "center",
      backgroundColor: "blanchedalmond",
    },
    "& td": {
      width: 80,
      height: 30,
      textAlign: "center",
    },
  },
  scenario: {},
  input: {
    fontSize: 20,
    width: 55,
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
    margin: "20px 10px",
    // padding: 10,
    textAlign: "center",
  },
  statement: {
    border: "1px solid blanchedalmond",
    boxShadow: "0px 0px 5px 5px blanchedalmond",
    marginBottom: 20,
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
        <div className={classes.statement}>
          <h2>幸福盘</h2>
          <p>
            让我们一起打开人生的幸福盘
            <br />
            寻找幸福, 创造幸福, 开启人生的幸福之旅!
          </p>
        </div>
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
    return <th key={header.key}>{header.label}</th>;
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
        <td className={classes.scenario}>
          <input
            type="checkbox"
            value={row.visible}
            className={classes.checkbox}
            onChange={(e) => onVisibleChange(row)}
          />
          <span>{row.label}</span>
        </td>
        {headers.map((header) => renderRowColumn(row, header))}
        <td className={classes.input}>{average}</td>
      </tr>
    );
  }

  function renderRowColumn(row, header) {
    const key = row.key + "-" + header.key;
    return (
      <td key={key}>
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
          <span>最高分</span>
        </td>
        {headers.map((header) => renderHighestColumn(rows, header))}
      </tr>
    );
  }

  function renderHighestColumn(rows, header) {
    const max = Math.max(
      ...rows.map((row) => parseInt(row.values[header.key]) || 0)
    );
    const key = header.key + "-max";
    return (
      <td key={key} className={classes.max}>
        {max}
      </td>
    );
  }
}

export default FatePlate;
