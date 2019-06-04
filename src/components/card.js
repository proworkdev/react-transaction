import React, { Component } from 'react';
import visa from '../images/pay-visa.png'
import master from '../images/pay-mastercard.png'
import american from '../images/pay-american-ex.png'
import api from '../services/api'
import tandemStore from '../stores/store';


// import Cleave from 'cleave.js/react';
import creditCardType, { getTypeInfo, types as CardType } from 'credit-card-type';
import PaymentIcon from 'react-payment-icons';


class CreditCard extends Component {
    constructor(props) {
        super(props);
        this.onCreditCardChange = this.onCreditCardChange.bind(this);
        this.onCreditCardFocus = this.onCreditCardFocus.bind(this);
        this.state = {
            cardType:'',
            cardNumber:'',
            cardHolder:'',
            expire:'',
            timeslotId:this.props.data.slotId,
            passengers:this.props.data.passengers,
            amount:parseInt(this.props.toCharge),
            numVideos:parseInt(this.props.data.videoCount),
            cvv:'',
            selYear:'',
            selMonth:'',
            cardIcon:'',
            //amount:0
        }
    }

    months=['Jan','Feb','Mar','Apr','May','June','Jul','Aug','Sep','Oct','Nov','Dec'];
    card=['MasterCard','Visa'];

    generateYears = () => {
        var currYear = new Date().getFullYear();    
        var yearsArray=[];
        for(let i=0;i<20;i++){
            yearsArray.push(currYear+i);    
        }
        return yearsArray;
    }

    onCreditCardChange(event) {
        // formatted pretty value
        console.log(event.target.value);
        // raw value
        console.log(event.target.rawValue);
    }

    onCreditCardFocus(event) {
        // update some state
    }

    handleSubmit = () => {
        var payload = {...this.state};
        payload.expire = payload.selMonth+payload.selYear;
        payload.token = tandemStore.getTokenVal();
        
        delete payload.selMonth;
        delete payload.selYear;
         
        console.log(payload);
        var body = this.createAuthorizeCaptureBody();
        console.log(body);
        var response = api.authorizeAndCapture(tandemStore.getTokenVal(), tandemStore.getServiceId(), body).then(this.processPaymentResponse);
        //api.makePayment({...payload}).then(this.processPaymentResponse);
    }
    
    createAuthorizeCaptureBody = () => {
    	return {
			"$type" : "AuthorizeAndCaptureTransaction,http://schemas.ipcommerce.com/CWS/v2.0/Transactions/Rest",
			SessionToken : tandemStore.getTokenVal(),
			ApplicationProfileId : tandemStore.getApplicationProfileId(),
			MerchantProfileId : tandemStore.getMerchantProfileId(),
			Transaction : {
				"$type" : "BankcardTransaction,http://schemas.ipcommerce.com/CWS/v2.0/Transactions/Bankcard",
				TenderData : {
					PaymentAccountDataToken : null,
					SecurePaymentAccountData : null,
					CardData : {
						CardType : this.state.cardType.toString(), //visa
						CardholderName : null,
						PAN : this.state.cardNumber.toString(), // 4000000000000002
						Expire : this.state.selMonth+this.state.selYear,  // 1220
					},
					CardSecurityData : {
						AVSData : {
							CardholderName : this.state.cardHolder,
						},
						CVDataProvided : "Provided",
						CVData : this.state.cvv,
					}
				},
				TransactionData : {
                    //Amount : this.state.amount.toFixed(2),
                    Amount : parseInt(this.state.amount).toFixed(2),
					CurrencyCode : "USD",
					TransactionDateTime : new Date().toISOString(),
					CustomerPresent : "Ecommerce",
					EmployeeId : "12345",
					EntryMode : "Keyed",
					OrderNumber : "12345",
					SignatureCaptured : false,
				}
			}
    	}
    }

    processPaymentResponse = (r)=>{
        console.log(r);
        

        if(r.data !== null && r.data !==undefined && r.data.Status==="Successful"){
            var payload = { ...this.state };
            var email = '';
            payload.passengers.forEach(element => {
                if (email == '') {
                    email = element.email;
                }
                else {
                    email = email + ' ,' + element.email;
                }
            });

            var Subject = "Inovice Report";
            var Message = "Your Reservation Has Been Successfull Amount for Date : " + new Date().toISOString("YYYY-MM-DD") + " and The Invoice generated is : " + payload.amount + " ";
            var emailBody = {
                email: email,
                subject: Subject,
                message: Message
            };

            tandemStore.MakeReservation(payload,r.data.TransactionId);
            tandemStore.sendEmail(emailBody);
            alert('Your payment has been processed');
        }else{
            alert('something failed, please try again');
        }
    }

    handleYearSelect=(event)=>this.setState({selYear:event.target.value.slice(-2)})

    handleMonthSelect=(event)=>{
        var month = parseInt(event.target.value);
        if(month>9){
            month = month.toString();
        }else{
            month = '0'+month.toString();
        }
        this.setState({selMonth:month})
    };


    // handleChange (e) {
    //     this.setState({amount: e.target.value});
    // }
    
    handleCvvChange = (event)=>this.setState({cvv:event.target.value});
    // handleAmountChange = (event)=>this.setState({amount:parseInt(event.target.value)});
    handleNameChange = (event)=>this.setState({cardHolder:event.target.value});
    
