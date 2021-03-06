/*
BlazeGears JavaScript Toolkit
Version 1.1.0-s.1, January 1st, 2013

Copyright (c) 2011-2013 Gabor Soos

This software is provided 'as-is', without any express or implied warranty. In
no event will the authors be held liable for any damages arising from the use of
this software.

Permission is granted to anyone to use this software for any purpose, including
commercial applications, and to alter it and redistribute it freely, subject to
the following restrictions:

  1. The origin of this software must not be misrepresented; you must not claim
     that you wrote the original software. If you use this software in a
     product, an acknowledgment in the product documentation would be
     appreciated but is not required.
  2. Altered source versions must be plainly marked as such, and must not be
     misrepresented as being the original software.
  3. This notice may not be removed or altered from any source distribution.

Email: info@yeticave.com
Homepage: http://www.yeticave.com
*/

/*
Class: BlazeGears.XMLRequest [Deprecated]
	This class has been deprecated and its functionality will be completely removed. Can be used for making AJAX requests.

Superclasses:
	<BlazeGears.BaseClass [Deprecated]>

Remarks:
	XML request are done by a wrapper around either the XMLHttpRequest object or an ActiveX component, depending on the browser.

Examples:
	(code)
		xml_request = new BlazeGears.XMLRequest();
		
		xml_request.onAbort = function(self) {
			alert("Request aborted!");
		}
		
		xml_request.onError = function(self) {
			alert("Error code: " + self.getStatus());
		}
		
		xml_request.onSend = function(self) {
			alert("Request started!");
		}
		
		xml_request.onSuccess = function(self) {
			alert(self.getResponse(false)); // alerts the result in plain text format
		}
		
		xml_request.url = "http://www.example.com/fetch_data.php"; // the url sans the query
		xml_request.query = { // the query part of the url
			category: "news&rumors",
			order_by: "date",
			page: 5
		}; // after escaping it will look like this: ?category=news%26rumors&order_by=date&page=5
		xml_request.send();
	(end)
*/
BlazeGears.XMLRequest = BlazeGears.Classes.declareClass(BlazeGears.BaseClass, {
	// Group: Variables
	
	// Field: async
	// If it's true, the request will be asynchronous.
	async: true,
	
	// Field: cache
	// If it's false, upon sending the request some additional headers and URL queries will be applied to disable the caching of the requested URL.
	cache: false,
	
	// Field: header
	// A dictionary that defines the HTTP headers of the request.
	headers: {"content-type": "application/x-www-form-urlencoded;charset=utf-8;"},
	
	// Field: query
	// A dictionary that holds the query part of the URL. Each key will be a query field. Upon sending the query, its values will be escaped.
	query: {},
	
	// Field: url
	// The target URL without the query part.
	url: "",
	
	_aborted: false,
	_request: null,
	_status: null,
	
	// Group: Events
	
	// Method: onAbort
	// Will be fired when the request gets aborted.
	// 
	// See Also:
	//   <abort>
	onAbort: function(self) {},
	
	// Method: onError
	// Will be fired when an error occurs during the request.
	onError: function(self) {},
	
	// Method: onSend
	// Will be fired when at the beginning of sending the request.
	// 
	// See Also:
	//   <send>
	onSend: function(self) {},
	
	// Method: onSuccess
	// Will be fired when the request successfully finishes.
	onSuccess: function(self) {},
	
	// Group: Functions
	
	// Method: abort
	// Aborts the request.
	// 
	// See Also:
	//   <onAbort>
	abort: function(self) {
		self._aborted = true;
		self._request.abort();
		self._request = null;
		
		if (self.onAbort != null) {
			self.onAbort.call(self, self);
		}
	},
	
	// Method: getStatus
	// Returns the HTTP status code of the request, or null, if it wasn't recoded yet.
	getStatus: function(self) {
		return self._status;
	},
	
	// Method: getResponse
	// Returns the response of the request.
	// 
	// Arguments:
	//   [xml = true] - If it's true, the returned response will be an XML document object, else plain text.
	// 
	// Return Value:
	//   Returns the response of the request either as an XML document object or plain text, depending on the provided argument. If the request wasn't completed successfully, it will return null.
	getResponse: function(self, xml) {
		if (!self.is(xml)) xml = true;
		
		if (self._request != null) {
			if (xml) {
				return self._request.responseXML;
			} else {
				return self._request.responseText;
			}
		} else {
			return null;
		}
	},
	
	// Method: send
	// Sends the request.
	// 
	// See Also:
	//   <onSend>
	send: function(self) {
		var headers = self.headers;
		var query = self.query;
		var timestamp;
		var url = self.url + "?";
		
		self._request = false;
		self._status = null;
		
		// try to create the request object
		if (window.XMLHttpRequest) {
			self._request = new XMLHttpRequest();
			if (self._request.overrideMimeType) {
				self._request.overrideMimeType("text/xml");
			}
		} else if (window.ActiveXObject) {
			try {
				self._request = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (exception) {
				try {
					self._request = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (exception) {}
			}
		}
		
		if (!self._request) {
			self.error("BlazeGears.XMLQuery", "Query initialization failed!");
			if (self.onError != null) {
				self.onError.call(self, self);
			}
		} else {
			// add the event listener
			self._request.onreadystatechange = function() {
				if (self._request != null && !self._aborted) {
					if (self._request.readyState == 4) {
						self._status = self._request.status;
						switch (self._request.status) {
							case 0: break;
							
							case 200:
								if (self.onSuccess != null) {
									self.onSuccess.call(self, self);
								}
								break;
							
							default:
								self.error("BlazeGears.XMLQuery", "Fetching failed!", self._request.status);
								if (self.onError != null) {
									self.onError.call(self, self);
								}
						}
					}
				}
			}
			
			// disable caching
			if (!self.cache) {
				headers["if-modified-since"] = new Date(0);
				timestamp = new Date();
				query.timestamp = timestamp.getTime();
			}
			
			// escape the query
			for (var i in query) {
				url += "&" + encodeURI(i) + "=" + encodeURI(query[i]);
			}
			
			// apply the headers and send the request
			self._request.open("GET", url, self.async);
			for (var i in headers) {
				self._request.setRequestHeader(i, headers[i]);
			}
			self._aborted = false;
			self._request.send(null);
			
			// call the event listener
			if (self.onSend != null) {
				self.onSend.call(self, self);
			}
		}
	}
});
