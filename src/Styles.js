import styled, { keyframes } from "styled-components";

const fade = keyframes`
  from { opacity: 0.1; } 
  to { opacity: 0.4; } 
`;

export const Container = styled.div`
  font-family: "Source Sans Pro", sans-serif;
  padding: 10px;
  max-width: 960px;
  margin: 30px auto;
  margin-bottom: 80px;
`;

export const Header = styled.h1`
  letter-spacing: 1.5px;
  font-size: 45px;
  margin-bottom: 20px;
`;

export const Title = styled.h2`
  margin-top: 50px;
  margin-bottom: 20px;
`;

export const Description = styled.p`
  font-style: italic;
  margin-bottom: 40px;
`;

export const Badge = styled.div`
  display: inline-block;
  position: relative;
  top: -3px;
  left: 4px;
  font-size: 30px;
  background: black;
  color: white;
  padding: 0 12px 2px 12px;
  border-radius: 10px;
`;

export const PasteArea = styled.input`
  background: none;
  border: 0;
  text-align: center;
  font-size: 30px;
  outline: none;
  padding: 5px;
  color: ${props => (props.error ? "red" : "black")};
  transition: color 0.5s ease;

  @media (max-width: 768px) {
    border: 1px solid #cacaca;
  }
`;

export const Dep = styled.div`
  margin-bottom: 29px;
  opacity: ${props => (props.notFound ? 0.2 : 1)};
  animation: ${props =>
    props.fetching ? `${fade} 1s infinite alternate` : ""};
`;

export const Version = styled.span`
  display: inline-block;
  background: ${props => (props.color ? props.color : "black")};
  border-radius: 4px;
  font-size: 13px;
  padding: 2px 8px;
  margin: 2px;
  color: ${props => (props.color ? "black" : "white")};
  opacity: ${props => (props.color ? 1 : props.inBetween ? 0.1 : 1)};
  cursor: pointer;
`;

export const Req = styled.span`
  display: inline-block;
  font-size: 12px;
  margin-right: 4px;
  font-style: italic;
`;

export const Arrow = styled.span`
  display: inline-block;
  user-select: none;
  position: relative;
  margin: 0 5px;
  top: 2px;
  cursor: pointer;
  opacity: ${props => (props.dimmed ? 1 : 0.1)};
`;

export const Info = styled.div`
  margin-top: 10px;
  font-style: italic;
`;

export const Name = styled.a`
  font-size: 22px;
  margin-right: 8px;
  color: black;
  position: relative;
  top: 1px;
`;

export const Command = styled.div`
  margin: 22px 0 0 0;
  font-size: 14px;

  b {
    padding: 0.2em 0.4em;
    margin: 0;
    margin-right: 10px;
    background-color: rgba(27, 31, 35, 0.05);
    border-radius: 3px;
  }
`;

export const Drag = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  background-color: rgba(
    ${props => (props.drop ? "198, 255, 198" : "255, 255, 255")},
    ${props => (props.drop ? 0.5 : 1)}
  );
  z-index: 1;
  color: black;
  text-align: center;
  font-size: 29px;

  div {
    position: relative;
    top: 40%;
    transform: translateY(-50%);
  }
`;
