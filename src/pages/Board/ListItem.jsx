import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { generateFromString } from "generate-avatar";
import styled from "styled-components";

const ListItem = ({ item, index, removeTask }) => {
  return (
    <Draggable draggableId={`${item.prefix}-${item.id}`} index={index}>
      {(provided, snapshot) => {
        return (
          <DragItem
            ref={provided.innerRef}
            snapshot={snapshot}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <CardHeader>
              {`${item?.content} - ${item?.date}`}
              <button onClick={() => removeTask(item?.prefix, index)}>X</button>
            </CardHeader>
            <CardFooter>
              <span>{item?.description}</span>
              <Author>
                <Avatar
                  src={`data:image/svg+xml;utf8,${generateFromString(item?.id || 'random')}`}
                />
              </Author>
            </CardFooter>
          </DragItem>
        );
      }}
    </Draggable>
  );
};

export default ListItem;

const Avatar = styled.img`
  height: 30px;
  width: 30px;
  border: 3px solid white;
  border-radius: 50%;
`;

const CardHeader = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  display: flex;
  justify-content: space-between;

  button {
    background: #ebecf0;
    color: #b92525;
    font-weight: bold;
    border-radius: 4px;
    border: none;
    cursor: pointer;
  }
`;

const Author = styled.div`
  display: flex;
  align-items: center;
`;
const CardFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    color: #444;
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
  }
`;

const DragItem = styled.div`
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  background: white;
  margin: 0 0 8px 0;
  display: grid;
  grid-gap: 20px;
  flex-direction: column;
`;
