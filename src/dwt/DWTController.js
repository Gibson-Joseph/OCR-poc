import React, { useState, useEffect } from 'react';
import './DWTController.css';
import Api from "../helpers/interceptor/interceptor";
import loadingSpinner from "../assets/refresh.svg";
import toastMsg from '../service/toastMsg/toast';
import { ToastContainer } from "react-toastify"

import { useNavigate } from "react-router-dom"
// import buffer from "buffer"
// import { workerData } from 'worker_threads';
// import fs from "fs";
// const fs=require("fs")
// import filepdf from "../../../../app/Downloads/final_format_sample.pdf"
// console.log("file--", filepdf);
/**
 * @props
 * @prop {object} Dynamsoft a namespace
 * @prop {number} startTime the time when initializing started
 * @prop {number} features the features that are enabled
 * @prop {WebTwain} dwt the object to perform the magic of Dynamic Web TWAIN
 * @prop {object} buffer the buffer status of data in memory (current & count)
 * @prop {number[]} selected the indices of the selected images
 * @prop {object[]} zones the zones on the current image that are selected by the user
 * @prop {object} runtimeInfo contains runtime information like the width & height of the current image
 * @prop {object[]} barcodeRects a number of rects to indicate where barcodes are found
 * @prop {function} handleOutPutMessage a function to call a message needs to be printed out
 * @prop {function} handleBarcodeResults a function to handle barcode rects
 * @prop {function} handleNavigating a function to handle whether navigation is allowed
 * @prop {function} handleException a function to handle exceptions
 */
