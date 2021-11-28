import React, { useEffect } from "react";
import styled from "styled-components";
import { DragDropContext } from "react-beautiful-dnd";
import { CSVLink } from 'react-csv';
import DraggableElement from "./DraggableElement";
import Header from "../../components/Header";
import { tasks } from '../../data/tasks.json';

const Board = () => {
  const [elements, setElements] = React.useState({});
  const [tasksList, setTasks] = React.useState(tasks);
  const [lists, setLists] = React.useState([]);
  const [CSVData, setCSVData] = React.useState([]);

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

  const removeFromList = (list, index) => {
    const result = Array.from(list);
    const [removed] = result.splice(index, 1);
    return [removed, result];
  };

  const addToList = (list, index, element) => {
    const result = Array.from(list);
    result.splice(index, 0, element);
    return result;
  };

  const addTask = (status) => {
    console.log('Pending', status);
    // const newTask = {
    //   content: `Added Task - ${elements[status]?.length + 1}`,
    //   date: "7/30/20",
    //   description: "Description",
    //   id: `${elements[status]?.length + 1}`,
    //   prefix: status
    // };

    // elements[status]?.push(newTask);
    // console.log(elements);
    // setElements(elements);
  };

  const generateLists = () => {
    const list = Array.from(new Set(tasksList?.map((t) => t?.Status))) || [];
    setLists(list);

    setCSVData(Object.values(list.reduce(
      (acc, listKey) => ({ ...acc, [listKey]: getItems(listKey) }),
      {}
    )).flat());

    return list.reduce(
      (acc, listKey) => ({ ...acc, [listKey]: getItems(listKey) }),
      {}
    );
  }

  useEffect(() => {
    if (tasks?.length) {
      setTasks(tasks);
      setElements(generateLists());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      removedElement
    );

    setCSVData(Object.values(listCopy).flat());
    setElements(listCopy);
  };

  return (
    <>
      <Header />
      <CSVButton>
        <CSVLink data={CSVData} filename="Tasks.csv" rel="button">
          <span>
            Export
          </span>
        </CSVLink>
      </CSVButton>
      <DragDropContextContainer>
        <DragDropContext onDragEnd={onDragEnd}>
          <ListGrid>
            {lists?.map((listKey) => (
              <DraggableElement
                elements={elements[`${listKey}`]}
                key={listKey}
                prefix={listKey}
                addTask={addTask}
              />
            ))}
          </ListGrid>
        </DragDropContext>
      </DragDropContextContainer>
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
  margin-top: 4.5em;
  background: #182a4d;

  a {
    text-decoration: none;
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

const ListGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 2%;
`;
