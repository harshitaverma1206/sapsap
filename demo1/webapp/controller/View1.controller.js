sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageToast) {
        "use strict";

        return Controller.extend("demo1.controller.View1", {
            onInit: function () {
            this._oRouter= sap.ui.core.UIComponent.getRouterFor(this);
            },
            onRatingChanged: function(oEvent) {
				var iValue = oEvent.getParameter("value");
				// MessageToast.show("yuor rating is" +[iValue]);
                alert("yuor rating is" +[iValue])
			},
            
            
            onPress : function () {
                // create dialog lazily
                if (!this.pDialog) {
                    this.pDialog = this.loadFragment({
                        name: "demo1.view.fragments.List"
                    });
                }
    
                this.pDialog.then(function(oDialog) {
                    oDialog.open();
                });
            },

            onCloseDialog:function(){
                this.byId("helloDialog").close();s
            },
            goNext:function(){
                this._oRouter.navTo("RouteView2");
            }

        });
    });
