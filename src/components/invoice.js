import React, { Component } from 'react';

import CreditCard from './creditCard';

class Invoice extends Component {
  constructor(props) {
    super(props);
    //alert(JSON.stringify(this.props.priceArray));
    console.log(JSON.stringify(this.props.priceArray));
    var priceSchedule = this.props.priceArray.priceSchedule;

    var tandemWeekend= this.getPrice(priceSchedule,"tandem weekend");
    var tandemWeekday= this.getPrice(priceSchedule,"tandem weekday");
    var video = this.getPrice(priceSchedule,"video");
    
    // this.tandemUnitCost = 50;
    // this.tandemVideoCost = 100;
    if(this.props.eventName.trim() == 'weekday Tandem')
    {
       this.tandemUnitCost = parseInt(tandemWeekday);
    }
    else if(this.props.eventName.trim() == 'weekend Tandem')
    {
       this.tandemUnitCost = parseInt(tandemWeekend);
    }
    else if (this.state.EventName.trim() == 'AFF1') {
      this.tandemUnitCost  = parseInt(tandemWeekend);
    }
    else {
      this.tandemUnitCost  = parseInt(tandemWeekend);
    }
    // this.tandemUnitCost = 50;
    this.tandemVideoCost = parseInt(video);
    this.taxPerc = 5;
    
    this.state = {
      passengers: this.props.data.passengers || 0,
      ticketCount: this.props.data.ticketCount || 0,
      videoCount: this.props.data.videoCount || 0,
      slotId: this.props.data.slotId || 0,
      deposit: this.props.data.deposit 
    };
  }

  calculateTax() {
    if(this.state.deposit === true)
    {
       var subTotal =
       this.state.ticketCount * 50 
       return (this.taxPerc / 100) * subTotal;
   }
    else
    {
      var subTotal = 
      this.tandemUnitCost * this.state.ticketCount +
      this.state.videoCount * this.tandemVideoCost;
      return (this.taxPerc / 100) * subTotal;
    }
    
  }

  getPrice(priceSchedule,type)
  {
    var index = priceSchedule.findIndex(x => x.type==type);
    var price = priceSchedule[index].price;
    return price;
  }

  calculateTotal() {
    if (this.state.deposit !== true) {
      var subTotal =
         this.tandemUnitCost * this.state.ticketCount +
         this.state.videoCount * this.tandemVideoCost;
         return subTotal + this.calculateTax();
    }
    else {
      var tandemUnitCost = 50;
      var subTotal =
        tandemUnitCost * this.state.ticketCount;
        return subTotal + this.calculateTax();
    }
  }

  render() {
    return (
      <div className="row justify-content-center">
        <h4
          className="col-md-12 text-center"
          style={{
            fontWeight: 400,
            letterSpacing: 1,
            backgroundColor: '#00419d',
            color: 'white',
            paddingTop: 30,
            paddingBottom: 30
          }}
        >
          SCHEDULE YOUR JUMP
        </h4>
        <div className="col-md-12">
        
          <button onClick = {this.props.goBack} className="checkoutButton subscribe btn btn-primary btn-block" type="button"> BACK </button>

          <div className="card cardOverRide">
            <div className="card-header">ORDER SUMMARY</div>
            <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Count</th>
                <th>Price</th>
                <th>Tax</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tandem</td>
                <td>{this.state.ticketCount}</td>
                <td>${this.state.deposit === true ?  50 * this.state.ticketCount : this.tandemUnitCost * this.state.ticketCount}</td>
                <td>${this.calculateTax()}</td>
              </tr>
                {
                  this.state.deposit === false ?
                    <tr>
                      <td>Video</td>
                      <td>{this.state.videoCount}</td>
                      <td>${this.state.videoCount * this.tandemVideoCost}</td>
                      <td></td>
                    </tr>
                    : ''
                }
                {
                  this.state.deposit === false ?
                    <tr>
                      <td>service fee</td>
                      <td></td>
                      <td>${this.state.videoCount * this.tandemVideoCost}</td>
                      <td></td>
                    </tr>
                    : ''
                }
              <tr>
                <td>TOTAL :</td>
                <td>${this.calculateTotal()}</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>
        <div className="col-md-5">
            <p style={{textAlign:'center',width:'100%',marginTop:30}}>
                <span className="customHeading">PAYMENT</span>
            </p>
            <CreditCard data={this.props.data} toCharge={this.calculateTotal()} />
        </div>
      </div>
    );
  }
}

export default Invoice;
