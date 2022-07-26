var request = require('request-promise');

/**
 * @param {String} merchantID
 * @param {boolean} sandbox
 */
function ZarinPal(merchantID,sandbox){
    if(typeof merchantID !== 'string'){
        throw new Error("merchantID is Invalid");
    }
    if(merchantID.length === 36){
        this.merchant = merchantID;
    }else{
        console.error('The MerchantID must be ' + 36 + ' Characters.');
    }
    this.sandbox = sandbox || false;
    this.url = (sandbox === true) ? 'https://sandbox.zarinpal.com/pg/v4/payment/' : 'https://api.zarinpal.com/pg/v4/payment/';
	// this.url = (sandbox === true) ? 'https://sandbox.zarinpal.com/pg/rest/WebGate/' : 'https://www.zarinpal.com/pg/rest/WebGate/';
}

/**
 * Get Authority from ZarinPal
 * @param  {number} Amount [Amount on Tomans.]
 * @param  {String} CallbackURL
 * @param  {String} Description
 * @param  {String} Email
 * @param  {String} Mobile
 * @param  {String} AdditionalData
 */
ZarinPal.prototype.PaymentRequestWithExtra = function(input){
    var self = this;
	console.log("--Z r--1");
    var params = {
        merchant_id: 'ab981e2c-1fdf-40af-8229-9f2d22038ebb',
		amount: input.amount,
		callback_url: input.callback_url,
		description: input.description,
		metadata:{
			mobile: input.mobile,
		},
		wages:input.wages,
    };
	console.log("--Z r--2");
	// var params = {
	// 	merchant_id: 'ab981e2c-1fdf-40af-8229-9f2d22038ebb',
	// 	amount: 50000,
	// 	callback_url: "http://192.168.1.104:3000/bills/verify/Ex",
	// 	description: "از اعتماد شما به تریدمستر متشکریم",
	// 	metadata:{
	// 		mobile: 09217135499,
	// 	},
	// 	wages:[
	// 		{
			  
	// 		  iban: "IR260120020000005217837375" ,
	// 		  amount: 45000,
	// 		  description: "سوپر ‏مارکت ‏گلبرگ",
	// 		},
	// 	  ],
	// };
	// var px = 'PaymentRequestWithExtra.json';
    var promise = new Promise(function(resolve,reject){
		console.log("--Z r--3");
        self.request('https://api.zarinpal.com/pg/v4/payment/request.json','','POST',params).then(function(data){
			console.log(data);
			resolve({
                code: data.data.code,
                authority: data.data.authority,
                url: (self.sandbox === true) ? 'https://sandbox.zarinpal.com/pg/StartPay/' : 'https://www.zarinpal.com/pg/StartPay/' + data.data.authority
            });
			console.log("--Z r--4");
        }).catch(function(err){
			console.log(err);
            reject(err);
			console.log("--Z r--5");
        });
    });
	console.log("--Z r--6");
    return promise;
};

/**
 * Validate Payment from Authority.
 * @param  {number} amount
 * @param  {String} authority
 */
ZarinPal.prototype.PaymentVerificationWithExtra = function(input){
	console.log("--Z v--1");
    var self = this;
    var params = {
        merchant_id: 'ab981e2c-1fdf-40af-8229-9f2d22038ebb',
		amount: input.amount,
		authority: input.authority,
    };
	var rx = 'PaymentVerificationWithExtra.json';
    var promise = new Promise(function (resolve, reject) {
		console.log("--Z v--2");
		self.request('https://api.zarinpal.com/pg/v4/payment/verify.json', '', 'POST', {
			merchant_id: 'ab981e2c-1fdf-40af-8229-9f2d22038ebb',
			amount: input.amount,
			authority: input.authority,
		}).then(function (data) {
			resolve({
				code: data.data.code,
				ref_id: data.data.ref_id,
				wages:{
					wages:data.data.code,
					message:data.data.message,
					card_pan:data.data.card_pan,
				}
			});
			console.log("--Z v--3");
		}).catch(function (err) {
			console.log(err);
			reject(err);
			console.log("--Z v--4");
		});
	});
	console.log("--Z v--5");
	return promise;
}

/**
 * Get Unverified Transactions
 * @param  {number} Amount
 * @param  {String} Authority
 */
ZarinPal.prototype.UnverifiedTransactions = function() {
	var self = this;
	var params = {
		MerchantID: 'ab981e2c-1fdf-40af-8229-9f2d22038ebb'
	};

	var promise = new Promise(function (resolve, reject) {
		self.request(self.url, 'UnverifiedTransactions.json', 'POST', params).then(function (data) {
			resolve({
				status: data.Status,
				authorities: data.Authorities
			});
		}).catch(function (err) {
			reject(err);
		});
	});

	return promise;
};

/**
 * Refresh Authority
 * @param  {number} Amount
 * @param  {String} Authority
 */
ZarinPal.prototype.RefreshAuthority = function(input) {
	var self = this;
	var params = {
		MerchantID: 'ab981e2c-1fdf-40af-8229-9f2d22038ebb',
		Authority: input.Authority,
		ExpireIn: input.Expire
	};

	var promise = new Promise(function (resolve, reject) {
		self.request(self.url, 'RefreshAuthority.json', 'POST', params).then(function (data) {
			resolve({
				status: data.Status
			});
		}).catch(function (err) {
			reject(err);
		});
	});

	return promise;
};

/**
 * `request` module with ZarinPal structure.
 * @param  {String}   url
 * @param  {String}   module
 * @param  {String}   method
 * @param  {String}   data
 * @param  {Function} callback
 */
ZarinPal.prototype.request = function(url, module, method, data) {
	var url = url + module;

	var options = {
		method: method,
		url: url,
		headers: {
			'cache-control': 'no-cache',
			'content-type': 'application/json'
		},
		body: data,
		json: true
	};

	return request(options);
};

/**
 * Remove EXTRA ooooo!
 * @param {number} token [API response Authority]
 */
ZarinPal.prototype.TokenBeautifier = function (token) {
	return token.split(/\b0+/g);
};

exports.version = require('../package.json').version;

exports.create = function(MerchantID, sandbox) {
	return new ZarinPal(MerchantID, sandbox);
};