import React from "react";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import ListItem from "./ListItem";

const DraggableElement = ({ prefix, elements, addTask, removeTask, editTask }) => (
  <DroppableStyles>
    <ColumnHeader>{`${prefix} (${elements?.length})`}</ColumnHeader>
    <Droppable droppableId={`${prefix}`}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {elements?.map((item, index) => (
            <ListItem
              key={`${item?.prefix}-${item?.id}-${item?.content}`}
              item={item}
              index={index}
              removeTask={removeTask}
              editTask={editTask}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
    <Add>
      <button onClick={() => addTask(prefix)}>+</button>
    </Add>
  </DroppableStyles>
);

export default DraggableElement;

const ColumnHeader = styled.div`
  text-transform: uppercase;
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
`;

const Add = styled.div`
  text-align: center;
`;

const DroppableStyles = styled.div`
  padding: 10px;
  border-radius: 3px;
  background: #ebecf0;
`;