    handleInput = (event, key) => {
        var data = {};
        if(key==='cardNumber' && event.target.value%1 !== 0){
            data["cardType"]='';
            this.setState(data);
          return; // since we dont have numeric value
        }
        
        var cardnumber = event.target.value;
        var cardType = creditCardType(cardnumber);
        //alert(JSON.stringify(JSON.stringify(cardType[0].type)));
        
        if(cardnumber != '' && cardType.length > 0)
        {
            if (cardType.length > 0) {
                if (cardType[0].type == 'american-express') {
                    data["cardType"] = 'AmericanExpress';
                    data["cardIcon"]='amex';
                }
                else {
                    data["cardType"] = cardType[0].type;
                    data["cardIcon"]='amex';
                }
                if (cardType[0].type == 'visa') {
                    data["cardIcon"]='visa';
                }
                if (cardType[0].type == 'mastercard') {
                    data["cardIcon"]='mastercard';
                }
                if (cardType[0].type == 'discover') {
                    data["cardIcon"]='discover';
                }
            }
        }
        else
        {
            data["cardType"] = '';
        }

        data[key] = event.target.value;
        this.setState(data);
    };

    render() {
        return (
            <article className="card" style={{margin:'auto',background:'#e7f2f6',padding:20,marginBottom:100}}>
                <p style={{marginTop:10,textAlign:'center',color:'rgb(8, 39, 100)',letterSpacing:1,fontSize:18}}>INVOICE</p>
                <div className="card-body p-4">
                    <p style={{textAlign:'center'}}> 

                        <img style={{ marginLeft: 10 }} alt="credit card visa" src={visa} />
                        <img style={{ marginLeft: 10 }} alt="credit card master" src={master} />
                        <img style={{ marginLeft: 10 }} alt="credit card american" src={american} />

                    </p>
                    {/* <p className="alert alert-success">Some text success or error</p> */}

                    <form>
                        <div className="form-group">
                            <label className="invoiceFormLabel">Full name (on the card)</label>
                            <div className="input-group">
                                <input type="text" onChange={this.handleNameChange} className="invoiceFrom form-control" name="username" placeholder="" required="" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="invoiceFormLabel">Card number</label>
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    className="invoiceFrom form-control" 
                                    name="cardNumber" 
                                    placeholder="" 
                                    onChange={(e) => this.handleInput(e, 'cardNumber')}
                                />
                            </div>
                        </div>

                 

                        <div className="row">
                            <div className="col-sm-8">
                                <div className="form-group">
                                    <label className="invoiceFormLabel"><span className="hidden-xs">Expiration</span> </label>
                                    <div className="form-inline">
                                        <select onChange={this.handleMonthSelect} className="invoiceFrom form-control" style={{ width: '45%' }}>
                                            <option>MM</option>
                                            {this.months.map((item,i)=><option key={i} value={(i+1)}>{item}</option>)}
                                        </select>
                                        <span style={{ width: '10px', 'textAlign': 'center' }} > / </span>
                                        <select onChange={this.handleYearSelect} className="invoiceFrom form-control" style={{ width: '45%' }}>
                                            <option>YY</option>
                                            <option value="2015">2015</option>
                                            {this.generateYears().map((item)=><option key={item} value={item}>{item}</option>)}
                                        </select>
                                        
                                    </div>
                                </div>
                            </div>


                            <div className="col-sm-4">
                                <div className="form-group" style={{paddingTop:12}}>
                                    <label className="invoiceFormLabel" data-toggle="tooltip" title="" data-original-title="3 digits code on back side of the card">CVV</label>
                                    <input className="invoiceFrom form-control" onChange={this.handleCvvChange} required="" type="text" />
                                </div>
                            </div>

                            {/* <input value={this.state.value} onChange={this.handleChange.bind(this)}/> */}


                            {
                                this.state.cardType != '' ?
                                    <div class="col-sm-12">
                                        <PaymentIcon
                                            id={this.state.cardIcon}
                                            style={{ margin: 10, width: 100 }}
                                            className="payment-icon"
                                        />
                                    </div>
                                    : ''
                            }
                            
                            {/* <div className="col-sm-12">
                                <div className="form-group" style={{paddingTop:12}}>
                                    <label className="invoiceFormLabel"><span className="hidden-xs">Amount</span> </label>
                                    <input className="invoiceFrom form-control" onChange={this.handleAmountChange} required="" type="text" />
                                </div>
                            </div> */}
                            {/* <div className="col-sm-12">
                            <label className="invoiceFormLabel"><span className="hidden-xs">Card Type</span> </label>
                            <img style={{ marginLeft: 10 }} alt="credit card american" src={american} />
                             <input className="invoiceFrom form-control" onChange={this.handleCvvChange} required="" type="text" />
                                 <div className="input-group">

                                    <input className="invoiceFrom form-control" value={this.state.cardType} type="text" />
                                </div> 
                                 <select onChange={(e) => this.handleInput(e, 'cardType')} className="invoiceFrom form-control">
                                    <option value="">Select</option>
                                    {this.card.map((item=><option key={item} value={item}>{item}</option>))}
                                </select> 
                            </div> */}



                        </div>
                        <button onClick={this.handleSubmit} className="checkoutButton subscribe btn btn-primary btn-block" type="button"> NEXT  </button>
                    </form>
                </div>
            </article>);
    }
}

export default CreditCard;