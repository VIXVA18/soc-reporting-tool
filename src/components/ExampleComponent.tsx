import React from "react";

interface ExampleComponentProps {
  text?: string;
}

export const ExampleComponent: React.FC<ExampleComponentProps> = ({
  text = "Hello from ExampleComponent",
}) => {
  return <div>{text}</div>;
};
