sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,Filter,FilterOperator,MessageToast,Fragment,MessageBox) {
        "use strict";

        return Controller.extend("cruddemo.controller.View2", {
            onInit: function () {

                this._oRouter= sap.ui.core.UIComponent.getRouterFor(this);
                this._oRouter.getRoute("RouteView2").attachPatternMatched(this._onRouteMatched,this);
                
            },
            _onRouteMatched:function(oEvent){
                // var arg=oEvent.getParameter("arguments");
                // this.getView().bindElement("/" + arg.selectedPath);
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
                var cPath ="/"+oEvent.getParameter("arguments").selectedPath+"/ToSalesOrders";
                console.log(cPath);
                // this.getView().bindElement(cPath);
                var oModel = this.getView().getModel();
                var localModel = new JSONModel([]);
                this.getView().setModel(localModel, "LocalModel");
                
                oModel.read(cPath, {
                    success: function (oData) {
                        localModel.setProperty("/SalesOrders", oData.results);
                    },
                    error: function (oError) {
                        MessageBox.error("technical error", {
                            title: "error"
                        });
                    }
                });
            },

            onSelect:function(oEvent){
                // var path = oEvent.getSource().getBindingContext().getPath().substr(1);
                var path = oEvent.getSource().getBindingContext("LocalModel").getObject().SalesOrderID;
                this._oRouter.navTo("RouteView3",{
                    item : path
                });
                // this._oRouter.navTo("RouteView3");
            },
            
            onBack:function(oEvent){
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
                this._oRouter.navTo("RouteView1");
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
                    if (sCriteria === "SalesOrderID")
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

            // delete start

             onDeletePress: function () {
                this.getView().byId("create").setEnabled(false);

                this.getView().byId("update").setEnabled(false);
                // var oDeleteButton = this.getView().byId("empTableID").getMode();
                var oDeleteButton = this.getView().byId("empTableID");
                oDeleteButton.setMode("Delete");
                console.log(oDeleteButton);
                // if(oDeleteButton === "None"){
                //     this.getView().byId("empTableID").setMode("Delete");
                // }
                // else{
                //     this.getView().byId("empTableID").setMode("None");
                // }
            },
            handleDelete: function (oEvent) {
                var oList = oEvent.getSource(),
                    oItem = oEvent.getParameter("listItem");
                var delSupplier = oItem.oBindingContexts.LocalModel.sPath.split("/")[2];
                oEvent.getSource().getModel("LocalModel");
                var supplier = this.getView().getModel("LocalModel").getProperty("/SalesOrders");
                supplier.splice(delSupplier, 1);
                this.getView().getModel("LocalModel").setProperty("/SalesOrders", supplier);
                MessageBox.confirm("record : " + delSupplier + "  record is successfully deleted ");
                // MessageToast.show("record : " + delSupplier + "record is successfully deleted")
                this.getView().byId("create").setEnabled(true);

                this.getView().byId("update").setEnabled(true);
            },

            // delete end

            // create start

            onCreatePress: function (oEvent) {
                this.getView().byId("empTableID").setMode("None");
                this.getView().byId("delete").setEnabled(false);

                            this.getView().byId("update").setEnabled(false);
                var oView = this.getView();
                var oClick = oEvent.getSource();
                
                if (!this._addCreatePopover) {
                   
                    Fragment.load({
                        id: oView.getId(),
                        name: "cruddemo.view.fragments.Create",
                        controller: this
                    }).then(function (addPopover) {
                        this._addCreatePopover = addPopover;
                        this.getView().addDependent(this._addCreatePopover);
                        this._addCreatePopover.openBy(oClick);
                    }.bind(this));
                } else {
                    this._addCreatePopover.openBy(oClick);
                }
                // oClick.setEnabled(false);
            },

            addCompanyPressed: function () {

                if (this.getView().byId("companyId").getValue() === "") {
                    MessageBox.alert("Please Enter Sales Order Id  it is required Field");
                }
                else if (this.getView().byId("customId").getValue() === ""){
                    MessageBox.alert("Please Enter Customer Id it is required Field");
                }
                else {
                    var newUserData = {};
                    newUserData["SalesOrderID"] = this.getView().byId("companyId").getValue();
                    newUserData["CustomerID"] = this.getView().byId("customId").getValue();



                    var newBusinessPartnerData = this.getView().getModel("LocalModel").getProperty("/SalesOrders");
                    newBusinessPartnerData.push(newUserData);
                    this.getView().getModel("LocalModel").setProperty("/SalesOrders", newBusinessPartnerData);

                    this.getView().getModel("LocalModel");
                    this.getView().byId("delete").setEnabled(true);

                    this.getView().byId("update").setEnabled(true);
                    
                    this._addCreatePopover.close();
                    MessageBox.success("New record is successfully added");
                   
                    
                }

            },

            // create end

            // update start


            onUpdatePress: function (oEvent) {
                this.getView().byId("create").setEnabled(false);

                this.getView().byId("delete").setEnabled(false);
                
                // var oList = this.getView().byId("empTableID").getMode();

                var oList = this.getView().byId("empTableID");
                
                oList.setMode("SingleSelect");
                

                // if(oList === "None"){
                //     this.getView().byId("empTableID").setMode("SingleSelect");
                // }
                // else{
                //     this.getView().byId("empTableID").setMode("None");
                // }
                
            },
            onMode: function (oEvent) {

                var oSelectedValue = this.getView().getModel("LocalModel").getProperty(oEvent.getSource().getSelectedContextPaths()[0]).SalesOrderID;
                // var mini = this.getView().getModel("LocalModel").getProperty(oEvent.getSource().getSelectedContextPaths()[0]).CustomerID;
                // var name = this.getView().getModel("LocalModel").getProperty(oEvent.getSource().getSelectedContextPaths()[0]).CustomerName;
                var oView = this.getView();
                var oClick = oEvent.getSource();

                this.index = oEvent.getSource().getSelectedContextPaths()[0].split("")[13];
                console.log(oEvent.getSource().getSelectedContextPaths()[0]);
                
                if (!this._addEmpPopover) {
                    
                    Fragment.load({
                        id: oView.getId(),
                        name: "cruddemo.view.fragments.Update",
                        controller: this
                    }).then(function (addPopover) {
                        this._addEmpPopover = addPopover;
                        this.getView().addDependent(this._addEmpPopover);
                        this._addEmpPopover.openBy(oClick);
                        this.getView().byId("updateId").setValue(oSelectedValue);
                        // this.getView().byId("custId").setValue(mini);
                        // this.getView().byId("custName").setValue(name);
                        
                        
                    }.bind(this));
                } else {
                    this._addEmpPopover.openBy(oClick);
                    this.getView().byId("updateId").setValue(oSelectedValue);
                    this.getView().byId("custId").setValue(mini);
                    this.getView().byId("custName").setValue(name);
                    
                }
            },

            updateCompanyPressed: function (oEvent) {
                
                var newUserData = new JSONModel([]);
                
                var updatedValue = this.getView().byId("updateId").getValue();
                var upValue = this.getView().byId("custId").getValue();
                var nValue = this.getView().byId("custName").getValue();
                var tValue = this.getView().byId("bill").getValue();
                
                
                
                console.log(this.index);

               
                this.getView().getModel("LocalModel").getData().SalesOrders[this.index].SalesOrderID = updatedValue;
                this.getView().getModel("LocalModel").getData().SalesOrders[this.index].CustomerID = upValue;
                this.getView().getModel("LocalModel").getData().SalesOrders[this.index].CustomerName = nValue;
                this.getView().getModel("LocalModel").getData().SalesOrders[this.index].BillingStatusDescription = tValue;
                console.log(this.getView().getModel("LocalModel").getData());
                newUserData= this.getView().getModel("LocalModel").getProperty("/SalesOrders");
                this.getView().getModel("LocalModel").setProperty("/SalesOrders", newUserData);
                this.getView().byId("create").setEnabled(true);

                this.getView().byId("delete").setEnabled(true);
                this._addEmpPopover.close();
                MessageBox.success("record is Successfully Updated");
            },

            // update end

            toggleCount:function(){
                var toggle=this.getView().byId("to").getVisible();
                if(toggle===true){
                    this.getView().byId("to").setVisible(false);
                }
                else{
                    this.getView().byId("to").setVisible(true);
                }
            },
            
           

        });
    });
