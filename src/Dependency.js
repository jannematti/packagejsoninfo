import React, { Component } from "react";
import semver from "semver";
import moment from "moment";
import ReactTooltip from "react-tooltip";
import axios from "axios";
import { Dep, Version, Arrow, Info, Name } from "./Styles";

export class Dependency extends Component {
  state = {
    showAll: true,
    result: null
  };

  componentDidMount() {
    this.fetchDependencyInfo();
  }

  async fetchDependencyInfo() {
    const { name } = this.props;
    const data = await this.npm(name);

    this.setState({ result: data });
    this.props.inc();
  }

  async npm(p) {
    try {
      return await axios.get(`https://registry.npmjs.cf/${p}/`);
    } catch (e) {
      return { data: { name: p, description: null, notFound: true } };
    }
  }

  toggleAll = () => {
    this.setState({ showAll: !this.state.showAll });
    window.gtag("event", "dependency", {
      event_category: !this.state.showAll ? "reduce" : "expand"
    });
  };

  notFound() {
    return (
      <Dep notFound>
        <Name>{this.props.name}</Name>
        <Info>{""}</Info>
      </Dep>
    );
  }

  fetching() {
    return (
      <Dep fetching>
        <Name>{this.props.name}</Name>
        <Info>{""}</Info>
      </Dep>
    );
  }

  render() {
    if (!this.state.result) return this.fetching();

    const { showAll } = this.state;
    const {
      description,
      versions,
      time,
      notFound,
      homepage
    } = this.state.result.data;

    const { requirement, name } = this.props;

    if (notFound || !versions) return this.notFound();

    const versionKeys = Object.keys(versions);
    const latestRequiredVersion = semver.maxSatisfying(
      versionKeys,
      requirement
    );
    const maxIndex = versionKeys.indexOf(latestRequiredVersion);
    const newVersions = versionKeys.slice(maxIndex + 1);
    const latestDistTag = this.state.result.data["dist-tags"].latest;
    const latestRequiredVersionAgo = moment(
      time[latestRequiredVersion]
    ).fromNow();
    const datedVersion = latestRequiredVersion === latestDistTag;

    const olderColor =
      !datedVersion && latestRequiredVersionAgo.includes("year") && "#ffa5a5";
    const oldColor =
      !datedVersion && latestRequiredVersionAgo.includes("month") && "#ffeb3b";
    const freshColor = "#c6ffc6";

    return (
      <Dep>
        <Name href={homepage}>{name}</Name>
        <Version
          required
          color={olderColor || oldColor || freshColor}
          data-tip={`${requirement} <br /> ${latestRequiredVersionAgo}`}
        >
          {latestRequiredVersion}
        </Version>
        <ReactTooltip key={Math.random()} effect="solid" multiline={true} />
        {newVersions.length > 0 && (
          <Arrow
            onClick={this.toggleAll}
            dimmed={newVersions.length > 1 && showAll}
          >
            →{" "}
          </Arrow>
        )}
        {newVersions.slice(showAll ? -1 : 0).map((v, i) => (
          <Version
            key={i}
            inBetween={v !== latestDistTag}
            data-tip={`${moment(time[v]).fromNow()}`}
          >
            {moment(time[v])
              .fromNow()
              .includes("day") &&
              v === latestDistTag && (
                <small>
                  <span aria-label="aah" role="img">
                    ✨
                  </span>
                </small>
              )}{" "}
            {v}
          </Version>
        ))}
        <Info>{description}</Info>
      </Dep>
    );
  }
}
