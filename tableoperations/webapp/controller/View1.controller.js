sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
    "sap/ui/core/Fragment",
    'sap/ui/export/library',
	'sap/ui/export/Spreadsheet'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,Export, ExportTypeCSV, Fragment, exportLibrary, Spreadsheet ) {
        "use strict";

        var EdmType = exportLibrary.EdmType;

        return Controller.extend("tableoperations.controller.View1", {
            onInit: function () {

                this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            },

            onCSV: function(oEvent)
            {
                var oExport = new Export({

                    // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                    exportType : new ExportTypeCSV({
                        separatorChar : ";"
                    }),
    
                    // Pass in the model created above
                    models : this.getView().getModel(),
    
                    // binding information for the rows aggregation
                    rows : {
                        path : "/EmployeeList"
                    },
    
                    // column definitions with column name and binding info for the content
    
                    columns : [{
                        name : "EmployeeID",
                        template : {
                            content : "{EmployeeID}"
                        }
                    }, {
                        name : "Name",
                        template : {
                            content : "{FirstName} {LastName}"
                        }
                    }, {
                        name : "Title",
                        template : {
                            content : "{Title}"
                        }
                    }, {
                        name : "City",
                        template : {
                            content : "{City}"
                        }
                    }, {
                        name : "Country",
                        template : {
                            content : "{Country}"
                        }
                    }]
                });
                // download exported file
			oExport.saveFile().catch(function(oError) {
				MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
			}).then(function() {
				oExport.destroy();
			});

            this.byId("exportDialog").close();
            },

            onExportDialog: function()
            {
                if (!this.pDialog) {
                    this.pDialog = this.loadFragment({
                        name: "tableoperations.view.fragments.Export"
                    });
                }
                this.pDialog.then(function(oDialog) {
                    oDialog.open();
                });
            },

            onClose: function()
            {
                this.byId("exportDialog").close();
            },

            
            createColumnConfig: function() {
                var aCols = [];
    
                aCols.push({
                    label: 'EmployeeID',
                    property: 'EmployeeID',
                    type: EdmType.Number,
                });
    
                aCols.push({
                    label: 'Name',
                    type: EdmType.String,
                    property: ['FirstName', 'LastName'],
                    scale: 0
                });
    
                aCols.push({
                    label: 'Title',
                    property: 'Title',
                    type: EdmType.String
                });
    
                aCols.push({
                    label: 'City',
                    property: 'City',
                    type: EdmType.String
                });
    
                aCols.push({
                    label: 'Country',
                    property: 'Country',
                    type: EdmType.String
                });

                return aCols;
            },

            onExcel: function()
            {
                var aCols, oRowBinding, oSettings, oSheet, oTable;

                if (!this._oTable) {
                    this._oTable = this.byId('exportData');
                }
    
                oTable = this._oTable;
                oRowBinding = oTable.getBinding('items');
                aCols = this.createColumnConfig();
    
                oSettings = {
                    workbook: {
                        columns: aCols,
                        hierarchyLevel: 'Level'
                    },
                    dataSource: oRowBinding,
                    fileName: 'Export.xlsx',
                   // worker: false // We need to disable worker because we are using a MockServer as OData Service
                };
    
                oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function() {
                    oSheet.destroy();
                });

                this.byId("exportDialog").close();
            },

            onUpload: function()
            {
                this._oRouter.navTo("RouteUpload");
            },

            onUploadCollection: function()
            {
                this._oRouter.navTo("RouteUploadCollection");
            }


        });
    });
