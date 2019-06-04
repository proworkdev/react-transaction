import { create } from 'apisauce';
import urls from '../config';
import authStore from '../stores/auth-store';

// define the api

const api = create({
  baseURL: urls.mainApiUrl
});

const func = {};


func.loadPrices = (startdate, endDate) =>{
	console.log('load price data');
	var token = authStore.getAuthToken();
	if(token == '')
	{
	   token = localStorage.getItem("Auth-token");
	}
	console.log(token);
	api.setHeader('Authorization', 'Bearer ' + token)
	return api.get('/reports/loadPrices');
}

func.updatePriceSchedule = (id,priceBody) => {
	console.log('in UpdatePlanes');
	var token = authStore.getAuthToken();
	if(token == '')
	{
	   token = localStorage.getItem("Auth-token");
	}
	console.log(token);
	api.setHeader('Authorization', 'Bearer ' + token)
	return api.put('/admin/priceSchedule/' + id, priceBody);
}

func.updatePaySchedule = (id,priceBody) => {
	console.log('in UpdatePlanes');
	var token = authStore.getAuthToken();
	if(token == '')
	{
	   token = localStorage.getItem("Auth-token");
	}
	console.log(token);
	api.setHeader('Authorization', 'Bearer ' + token)
	return api.put('/admin/paySchedule/' + id, priceBody);
}

func.GetInvoiceByCategory = (startdate, endDate) => {
	console.log('Get Invoice category');
	var token = authStore.getAuthToken();
	if(token == '')
	{
	   token = localStorage.getItem("Auth-token");
	}
	console.log(token);
	api.setHeader('Authorization', 'Bearer ' + token)
	return api.get('/reports/getInvoiceByCategory?start='+startdate+'&end='+endDate);
}

func.GetSlots = (startdate, endDate) =>{
	console.log('Get Slots');
	var token = authStore.getAuthToken();
	if(token == '')
	{
	   token = localStorage.getItem("Auth-token");
	}
	console.log(token);
	api.setHeader('Authorization', 'Bearer ' + token)
	return api.get('/reports/getSlots?start='+startdate+'&end='+endDate);
}

func.GetJumperLogs = (startdate, endDate,id) =>{
	console.log('Get Jumper Logs');
	var token = authStore.getAuthToken();
	if(token == '')
	{
	   token = localStorage.getItem("Auth-token");
	}
	console.log(token);
	api.setHeader('Authorization', 'Bearer ' + token)
	return api.get('/reports/getLocalJumperLogs?start='+startdate+'&end='+endDate +'&jumper='+id);
}


func.GetStaffSummary = (startdate, endDate) =>{
	console.log('Get Staff Summary');
	var token = authStore.getAuthToken();
	if(token == '')
	{
	   token = localStorage.getItem("Auth-token");
	}
	console.log(token);
	api.setHeader('Authorization', 'Bearer ' + token)
	return api.get('/reports/getStaffSummary?start='+startdate+'&end='+endDate);
}

func.getDropzoneTodayActivity = () => {
	console.log('Get dropzone today activity');
	var token = authStore.getAuthToken();
	if(token == '')
	{
	   token = localStorage.getItem("Auth-token");
	}
	console.log(token);
	api.setHeader('Authorization', 'Bearer ' + token)
	return api.get('/reports/getDropzoneTodayActivity');
}

export default func;
 