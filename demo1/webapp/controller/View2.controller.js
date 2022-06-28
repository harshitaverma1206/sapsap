sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageToast,JSONModel) {
        "use strict";

        return Controller.extend("demo1.controller.View2", {
            onInit: function () {
                this._oRouter= sap.ui.core.UIComponent.getRouterFor(this);

                var oModel=new JSONModel();
                oModel.loadData("/model/data.json");
                this.getView().setModel(oModel,"car");
            },
            next:function(){
                this._oRouter.navTo("RouteView3");
            }
    
        });
    });


