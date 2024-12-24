sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox,JSONModel) {
        "use strict";

        return Controller.extend("ztransferposting.controller.View1", {
            onInit: function () {
                var slection = {
                    sloc:false,
                    recsoitem:true,
                }

                this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(slection), "oCommonModel");

            },
            onChangeAction: function (oEvent) {
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                if (oEvent.getSource().getSelectedButton().getText() !== 'Sloc To Sloc') {
                    
                    oCommonModel.setProperty("/recsoitem", false);
                    oCommonModel.setProperty("/sloc", true);
                    
                }
                else {
                   
                    oCommonModel.setProperty("/recsoitem", true);
                    oCommonModel.setProperty("/sloc", false);
                    
                }

               
            },
            CallBackendData: function () {
                ////////////////////Anshul Chechani
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel1");
                this.getView().getModel("oTableDataModel1").setProperty("/aTableData1", []);
                var oModel = this.getView().getModel();
                var RadioBtnGroup = this.getView().byId("idActionRadioBtnGroup").getSelectedButton().getText();
                var plant = this.getView().byId("plant").getValue();
                var material = this.getView().byId("idmaterial").getValue();
                var stloc = this.getView().byId("idstloc").getValue();
                var batch = this.getView().byId("idbatch").getValue();
                var salesorder = this.getView().byId("idsalesorder").getValue();
                var soitem = this.getView().byId("idsoitem").getValue();
                var stockfrom = this.getView().byId("idstockfrom").getValue();
                var stockto = this.getView().byId("idstockto").getValue();
              if(stockfrom != "" && stockto === ""){
                  MessageBox.error("Please Enter Stock To");
              }
              else if(stockfrom === "" && stockto != ""){
                MessageBox.error("Please Enter Stock From");
              }
              else
              {
                if(RadioBtnGroup === "Sloc To Sloc"){
                    batch = this.getView().byId("idbatch").getValue();
                   var recloc = this.getView().byId("idrecloc").getValue();
                   if (stloc === "") {
                       MessageBox.error("Please Select The St Loc.", {
                           title: "Warning",
                           icon: MessageBox.Icon.ERROR
                       });
   
                   }
                   else if(plant ===""){
                       MessageBox.error("Please Select The Plant",
                       {
                           title: "Warning",
                           icon: MessageBox.Icon.ERROR
                       });
                   }
                   else if (recloc === "") {
                       MessageBox.error("Please Select The Rec. Loc.",
                           {
                               title: "Warning",
                               icon: MessageBox.Icon.ERROR
                           });
                   }
                   else if (salesorder.length>0 && soitem ==="") {
                       MessageBox.error("Please Enter the Sales Order Item",
                       {
                           title: "Warning",
                           icon: MessageBox.Icon.ERROR
                       });
                   }
                   else if (soitem.length>0 && salesorder ==="") {
                       MessageBox.error("Please Enter the Sales Order",
                       {
                           title: "Warning",
                           icon: MessageBox.Icon.ERROR
                       });
                   }
   
                   else if(batch ==="" && material === "" && salesorder ==="" && soitem === "" && stockfrom === "" && stockto ==="") {
                       batch = this.getView().byId("idbatch").getValue();
                       var material = this.getView().byId("idmaterial").getValue();
                       var salesorder = this.getView().byId("idsalesorder").getValue();
                       var soitem = this.getView().byId("idsoitem").getValue();
                       var aTablearr2 = [];
                       var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                       // var oFilter1 = new sap.ui.model.Filter("IssuingOrReceivingStorageLoc", "EQ", recloc);
                       var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                       var oBusyDialog = new sap.m.BusyDialog({
                           title: "Fetching Data",
                           text: "Please wait",
                       });
                       oBusyDialog.open();
   
                       oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                           urlParameters: { "$top": "50000" },
                           filters: [oFilter, oFilter2],
                           success: function (oresponse) {
                               if (oresponse.results.length === 0) {
                                   oBusyDialog.close();
                                   MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                       title: "Warning",
                                       icon: MessageBox.Icon.ERROR
                                   });
                               }
                               else {
                                   
                                   var TableModel2 = this.getView().getModel("oTableDataModel1");
                                   var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                   oresponse.results.map(function (items) {
                                       var obj = {
                                           Plant:items.Plant,
                                           mat:items.Material,
                                           matdesc:items.ProductDescription,
                                           stloc:items.StorageLocation,
                                           stockqty:items.StockQty,
                                           Batch:items.Batch,
                                           salesoder:items.SalesOrder,
                                           Soitem:items.SalesOrderItem,
                                           recloc:recloc,
                                           recso:items.SalesOrder,
                                           recsoitem:items.SalesOrderItem,
                                           Grade:items.Grade,
                                           SETCODE:items.SETCODE
                                       }
                                       aTablearr2.push(obj);
   
                                   })
                                   TableModel2.setProperty("/aTableData1", aTablearr2)
                                   oBusyDialog.close();
                               }
   
                           }.bind(this),
                           error: function (error) {
                               oBusyDialog.close();
                               MessageBox.show("Data Can't Read!!!!!!!!!", {
                                   title: "Warning!!!!!!",
                                   icon: MessageBox.Icon.ERROR
                               });
                           }
   
                       })
   
   
   
                   }
                   else if(batch ==="" && material === "" && salesorder ==="" && soitem === "" && stockfrom != "" && stockto !="") {
                    batch = this.getView().byId("idbatch").getValue();
                    var material = this.getView().byId("idmaterial").getValue();
                    var salesorder = this.getView().byId("idsalesorder").getValue();
                    var soitem = this.getView().byId("idsoitem").getValue();
                    var aTablearr2 = [];
                    var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                    // var oFilter1 = new sap.ui.model.Filter("IssuingOrReceivingStorageLoc", "EQ", recloc);
                    var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Fetching Data",
                        text: "Please wait",
                    });
                    oBusyDialog.open();

                    oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                        urlParameters: { "$top": "50000" },
                        filters: [oFilter, oFilter2],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                oBusyDialog.close();
                                MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                    title: "Warning",
                                    icon: MessageBox.Icon.ERROR
                                });
                            }
                            else {
                                
                                var TableModel2 = this.getView().getModel("oTableDataModel1");
                                var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                oresponse.results.map(function (items) {
                                    var stock = Number(items.StockQty);
                                    if(stock>Number(stockfrom)  && stock <= Number(stockto)){
                                        var obj = {
                                            Plant:items.Plant,
                                            mat:items.Material,
                                            matdesc:items.ProductDescription,
                                            stloc:items.StorageLocation,
                                            stockqty:items.StockQty,
                                            Batch:items.Batch,
                                            salesoder:items.SalesOrder,
                                            Soitem:items.SalesOrderItem,
                                            recloc:recloc,
                                            recso:items.SalesOrder,
                                            recsoitem:items.SalesOrderItem,
                                            Grade:items.Grade,
                                           SETCODE:items.SETCODE

                                        }
                                        aTablearr2.push(obj);
                                    }
                                    

                                })
                                TableModel2.setProperty("/aTableData1", aTablearr2)
                                oBusyDialog.close();
                            }

                        }.bind(this),
                        error: function (error) {
                            oBusyDialog.close();
                            MessageBox.show("Data Can't Read!!!!!!!!!", {
                                title: "Warning!!!!!!",
                                icon: MessageBox.Icon.ERROR
                            });
                        }

                    })



                   }
                   else if(batch ==="" && material != "" && salesorder ==="" && soitem === "" && stockfrom === "" && stockto ==="") {
                       batch = this.getView().byId("idbatch").getValue();
                       var material = this.getView().byId("idmaterial").getValue();
                       var salesorder = this.getView().byId("idsalesorder").getValue();
                       var soitem = this.getView().byId("idsoitem").getValue();
                       var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                       // var oFilter1 = new sap.ui.model.Filter("IssuingOrReceivingStorageLoc", "EQ", recloc);
                       var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                       var oFilter3 = new sap.ui.model.Filter("Material", "EQ", material);
                       var oBusyDialog = new sap.m.BusyDialog({
                           title: "Fetching Data",
                           text: "Please wait",
                       });
                       oBusyDialog.open();
   
                       oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                           urlParameters: { "$top": "50000" },
                           filters: [oFilter,oFilter2,oFilter3],
                           success: function (oresponse) {
                               if (oresponse.results.length === 0) {
                                   oBusyDialog.close();
                                   MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                       title: "Warning",
                                       icon: MessageBox.Icon.ERROR
                                   });
                               }
                               else {
                                   
                                   var TableModel2 = this.getView().getModel("oTableDataModel1");
                                   var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                   oresponse.results.map(function (items) {
                                       var obj = {
                                           Plant:items.Plant,
                                           mat:items.Material,
                                           matdesc:items.ProductDescription,
                                           stloc:items.StorageLocation,
                                           stockqty:items.StockQty,
                                           Batch:items.Batch,
                                           salesoder:items.SalesOrder,
                                           Soitem:items.SalesOrderItem,
                                           recloc:recloc,
                                           recso:items.SalesOrder,
                                           recsoitem:items.SalesOrderItem,
                                           Grade:items.Grade,
                                           SETCODE:items.SETCODE

                                       }
                                       aTablearr2.push(obj);
   
                                   })
                                   TableModel2.setProperty("/aTableData1", aTablearr2)
                                   oBusyDialog.close();
                               }
   
                           }.bind(this),
                           error: function (error) {
                               oBusyDialog.close();
                               MessageBox.show("Data Can't Read!!!!!!!!!", {
                                   title: "Warning!!!!!!",
                                   icon: MessageBox.Icon.ERROR
                               });
                           }
   
                       })
                   }
                   else if(batch ==="" && material != "" && salesorder ==="" && soitem === "" && stockfrom != "" && stockto !="") {
                    batch = this.getView().byId("idbatch").getValue();
                    var material = this.getView().byId("idmaterial").getValue();
                    var salesorder = this.getView().byId("idsalesorder").getValue();
                    var soitem = this.getView().byId("idsoitem").getValue();
                    var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                    // var oFilter1 = new sap.ui.model.Filter("IssuingOrReceivingStorageLoc", "EQ", recloc);
                    var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                    var oFilter3 = new sap.ui.model.Filter("Material", "EQ", material);
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Fetching Data",
                        text: "Please wait",
                    });
                    oBusyDialog.open();

                    oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                        urlParameters: { "$top": "50000" },
                        filters: [oFilter,oFilter2,oFilter3],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                oBusyDialog.close();
                                MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                    title: "Warning",
                                    icon: MessageBox.Icon.ERROR
                                });
                            }
                            else {
                                
                                var TableModel2 = this.getView().getModel("oTableDataModel1");
                                var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                oresponse.results.map(function (items) {
                                    var stock = Number(items.StockQty);
                                    if(stock>Number(stockfrom)  && stock <= Number(stockto)){
                                        var obj = {
                                            Plant:items.Plant,
                                            mat:items.Material,
                                            matdesc:items.ProductDescription,
                                            stloc:items.StorageLocation,
                                            stockqty:items.StockQty,
                                            Batch:items.Batch,
                                            salesoder:items.SalesOrder,
                                            Soitem:items.SalesOrderItem,
                                            recloc:recloc,
                                            recso:items.SalesOrder,
                                            recsoitem:items.SalesOrderItem,
                                            Grade:items.Grade,
                                           SETCODE:items.SETCODE

                                        }
                                        aTablearr2.push(obj);
                                    }
                                    

                                })
                                TableModel2.setProperty("/aTableData1", aTablearr2)
                                oBusyDialog.close();
                            }

                        }.bind(this),
                        error: function (error) {
                            oBusyDialog.close();
                            MessageBox.show("Data Can't Read!!!!!!!!!", {
                                title: "Warning!!!!!!",
                                icon: MessageBox.Icon.ERROR
                            });
                        }

                    })
                   }
                   else if(batch ==="" && material === "" && salesorder !="" && soitem != "" && stockfrom === "" && stockto ==="") {
   
                       var batch = this.getView().byId("idbatch").getValue();
                       var material = this.getView().byId("idmaterial").getValue();
                       var salesorder = this.getView().byId("idsalesorder").getValue();
                       var soitem = this.getView().byId("idsoitem").getValue();
                       var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                       // var oFilter1 = new sap.ui.model.Filter("IssuingOrReceivingStorageLoc", "EQ", recloc);
                       var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                       var oFilter4 = new sap.ui.model.Filter("Material", "EQ", material);
                       var oFilter3 = new sap.ui.model.Filter("Batch", "EQ", batch);
                       var oFilter5 = new sap.ui.model.Filter("SalesOrder", "EQ", salesorder);
                       var oFilter6 = new sap.ui.model.Filter("SalesOrderItem", "EQ", soitem);
                       var oBusyDialog = new sap.m.BusyDialog({
                           title: "Fetching Data",
                           text: "Please wait",
                       });
                       oBusyDialog.open();
   
                       oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                           urlParameters: { "$top": "50000" },
                           filters: [oFilter,oFilter2,oFilter6,oFilter5],
                           success: function (oresponse) {
                               if (oresponse.results.length === 0) {
                                   oBusyDialog.close();
                                   MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                       title: "Warning",
                                       icon: MessageBox.Icon.ERROR
                                   });
                               }
                               else {
                                   
                                   var TableModel2 = this.getView().getModel("oTableDataModel1");
                                   var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                   oresponse.results.map(function (items) {
                                       var obj = {
                                           Plant:items.Plant,
                                           mat:items.Material,
                                           matdesc:items.ProductDescription,
                                           stloc:items.StorageLocation,
                                           stockqty:items.StockQty,
                                           Batch:items.Batch,
                                           salesoder:items.SalesOrder,
                                           Soitem:items.SalesOrderItem,
                                           recloc:recloc,
                                           recso:items.SalesOrder,
                                           recsoitem:items.SalesOrderItem,
                                           Grade:items.Grade,
                                           SETCODE:items.SETCODE

                                       }
                                       aTablearr2.push(obj);
   
                                   })
                                   TableModel2.setProperty("/aTableData1", aTablearr2)
                                   oBusyDialog.close();
                               }
   
                           }.bind(this),
                           error: function (error) {
                               oBusyDialog.close();
                               MessageBox.show("Data Can't Read!!!!!!!!!", {
                                   title: "Warning!!!!!!",
                                   icon: MessageBox.Icon.ERROR
                               });
                           }
   
                       })
   
                   }
                   else if(batch ==="" && material === "" && salesorder !="" && soitem != "" && stockfrom != "" && stockto !="") {
   
                    var batch = this.getView().byId("idbatch").getValue();
                    var material = this.getView().byId("idmaterial").getValue();
                    var salesorder = this.getView().byId("idsalesorder").getValue();
                    var soitem = this.getView().byId("idsoitem").getValue();
                    var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                    // var oFilter1 = new sap.ui.model.Filter("IssuingOrReceivingStorageLoc", "EQ", recloc);
                    var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                    var oFilter4 = new sap.ui.model.Filter("Material", "EQ", material);
                    var oFilter3 = new sap.ui.model.Filter("Batch", "EQ", batch);
                    var oFilter5 = new sap.ui.model.Filter("SalesOrder", "EQ", salesorder);
                    var oFilter6 = new sap.ui.model.Filter("SalesOrderItem", "EQ", soitem);
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Fetching Data",
                        text: "Please wait",
                    });
                    oBusyDialog.open();

                    oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                        urlParameters: { "$top": "50000" },
                        filters: [oFilter,oFilter2,oFilter6,oFilter5],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                oBusyDialog.close();
                                MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                    title: "Warning",
                                    icon: MessageBox.Icon.ERROR
                                });
                            }
                            else {
                                
                                var TableModel2 = this.getView().getModel("oTableDataModel1");
                                var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                oresponse.results.map(function (items) {
                                    var stock = Number(items.StockQty);
                                    if(stock>Number(stockfrom)  && stock <= Number(stockto)){
                                        var obj = {
                                            Plant:items.Plant,
                                            mat:items.Material,
                                            matdesc:items.ProductDescription,
                                            stloc:items.StorageLocation,
                                            stockqty:items.StockQty,
                                            Batch:items.Batch,
                                            salesoder:items.SalesOrder,
                                            Soitem:items.SalesOrderItem,
                                            recloc:recloc,
                                            recso:items.SalesOrder,
                                            recsoitem:items.SalesOrderItem,
                                            Grade:items.Grade,
                                           SETCODE:items.SETCODE

                                        }
                                        aTablearr2.push(obj);
                                    }
                                    

                                })
                                TableModel2.setProperty("/aTableData1", aTablearr2)
                                oBusyDialog.close();
                            }

                        }.bind(this),
                        error: function (error) {
                            oBusyDialog.close();
                            MessageBox.show("Data Can't Read!!!!!!!!!", {
                                title: "Warning!!!!!!",
                                icon: MessageBox.Icon.ERROR
                            });
                        }

                    })

                   }
                   else if(batch ==="" && material != "" && salesorder !="" && soitem != "" && stockfrom === "" && stockto ==="") {
                       var batch = this.getView().byId("idbatch").getValue();
                       var material = this.getView().byId("idmaterial").getValue();
                       var salesorder = this.getView().byId("idsalesorder").getValue();
                       var soitem = this.getView().byId("idsoitem").getValue();
                       var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                       // var oFilter1 = new sap.ui.model.Filter("IssuingOrReceivingStorageLoc", "EQ", recloc);
                       var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                       var oFilter4 = new sap.ui.model.Filter("Material", "EQ", material);
                       var oFilter3 = new sap.ui.model.Filter("SalesOrder", "EQ", salesorder);
                       var oBusyDialog = new sap.m.BusyDialog({
                           title: "Fetching Data",
                           text: "Please wait",
                       });
                       oBusyDialog.open();
   
                       oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                           urlParameters: { "$top": "50000" },
                           filters: [oFilter, oFilter2,oFilter4,oFilter3],
                           success: function (oresponse) {
                               if (oresponse.results.length === 0) {
                                   oBusyDialog.close();
                                   MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                       title: "Warning",
                                       icon: MessageBox.Icon.ERROR
                                   });
                               }
                               else {
                                   
                                   var TableModel2 = this.getView().getModel("oTableDataModel1");
                                   var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                   oresponse.results.map(function (items) {
                                       var obj = {
                                           Plant:items.Plant,
                                           mat:items.Material,
                                           matdesc:items.ProductDescription,
                                           stloc:items.StorageLocation,
                                           stockqty:items.StockQty,
                                           Batch:items.Batch,
                                           salesoder:items.SalesOrder,
                                           Soitem:items.SalesOrderItem,
                                           recloc:recloc,
                                           recso:items.SalesOrder,
                                           recsoitem:items.SalesOrderItem,
                                           Grade:items.Grade,
                                           SETCODE:items.SETCODE

                                       }
                                       aTablearr2.push(obj);
   
                                   })
                                   TableModel2.setProperty("/aTableData1", aTablearr2)
                                   oBusyDialog.close();
                               }
   
                           }.bind(this),
                           error: function (error) {
                               oBusyDialog.close();
                               MessageBox.show("Data Can't Read!!!!!!!!!", {
                                   title: "Warning!!!!!!",
                                   icon: MessageBox.Icon.ERROR
                               });
                           }
   
                       })
   
                   }
                   else if(batch ==="" && material != "" && salesorder !="" && soitem != "" && stockfrom != "" && stockto !="") {
                    var batch = this.getView().byId("idbatch").getValue();
                    var material = this.getView().byId("idmaterial").getValue();
                    var salesorder = this.getView().byId("idsalesorder").getValue();
                    var soitem = this.getView().byId("idsoitem").getValue();
                    var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                    // var oFilter1 = new sap.ui.model.Filter("IssuingOrReceivingStorageLoc", "EQ", recloc);
                    var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                    var oFilter4 = new sap.ui.model.Filter("Material", "EQ", material);
                    var oFilter3 = new sap.ui.model.Filter("SalesOrder", "EQ", salesorder);
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Fetching Data",
                        text: "Please wait",
                    });
                    oBusyDialog.open();

                    oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                        urlParameters: { "$top": "50000" },
                        filters: [oFilter, oFilter2,oFilter4,oFilter3],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                oBusyDialog.close();
                                MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                    title: "Warning",
                                    icon: MessageBox.Icon.ERROR
                                });
                            }
                            else {
                                
                                var TableModel2 = this.getView().getModel("oTableDataModel1");
                                var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                oresponse.results.map(function (items) {
                                    var stock = Number(items.StockQty);
                                    if(stock>Number(stockfrom)  && stock <= Number(stockto)){
                                        var obj = {
                                            Plant:items.Plant,
                                            mat:items.Material,
                                            matdesc:items.ProductDescription,
                                            stloc:items.StorageLocation,
                                            stockqty:items.StockQty,
                                            Batch:items.Batch,
                                            salesoder:items.SalesOrder,
                                            Soitem:items.SalesOrderItem,
                                            recloc:recloc,
                                            recso:items.SalesOrder,
                                            recsoitem:items.SalesOrderItem,
                                            Grade:items.Grade,
                                           SETCODE:items.SETCODE

                                        }
                                        aTablearr2.push(obj);
                                    }
                                    

                                })
                                TableModel2.setProperty("/aTableData1", aTablearr2)
                                oBusyDialog.close();
                            }

                        }.bind(this),
                        error: function (error) {
                            oBusyDialog.close();
                            MessageBox.show("Data Can't Read!!!!!!!!!", {
                                title: "Warning!!!!!!",
                                icon: MessageBox.Icon.ERROR
                            });
                        }

                    })

                   }
                   else if(batch =!"" && material === "" && salesorder ==="" && soitem === "" && stockfrom === "" && stockto ==="") {
                       batch = this.getView().byId("idbatch").getValue();
                       var material = this.getView().byId("idmaterial").getValue();
                       var salesorder = this.getView().byId("idsalesorder").getValue();
                       var soitem = this.getView().byId("idsoitem").getValue();
                       var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                       // var oFilter1 = new sap.ui.model.Filter("IssuingOrReceivingStorageLoc", "EQ", recloc);
                       var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                       var oFilter3 = new sap.ui.model.Filter("Batch", "EQ", batch);
                       var oBusyDialog = new sap.m.BusyDialog({
                           title: "Fetching Data",
                           text: "Please wait",
                       });
                       oBusyDialog.open();
   
                       oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                           urlParameters: { "$top": "50000" },
                           filters: [oFilter, oFilter2,oFilter3],
                           success: function (oresponse) {
                               if (oresponse.results.length === 0) {
                                   oBusyDialog.close();
                                   MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                       title: "Warning",
                                       icon: MessageBox.Icon.ERROR
                                   });
                               }
                               else {
                                   
                                   var TableModel2 = this.getView().getModel("oTableDataModel1");
                                   var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                   oresponse.results.map(function (items) {
                                       var obj = {
                                           Plant:items.Plant,
                                           mat:items.Material,
                                           matdesc:items.ProductDescription,
                                           stloc:items.StorageLocation,
                                           stockqty:items.StockQty,
                                           Batch:items.Batch,
                                           salesoder:items.SalesOrder,
                                           Soitem:items.SalesOrderItem,
                                           recloc:recloc,
                                           recso:items.SalesOrder,
                                           recsoitem:items.SalesOrderItem,
                                           Grade:items.Grade,
                                           SETCODE:items.SETCODE

                                       }
                                       aTablearr2.push(obj);
   
                                   })
                                   TableModel2.setProperty("/aTableData1", aTablearr2)
                                   oBusyDialog.close();
                               }
   
                           }.bind(this),
                           error: function (error) {
                               oBusyDialog.close();
                               MessageBox.show("Data Can't Read!!!!!!!!!", {
                                   title: "Warning!!!!!!",
                                   icon: MessageBox.Icon.ERROR
                               });
                           }
   
                       })
   
   
   
   
                   }
                   else if(batch =!"" && material === "" && salesorder ==="" && soitem === "" && stockfrom != "" && stockto !="") {
                    batch = this.getView().byId("idbatch").getValue();
                    var material = this.getView().byId("idmaterial").getValue();
                    var salesorder = this.getView().byId("idsalesorder").getValue();
                    var soitem = this.getView().byId("idsoitem").getValue();
                    var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                    // var oFilter1 = new sap.ui.model.Filter("IssuingOrReceivingStorageLoc", "EQ", recloc);
                    var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                    var oFilter3 = new sap.ui.model.Filter("Batch", "EQ", batch);
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Fetching Data",
                        text: "Please wait",
                    });
                    oBusyDialog.open();

                    oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                        urlParameters: { "$top": "50000" },
                        filters: [oFilter, oFilter2,oFilter3],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                oBusyDialog.close();
                                MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                    title: "Warning",
                                    icon: MessageBox.Icon.ERROR
                                });
                            }
                            else {
                                
                                var TableModel2 = this.getView().getModel("oTableDataModel1");
                                var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                oresponse.results.map(function (items) {
                                    var stock = Number(items.StockQty);
                                    if(stock>Number(stockfrom)  && stock <= Number(stockto)){
                                        var obj = {
                                            Plant:items.Plant,
                                            mat:items.Material,
                                            matdesc:items.ProductDescription,
                                            stloc:items.StorageLocation,
                                            stockqty:items.StockQty,
                                            Batch:items.Batch,
                                            salesoder:items.SalesOrder,
                                            Soitem:items.SalesOrderItem,
                                            recloc:recloc,
                                            recso:items.SalesOrder,
                                            recsoitem:items.SalesOrderItem,
                                            Grade:items.Grade,
                                           SETCODE:items.SETCODE

                                        }
                                        aTablearr2.push(obj);
                                    }
                                    

                                })
                                TableModel2.setProperty("/aTableData1", aTablearr2)
                                oBusyDialog.close();
                            }

                        }.bind(this),
                        error: function (error) {
                            oBusyDialog.close();
                            MessageBox.show("Data Can't Read!!!!!!!!!", {
                                title: "Warning!!!!!!",
                                icon: MessageBox.Icon.ERROR
                            });
                        }

                    })




                   }
                   else if(batch =!"" && material != "" && salesorder ==="" && soitem === "" && stockfrom === "" && stockto ==="") {
                       batch = this.getView().byId("idbatch").getValue();
                       var material = this.getView().byId("idmaterial").getValue();
                       var salesorder = this.getView().byId("idsalesorder").getValue();
                       var soitem = this.getView().byId("idsoitem").getValue();
                       var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                       // var oFilter1 = new sap.ui.model.Filter("IssuingOrReceivingStorageLoc", "EQ", recloc);
                       var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                       var oFilter4 = new sap.ui.model.Filter("Material", "EQ", material);
                       var oFilter3 = new sap.ui.model.Filter("Batch", "EQ", batch);
                       var oBusyDialog = new sap.m.BusyDialog({
                           title: "Fetching Data",
                           text: "Please wait",
                       });
                       oBusyDialog.open();
   
                       oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                           urlParameters: { "$top": "50000" },
                           filters: [oFilter, oFilter2,oFilter3,oFilter4],
                           success: function (oresponse) {
                               if (oresponse.results.length === 0) {
                                   oBusyDialog.close();
                                   MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                       title: "Warning",
                                       icon: MessageBox.Icon.ERROR
                                   });
                               }
                               else {
                                   
                                   var TableModel2 = this.getView().getModel("oTableDataModel1");
                                   var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                   oresponse.results.map(function (items) {
                                       var obj = {
                                           Plant:items.Plant,
                                           mat:items.Material,
                                           matdesc:items.ProductDescription,
                                           stloc:items.StorageLocation,
                                           stockqty:items.StockQty,
                                           Batch:items.Batch,
                                           salesoder:items.SalesOrder,
                                           Soitem:items.SalesOrderItem,
                                           recloc:recloc,
                                           recso:items.SalesOrder,
                                           recsoitem:items.SalesOrderItem,
                                           Grade:items.Grade,
                                           SETCODE:items.SETCODE

                                       }
                                       aTablearr2.push(obj);
   
                                   })
                                   TableModel2.setProperty("/aTableData1", aTablearr2)
                                   oBusyDialog.close();
                               }
   
                           }.bind(this),
                           error: function (error) {
                               oBusyDialog.close();
                               MessageBox.show("Data Can't Read!!!!!!!!!", {
                                   title: "Warning!!!!!!",
                                   icon: MessageBox.Icon.ERROR
                               });
                           }
   
                       })
   
                   }
                   else if(batch =!"" && material != "" && salesorder ==="" && soitem === "" && stockfrom != "" && stockto !="") {
                    batch = this.getView().byId("idbatch").getValue();
                    var material = this.getView().byId("idmaterial").getValue();
                    var salesorder = this.getView().byId("idsalesorder").getValue();
                    var soitem = this.getView().byId("idsoitem").getValue();
                    var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                    // var oFilter1 = new sap.ui.model.Filter("IssuingOrReceivingStorageLoc", "EQ", recloc);
                    var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                    var oFilter4 = new sap.ui.model.Filter("Material", "EQ", material);
                    var oFilter3 = new sap.ui.model.Filter("Batch", "EQ", batch);
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Fetching Data",
                        text: "Please wait",
                    });
                    oBusyDialog.open();

                    oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                        urlParameters: { "$top": "50000" },
                        filters: [oFilter, oFilter2,oFilter3,oFilter4],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                oBusyDialog.close();
                                MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                    title: "Warning",
                                    icon: MessageBox.Icon.ERROR
                                });
                            }
                            else {
                                
                                var TableModel2 = this.getView().getModel("oTableDataModel1");
                                var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                oresponse.results.map(function (items) {
                                    var stock = Number(items.StockQty);
                                    if(stock>Number(stockfrom)  && stock <= Number(stockto)){
                                        var obj = {
                                            Plant:items.Plant,
                                            mat:items.Material,
                                            matdesc:items.ProductDescription,
                                            stloc:items.StorageLocation,
                                            stockqty:items.StockQty,
                                            Batch:items.Batch,
                                            salesoder:items.SalesOrder,
                                            Soitem:items.SalesOrderItem,
                                            recloc:recloc,
                                            recso:items.SalesOrder,
                                            recsoitem:items.SalesOrderItem,
                                            Grade:items.Grade,
                                           SETCODE:items.SETCODE

                                        }
                                        aTablearr2.push(obj);
                                    }
                                    

                                })
                                TableModel2.setProperty("/aTableData1", aTablearr2)
                                oBusyDialog.close();
                            }

                        }.bind(this),
                        error: function (error) {
                            oBusyDialog.close();
                            MessageBox.show("Data Can't Read!!!!!!!!!", {
                                title: "Warning!!!!!!",
                                icon: MessageBox.Icon.ERROR
                            });
                        }

                    })

                   }
                   else if(batch !="" && material === "" && salesorder !="" && soitem != "" && stockfrom === "" && stockto ==="") {
                       var batch = this.getView().byId("idbatch").getValue();
                       var material = this.getView().byId("idmaterial").getValue();
                       var salesorder = this.getView().byId("idsalesorder").getValue();
                       var soitem = this.getView().byId("idsoitem").getValue();
                       var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                       // var oFilter1 = new sap.ui.model.Filter("IssuingOrReceivingStorageLoc", "EQ", recloc);
                       var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                       var oFilter4 = new sap.ui.model.Filter("SalesOrderItem", "EQ", soitem);
                       var oFilter3 = new sap.ui.model.Filter("Batch", "EQ", batch);
                       var oBusyDialog = new sap.m.BusyDialog({
                           title: "Fetching Data",
                           text: "Please wait",
                       });
                       oBusyDialog.open();
   
                       oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                           urlParameters: { "$top": "50000" },
                           filters: [oFilter, oFilter2,oFilter3,oFilter4],
                           success: function (oresponse) {
                               if (oresponse.results.length === 0) {
                                   oBusyDialog.close();
                                   MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                       title: "Warning",
                                       icon: MessageBox.Icon.ERROR
                                   });
                               }
                               else {
                                   
                                   var TableModel2 = this.getView().getModel("oTableDataModel1");
                                   var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                   oresponse.results.map(function (items) {
                                       var obj = {
                                           Plant:items.Plant,
                                           mat:items.Material,
                                           matdesc:items.ProductDescription,
                                           stloc:items.StorageLocation,
                                           stockqty:items.StockQty,
                                           Batch:items.Batch,
                                           salesoder:items.SalesOrder,
                                           Soitem:items.SalesOrderItem,
                                           recloc:recloc,
                                           recso:items.SalesOrder,
                                           recsoitem:items.SalesOrderItem,
                                           Grade:items.Grade,
                                           SETCODE:items.SETCODE

                                       }
                                       aTablearr2.push(obj);
   
                                   })
                                   TableModel2.setProperty("/aTableData1", aTablearr2)
                                   oBusyDialog.close();
                               }
   
                           }.bind(this),
                           error: function (error) {
                               oBusyDialog.close();
                               MessageBox.show("Data Can't Read!!!!!!!!!", {
                                   title: "Warning!!!!!!",
                                   icon: MessageBox.Icon.ERROR
                               });
                           }
   
                       })
   
                   }
                   else if(batch !="" && material === "" && salesorder !="" && soitem != "" && stockfrom != "" && stockto !="") {
                    var batch = this.getView().byId("idbatch").getValue();
                    var material = this.getView().byId("idmaterial").getValue();
                    var salesorder = this.getView().byId("idsalesorder").getValue();
                    var soitem = this.getView().byId("idsoitem").getValue();
                    var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                    // var oFilter1 = new sap.ui.model.Filter("IssuingOrReceivingStorageLoc", "EQ", recloc);
                    var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                    var oFilter4 = new sap.ui.model.Filter("SalesOrderItem", "EQ", soitem);
                    var oFilter3 = new sap.ui.model.Filter("Batch", "EQ", batch);
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Fetching Data",
                        text: "Please wait",
                    });
                    oBusyDialog.open();

                    oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                        urlParameters: { "$top": "50000" },
                        filters: [oFilter, oFilter2,oFilter3,oFilter4],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                oBusyDialog.close();
                                MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                    title: "Warning",
                                    icon: MessageBox.Icon.ERROR
                                });
                            }
                            else {
                                
                                var TableModel2 = this.getView().getModel("oTableDataModel1");
                                var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                oresponse.results.map(function (items) {
                                    var stock = Number(items.StockQty);
                                    if(stock>Number(stockfrom)  && stock <= Number(stockto)){
                                        var obj = {
                                            Plant:items.Plant,
                                            mat:items.Material,
                                            matdesc:items.ProductDescription,
                                            stloc:items.StorageLocation,
                                            stockqty:items.StockQty,
                                            Batch:items.Batch,
                                            salesoder:items.SalesOrder,
                                            Soitem:items.SalesOrderItem,
                                            recloc:recloc,
                                            recso:items.SalesOrder,
                                            recsoitem:items.SalesOrderItem,
                                            Grade:items.Grade,
                                           SETCODE:items.SETCODE

                                        }
                                        aTablearr2.push(obj);
                                    }
                                    

                                })
                                TableModel2.setProperty("/aTableData1", aTablearr2)
                                oBusyDialog.close();
                            }

                        }.bind(this),
                        error: function (error) {
                            oBusyDialog.close();
                            MessageBox.show("Data Can't Read!!!!!!!!!", {
                                title: "Warning!!!!!!",
                                icon: MessageBox.Icon.ERROR
                            });
                        }

                    })

                   }
                   else if(batch !="" && material != "" && salesorder !="" && soitem != "" && stockfrom === "" && stockto ==="") {
                       var batch = this.getView().byId("idbatch").getValue();
                       var material = this.getView().byId("idmaterial").getValue();
                       var salesorder = this.getView().byId("idsalesorder").getValue();
                       var soitem = this.getView().byId("idsoitem").getValue();
                       var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                       // var oFilter1 = new sap.ui.model.Filter("IssuingOrReceivingStorageLoc", "EQ", recloc);
                       var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                       var oFilter4 = new sap.ui.model.Filter("Material", "EQ", material);
                       var oFilter3 = new sap.ui.model.Filter("SalesOrder", "EQ", salesorder);
                       var oFilter5 = new sap.ui.model.Filter("Batch", "EQ", batch);
                       var oFilter6 = new sap.ui.model.Filter("SalesOrderItem", "EQ", soitem);
                       var oBusyDialog = new sap.m.BusyDialog({
                           title: "Fetching Data",
                           text: "Please wait",
                       });
                       oBusyDialog.open();
   
                       oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                           urlParameters: { "$top": "50000" },
                           filters: [oFilter, oFilter2,oFilter4,oFilter3],
                           success: function (oresponse) {
                               if (oresponse.results.length === 0) {
                                   oBusyDialog.close();
                                   MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                       title: "Warning",
                                       icon: MessageBox.Icon.ERROR
                                   });
                               }
                               else {
                                   
                                   var TableModel2 = this.getView().getModel("oTableDataModel1");
                                   var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                   oresponse.results.map(function (items) {
                                       var obj = {
                                           Plant:items.Plant,
                                           mat:items.Material,
                                           matdesc:items.ProductDescription,
                                           stloc:items.StorageLocation,
                                           stockqty:items.StockQty,
                                           Batch:items.Batch,
                                           salesoder:items.SalesOrder,
                                           Soitem:items.SalesOrderItem,
                                           recloc:recloc,
                                           recso:items.SalesOrder,
                                           recsoitem:items.SalesOrderItem,
                                           Grade:items.Grade,
                                           SETCODE:items.SETCODE

                                       }
                                       aTablearr2.push(obj);
   
                                   })
                                   TableModel2.setProperty("/aTableData1", aTablearr2)
                                   oBusyDialog.close();
                               }
   
                           }.bind(this),
                           error: function (error) {
                               oBusyDialog.close();
                               MessageBox.show("Data Can't Read!!!!!!!!!", {
                                   title: "Warning!!!!!!",
                                   icon: MessageBox.Icon.ERROR
                               });
                           }
   
                       })
   
                   }
                   else if(batch !="" && material != "" && salesorder !="" && soitem != "" && stockfrom != "" && stockto !="") {
                    var batch = this.getView().byId("idbatch").getValue();
                    var material = this.getView().byId("idmaterial").getValue();
                    var salesorder = this.getView().byId("idsalesorder").getValue();
                    var soitem = this.getView().byId("idsoitem").getValue();
                    var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                    // var oFilter1 = new sap.ui.model.Filter("IssuingOrReceivingStorageLoc", "EQ", recloc);
                    var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                    var oFilter4 = new sap.ui.model.Filter("Material", "EQ", material);
                    var oFilter3 = new sap.ui.model.Filter("SalesOrder", "EQ", salesorder);
                    var oFilter5 = new sap.ui.model.Filter("Batch", "EQ", batch);
                    var oFilter6 = new sap.ui.model.Filter("SalesOrderItem", "EQ", soitem);
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Fetching Data",
                        text: "Please wait",
                    });
                    oBusyDialog.open();

                    oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                        urlParameters: { "$top": "50000" },
                        filters: [oFilter, oFilter2,oFilter4,oFilter3],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                oBusyDialog.close();
                                MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                    title: "Warning",
                                    icon: MessageBox.Icon.ERROR
                                });
                            }
                            else {
                                
                                var TableModel2 = this.getView().getModel("oTableDataModel1");
                                var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                oresponse.results.map(function (items) {
                                    var stock = Number(items.StockQty);
                                    if(stock>Number(stockfrom)  && stock <= Number(stockto)){
                                        var obj = {
                                            Plant:items.Plant,
                                            mat:items.Material,
                                            matdesc:items.ProductDescription,
                                            stloc:items.StorageLocation,
                                            stockqty:items.StockQty,
                                            Batch:items.Batch,
                                            salesoder:items.SalesOrder,
                                            Soitem:items.SalesOrderItem,
                                            recloc:recloc,
                                            recso:items.SalesOrder,
                                            recsoitem:items.SalesOrderItem,
                                            Grade:items.Grade,
                                           SETCODE:items.SETCODE

                                        }
                                        aTablearr2.push(obj);
                                    }
                                    

                                })
                                TableModel2.setProperty("/aTableData1", aTablearr2)
                                oBusyDialog.close();
                            }

                        }.bind(this),
                        error: function (error) {
                            oBusyDialog.close();
                            MessageBox.show("Data Can't Read!!!!!!!!!", {
                                title: "Warning!!!!!!",
                                icon: MessageBox.Icon.ERROR
                            });
                        }

                    })

                   }
                   
                }
                else{
                   var recso = this.getView().byId("idrecso").getValue();
                   var recsoitem = this.getView().byId("idrecsitem").getValue();
                   if (stloc === "") {
                       MessageBox.error("Please Select The St Loc.", {
                           title: "Warning",
                           icon: MessageBox.Icon.ERROR
                       });
   
                   }
                   else if(plant ===""){
                       MessageBox.error("Please Select The Plant",
                       {
                           title: "Warning",
                           icon: MessageBox.Icon.ERROR
                       });
                   }
                   else if (recso === "") {
                       MessageBox.error("Please Select The Rec. SO",
                           {
                               title: "Warning",
                               icon: MessageBox.Icon.ERROR
                           });
                   }
                   else if (recsoitem === "") {
                       MessageBox.error("Please Select The Rec. SO Item",
                           {
                               title: "Warning",
                               icon: MessageBox.Icon.ERROR
                           });
                   }
                   else if (salesorder.length>0 && soitem ==="") {
                       MessageBox.error("Please Enter the Sales Order Item",
                       {
                           title: "Warning",
                           icon: MessageBox.Icon.ERROR
                       });
                   }
                   else if (soitem.length>0 && salesorder ==="") {
                       MessageBox.error("Please Enter the Sales Order",
                       {
                           title: "Warning",
                           icon: MessageBox.Icon.ERROR
                       });
                   }
                   else if(batch ==="" && material === "" && salesorder ==="" && soitem === "" && stockfrom === "" && stockto ==="") {
                       batch = this.getView().byId("idbatch").getValue();
                       var material = this.getView().byId("idmaterial").getValue();
                       var salesorder = this.getView().byId("idsalesorder").getValue();
                       var soitem = this.getView().byId("idsoitem").getValue();
                       var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                       
                       var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                       var oBusyDialog = new sap.m.BusyDialog({
                           title: "Fetching Data",
                           text: "Please wait",
                       });
                       oBusyDialog.open();
   
                       oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                           urlParameters: { "$top": "50000" },
                           filters: [oFilter, oFilter2],
                           success: function (oresponse) {
                               if (oresponse.results.length === 0) {
                                   oBusyDialog.close();
                                   MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                       title: "Warning",
                                       icon: MessageBox.Icon.ERROR
                                   });
                               }
                               else {
                                   
                                   var TableModel2 = this.getView().getModel("oTableDataModel1");
                                   var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                   oresponse.results.map(function (items) {
                                       var obj = {
                                           Plant:items.Plant,
                                           mat:items.Material,
                                           matdesc:items.ProductDescription,
                                           stloc:items.StorageLocation,
                                           stockqty:items.StockQty,
                                           Batch:items.Batch,
                                           salesoder:items.SalesOrder,
                                           Soitem:items.SalesOrderItem,
                                           Grade:items.Grade,
                                           recloc:items.StorageLocation,
                                           recso:recso,
                                           recsoitem:recsoitem,
                                           SETCODE:items.SETCODE

                                       }
                                       aTablearr2.push(obj);
   
                                   })
                                   TableModel2.setProperty("/aTableData1", aTablearr2)
                                   oBusyDialog.close();
                               }
   
                           }.bind(this),
                           error: function (error) {
                               oBusyDialog.close();
                               MessageBox.show("Data Can't Read!!!!!!!!!", {
                                   title: "Warning!!!!!!",
                                   icon: MessageBox.Icon.ERROR
                               });
                           }
   
                       })
   
   
   
                   }
                   else if(batch ==="" && material === "" && salesorder ==="" && soitem === "" && stockfrom != "" && stockto !="") {
                    batch = this.getView().byId("idbatch").getValue();
                    var material = this.getView().byId("idmaterial").getValue();
                    var salesorder = this.getView().byId("idsalesorder").getValue();
                    var soitem = this.getView().byId("idsoitem").getValue();
                    var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                    
                    var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Fetching Data",
                        text: "Please wait",
                    });
                    oBusyDialog.open();

                    oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                        urlParameters: { "$top": "50000" },
                        filters: [oFilter, oFilter2],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                oBusyDialog.close();
                                MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                    title: "Warning",
                                    icon: MessageBox.Icon.ERROR
                                });
                            }
                            else {
                                
                                var TableModel2 = this.getView().getModel("oTableDataModel1");
                                var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                oresponse.results.map(function (items) {
                                    var stock = Number(items.StockQty);
                                    if(stock>Number(stockfrom)  && stock <= Number(stockto)){
                                    var obj = {
                                        Plant:items.Plant,
                                        mat:items.Material,
                                        matdesc:items.ProductDescription,
                                        stloc:items.StorageLocation,
                                        stockqty:items.StockQty,
                                        Batch:items.Batch,
                                        salesoder:items.SalesOrder,
                                        Soitem:items.SalesOrderItem,
                                        Grade:items.Grade,
                                        recloc:items.StorageLocation,
                                        recso:recso,
                                        recsoitem:recsoitem,
                                        SETCODE:items.SETCODE

                                    }
                                    aTablearr2.push(obj);
                                }
                                })
                            
                                TableModel2.setProperty("/aTableData1", aTablearr2)
                                oBusyDialog.close();
                            }

                        }.bind(this),
                        error: function (error) {
                            oBusyDialog.close();
                            MessageBox.show("Data Can't Read!!!!!!!!!", {
                                title: "Warning!!!!!!",
                                icon: MessageBox.Icon.ERROR
                            });
                        }

                    })



                   }
                   else if(batch ==="" && material != "" && salesorder ==="" && soitem === "" && stockfrom === "" && stockto ==="") {
                       batch = this.getView().byId("idbatch").getValue();
                       var material = this.getView().byId("idmaterial").getValue();
                       var salesorder = this.getView().byId("idsalesorder").getValue();
                       var soitem = this.getView().byId("idsoitem").getValue();
                       var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                       
                       var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                       var oFilter3 = new sap.ui.model.Filter("Material", "EQ", material);
                       var oBusyDialog = new sap.m.BusyDialog({
                           title: "Fetching Data",
                           text: "Please wait",
                       });
                       oBusyDialog.open();
   
                       oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                           urlParameters: { "$top": "50000" },
                           filters: [oFilter,oFilter2,oFilter3],
                           success: function (oresponse) {
                               if (oresponse.results.length === 0) {
                                   oBusyDialog.close();
                                   MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                       title: "Warning",
                                       icon: MessageBox.Icon.ERROR
                                   });
                               }
                               else {
                                   
                                   var TableModel2 = this.getView().getModel("oTableDataModel1");
                                   var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                   oresponse.results.map(function (items) {
                                       var obj = {
                                           Plant:items.Plant,
                                           mat:items.Material,
                                           matdesc:items.ProductDescription,
                                           stloc:items.StorageLocation,
                                           stockqty:items.StockQty,
                                           Batch:items.Batch,
                                           salesoder:items.SalesOrder,
                                           Soitem:items.SalesOrderItem,
                                           Grade:items.Grade,
                                           recloc:items.StorageLocation,
                                           recso:recso,
                                           recsoitem:recsoitem,
                                           SETCODE:items.SETCODE

                                       }
                                       aTablearr2.push(obj);
   
                                   })
                                   TableModel2.setProperty("/aTableData1", aTablearr2)
                                   oBusyDialog.close();
                               }
   
                           }.bind(this),
                           error: function (error) {
                               oBusyDialog.close();
                               MessageBox.show("Data Can't Read!!!!!!!!!", {
                                   title: "Warning!!!!!!",
                                   icon: MessageBox.Icon.ERROR
                               });
                           }
   
                       })
                   }
                   else if(batch ==="" && material != "" && salesorder ==="" && soitem === "" && stockfrom != "" && stockto !="") {
                    batch = this.getView().byId("idbatch").getValue();
                    var material = this.getView().byId("idmaterial").getValue();
                    var salesorder = this.getView().byId("idsalesorder").getValue();
                    var soitem = this.getView().byId("idsoitem").getValue();
                    var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                    
                    var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                    var oFilter3 = new sap.ui.model.Filter("Material", "EQ", material);
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Fetching Data",
                        text: "Please wait",
                    });
                    oBusyDialog.open();

                    oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                        urlParameters: { "$top": "50000" },
                        filters: [oFilter,oFilter2,oFilter3],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                oBusyDialog.close();
                                MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                    title: "Warning",
                                    icon: MessageBox.Icon.ERROR
                                });
                            }
                            else {
                                
                                var TableModel2 = this.getView().getModel("oTableDataModel1");
                                var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                oresponse.results.map(function (items) {
                                    var stock = Number(items.StockQty);
                                    if(stock>Number(stockfrom)  && stock <= Number(stockto)){
                                    var obj = {
                                        Plant:items.Plant,
                                        mat:items.Material,
                                        matdesc:items.ProductDescription,
                                        stloc:items.StorageLocation,
                                        stockqty:items.StockQty,
                                        Batch:items.Batch,
                                        salesoder:items.SalesOrder,
                                        Soitem:items.SalesOrderItem,
                                        Grade:items.Grade,
                                        recloc:items.StorageLocation,
                                        recso:recso,
                                        recsoitem:recsoitem,
                                        SETCODE:items.SETCODE

                                    }
                                    aTablearr2.push(obj);
                                }
                                })
                                TableModel2.setProperty("/aTableData1", aTablearr2)
                                oBusyDialog.close();
                            }

                        }.bind(this),
                        error: function (error) {
                            oBusyDialog.close();
                            MessageBox.show("Data Can't Read!!!!!!!!!", {
                                title: "Warning!!!!!!",
                                icon: MessageBox.Icon.ERROR
                            });
                        }

                    })
                   }
                   else if(batch ==="" && material === "" && salesorder !="" && soitem != "" && stockfrom === "" && stockto ==="") {
   
                       var batch = this.getView().byId("idbatch").getValue();
                       var material = this.getView().byId("idmaterial").getValue();
                       var salesorder = this.getView().byId("idsalesorder").getValue();
                       var soitem = this.getView().byId("idsoitem").getValue();
                       var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                       var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                       var oFilter4 = new sap.ui.model.Filter("Material", "EQ", material);
                       var oFilter3 = new sap.ui.model.Filter("Batch", "EQ", batch);
                       var oFilter5 = new sap.ui.model.Filter("SalesOrder", "EQ", salesorder);
                       var oFilter6 = new sap.ui.model.Filter("SalesOrderItem", "EQ", soitem);
                       var oBusyDialog = new sap.m.BusyDialog({
                           title: "Fetching Data",
                           text: "Please wait",
                       });
                       oBusyDialog.open();
   
                       oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                           urlParameters: { "$top": "50000" },
                           filters: [oFilter,oFilter2,oFilter6,oFilter5],
                           success: function (oresponse) {
                               if (oresponse.results.length === 0) {
                                   oBusyDialog.close();
                                   MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                       title: "Warning",
                                       icon: MessageBox.Icon.ERROR
                                   });
                               }
                               else {
                                   
                                   var TableModel2 = this.getView().getModel("oTableDataModel1");
                                   var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                   oresponse.results.map(function (items) {
                                       var obj = {
                                           Plant:items.Plant,
                                           mat:items.Material,
                                           matdesc:items.ProductDescription,
                                           stloc:items.StorageLocation,
                                           stockqty:items.StockQty,
                                           Batch:items.Batch,
                                           salesoder:items.SalesOrder,
                                           Soitem:items.SalesOrderItem,
                                           Grade:items.Grade,
                                           recloc:items.StorageLocation,
                                           recso:recso,
                                           recsoitem:recsoitem,
                                           SETCODE:items.SETCODE

                                       }
                                       aTablearr2.push(obj);
   
                                   })
                                   TableModel2.setProperty("/aTableData1", aTablearr2)
                                   oBusyDialog.close();
                               }
   
                           }.bind(this),
                           error: function (error) {
                               oBusyDialog.close();
                               MessageBox.show("Data Can't Read!!!!!!!!!", {
                                   title: "Warning!!!!!!",
                                   icon: MessageBox.Icon.ERROR
                               });
                           }
   
                       })
   
                   }
                   else if(batch ==="" && material === "" && salesorder !="" && soitem != "" && stockfrom != "" && stockto !="") {
   
                    var batch = this.getView().byId("idbatch").getValue();
                    var material = this.getView().byId("idmaterial").getValue();
                    var salesorder = this.getView().byId("idsalesorder").getValue();
                    var soitem = this.getView().byId("idsoitem").getValue();
                    var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                    var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                    var oFilter4 = new sap.ui.model.Filter("Material", "EQ", material);
                    var oFilter3 = new sap.ui.model.Filter("Batch", "EQ", batch);
                    var oFilter5 = new sap.ui.model.Filter("SalesOrder", "EQ", salesorder);
                    var oFilter6 = new sap.ui.model.Filter("SalesOrderItem", "EQ", soitem);
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Fetching Data",
                        text: "Please wait",
                    });
                    oBusyDialog.open();

                    oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                        urlParameters: { "$top": "50000" },
                        filters: [oFilter,oFilter2,oFilter6,oFilter5],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                oBusyDialog.close();
                                MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                    title: "Warning",
                                    icon: MessageBox.Icon.ERROR
                                });
                            }
                            else {
                                
                                var TableModel2 = this.getView().getModel("oTableDataModel1");
                                var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                oresponse.results.map(function (items) {
                                    var stock = Number(items.StockQty);
                                    if(stock>Number(stockfrom)  && stock <= Number(stockto)){
                                    var obj = {
                                        Plant:items.Plant,
                                        mat:items.Material,
                                        matdesc:items.ProductDescription,
                                        stloc:items.StorageLocation,
                                        stockqty:items.StockQty,
                                        Batch:items.Batch,
                                        salesoder:items.SalesOrder,
                                        Soitem:items.SalesOrderItem,
                                        Grade:items.Grade,
                                        recloc:items.StorageLocation,
                                        recso:recso,
                                        recsoitem:recsoitem,
                                        SETCODE:items.SETCODE

                                    }
                                    aTablearr2.push(obj);
                                }
                                })
                                TableModel2.setProperty("/aTableData1", aTablearr2)
                                oBusyDialog.close();
                            }

                        }.bind(this),
                        error: function (error) {
                            oBusyDialog.close();
                            MessageBox.show("Data Can't Read!!!!!!!!!", {
                                title: "Warning!!!!!!",
                                icon: MessageBox.Icon.ERROR
                            });
                        }

                    })

                   }
                   else if(batch ==="" && material != "" && salesorder !="" && soitem != "" && stockfrom === "" && stockto ==="") {
                       var batch = this.getView().byId("idbatch").getValue();
                       var material = this.getView().byId("idmaterial").getValue();
                       var salesorder = this.getView().byId("idsalesorder").getValue();
                       var soitem = this.getView().byId("idsoitem").getValue();
                       var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                       
                       var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                       var oFilter4 = new sap.ui.model.Filter("Material", "EQ", material);
                       var oFilter3 = new sap.ui.model.Filter("SalesOrder", "EQ", salesorder);
                       var oBusyDialog = new sap.m.BusyDialog({
                           title: "Fetching Data",
                           text: "Please wait",
                       });
                       oBusyDialog.open();
   
                       oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                           urlParameters: { "$top": "50000" },
                           filters: [oFilter,oFilter2,oFilter4,oFilter3],
                           success: function (oresponse) {
                               if (oresponse.results.length === 0) {
                                   oBusyDialog.close();
                                   MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                       title: "Warning",
                                       icon: MessageBox.Icon.ERROR
                                   });
                               }
                               else {
                                   
                                   var TableModel2 = this.getView().getModel("oTableDataModel1");
                                   var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                   oresponse.results.map(function (items) {
                                       var obj = {
                                           Plant:items.Plant,
                                           mat:items.Material,
                                           matdesc:items.ProductDescription,
                                           stloc:items.StorageLocation,
                                           stockqty:items.StockQty,
                                           Batch:items.Batch,
                                           salesoder:items.SalesOrder,
                                           Soitem:items.SalesOrderItem,
                                           Grade:items.Grade,
                                           recloc:items.StorageLocation,
                                           recso:recso,
                                           recsoitem:recsoitem,
                                           SETCODE:items.SETCODE

                                       }
                                       aTablearr2.push(obj);
   
                                   })
                                   TableModel2.setProperty("/aTableData1", aTablearr2)
                                   oBusyDialog.close();
                               }
   
                           }.bind(this),
                           error: function (error) {
                               oBusyDialog.close();
                               MessageBox.show("Data Can't Read!!!!!!!!!", {
                                   title: "Warning!!!!!!",
                                   icon: MessageBox.Icon.ERROR
                               });
                           }
   
                       })
   
                   }
                   else if(batch ==="" && material != "" && salesorder !="" && soitem != "" && stockfrom != "" && stockto !="") {
                    var batch = this.getView().byId("idbatch").getValue();
                    var material = this.getView().byId("idmaterial").getValue();
                    var salesorder = this.getView().byId("idsalesorder").getValue();
                    var soitem = this.getView().byId("idsoitem").getValue();
                    var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                    
                    var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                    var oFilter4 = new sap.ui.model.Filter("Material", "EQ", material);
                    var oFilter3 = new sap.ui.model.Filter("SalesOrder", "EQ", salesorder);
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Fetching Data",
                        text: "Please wait",
                    });
                    oBusyDialog.open();

                    oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                        urlParameters: { "$top": "50000" },
                        filters: [oFilter,oFilter2,oFilter4,oFilter3],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                oBusyDialog.close();
                                MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                    title: "Warning",
                                    icon: MessageBox.Icon.ERROR
                                });
                            }
                            else {
                                
                                var TableModel2 = this.getView().getModel("oTableDataModel1");
                                var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                oresponse.results.map(function (items) {
                                    var stock = Number(items.StockQty);
                                    if(stock>Number(stockfrom)  && stock <= Number(stockto)){
                                    var obj = {
                                        Plant:items.Plant,
                                        mat:items.Material,
                                        matdesc:items.ProductDescription,
                                        stloc:items.StorageLocation,
                                        stockqty:items.StockQty,
                                        Batch:items.Batch,
                                        salesoder:items.SalesOrder,
                                        Soitem:items.SalesOrderItem,
                                        Grade:items.Grade,
                                        recloc:items.StorageLocation,
                                        recso:recso,
                                        recsoitem:recsoitem,
                                        SETCODE:items.SETCODE

                                    }
                                    aTablearr2.push(obj);
                                }
                                })
                                TableModel2.setProperty("/aTableData1", aTablearr2)
                                oBusyDialog.close();
                            }

                        }.bind(this),
                        error: function (error) {
                            oBusyDialog.close();
                            MessageBox.show("Data Can't Read!!!!!!!!!", {
                                title: "Warning!!!!!!",
                                icon: MessageBox.Icon.ERROR
                            });
                        }

                    })

                   }
                   else if(batch =!"" && material === "" && salesorder ==="" && soitem === "" && stockfrom === "" && stockto ==="") {
                       batch = this.getView().byId("idbatch").getValue();
                       var material = this.getView().byId("idmaterial").getValue();
                       var salesorder = this.getView().byId("idsalesorder").getValue();
                       var soitem = this.getView().byId("idsoitem").getValue();
                       var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                       var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                       var oFilter3 = new sap.ui.model.Filter("Batch", "EQ", batch);
                       var oBusyDialog = new sap.m.BusyDialog({
                           title: "Fetching Data",
                           text: "Please wait",
                       });
                       oBusyDialog.open();
   
                       oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                           urlParameters: { "$top": "50000" },
                           filters: [oFilter, oFilter2,oFilter3],
                           success: function (oresponse) {
                               if (oresponse.results.length === 0) {
                                   oBusyDialog.close();
                                   MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                       title: "Warning",
                                       icon: MessageBox.Icon.ERROR
                                   });
                               }
                               else {
                                   
                                   var TableModel2 = this.getView().getModel("oTableDataModel1");
                                   var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                   oresponse.results.map(function (items) {
                                       var obj = {
                                           Plant:items.Plant,
                                           mat:items.Material,
                                           matdesc:items.ProductDescription,
                                           stloc:items.StorageLocation,
                                           stockqty:items.StockQty,
                                           Batch:items.Batch,
                                           salesoder:items.SalesOrder,
                                           Soitem:items.SalesOrderItem,
                                           Grade:items.Grade,
                                           recloc:items.StorageLocation,
                                           recso:recso,
                                           recsoitem:recsoitem,
                                           SETCODE:items.SETCODE

                                       }
                                       aTablearr2.push(obj);
   
                                   })
                                   TableModel2.setProperty("/aTableData1", aTablearr2)
                                   oBusyDialog.close();
                               }
   
                           }.bind(this),
                           error: function (error) {
                               oBusyDialog.close();
                               MessageBox.show("Data Can't Read!!!!!!!!!", {
                                   title: "Warning!!!!!!",
                                   icon: MessageBox.Icon.ERROR
                               });
                           }
   
                       })
   
   
   
   
                   }
                   else if(batch =!"" && material === "" && salesorder ==="" && soitem === "" && stockfrom != "" && stockto !="") {
                    batch = this.getView().byId("idbatch").getValue();
                    var material = this.getView().byId("idmaterial").getValue();
                    var salesorder = this.getView().byId("idsalesorder").getValue();
                    var soitem = this.getView().byId("idsoitem").getValue();
                    var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                    var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                    var oFilter3 = new sap.ui.model.Filter("Batch", "EQ", batch);
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Fetching Data",
                        text: "Please wait",
                    });
                    oBusyDialog.open();

                    oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                        urlParameters: { "$top": "50000" },
                        filters: [oFilter, oFilter2,oFilter3],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                oBusyDialog.close();
                                MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                    title: "Warning",
                                    icon: MessageBox.Icon.ERROR
                                });
                            }
                            else {
                                
                                var TableModel2 = this.getView().getModel("oTableDataModel1");
                                var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                oresponse.results.map(function (items) {
                                    var stock = Number(items.StockQty);
                                    if(stock>Number(stockfrom)  && stock <= Number(stockto)){
                                    var obj = {
                                        Plant:items.Plant,
                                        mat:items.Material,
                                        matdesc:items.ProductDescription,
                                        stloc:items.StorageLocation,
                                        stockqty:items.StockQty,
                                        Batch:items.Batch,
                                        salesoder:items.SalesOrder,
                                        Soitem:items.SalesOrderItem,
                                        Grade:items.Grade,
                                        recloc:items.StorageLocation,
                                        recso:recso,
                                        recsoitem:recsoitem,
                                        SETCODE:items.SETCODE

                                    }
                                    aTablearr2.push(obj);
                                }
                                })
                                TableModel2.setProperty("/aTableData1", aTablearr2)
                                oBusyDialog.close();
                            }

                        }.bind(this),
                        error: function (error) {
                            oBusyDialog.close();
                            MessageBox.show("Data Can't Read!!!!!!!!!", {
                                title: "Warning!!!!!!",
                                icon: MessageBox.Icon.ERROR
                            });
                        }

                    })




                   }
                   else if(batch =!"" && material != "" && salesorder ==="" && soitem === "" && stockfrom === "" && stockto ==="") {
                       batch = this.getView().byId("idbatch").getValue();
                       var material = this.getView().byId("idmaterial").getValue();
                       var salesorder = this.getView().byId("idsalesorder").getValue();
                       var soitem = this.getView().byId("idsoitem").getValue();
                       var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                       var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                       var oFilter4 = new sap.ui.model.Filter("Material", "EQ", material);
                       var oFilter3 = new sap.ui.model.Filter("Batch", "EQ", batch);
                       var oBusyDialog = new sap.m.BusyDialog({
                           title: "Fetching Data",
                           text: "Please wait",
                       });
                       oBusyDialog.open();
   
                       oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                           urlParameters: { "$top": "50000" },
                           filters: [oFilter,oFilter2,oFilter3,oFilter4],
                           success: function (oresponse) {
                               if (oresponse.results.length === 0) {
                                   oBusyDialog.close();
                                   MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                       title: "Warning",
                                       icon: MessageBox.Icon.ERROR
                                   });
                               }
                               else {
                                   
                                   var TableModel2 = this.getView().getModel("oTableDataModel1");
                                   var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                   oresponse.results.map(function (items) {
                                       var obj = {
                                           Plant:items.Plant,
                                           mat:items.Material,
                                           matdesc:items.ProductDescription,
                                           stloc:items.StorageLocation,
                                           stockqty:items.StockQty,
                                           Batch:items.Batch,
                                           salesoder:items.SalesOrder,
                                           Soitem:items.SalesOrderItem,
                                           Grade:items.Grade,
                                           recloc:items.StorageLocation,
                                           recso:recso,
                                           recsoitem:recsoitem,
                                           SETCODE:items.SETCODE

                                       }
                                       aTablearr2.push(obj);
   
                                   })
                                   TableModel2.setProperty("/aTableData1", aTablearr2)
                                   oBusyDialog.close();
                               }
   
                           }.bind(this),
                           error: function (error) {
                               oBusyDialog.close();
                               MessageBox.show("Data Can't Read!!!!!!!!!", {
                                   title: "Warning!!!!!!",
                                   icon: MessageBox.Icon.ERROR
                               });
                           }
   
                       })
   
                   }
                   else if(batch =!"" && material != "" && salesorder ==="" && soitem === "" && stockfrom != "" && stockto !="") {
                    batch = this.getView().byId("idbatch").getValue();
                    var material = this.getView().byId("idmaterial").getValue();
                    var salesorder = this.getView().byId("idsalesorder").getValue();
                    var soitem = this.getView().byId("idsoitem").getValue();
                    var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                    var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                    var oFilter4 = new sap.ui.model.Filter("Material", "EQ", material);
                    var oFilter3 = new sap.ui.model.Filter("Batch", "EQ", batch);
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Fetching Data",
                        text: "Please wait",
                    });
                    oBusyDialog.open();

                    oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                        urlParameters: { "$top": "50000" },
                        filters: [oFilter,oFilter2,oFilter3,oFilter4],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                oBusyDialog.close();
                                MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                    title: "Warning",
                                    icon: MessageBox.Icon.ERROR
                                });
                            }
                            else {
                                
                                var TableModel2 = this.getView().getModel("oTableDataModel1");
                                var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                oresponse.results.map(function (items) {
                                    var stock = Number(items.StockQty);
                                    if(stock>Number(stockfrom)  && stock <= Number(stockto)){
                                    var obj = {
                                        Plant:items.Plant,
                                        mat:items.Material,
                                        matdesc:items.ProductDescription,
                                        stloc:items.StorageLocation,
                                        stockqty:items.StockQty,
                                        Batch:items.Batch,
                                        salesoder:items.SalesOrder,
                                        Soitem:items.SalesOrderItem,
                                        Grade:items.Grade,
                                        recloc:items.StorageLocation,
                                        recso:recso,
                                        recsoitem:recsoitem,
                                        SETCODE:items.SETCODE

                                    }
                                    aTablearr2.push(obj);
                                }
                                })
                                TableModel2.setProperty("/aTableData1", aTablearr2)
                                oBusyDialog.close();
                            }

                        }.bind(this),
                        error: function (error) {
                            oBusyDialog.close();
                            MessageBox.show("Data Can't Read!!!!!!!!!", {
                                title: "Warning!!!!!!",
                                icon: MessageBox.Icon.ERROR
                            });
                        }

                    })

                   }
                   else if(batch !="" && material === "" && salesorder !="" && soitem != "" && stockfrom === "" && stockto ==="") {
                       var batch = this.getView().byId("idbatch").getValue();
                       var material = this.getView().byId("idmaterial").getValue();
                       var salesorder = this.getView().byId("idsalesorder").getValue();
                       var soitem = this.getView().byId("idsoitem").getValue();
                       var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                       var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                       var oFilter4 = new sap.ui.model.Filter("SalesOrderItem", "EQ", soitem);
                       var oFilter3 = new sap.ui.model.Filter("Batch", "EQ", batch);
                       var oBusyDialog = new sap.m.BusyDialog({
                           title: "Fetching Data",
                           text: "Please wait",
                       });
                       oBusyDialog.open();
   
                       oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                           urlParameters: { "$top": "50000" },
                           filters: [oFilter,oFilter2,oFilter3,oFilter4],
                           success: function (oresponse) {
                               if (oresponse.results.length === 0) {
                                   oBusyDialog.close();
                                   MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                       title: "Warning",
                                       icon: MessageBox.Icon.ERROR
                                   });
                               }
                               else {
                                   
                                   var TableModel2 = this.getView().getModel("oTableDataModel1");
                                   var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                   oresponse.results.map(function (items) {
                                       var obj = {
                                           Plant:items.Plant,
                                           mat:items.Material,
                                           matdesc:items.ProductDescription,
                                           stloc:items.StorageLocation,
                                           stockqty:items.StockQty,
                                           Batch:items.Batch,
                                           salesoder:items.SalesOrder,
                                           Soitem:items.SalesOrderItem,
                                           Grade:items.Grade,
                                           recloc:items.StorageLocation,
                                           recso:recso,
                                           recsoitem:recsoitem,
                                           SETCODE:items.SETCODE

                                       }
                                       aTablearr2.push(obj);
   
                                   })
                                   TableModel2.setProperty("/aTableData1", aTablearr2)
                                   oBusyDialog.close();
                               }
   
                           }.bind(this),
                           error: function (error) {
                               oBusyDialog.close();
                               MessageBox.show("Data Can't Read!!!!!!!!!", {
                                   title: "Warning!!!!!!",
                                   icon: MessageBox.Icon.ERROR
                               });
                           }
   
                       })
   
                   }
                   else if(batch !="" && material === "" && salesorder !="" && soitem != "" && stockfrom != "" && stockto !="") {
                    var batch = this.getView().byId("idbatch").getValue();
                    var material = this.getView().byId("idmaterial").getValue();
                    var salesorder = this.getView().byId("idsalesorder").getValue();
                    var soitem = this.getView().byId("idsoitem").getValue();
                    var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                    var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                    var oFilter4 = new sap.ui.model.Filter("SalesOrderItem", "EQ", soitem);
                    var oFilter3 = new sap.ui.model.Filter("Batch", "EQ", batch);
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Fetching Data",
                        text: "Please wait",
                    });
                    oBusyDialog.open();

                    oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                        urlParameters: { "$top": "50000" },
                        filters: [oFilter,oFilter2,oFilter3,oFilter4],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                oBusyDialog.close();
                                MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                    title: "Warning",
                                    icon: MessageBox.Icon.ERROR
                                });
                            }
                            else {
                                
                                var TableModel2 = this.getView().getModel("oTableDataModel1");
                                var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                oresponse.results.map(function (items) {
                                    var stock = Number(items.StockQty);
                                    if(stock>Number(stockfrom)  && stock <= Number(stockto)){
                                    var obj = {
                                        Plant:items.Plant,
                                        mat:items.Material,
                                        matdesc:items.ProductDescription,
                                        stloc:items.StorageLocation,
                                        stockqty:items.StockQty,
                                        Batch:items.Batch,
                                        salesoder:items.SalesOrder,
                                        Soitem:items.SalesOrderItem,
                                        Grade:items.Grade,
                                        recloc:items.StorageLocation,
                                        recso:recso,
                                        recsoitem:recsoitem,
                                        SETCODE:items.SETCODE

                                    }
                                    aTablearr2.push(obj);
                                }
                                })
                                TableModel2.setProperty("/aTableData1", aTablearr2)
                                oBusyDialog.close();
                            }

                        }.bind(this),
                        error: function (error) {
                            oBusyDialog.close();
                            MessageBox.show("Data Can't Read!!!!!!!!!", {
                                title: "Warning!!!!!!",
                                icon: MessageBox.Icon.ERROR
                            });
                        }

                    })

                   }
                   else if(batch !="" && material != "" && salesorder !="" && soitem != "" && stockfrom === "" && stockto ==="") {
                       var batch = this.getView().byId("idbatch").getValue();
                       var material = this.getView().byId("idmaterial").getValue();
                       var salesorder = this.getView().byId("idsalesorder").getValue();
                       var soitem = this.getView().byId("idsoitem").getValue();
                       var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                       var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                       var oFilter4 = new sap.ui.model.Filter("Material", "EQ", material);
                       var oFilter3 = new sap.ui.model.Filter("SalesOrder", "EQ", salesorder);
                       var oFilter5 = new sap.ui.model.Filter("Batch", "EQ", batch);
                       var oFilter6 = new sap.ui.model.Filter("SalesOrderItem", "EQ", soitem);
                       var oBusyDialog = new sap.m.BusyDialog({
                           title: "Fetching Data",
                           text: "Please wait",
                       });
                       oBusyDialog.open();
   
                       oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                           urlParameters: { "$top": "50000" },
                           filters: [oFilter,oFilter2,oFilter4,oFilter3],
                           success: function (oresponse) {
                               if (oresponse.results.length === 0) {
                                   oBusyDialog.close();
                                   MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                       title: "Warning",
                                       icon: MessageBox.Icon.ERROR
                                   });
                               }
                               else {
                                   
                                   var TableModel2 = this.getView().getModel("oTableDataModel1");
                                   var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                   oresponse.results.map(function (items) {
                                       var obj = {
                                           Plant:items.Plant,
                                           mat:items.Material,
                                           matdesc:items.ProductDescription,
                                           stloc:items.StorageLocation,
                                           stockqty:items.StockQty,
                                           Batch:items.Batch,
                                           salesoder:items.SalesOrder,
                                           Soitem:items.SalesOrderItem,
                                           Grade:items.Grade,
                                           recloc:items.StorageLocation,
                                           recso:recso,
                                           recsoitem:recsoitem,
                                           SETCODE:items.SETCODE

                                       }
                                       aTablearr2.push(obj);
   
                                   })
                                   TableModel2.setProperty("/aTableData1", aTablearr2)
                                   oBusyDialog.close();
                               }
   
                           }.bind(this),
                           error: function (error) {
                               oBusyDialog.close();
                               MessageBox.show("Data Can't Read!!!!!!!!!", {
                                   title: "Warning!!!!!!",
                                   icon: MessageBox.Icon.ERROR
                               });
                           }
   
                       })
   
                   }
                   else if(batch !="" && material != "" && salesorder !="" && soitem != "" && stockfrom != "" && stockto !="") {
                    var batch = this.getView().byId("idbatch").getValue();
                    var material = this.getView().byId("idmaterial").getValue();
                    var salesorder = this.getView().byId("idsalesorder").getValue();
                    var soitem = this.getView().byId("idsoitem").getValue();
                    var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                    var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", stloc);
                    var oFilter4 = new sap.ui.model.Filter("Material", "EQ", material);
                    var oFilter3 = new sap.ui.model.Filter("SalesOrder", "EQ", salesorder);
                    var oFilter5 = new sap.ui.model.Filter("Batch", "EQ", batch);
                    var oFilter6 = new sap.ui.model.Filter("SalesOrderItem", "EQ", soitem);
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Fetching Data",
                        text: "Please wait",
                    });
                    oBusyDialog.open();

                    oModel.read("/ZPP_TRANSFER_POSTING_CDS", {
                        urlParameters: { "$top": "50000" },
                        filters: [oFilter,oFilter2,oFilter4,oFilter3],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                oBusyDialog.close();
                                MessageBox.error("Wrong Enter Plant, Rec Loc, Sto Loc", {
                                    title: "Warning",
                                    icon: MessageBox.Icon.ERROR
                                });
                            }
                            else {
                                
                                var TableModel2 = this.getView().getModel("oTableDataModel1");
                                var aTablearr2 = TableModel2.getProperty("/aTableData1")
                                oresponse.results.map(function (items) {
                                    var stock = Number(items.StockQty);
                                    if(stock>Number(stockfrom)  && stock <= Number(stockto)){
                                    var obj = {
                                        Plant:items.Plant,
                                        mat:items.Material,
                                        matdesc:items.ProductDescription,
                                        stloc:items.StorageLocation,
                                        stockqty:items.StockQty,
                                        Batch:items.Batch,
                                        salesoder:items.SalesOrder,
                                        Soitem:items.SalesOrderItem,
                                        Grade:items.Grade,
                                        recloc:items.StorageLocation,
                                        recso:recso,
                                        recsoitem:recsoitem,
                                        SETCODE:items.SETCODE

                                    }
                                    aTablearr2.push(obj);
                                }
                                })
                                TableModel2.setProperty("/aTableData1", aTablearr2)
                                oBusyDialog.close();
                            }

                        }.bind(this),
                        error: function (error) {
                            oBusyDialog.close();
                            MessageBox.show("Data Can't Read!!!!!!!!!", {
                                title: "Warning!!!!!!",
                                icon: MessageBox.Icon.ERROR
                            });
                        }

                    })

                   }
                }
              }
            
            },
            savedata1: function () {
                    var oBusyDialog = new sap.m.BusyDialog({
                        text: "Please wait"
                    });
                    oBusyDialog.open();
                    var aIndices = this.byId("table1").getSelectedIndices();
                    if(aIndices.length === 0)
                    {
                        oBusyDialog.close();
                        MessageBox.error("Please Select At Least 1 line", {
                            title: "Warning",
                            icon: MessageBox.Icon.ERROR
                        });
                    }
                    else{
                        var table1 = this.getView().getModel("oTableDataModel1").getProperty("/aTableData1");
                        var radiobuton= this.getView().byId("idActionRadioBtnGroup").getSelectedButton().getText();
                        
                        var plant = this.getView().byId("plant").getValue();
                        
        
                        this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel1");
                        this.getOwnerComponent().getModel("oTableDataModel1").setProperty("/aTableData1", []);
    
                        var TableModel1 = this.getOwnerComponent().getModel("oTableDataModel1");
        
                        var aTablearr1 = [];
                        for(var i = 0; i < aIndices.length; i++){
                               
                            var items1 = {
                                Plant:table1[aIndices[i]].Plant,
                                mat:table1[aIndices[i]].mat,
                                matdesc:table1[aIndices[i]].matdesc,
                                stloc:table1[aIndices[i]].stloc,
                                stockqty:table1[aIndices[i]].stockqty,
                                Batch:table1[aIndices[i]].Batch,
                                salesoder:table1[aIndices[i]].salesoder,
                                Soitem:table1[aIndices[i]].Soitem,
                                recloc:table1[aIndices[i]].recloc,
                                recso:table1[aIndices[i]].recso,
                                recsoitem:table1[aIndices[i]].recsoitem,
                                Grade:table1[aIndices[i]].Grade,
                                SETCODE:table1[aIndices[i]].SETCODE


                            }
                                aTablearr1.push(items1);   
                              }
                    TableModel1.setProperty("/aTableData", aTablearr1)
                        
                            
        
                      
                        var url4 = "/sap/bc/http/sap/zpp_transfer_posting_http?sap-client=080";
                        var url1 ="&action="
                        var url2 = url1 + radiobuton;
    
                        var url = url4 + url2;
                        $.ajax({
                            type: "post",
                            url: url,
                            data: JSON.stringify({
                                radiobuton,
                                plant,
                                aTablearr1,
                            }),
                            contentType: "application/json; charset=utf-8",
                            traditional: true,
                            success: function (data) {
                                oBusyDialog.close();
                                MessageBox.show(data
                                    , {
                                        onClose: function (oAction) {
                                            if (oAction === MessageBox.Action.OK) {
                                                window.location.reload();
                                            }
                                        }.bind(this)
                                    });
                            }.bind(this),
                            error: function (error) {
                                oBusyDialog.close();
                                MessageBox.error(error);
                            }
        
                        })
                    }
                    
            },
            savedata: function(){
                var oModel = this.getView().getModel();
                var plant = this.getView().byId("plant").getValue();
                var material = this.getView().byId("idmaterial").getValue();
                var stloc = this.getView().byId("idstloc").getValue();
                var batch = this.getView().byId("idbatch").getValue();
                var salesorder = this.getView().byId("idsalesorder").getValue();
                var soitem = this.getView().byId("idsoitem").getValue();
                var stockfrom = this.getView().byId("idstockfrom").getValue();
                var stockto = this.getView().byId("idstockto").getValue();
                var recso = this.getView().byId("idrecso").getValue();
                var recsoitem = this.getView().byId("idrecsitem").getValue();
                const validateField = (condition, message) => {
                    if (condition) {
                        errorMessages.push(message);
                    }
                };
                
                let errorMessages = [];
                
                validateField(stockfrom !== "" && stockto === "", "Please Enter Stock To");
                validateField(stockfrom === "" && stockto !== "", "Please Enter Stock From");
                validateField(stloc === "", "Please Select The St Loc.");
                validateField(plant === "", "Please Select The Plant");
                validateField(recso === "", "Please Select The Rec. SO");
                validateField(recsoitem === "", "Please Select The Rec. SO Item");
                validateField(salesorder.length > 0 && soitem === "", "Please Enter the Sales Order Item");
                validateField(soitem.length > 0 && salesorder === "", "Please Enter the Sales Order");
                
                if (errorMessages.length > 0) {
                    MessageBox.error(errorMessages.join("\n\n"), {
                        title: "Warning",
                        icon: MessageBox.Icon.ERROR
                    });
                }else{
                    MessageBox.error("Devendra Singh Rathor", {
                        title: "Warning",
                        icon: MessageBox.Icon.ERROR
                    });
                }
                
            },
            onstoloc:function(oEvent){
                var plant = this.getView().byId("plant").getValue();
                var oModel = this.getView().getModel();
                var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "modelname")
                this.getView().getModel("modelname").setProperty("/odataelementlist", [])
                 oModel.read("/Sloc", {
                   filters: [oFilter],
                   urlParameters:{"$top": "5000"},
                   success: function (oresponse) {
                       this.getView().getModel("modelname").setProperty("/odataelementlist", oresponse.results)
                    }.bind(this)
                     })
            }
        
        });
    });
