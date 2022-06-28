sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox) {
        "use strict";

        return Controller.extend("demo1.controller.View3", {
            onInit: function () {
            this._oRouter= sap.ui.core.UIComponent.getRouterFor(this);
            },
            onLogin:function(oEvent){
                var username = this.getView().byId('user');
                var password = this.getView().byId('pass');

                var usern ="Mini";
                var passp ="12345";

                if(username.getValue() === ''){
                    alert("Please enter username");
                    return;
                }else if(password.getValue() === ''){
                    alert("Please enter password");
                    return;
                }else{
                    if(username.getValue()=== usern && password.getValue()=== passp){
                   alert("successfully done");
                }
                else{
                    alert("wrong username and password ");
                }
                }

                
            }
            
           
        });
    });
