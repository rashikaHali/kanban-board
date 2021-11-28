import React from "react";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import ListItem from "./ListItem";

const DraggableElement = ({ prefix, elements }) => (
  <DroppableStyles>
    <ColumnHeader>{`${prefix} (${elements?.length})`}</ColumnHeader>
    <Droppable droppableId={`${prefix}`}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {elements?.map((item, index) => (
            <ListItem key={`${item.prefix}-${item.id}`} item={item} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
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

const DroppableStyles = styled.div`
  padding: 10px;
  border-radius: 3px;
  background: #ebecf0;
`;
