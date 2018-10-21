import React, { Component } from "react";
import { Command } from "./Styles";

export class Script extends Component {
  render() {
    const { script, command } = this.props;
    return (
      <Command>
        <code>
          <b>{script}</b> {command}
        </code>
      </Command>
    );
  }
}
