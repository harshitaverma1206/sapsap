sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
 
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";


        return Controller.extend("tableoperations.controller.Upload", {
            onInit: function () {

                this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                this.localModel = new sap.ui.model.json.JSONModel();
			    this.getView().setModel(this.localModel, "localModel");
            },

            onExport: function()
            {
                this._oRouter.navTo("RouteView1");
            },

            onUpload: function (e) {
                this._import(e.getParameter("files") && e.getParameter("files")[0]);
            },
    
            _import: function (file) {
                var that = this;
                var excelData = {};
                if (file && window.FileReader) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var data = e.target.result;
                        var workbook = XLSX.read(data, {
                            type: 'binary'
                        });
                        workbook.SheetNames.forEach(function (sheetName) {
                            // Here is your object for every sheet in workbook
                            excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    
                        });
                        // Setting the data to the local model 
                        that.localModel.setData({
                            items: excelData
                        });
                        that.localModel.refresh(true);
                    };
                    reader.onerror = function (ex) {
                        console.log(ex);
                    };
                    reader.readAsBinaryString(file);
                }
            },

            onUploadCollection: function()
            {
                this._oRouter.navTo("RouteUploadCollection");
            },

            // onClear: function(oEvent)
            // {
            //     console.log(sap.ui.getCore().byId("uploadTable"));
            //     sap.ui.getCore().byId("uploadTable").setModel(new sap.ui.model.json.JSONModel({localModel: []}));

            //     var table = sap.ui.getCore().byId("uploadTable");
            //     table.destroyColumns();
            //     table.setNoData(new sap.ui.commons.TextView({text: "Sorry, no data available!"}));
            // }

            // onClear: function(oEvent)
            // {
            //     var oTable = this.byId("uploadTable");
            //     var oData = oTable.getModel().getData();
            //     console.log(oData);
   
            // }

        });
    });
