import React, { useEffect } from "react";
import styled from "styled-components";
import { DragDropContext } from "react-beautiful-dnd";
import { CSVLink } from 'react-csv';
import Header from "../../components/Header";
// import { tasks } from '../../data/tasks.json';
import DraggableElement from "./DraggableElement";
import EditModal from "./EditModal";
import XLSX from 'xlsx';

const Board = () => {
  const [elements, setElements] = React.useState({});
  const [tasksList, setTasks] = React.useState([]);
  const [lists, setLists] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [status, setSelectedStatus] = React.useState('');
  const [index, setSelectedIndex] = React.useState();

  const getItems = (prefix) => {
    let mappedItems = tasksList.filter((f) => f.Status === prefix).map((t, i) => ({
      id: `${i}`,
      prefix: t?.Status,
      content: t?.Task,
      description: t?.Description,
      date: t?.Date
    }));

    if (mappedItems?.length) {
      mappedItems = mappedItems?.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return mappedItems;
  }

  const addTask = (status) => {
    const newTask = {
      content: `Added Task - ${status} - ${elements[status]?.length + 1}`,
      date: "7/30/20",
      description: "Description",
      id: `${elements[status]?.length + 1}`,
      prefix: status
    };

    setElements(
      {
        ...elements,
        [status]: elements[status].concat(newTask)
      }
    );
  };

  const removeTask = (status, index) => {
    setElements(
      {
        ...elements,
        [status?.prefix]: elements[status?.prefix].filter((item, ind) => ind !== index)
      }
    );
  };

  const editTask = (status, index) => {
    setOpen(true);
    setSelectedStatus(status);
    setSelectedIndex(index);
  };

  const generateLists = () => {
    const list = Array.from(new Set(tasksList?.map((t) => t?.Status))) || [];
    setLists(list);

    return list.reduce(
      (acc, listKey) => ({ ...acc, [listKey]: getItems(listKey) }),
      {}
    );
  }

  useEffect(() => {
    if (tasksList?.length) {
      setElements(generateLists());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasksList]);

  const removeFromList = (list, index) => {
    const result = Array.from(list);
    const [removed] = result.splice(index, 1);
    return [removed, result];
  };

  const addToList = (list, index, element, id) => {
    const result = Array.from(list);
    element['prefix'] = id;
    result.splice(index, 0, element);
    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const listCopy = { ...elements };

    const sourceList = listCopy[result.source.droppableId];
    const [removedElement, newSourceList] = removeFromList(
      sourceList,
      result.source.index
    );
    listCopy[result.source.droppableId] = newSourceList;
    const destinationList = listCopy[result.destination.droppableId];
    listCopy[result.destination.droppableId] = addToList(
      destinationList,
      result.destination.index,
      removedElement,
      result.destination.droppableId
    );

    setElements(listCopy);
  };

  /* generate an array of column objects */
  const make_cols = (refstr) => {
    let o = [],
      C = XLSX.utils.decode_range(refstr).e.c + 1;
    for (var i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i };
    return o;
  };

  const handleFile = (file) => {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = e => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws);
      /* Update state */

      console.log({ cols: make_cols(ws["!ref"]), data: data });
        
      setTasks(data);
    };

    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  }

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) handleFile(files[0]);
  };

  const SheetJSFT = [
    "xlsx",
    "xlsb",
    "xlsm",
    "xls",
    "xml",
    "csv",
    "txt",
    "ods",
    "fods",
    "uos",
    "sylk",
    "dif",
    "dbf",
    "prn",
    "qpw",
    "123",
    "wb*",
    "wq*",
    "html",
    "htm"
  ]
    .map(function(x) {
      return "." + x;
    })
    .join(",");  

  return (
    <>
      <Header />
      <Flex>
        <CSVButton>
          <CSVLink data={Object.values(elements).flat() || []} filename="Tasks.csv" rel="button">
            <span>
              Export to CSV
            </span>
          </CSVLink>
        </CSVButton>
        <div>
          <label htmlFor="file">Spreadsheet</label>
          <input
            type="file"
            className="form-control"
            id="file"
            accept={SheetJSFT}
            onChange={handleChange}
          />
        </div>
      </Flex>
      <DragDropContextContainer>
        <DragDropContext onDragEnd={onDragEnd}>
          <ListGrid>
            {lists?.map((listKey) => (
              <DraggableElement
                elements={elements[`${listKey}`]}
                key={listKey}
                prefix={listKey}
                addTask={addTask}
                removeTask={removeTask}
                editTask={editTask}
              />
            ))}
          </ListGrid>
        </DragDropContext>
      </DragDropContextContainer>
      <EditModal
        open={open}
        updateClick={setOpen}
        status={status}
        index={index}
        setElements={setElements}
        elements={elements}
      />
    </>
  );
}

export default Board;

const DragDropContextContainer = styled.div`
  padding: 5%;
  background: linear-gradient(180deg, #182a4d 0%, #172b4d 100%);
  min-height: 100vh;
`;

const CSVButton = styled.div`
  background: #182a4d;
  width: 20%;

  a {
    text-decoration: none;
    width: 100%;
    color: white;
    font-weight: normal;
    margin: 5%;
    background: #ffffff3d;
    border-radius: 4px;

    span {
      padding: 1em;
    }
  }
`;

const Flex = styled.div`
  display: flex;
  margin-top: 4.5em;
`;

const ListGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 2%;
`;
