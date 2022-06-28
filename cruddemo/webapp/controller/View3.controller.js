sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,History,MessageBox) {
        "use strict";

        return Controller.extend("cruddemo.controller.View3", {
            onInit: function () {

                this._oRouter= sap.ui.core.UIComponent.getRouterFor(this);
                this._oRouter.getRoute("RouteView3").attachPatternMatched(this._onRouteMatched,this);

                
                
            },
            _onRouteMatched:function(oEvent){
                
                var oBusy= new sap.m.BusyDialog({
                    showCancelButton:true,
                    cancelButtonText:"stop",
                    customIcon:"https://img.icons8.com/nolan/64/loading-sign.png",
                    text:"trying to get data"
                 });
                oBusy.open();
                window.setTimeout(()=>{
                    oBusy.close();
                },3000);
                var aPath ="/SalesOrderSet"+"("+"'"+oEvent.getParameter("arguments").item+"'"+")"+"/ToLineItems";
                console.log(aPath);
                // this.getView().bindElement(aPath);

                var oModel = this.getView().getModel();
                

                var localModel = new JSONModel([]);
                this.getView().setModel(localModel, "LocalModel");
                
                oModel.read(aPath, {
                    success: function (oData) {
                        localModel.setProperty("/LineItems", oData.results);
                    },
                    error: function (oError) {
                        MessageBox.error("technical error", {
                            title: "error"
                        });
                    }
                });
            },

            onBack:function(oEvent){
                window.history.go(-1);
            },
            toggleCount:function(){
                var toggle=this.getView().byId("to").getVisible();
                if(toggle===true){
                    this.getView().byId("to").setVisible(false);
                }
                else{
                    this.getView().byId("to").setVisible(true);
                }
            },
            getProCount:function(oEvent){
                var count=oEvent.getParameter("total");
                this.byId("to").setText("Total Record(" + count + ")");
            },
            
            
           

        });
    });
