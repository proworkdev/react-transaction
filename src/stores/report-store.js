import { EventEmitter } from 'events';

import Api from '../services/reportsapi';
import * as moment from 'moment';


class ReportStore extends EventEmitter {
    constructor(){
        super();
        this.prefix = 'REPORTS_STORE_';
        this.paySchedule = [];
        this.priceSchedule = [];
        this.dropzoneTodayActivity = {};
	}
	

	setListeners = (socket) =>{ 
        socket.on("getInvoiceByCategory", data => {
			//console.log(data);
			//var loading = true;
			//this.emitResults(loading,'loaderActivity');
        });    
    }
	
	loadPrices = () => {
		//console.log('in load Prices');
		return new Promise((resolve, reject) => {
			Api.loadPrices().then((r) => {
				if (r.status == 200) {
					var prices = r.data;
					this.paySchedule = r.data.paySchedule;
					this.priceSchedule = r.data.priceSchedule;
					//console.log("price data:" + JSON.stringify(r.data))
					resolve(prices);
				} else {
					this.emitError({ message: 'could not load prices.' });
				}
			})
				.catch(err => {
					this.emitError({ message: 'Incomplete or Invalid data present' });
					reject(err);
				});
		});
	}

   
    
    getInvoiceByCategory = (startDate,endDate) => {
    	return new Promise((resolve, reject)=>{
    		Api.GetInvoiceByCategory(startDate,endDate).then((r)=>{
    			if(r.status==200){
    				var invoice = r.data;
					//console.log("categoryapidata:"+JSON.stringify(r.data))
					
    			   	resolve(invoice);
				}
				else if(r.status == 500)
				{
					resolve(false);
				}
				else {
          this.emitError({message:'could not get Invoice report, please contact support.'});
				}
				var loading = true;
				this.emitResults(loading,'loaderActivity');
    		})
    		.catch(err => {
    			this.emitError({message:'Incomplete or Invalid data present'});
    			reject(err);
    		});
    	});
	}
	

	GetJumperLogs = (start,end,id) => {
    	return new Promise((resolve, reject)=>{
    		Api.GetJumperLogs(start,end,id).then((r)=>{
    			if(r.status==200){
    				var jumperLogs = r.data;
    			   	resolve(jumperLogs);
                }else{
				  this.emitError({message:'could not get Jumper Logs, please contact support.'});
				  resolve(false);
				}
				var loading = true;
				this.emitResults(loading,'loaderActivity');
    		})
    		.catch(err=>{
    			this.emitError({message:'Incomplete or Invalid data present'});
    			reject(err);
    		});
    	});
    }
	
	
	GetSlots = (start,end) => {
    	return new Promise((resolve, reject)=>{
    		Api.GetSlots(start,end).then((r)=>{
    			if(r.status==200){
    				var slots = r.data;
					////console.log("apidata:"+JSON.stringify(r.data))
    			   	resolve(slots);
                }else{
				  this.emitError({message:'could not get Slots, please contact support.'});
				  resolve(false);
				}
				var loading = true;
				this.emitResults(loading,'loaderActivity');
    		})
    		.catch(err=>{
    			this.emitError({message:'Incomplete or Invalid data present'});
    			reject(err);
    		});
    	});
	}

	GetStaffSummary = (start,end) => {
    	return new Promise((resolve, reject)=>{
    		Api.GetStaffSummary(start,end).then((r)=>{
    			if(r.status==200){
    				var invoice = r.data;
					//console.log("apidata:"+JSON.stringify(r.data))
    			   	resolve(invoice);
                }else{
				  this.emitError({message:'could not get Staff summary, please contact support.'});
				  resolve(false);
				}
				var loading = true;
				this.emitResults(loading,'loaderActivity');
    		})
    		.catch(err=>{
    			this.emitError({message:'Incomplete or Invalid data present'});
    			reject(err);
    		});
    	});
	}

	UpdatePaySchedule = (id, priceBody) => {
		return new Promise((resolve, reject) => {
			Api.updatePaySchedule(id, priceBody).then((r) => {
				if (r.status == 200) {
					//console.log('Update PaySchedule');
					var status = true;
					this.emitResults(status,'priceActivity');
				} 
				else {
					this.emitError({ message: 'Price could not be updated, please contact support.' });
				}
			})
				.catch(err => {
					this.emitError({ message: 'Incomplete or Invalid data present' });
					reject(err)
				});
		});
	}

	UpdatePriceSchedule = (id, priceBody) => {
		return new Promise((resolve, reject) => {
			Api.updatePriceSchedule(id, priceBody).then((r) => {
				if (r.status == 200) {
					//console.log('updated price');
					var status = true;
					this.emitResults(status,'priceActivity');
				} 
				else {
					this.emitError({ message: 'Price could not be updated, please contact support.' });
				}
			})
				.catch(err => {
					this.emitError({ message: 'Incomplete or Invalid data present' });
					reject(err)
				});
		});
	}

    loadDropzoneTodayActivity = () => {
    	return new Promise((resolve, reject)=>{ 	
    		Api.getDropzoneTodayActivity().then((r)=>{
    			if(r.status==200){
    				this.setDropzoneTodayActivity(r.data);
    				this.emitResults(this.getDropzoneTodayActivity(),'loadDropzoneDailyActivity'); 
    				resolve(r.data);
                }else{
                  this.emitError({message:'Load could not be created, please contact support.'});
                }
    		})
    		.catch(err=>{
    			this.emitError({message:'Incomplete or Invalid data present'});
    			reject(err);
    		});
    	});
    }
	
	getDropzoneTodayActivity = () => {
		return this.dropzoneTodayActivity;
	}
	
	setDropzoneTodayActivity = (dropzoneTodayActivity) => {
		//console.log('in set DropzoneTodayActivity');
		this.dropzoneTodayActivity = dropzoneTodayActivity;
	}

	clearState = () => {
		this.paySchedule = [];
        this.priceSchedule = [];
        this.dropzoneTodayActivity = {};
	}
	
    emitError = (err) => {
        var payload = {...err};
        this.emit('ERROR',payload);
    }
    
    getEventPrefix=(func)=>{
        return `${this.prefix}${func}`;
    }
    
    emitResults = (r,func)=>{
        if(!r){
            //console.log(r);
            this.emitError({alert:true,message:'No Slots found'});
        }
        this.emit(`${this.prefix}${func}`,r);
    }
    
    debug=(r)=>{
        //console.log(r.data);
    }      
}

const reportStore = new ReportStore();
window.reportStore = reportStore;
export default reportStore;