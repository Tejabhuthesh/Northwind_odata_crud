sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], 
function (JSONModel, Device) {
    "use strict";

    return {
        /**
         * Provides runtime information for the device the UI5 app is running on as a JSONModel.
         * @returns {sap.ui.model.json.JSONModel} The device model.
         */
        
        createDeviceModel: function () {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },
        oCreateCategory: function (oDModel, data) {
            // Validate the OData model
            if (!oDModel) {
                throw new Error("Data model is required for creating data.");
            }
        
            // Create a JSONModel to hold the created data
            var oModel = new sap.ui.model.json.JSONModel();
        
            // Perform the create operation
            oDModel.create("/Categories", data, {
                success: function (createdData) {
                    // Update the JSON model with the created data
                    oModel.setData(createdData);
                    sap.m.MessageToast("Data successfully created.");
                },
                error: function (error) {
                    // Handle and log the error
                    sap.m.MessageBox.error("Error while creating the data.");
                    // Optional: Use a custom error handler for more detailed logging
                    ErrorHandler.showError(error);
                }
            });
        
            // Return the JSONModel with created data
            return oModel;
        }
        
    };

});