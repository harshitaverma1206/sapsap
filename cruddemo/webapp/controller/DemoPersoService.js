sap.ui.define(["jquery.sap.global"],
	function (jQuery) {
		"use strict";

		// Very simple page-context personalization
		// persistence service, not for productive use!
		var DemoPersoService = {

			oData: {
				_persoSchemaVersion: "1.0",
				aColumns: [{
					id: "app-empTableID-busId",
					order: 0,
					text: "BusinessPartner Id",
					visible: true
				}, {
					id: "app-empTableID-comName",
					order: 1,
					text: "Company Name",
					visible: true
				}, {
					id: "app-empTableID-email",
					order: 3,
					text: "Email",
					visible: true
				}, {
					id: "app-empTableID-phone",
					order: 4,
					text: "Phone Number",
					visible: false
				}
            ]
			},

			getPersData: function () {
				var oDeferred = new jQuery.Deferred();
				if (!this._oBundle) {
					this._oBundle = this.oData;
				}
				var oBundle = this._oBundle;
				oDeferred.resolve(oBundle);
				return oDeferred.promise();
			},

			setPersData: function (oBundle) {
				var oDeferred = new jQuery.Deferred();
				this._oBundle = oBundle;
				oDeferred.resolve();
				return oDeferred.promise();
			},

			resetPersData: function () {
				var oDeferred = new jQuery.Deferred();
				var oInitialData = {
					_persoSchemaVersion: "1.0",
					aColumns: [{
						id: "app-empTableID-busId",
						order: 0,
						text: "BusinessPartner Id",
						visible: true
					}, {
						id: "app-empTableID-comName",
						order: 1,
						text: "Company Name",
						visible: true
					}, {
						id: "app-empTableID-email",
						order: 3,
						text: "Email",
						visible: true
					}, {
						id: "app-empTableID-phone",
						order: 4,
						text: "Phone Number",
						visible: false
					}
                    
                    
                   ]
				};

				//set personalization"
				this._oBundle = oInitialData;

				//reset personalization, i.e. display table as defined
				//		this._oBundle = null;

				oDeferred.resolve();
				return oDeferred.promise();
			},

			getGroup: function (oColumn) {
				if (oColumn.getId().indexOf("busId") !== -1 ||
					oColumn.getId().indexOf("comName") !== -1) {
					return "Primary Group";
				}
				return "Secondary Group";
			}
		};

		return DemoPersoService;

	});

