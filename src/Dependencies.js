import React, { Component } from "react";
import { Dependency } from "./Dependency";
import { Title } from "./Styles";

export class Dependencies extends Component {
  state = {
    count: 0,
    inc: () => {
      this.setState({ count: this.state.count + 1 });
    }
  };

  render() {
    const { type, deps } = this.props;

    if (!deps) return false;

    const data = Object.keys(deps);

    return (
      data.length > 0 && (
        <>
          <Title>
            {this.state.count} {type}:{" "}
          </Title>
          {data.map(d => (
            <Dependency
              inc={this.state.inc}
              key={d}
              name={d}
              requirement={deps[d]}
            />
          ))}
        </>
      )
    );
  }
}
