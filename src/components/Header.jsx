import React from 'react';
import styled from "styled-components";
import { AvatarGroup, Avatar } from '@mui/material';
import { generateFromString } from "generate-avatar";

const Header = () => {
  return (
        <HeaderDiv>
            <Contain>
                <Title>Project Management</Title>
                <AvatarGroup>
                    <Avatar sx={{ bgcolor: 'orange' }}>NM</Avatar>
                    <Avatar sx={{ bgcolor: 'green' }}>RH</Avatar>
                    <Avatar sx={{ bgcolor: 'pink' }}>OP</Avatar>
                    <Avatar src={`data:image/svg+xml;utf8,${generateFromString('RH')}`}>RH</Avatar>
                    <Avatar src={`data:image/svg+xml;utf8,${generateFromString('OP')}`}>OP</Avatar>
                </AvatarGroup>
            </Contain>
        </HeaderDiv>
  );
}

export default Header;

const HeaderDiv = styled.div`
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 4.5em;
    z-index: 1000;
    transition: all 0.3s ease 0s;
    background: linear-gradient(45deg, #314c7c, #314c7c);
`;

const Contain = styled.div`
    margin: auto 5%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    width: auto;
`;

const Title = styled.span`
    color: #FFF;
    font-size: 18px;
    font-weight: 700;
    line-height: 32px;
`;
