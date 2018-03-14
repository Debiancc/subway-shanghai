import React from 'react'
import '../styles/Station.css'
import wcActive from '../imgs/wc.png'
import wcInactive from '../imgs/wc0.png'
import elevatorActive from '../imgs/elevator.png'
import elevatorInactive from '../imgs/elevator0.png'
import entranceActive from '../imgs/exit.png'
import entranceInactive from '../imgs/exit0.png'
import stationInfos from '../data/stationInfo.json'
import { lineColor } from '../data/Data'
import TimeSheet from './TimeSheet';

class InfoCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      toiletPosition: false,
      elevator: false,
      entranceInfo: false,
      timesheet: null,
      info: null,
      lastClickId: null,
      line: null,
      timesheetActive: true
    }
  }

  getStyle(infoCard) {
    return {
      display: infoCard.show && this.state.timesheetActive ? 'block' : 'none',
      left: +infoCard.stationPosition.x - 130 + 'px',
      top: +infoCard.stationPosition.y - 20 + 'px'
    }
  }

  getContainerStyle(line) {
    return {
      borderTop: '2px solid ' + lineColor[line]
    }
  }

  changeIconState(id, state) {
    if (state.lastClickId === null) {
      state[id] = true;
    } else {
      if (id === state.lastClickId) {
        state[id] = !state[id];
      } else {
        state.toiletPosition = false;
        state.elevator = false;
        state.entranceInfo = false;
        state[id] = true;
      }
    }
    return state;
  }

  changeState(e) {
    const id = e.target.attributes['id'].value;
    const statId = this.props.infoCard.statId;
    const stationName = this.props.infoCard.stationName;
    const stationInfo = stationInfos[statId];
    const state = this.changeIconState(id, this.state);
    stationInfo[id] = stationInfo[id].replace(/\d+号线/g, word => {
      return '<b>' + word + '</b>'
    });
    stationInfo[id] = stationInfo[id].replace(/\,/g, ',<br />');
    state.info = {__html: stationInfo[id]};
    state.lastClickId = id;
    state.line = stationInfo.timesheet[0].line;
    state.timesheetActive = !(state.toiletPosition || state.elevator || state.entranceInfo);
    this.setState(state);
    e.stopPropagation();
  }
  
  isIconActivated() {
    return this.state.toiletPosition || this.state.elevator || this.state.entranceInfo;
  }

  render() {
    const infoCard = this.props.infoCard;
    const style = {
      display: 'none'
    };
    return (
    <div className="info-card" style={this.getStyle(this.props.infoCard)}>
        <div className="header">
          {infoCard.stationName}
          <span className="icons" onClick={e => this.changeState(e)}>
            <img src={this.state.toiletPosition ? wcActive : wcInactive} alt="卫生间" title="卫生间" id="toiletPosition"/>
            <img src={this.state.elevator ? elevatorActive : elevatorInactive} alt="无障碍电梯" title="无障碍电梯" id="elevator"/>
            <img src={this.state.entranceInfo ? entranceActive : entranceInactive} alt="出入口" title="出入口" id="entranceInfo"/>          
          </span>
        </div>
        <div className="container">
          <TimeSheet timesheet={this.props.infoCard.timesheet} timesheetActive={this.state.timesheetActive} />
          <div className="info-container" style={this.getContainerStyle(this.state.line)} dangerouslySetInnerHTML={this.state.info}></div>
        </div>
    </div>
    )
  }
}

export default InfoCard
