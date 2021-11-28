import React, { useEffect } from "react";
import styled from "styled-components";
import { DragDropContext } from "react-beautiful-dnd";
import DraggableElement from "./DraggableElement";
import Header from "../../components/Header";
import { tasks } from '../../data/tasks.json';

const Board = () => {
  const [elements, setElements] = React.useState({});
  const [tasksList, setTasks] = React.useState(tasks);
  const [lists, setLists] = React.useState([]);

  const getItems = (prefix) =>
    tasksList.filter((f) => f.Status === prefix).map((t, i) => ({
      id: `${i}`,
      prefix: t?.Status,
      content: t?.Task,
      description: t?.Description
    }));

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

  const generateLists = () => {
    const list = Array.from(new Set(tasksList?.map((t) => t?.Status))) || [];
    setLists(list);

    return list.reduce(
      (acc, listKey) => ({ ...acc, [listKey]: getItems(listKey) }),
      {}
    );;
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
    console.log(listCopy, result);

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

    setElements(listCopy);
  };

  return (
    <>
      <Header />
      <DragDropContextContainer>
        <DragDropContext onDragEnd={onDragEnd}>
          <ListGrid>
            {lists?.map((listKey) => (
              <DraggableElement
                elements={elements[`${listKey}`]}
                key={listKey}
                prefix={listKey}
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
  margin-top: 4.5em;
  min-height: 100vh;
`;

const ListGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 2%;
`;