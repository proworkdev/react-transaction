import React, { Component } from 'react';
import Hr from './customHr';
import moment from 'moment-timezone'
class DateSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    };
  }
  render() {
    var { slot } = this.props;
    
    var date = slot.datetime;
    var timeZone = slot.timeZone;
    console.log(slot);
    console.log(timeZone);
    console.log(moment(date));
    console.log(moment(date).tz(timeZone).format("DD/MM/YYYY,  h:mm A"));
    return (
      <div className="row" style={{ padding: 10}}>
        <div className="col-xs">
          <button className="btn btn-default fontNoColor" style={{ background: '#c6dee6', color: '#013e8b' }}>
            {slot.eventName.toUpperCase()}
          </button>
          &nbsp;&nbsp;<span className="appFont">:</span>&nbsp;&nbsp;
        </div>
        <div className="col-xs-9">
          <button
            className={(this.props.selected ? "active" : "") + " timeSelect lightButtonBorder appFont inline btn btn-link"}
            onClick={() => this.props.handleClick(slot,slot.eventName)}
          >
            <i className="rounded-circle fa fa-clock-o p-2 roundFix"></i>&nbsp;
            {moment(date).tz(timeZone).format("DD/MM/YYYY,  h:mm A")} {slot.seatsRemaining} Seats available
          </button>
        </div>
        <Hr />
      </div>

    );
  }
}

export default DateSelector;