let initialShownTabs = 127;
let fileUploaderReady = false;
let Dynamsoft = null;
let DWObject = null;
let fileUploaderManager = null;
console.log("DWObject", DWObject);
export default function DWTController(props) {
    const navigate = useNavigate()
    if (props.features & 7 === 0) {
        initialShownTabs = props.features;
    } else {
        initialShownTabs = props.features & 1 || props.features & 2 || props.features & 4;
        if (props.features & 24) {
            initialShownTabs += 8;
        } else if (props.features & 96) {
            initialShownTabs += 16;
        }
    }
    Dynamsoft = props.Dynamsoft
    const [shownTabs, setShownTabs] = useState(initialShownTabs);
    const [scanners, setScanners] = useState([]);
    const [deviceSetup, setDeviceSetup] = useState({
        currentScanner: "Looking for devices..",
        currentCamera: "Looking for devices..",
        bShowUI: false,
        bADF: false,
        bDuplex: false,
        nPixelType: "0",
        nResolution: "100",
        isVideoOn: false
    });


    const [saveFileFormat] = useState("pdf");
    const [saveFileName, setSaveFileName] = useState((new Date()).getTime().toString());


    useEffect(() => {
        DWObject = props.dwt;
        console.log("DWObject", DWObject);
        console.log();
        if (DWObject) {
            if (props.features & 0b1) {
                let vCount = DWObject.SourceCount;
                let sourceNames = [];
                for (let i = 0; i < vCount; i++)
                    sourceNames.push(DWObject.GetSourceNameItems(i));
                setScanners(sourceNames)
                console.log("scanners", scanners);
                if (sourceNames.length > 0)
                    onSourceChange(sourceNames[0]);
            }

            if (props.features & 0b10000000) {
                Dynamsoft.FileUploader.Init("", (objFileUploader) => {
                    console.log("objFileUploader", objFileUploader);
                    fileUploaderManager = objFileUploader;
                    console.log("fileUploaderManager", fileUploaderManager);
                    if (!fileUploaderReady) {
                        fileUploaderReady = true;
                        props.handleStatusChange(128);
                    }
                }, (errorCode, errorString) => {
                    props.handleException({ code: errorCode, message: errorString });
                    if (!fileUploaderReady) {
                        fileUploaderReady = true;
                        props.handleStatusChange(128);
                    }
                });
            }
        }
    }, [props.dwt]) // eslint-disable-line react-hooks/exhaustive-deps

    // Tab 1: Scanner
    const onSourceChange = (value) => {
        setDeviceSetup({ ...deviceSetup, currentScanner: value })
        if (value === "noscanner") return;
        if (Dynamsoft.Lib.env.bMac) {
            console.log("Dynamsoft.Lib.env.bMac", Dynamsoft.Lib.env.bMac);
            if (value.indexOf("ICA") === 0) {
                setDeviceSetup({ ...deviceSetup, noUI: true })
            } else {
                setDeviceSetup({ ...deviceSetup, noUI: false })
            }
        }
    }
    const handleScannerSetupChange = (e, option) => {
        switch (option.substr(0, 1)) {
            default: break;
            case "b":
                onScannerSetupChange(option, e.target.checked);
                break;
            case "n":
                onScannerSetupChange(option, e.target.value);
                break;
        }
    }
    const onScannerSetupChange = (option, value) => {
        setDeviceSetup(deviceSetup => {
            let newDeviceSetup = { ...deviceSetup };
            switch (option) {
                case "bShowUI":
                    newDeviceSetup.bShowUI = value;
                    console.log("newDeviceSetup.bShowUI", newDeviceSetup.bShowUI);
                    break;
                case "bADF":
                    newDeviceSetup.bADF = value;
                    console.log("newDeviceSetup.bADF", newDeviceSetup.bADF);
                    break;
                case "bDuplex":
                    newDeviceSetup.bDuplex = value;
                    break;
                case "nPixelType":
                    newDeviceSetup.nPixelType = value;
                    break;
                case "nResolution":
                    newDeviceSetup.nResolution = value;
                    break;
                default: break;
            }
            return newDeviceSetup
        })
    }
    const acquireImage = () => {
        DWObject.CloseSource();
        for (let i = 0; i < DWObject.SourceCount; i++) {
            if (DWObject.GetSourceNameItems(i) === deviceSetup.currentScanner) {
                DWObject.SelectSourceByIndex(i);
                break;
            }

        }
        DWObject.OpenSource();
        DWObject.AcquireImage(
            {
                IfShowUI: deviceSetup.bShowUI,
                PixelType: deviceSetup.nPixelType,
                Resolution: deviceSetup.nResolution,
                IfFeederEnabled: deviceSetup.bADF,
                IfDuplexEnabled: deviceSetup.bDuplex,
                IfDisableSourceAfterAcquire: true,
                IfGetImageInfo: true,
                IfGetExtImageInfo: true,
                extendedImageInfoQueryLevel: 0
            },
        );
    }


    const saveOrUploadImage = (_type) => {
        props.setLoading(true)
        let fileType = 0;
        let fileName = saveFileName + "." + saveFileFormat;

        let onSuccess = () => {
            console.log("onSuccess is called");
            setSaveFileName((new Date()).getTime().toString());

            DWObject.ConvertToBase64(
                [props.buffer.current],
                fileType,
                function (result, indices, type) {
                    let base64Str = result.getData(props.buffer.current, result.getLength(), indices)
                    console.log(base64Str);
                    Api("/v1/save_pdf", {
                        method: "POST",
                        data: {
                            base64: base64Str
                        },
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                        .then((data) => {
                            console.log('data from node server', data);
                            props.setBack(false)
                            navigate("/form", { state: data.data })
                            DWObject.RemoveImage(props.buffer.count)
                        })
                        .catch((err) => {
                            console.log("response err", err);
                            toastMsg("error", "OCR conversion failed, Kindly update the form manually");
                            navigate("/form")
                        });
                },
                function (errorCode, errorString) {
                    console.log("---------", errorString);
                }
            );

        };
        let onFailure = (errorCode, errorString, httpResponse) => {
            console.log("onFilure is Called",errorString);
        };

        DWObject.SaveAsPDF(fileName, props.buffer.current, onSuccess, onFailure);


        // DWObject.ConvertToBase64(
        //     [props.buffer.current],
        //     fileType,
        //     function (result, indices, type) {
        //         let base64Str = result.getData(props.buffer.current, result.getLength(), indices)
        //         console.log(base64Str);
        //         Api("/v1/save_pdf", {
        //             method: "POST",
        //             data: {
        //                 base64: base64Str
        //             },
        //             headers: {
        //                 "Content-Type": "application/json",
        //             },
        //         })
        //             .then((data) => {
        //                 console.log('data from node server', data);
        //                 props.setBack(false)
        //                 navigate("/form", { state: data.data })
        //                 DWObject.RemoveImage(props.buffer.count)
        //             })
        //             .catch((err) => {
        //                 console.log("response err", err);
        //                 toastMsg("error", "OCR conversion failed, Kindly update the form manually");
        //                 navigate("/form")
        //             });
        //     },
        //     function (errorCode, errorString) {
        //         console.log("---------", errorString);
        //     }
        // );

        if (_type !== "local" && _type !== "server") return;

        for (let o in Dynamsoft.DWT.EnumDWT_ImageType) {
            console.log("Dynamsoft.DWT.EnumDWT_ImageType", Dynamsoft.DWT.EnumDWT_ImageType);
            if (o.toLowerCase().indexOf(saveFileFormat) !== -1 && Dynamsoft.DWT.EnumDWT_ImageType[o] < 7) {
                fileType = Dynamsoft.DWT.EnumDWT_ImageType[o];
                break;
            }
        }
    }

    return (
        <div>
            <div className="DWTController">
                <div className="divinput">
                    <ul className="PCollapse">
                        {props.features & 0b1 ? (
                            <li>
                                <div className="divType" tabIndex="1" controlindex="1">
                                    <div className={shownTabs & 1 ? "mark_arrow expanded" : "mark_arrow collapsed"} ></div>
                                    Scan</div>
                                <div className="divTableStyle" style={shownTabs & 1 ? { display: "block" } : { display: "none" }}>
                                    <ul>
                                        <li>
                                            <select tabIndex="1" value={deviceSetup.currentScanner} className="fullWidth" onChange={(e) => onSourceChange(e.target.value)}>
                                                {
                                                    scanners.length > 0 ?
                                                        scanners.map((_name, _index) =>
                                                            <option value={_name} key={_index}>{_name}</option>
                                                        )
                                                        :
                                                        <option value="noscanner">Looking for devices..</option>
                                                }
                                            </select>
                                        </li>
                                        <li>
                                            <ul>
                                                <li>
                                                    <select tabIndex="1" style={{ width: "48%", marginRight: "4%" }}
                                                        value={deviceSetup.nPixelType}
                                                        onChange={(e) => handleScannerSetupChange(e, "nPixelType")}>
                                                        <option value="0">B&amp;W</option>
                                                        <option value="1">Gray</option>
                                                        <option value="2">Color</option>
                                                    </select>
                                                    <select tabIndex="1" style={{ width: "48%" }}
                                                        value={deviceSetup.nResolution}
                                                        onChange={(e) => handleScannerSetupChange(e, "nResolution")}>
                                                        <option value="100">100 DPI</option>
                                                        <option value="200">200 DPI</option>
                                                        <option value="300">300 DPI</option>
                                                        <option value="600">600 DPI</option>
                                                    </select>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="tc">
                                            <button tabIndex="1" className={scanners.length > 0 ? "majorButton enabled fullWidth" : "majorButton disabled fullWidth"} onClick={() => acquireImage()} disabled={scanners.length > 0 ? "" : "disabled"}>Scan</button>
                                        </li>
                                        <li className="tc">
                                            {(props.features & 0b1000) ? <button tabIndex="4" className={props.buffer.count === 0 ? "majorButton disabled width_48p" : "majorButton enabled width_48p"} disabled={props.buffer.count === 0 ? "disabled" : ""} onClick={() => saveOrUploadImage('local')} >Upload</button> : ""}
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        ) : ""}
                    </ul>
                </div>
            </div >
        </div>
    );
}