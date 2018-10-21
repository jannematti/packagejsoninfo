import React, { Component } from "react";
import Dropzone from "react-dropzone";
import axios from "axios";
import validator from "validator";
import { Dependencies } from "./Dependencies";
import { Script } from "./Script";
import {
  Container,
  Header,
  Description,
  Drag,
  Badge,
  PasteArea
} from "./Styles";

class App extends Component {
  constructor() {
    super();
    this.state = {
      packagejson: false,
      active: false,
      dependencies: [],
      devDependencies: [],
      peerDependencies: [],
      optionalDependencies: [],
      loading: false,
      url: "",
    };
  }

  componentDidMount() {
    this.focusPasteArea();
  }

  handlePaste = e => {
    const url = e.target.value;

    if (validator.isURL(url) && url.includes("package.json")) {
      this.loadFile(url);
    } else {
      this.setState({ url: "" });
      this.flashError();
    }
  };

  focusPasteArea = () => {
    this.pasteArea.focus();
  };

  flashError() {
    this.setState({ error: true });

    setTimeout(() => this.setState({ error: false }), 1000);
  }

  async fetchUrl(u) {
    let url = u;

    if (url.includes("github.com")) {
      url = u
        .replace("blob/", "")
        .replace("github.com", "raw.githubusercontent.com");
    }

    try {
      const result = await axios.get(url);
      return result.data;
    } catch (e) {
      console.error(e);
    }
  }

  setActive = () => {
    this.setState({ active: true });
  };

  setPassive = () => {
    this.setState({ active: false });
  };

  updateData = result => {
    if (result.title) {
      document.title = `${result.title} - packagejson.info`;
    }

    this.setState({
      packagejson: result,
      active: false,
      loading: false,
      dependencies: result.dependencies,
      devDependencies: result.devDependencies,
      peerDependencies: result.peerDependencies,
      optionalDependencies: result.optionalDependencies
    });

    window.gtag("event", "drop", {
      event_category: "success"
    });
  };

  loadFile = async files => {
    this.setState({ loading: true });

    if (typeof files === "object") {
      const reader = new FileReader();
      reader.readAsBinaryString(files[0]);

      reader.onload = async () => {
        const result = JSON.parse(reader.result);
        this.updateData(result);
      };

      reader.onabort = () =>
        window.gtag("event", "drop", { event_category: "abort" });
      reader.onerror = () =>
        window.gtag("event", "drop", { event_category: "error" });
    } else {
      const result = await this.fetchUrl(files);
      this.updateData(result);
    }
  };

  dragArea = () => (
    <Drag>
      <div>
        <b>Drag</b> your package.json file <br />
        or <b>paste</b> the source url here
      </div>
      <div>
        <PasteArea
          error={this.state.error}
          value={this.state.url}
          onChange={this.handlePaste}
          innerRef={input => {
            this.pasteArea = input;
          }}
        />
      </div>
    </Drag>
  );

  dropArea = () => <Drag drop />;

  result = () => {
    const {
      dependencies,
      devDependencies,
      peerDependencies,
      optionalDependencies
    } = this.state;

    const { name, version, description, scripts } = this.state.packagejson;

    return (
      <>
        <Header>
          {name} <Badge>{version}</Badge>
        </Header>
        <Description>{description}</Description>
        {scripts &&
          Object.keys(scripts).map(s => (
            <Script key={s} script={s} command={scripts[s]} />
          ))}

        <Dependencies deps={dependencies} type={"dependencies"} />
        <Dependencies deps={devDependencies} type={"devDependencies"} />
        <Dependencies deps={peerDependencies} type={"peerDependencies"} />
        <Dependencies
          deps={optionalDependencies}
          type={"optionalDependencies"}
        />
      </>
    );
  };

  render() {
    const { packagejson, active, loading } = this.state;

    return (
      <Container onClick={() => !packagejson && this.focusPasteArea()}>
        <Dropzone
          disableClick
          style={{ position: "relative" }}
          accept={"application/json"}
          onDrop={this.loadFile}
          onDragEnter={this.setActive}
          onDragLeave={this.setPassive}
        >
          {!packagejson && !active && this.dragArea()}
          {active && !loading && this.dropArea()}
          {!!packagejson && this.result()}
        </Dropzone>
      </Container>
    );
  }
}

export default App;
