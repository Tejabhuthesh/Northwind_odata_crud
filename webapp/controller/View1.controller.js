sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "znorthwindcrudtest/model/models"
], (Controller, MessageToast, oMainModel) => {
    "use strict";

    return Controller.extend("znorthwindcrudtest.controller.View1", {
        onInit: function () {
            // OData Model Initialization
            // var oModel = new sap.ui.model.odata.v2.ODataModel("https://services.odata.org/V2/Northwind/Northwind.svc/");
            // this.getView().setModel(oModel);
          
        },
        // _fetchDataFromBackend: function () {
        //     // Replace this with actual OData service call
        //     return [
        //         { ID: 1, Name: "Product 1" },
        //         { ID: 2, Name: "Product 2" },
        //         { ID: 2, Name: "Product 2" }, // Duplicate entry
        //         { ID: 3, Name: "Product 3" }
        //     ];
        // },
        
        // _removeDuplicates: function (aData) {
        //     // Remove duplicates based on ID using a filter
        //     return aData.filter(function (value, index, self) {
        //         return index === self.findIndex(function (t) {
        //             return t.ID === value.ID;
        //         });
        //     });
        // },
        onCreateProduct: function () {
            var oModel = this.getView().getModel();
            oModel.setUseBatch(false);
            var oProductData = {
                ID: parseInt(this.getView().byId("productPriceInput").getValue()),
                Name: this.getView().byId("productNameInput").getValue(),


            };

            oModel.create("/Categories", oProductData, {
                success: function (odata) {
                    MessageToast.show("Product created successfully!");
                }.bind(this),
                error: function (error) {
                    MessageToast.show("Failed to create product!");
                }
            });

        },
        onCreateCategory: function () {
            // Retrieve values from input fields
            var oID = this.getView().byId("productPriceInput").getValue();
            var oName = this.getView().byId("productNameInput").getValue();

            // Construct payload
            var oObj = {
                ID: parseInt(oID, 10), // Ensure ID is an integer
                Name: oName
            };

            // Get OData model
            var oDataModel = this.getView().getModel();
            oDataModel.setUseBatch(false); // Disable batch mode for this operation

            // Perform create operation
            var oModel = oMainModel.oCreateCategory(oDataModel, oObj);

            // Attach request completion handler
            oModel.attachRequestCompleted(
                function (oEvent) {
                    debugger
                    // Detach the event listener after completion
                    oEvent.getSource().detachRequestCompleted(null, this);

                    // Update the view with the JSON model
                    this.getView().setModel(oModel);
                },
                this
            );
        },

        onProductSelect: function (oEvent) {
            var oSelectedItem = oEvent.getSource();
            var sPath = oSelectedItem.getBindingContext().getPath();
            var oModel = this.getView().getModel();

            oModel.read(sPath, {
                success: function (oData) {
                    this.getView().byId("updateNameInput").setValue(oData.Name);
                    this.getView().byId("updatePriceInput").setValue(oData.ID);
                    this._sSelectedPath = sPath; // Save the path for update/delete operations
                }.bind(this),
                error: function () {
                    MessageToast.show("Failed to fetch product details!");
                }
            });
        },

        onUpdateProduct: function () {
            if (!this._sSelectedPath) {
                MessageToast.show("Please select a product first!");
                return;
            }

            var oModel = this.getView().getModel();
            oModel.setUseBatch(false);

            var oUpdatedData = {
                ID: this.getView().byId("updatePriceInput").getValue(),
                Name: this.getView().byId("updateNameInput").getValue()
            };

            oModel.update(this._sSelectedPath, oUpdatedData, {
                success: function () {
                    MessageToast.show("Product updated successfully!");
                },
                error: function () {
                    MessageToast.show("Failed to update product!");
                }
            });
        },

        onDelete: function (oEvent) {
            var oListItem = oEvent.getParameter("listItem"); // Get the selected list item
            // var oModel = this.getView().getModel();
            var sPath = oListItem.getBindingContext().getPath();
            if (!sPath) {
                MessageToast.show("Please select a product first!");
                return;
            }

            var oModel = this.getView().getModel();
            oModel.setUseBatch(false);
            oModel.remove(sPath, {
                success: function () {
                    MessageToast.show("Product deleted successfully!");
                },
                error: function () {
                    MessageToast.show("Failed to delete product!");
                }
            });

            // sPath = null; // Clear the selected path after deletion
        }
    });
});