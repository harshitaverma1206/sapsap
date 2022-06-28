sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/TablePersoController",
    "cruddemo/controller/DemoPersoService",
    "sap/ui/core/syncStyleClass",
    
    
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,Filter, FilterOperator,Fragment,TablePersoController,DemoPersoService,syncStyleClass) {
        "use strict";
       

        return Controller.extend("cruddemo.controller.View1", {
            onInit: function () {

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

                this._oRouter= sap.ui.core.UIComponent.getRouterFor(this);
                // this._oRouter.getRoute("RouteView1").attachPatternMatched(this._onRouteMatched,this);

                this._oTPC = new TablePersoController({
                    table: this.byId("empTableID"),
                    //specify the first part of persistence ids e.g. 'demoApp-productsTable-dimensionsCol'
                    componentName: "app",
                    persoService: DemoPersoService
                }).activate();
                this._oTPC.setHasGrouping(true);

               
                


            //    var oModel =this.getView().getModel();
            //    var localModel=new JSONModel([]);
            //    this.getView().setModel(localModel,"LocalModel");
            //    oModel.read("/BusinessPartnerSet",{
            //        success:function(oData){
            //            localModel.setProperty("/BusinessPartnerData",oData.results);
            //        }
            //    });
            },

            onPressSettingsIcon: function (oEvent) {
                this._oTPC.openDialog();
            },


            

            onSelect:function(oEvent){
                // var path = oEvent.getSource().getBindingContextPath().substr(1);
                
                var path = oEvent.getSource().getBindingContext().getPath().substr(1);
                this._oRouter.navTo("RouteView2",{
                    selectedPath : path
                });
                // this._oRouter.navTo("RouteView2");
            },
            onSearch: function (oEvent) {
                var queries = [];
                this.aKeys = [];
                var selectionSet = oEvent.getParameter("selectionSet");
                selectionSet.forEach(function (selection) {
                    if (selection._getSelectedItemText() && selection._getSelectedItemText().length > 0) {
                        this.aKeys.push(selection.getSelectedKey());
                        queries.push(selection._getSelectedItemText());
                    }
                }.bind(this));
                this.filterTable(queries);
            },
            filterTable: function (aCurrentFilterValues) {
                this.getTableItems().filter(this.getFilters(aCurrentFilterValues));
            },

            getFilters: function (aCurrentFilterValues) {
                this.aFilters = [];
    
                this.aFilters = this.aKeys.map(function (sCriteria, i) {
                    if (sCriteria === "")
                        return new Filter(sCriteria, FilterOperator.EQ, parseInt(aCurrentFilterValues[i], 10));
                    else
                        return new Filter(sCriteria, FilterOperator.Contains, aCurrentFilterValues[i]);
                });
    
                return this.aFilters;
            },

            getTable: function () {
                return this.getView().byId("empTableID");
            },
            getTableItems: function () {
                return this.getTable().getBinding("items");
            },
            onExit: function () {
                this.aKeys = [];
                this.aFilters = [];
            },

            languagePopover: function (oEvent) {


                // var oBusy= new sap.m.BusyDialog();
                // oBusy.open();
                // window.setTimeout(()=>{
                //     oBusy.close();
                // },3000);
             
                var oClick = oEvent.getSource();
    
                //create popover
                if (!this._languagePopover) {
                    //MessageToast.show("if  triggered");
                    Fragment.load({
                        name: "cruddemo.view.fragments.Info",
                        controller: this
                    }).then(function (LPopover) {
                        this._languagePopover = LPopover;
                        this.getView().addDependent(this._languagePopover);
    
                        this._languagePopover.openBy(oClick);
                    }.bind(this));
    
                } else {
    
                    this._languagePopover.openBy(oClick);
    
                }

                
            },
            okPressLanguage: function () {
                this._languagePopover.close();
            },
            toggleCount:function(){
                //  var oBusy= new sap.m.BusyDialog({
                //     showCancelButton:true,
                //     cancelButtonText:"stop",
                //     customIcon:"https://img.icons8.com/nolan/64/loading-sign.png",
                //     text:"trying to get data"
                //  });
                // oBusy.open();
                // window.setTimeout(()=>{
                //     oBusy.close();
                // },3000);

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


            onOpenDialog: function () {
                // load BusyDialog fragment asynchronously
                if (!this._pBusyDialog) {
                    this._pBusyDialog = Fragment.load({
                        name: "cruddemo.view.fragments.Busy",
                        controller: this
                    }).then(function (oBusyDialog) {
                        this.getView().addDependent(oBusyDialog);
                        syncStyleClass("sapUiSizeCompact", this.getView(), oBusyDialog);
                        return oBusyDialog;
                    }.bind(this));
                }
    
                this._pBusyDialog.then(function(oBusyDialog) {
                    oBusyDialog.open();
                    this.simulateServerRequest();
                }.bind(this));
            },
    
            simulateServerRequest: function () {
                // simulate a longer running operation
                iTimeoutId = setTimeout(function() {
                    this._pBusyDialog.then(function(oBusyDialog) {
                        oBusyDialog.close();
                    });
                }.bind(this), 3000);
            },
    
            onDialogClosed: function (oEvent) {
                clearTimeout(iTimeoutId);
    
                if (oEvent.getParameter("cancelPressed")) {
                    MessageToast.show("The operation has been cancelled");
                } else {
                    MessageToast.show("The operation has been completed");
                }
            }
    


            

        });
    });
