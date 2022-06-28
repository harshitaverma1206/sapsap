sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/jquery",
	"sap/base/util/deepExtend",
	"sap/ui/core/syncStyleClass",
    "sap/m/ObjectMarker",
	"sap/m/MessageToast",
	"sap/m/UploadCollectionParameter",
	"sap/m/library",
    "sap/ui/core/format/FileSizeFormat",
	"sap/ui/Device",
	"sap/ui/core/Fragment"
 
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, jquery, deepExtend, syncStyleClass, ObjectMarker, MessageToast, UploadCollectionParameter, MobileLibrary, FileSizeFormat, Device, Fragment) {
        "use strict";


        return Controller.extend("tableoperations.controller.Upload", {
            onInit: function () {

                this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                 // oModel for Employee Table
                 var oModel = new JSONModel("/model/data.json");
                 this.getView().setModel(oModel);

                this.getView().setModel(new JSONModel(Device), "device");

                this.getView().setModel(new JSONModel({
                    "maximumFilenameLength": 55,
                    "maximumFileSize": 1000,
                }), "settings");

                // Sets the text to the label
			this.byId("UploadCollection").addEventDelegate({
				onBeforeRendering: function() {
					this.byId("attachmentTitle").setText(this.getAttachmentTitleText());
				}.bind(this)
			});


            },

            getAttachmentTitleText: function() {
                var aItems = this.byId("UploadCollection").getItems();
                return "Uploaded (" + aItems.length + ")";
            },

            onChange: function(oEvent) {
                var oUploadCollection = oEvent.getSource();
                // Header Token
                var oCustomerHeaderToken = new UploadCollectionParameter({
                    name: "x-csrf-token",
                    value: "securityTokenFromModel"
                });
                oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
            },

            onUploadComplete: function(oEvent) {
                var oUploadCollection = this.byId("UploadCollection");
                var oData = oUploadCollection.getModel().getData();
                console.log(oData);
    
                oData.items.unshift({
                    "documentId": Date.now().toString(), // generate Id,
                    "fileName": oEvent.getParameter("files")[0].fileName,
                    "mimeType": "",
                    "thumbnailUrl": "",
                    "url": "",
                });
                this.getView().getModel().refresh();
    
                // Sets the text to the label
                this.byId("attachmentTitle").setText(this.getAttachmentTitleText());
    
                // delay the success message for to notice onChange message
                setTimeout(function() {
                    MessageToast.show("File has been Uploaded");
                }, 4000);
            },

            onFileRenamed: function(oEvent) {
                var oData = this.byId("UploadCollection").getModel().getData();
                var aItems = deepExtend({}, oData).items;
                var sDocumentId = oEvent.getParameter("documentId");
                jQuery.each(aItems, function(index) {
                    if (aItems[index] && aItems[index].documentId === sDocumentId) {
                        aItems[index].fileName = oEvent.getParameter("item").getFileName();
                    }
                });
                this.byId("UploadCollection").getModel().setData({
                    "items": aItems
                });
                MessageToast.show("File has been Renamed");
            },

            onFileDeleted: function(oEvent) {
                this.deleteItemById(oEvent.getParameter("documentId"));
                MessageToast.show("File has been Deleted");
            },
    
            deleteItemById: function(sItemToDeleteId) {
                var oData = this.byId("UploadCollection").getModel().getData();
                var aItems = deepExtend({}, oData).items;
                jQuery.each(aItems, function(index) {
                    if (aItems[index] && aItems[index].documentId === sItemToDeleteId) {
                        aItems.splice(index, 1);
                    }
                });
                this.byId("UploadCollection").getModel().setData({
                    "items": aItems
                });
                this.byId("attachmentTitle").setText(this.getAttachmentTitleText());
            },

            onBeforeUploadStarts: function(oEvent) {
                // Header Slug
                var oCustomerHeaderSlug = new UploadCollectionParameter({
                    name: "slug",
                    value: oEvent.getParameter("fileName")
                });
                oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
                // MessageToast.show("BeforeUploadStarts event triggered.");
            },

            onExport: function()
            {
                this._oRouter.navTo("RouteView1");
            },

            onUpload: function()
            {
                this._oRouter.navTo("RouteUpload");
            },
        });
    });
