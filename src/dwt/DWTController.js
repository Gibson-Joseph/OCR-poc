import React, { useState, useEffect } from 'react';
import './DWTController.css';
import ValuePicker from './ValuePicker';
import RangePicker from './RangePicker';
import Api from "../helpers/interceptor/interceptor";
import loadinSpinner from "../assets/refresh.svg";
import toastMsg from '../service/toast/toast';
import { ToastContainer } from "react-toastify"

import { Navigate, useNavigate } from "react-router-dom"
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
let cameraReady = false;
let barcodeReady = false;
let ocrReady = false;
let fileUploaderReady = false;
let Dynamsoft = null;
let DWObject = null;
//  let dbrObject = null;
let fileUploaderManager = null;
let dbrResults = [];
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
    const [cameras, setCameras] = useState([]);
    const [cameraSettings, setCameraSettings] = useState([]);
    const [bShowRangePicker, setBShowRangePicker] = useState(false);
    const [rangePicker, setRangePicker] = useState({
        bCamera: false,
        value: 0,
        min: 0,
        max: 0,
        defaultvalue: 0,
        step: 0,
        title: ""
    });
    const [saveFileName, setSaveFileName] = useState((new Date()).getTime().toString());
    // const value = fs.readFileSync('../../../', saveFileName + ".pdf") --->

    const [saveFileFormat, setSaveFileFormat] = useState("pdf");
    const [bUseFileUploader, setBUseFileUploader] = useState(false);
    const [bMulti, setBMulti] = useState(false);
    const [readingBarcode, setReadingBarcode] = useState(false);
    const [ocring] = useState(false)
    const [loadding, setLoading] = useState(false)

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
            // if (props.features & 0b10) {
            //     let cameraNames = DWObject.Addon.Webcam.GetSourceList();
            //     setCameras(cameraNames)
            //     if (cameraNames.length > 0)
            //         onCameraChange(cameraNames[0]);
            // }
            // if (props.features & 0b100000) {
            //     initBarcodeReader(props.features);
            // }
            // if (props.features & 0b1000000) {
            //     initOCR(props.features);
            // }
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
        console.log("call acquireImage");
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
                /**
                 * NOTE: No errors are being logged!!
                 */
            },
            () => props.handleOutPutMessage("Acquire success!", "important"),
            () => props.handleOutPutMessage("Acquire failure!", "error")
        );
    }


    // Tab 4: Save & Upload
    const handleFileNameChange = (event) => {
        setSaveFileName(event.target.value)
        console.log("saveFileName---", saveFileName);
    }

    //////////////////////////////////

    const saveOrUploadImage = (_type) => {
        props.setLoading(true)
        let fileName = saveFileName + "." + saveFileFormat;
        let imagesToUpload = [];
        let fileType = 0;
        console.log("fileName---", fileName);

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
                        props.setBack(true)
                        props.setUserData(data.data)
                        console.log('data from node server', data);
                        props.setBack(false)
                        navigate("/form", { state: data.data })
                        DWObject.RemoveImage(props.buffer.count)
                    })
                    .catch((err) => {
                        console.log("response err", err);
                        navigate("/form")
                        toastMsg("error", "Could not upload file please enter manualy");

                    });
            },
            function (errorCode, errorString) {
                console.log("---------", errorString);
            }
        );


        if (_type !== "local" && _type !== "server") return;

        for (let o in Dynamsoft.DWT.EnumDWT_ImageType) {
            console.log("Dynamsoft.DWT.EnumDWT_ImageType", Dynamsoft.DWT.EnumDWT_ImageType);
            if (o.toLowerCase().indexOf(saveFileFormat) !== -1 && Dynamsoft.DWT.EnumDWT_ImageType[o] < 7) {
                fileType = Dynamsoft.DWT.EnumDWT_ImageType[o];
                // console.log("fileType ----", fileType);
                // DWObject.ConvertToBase64(
                //     // [0, 1, 2],
                //     props.buffer.current,

                //     fileType,
                //     function (result, indices, type) {
                //         console.log("---------", result.getData(0, result.getLength(), indices));
                //     },
                //     function (errorCode, errorString) {
                //         console.log("---------", errorString);
                //     }
                // );
                // DWObject.ConvertToBase64(
                //     [0, 1, 2],
                //     Dynamsoft.DWT.EnumDWT_ImageType.IT_PDF,
                //     function (result, indices, type) {
                //         console.log(result.getData(props.buffer.current, result.getLength(), Dynamsoft.DWT.EnumDWT_ImageType.IT_PDF));
                //     },
                //     function (errorCode, errorString) {
                //         console.log(errorString);
                //     }
                // );
                break;
            }
        }



    }

    return (
        <div>
            {loadding && <div className="w-full h-full flex justify-center items-center">
                <img
                    className="animate-spin h-12"
                    src={loadinSpinner}
                    alt="loading ..."
                />
            </div>}
            <ToastContainer/>

            <div className="DWTController">

                {!loadding && <div className="divinput">
                    <ul className="PCollapse">
                        {props.features & 0b1 ? (
                            <li>
                                {/* <div className="divType" tabIndex="1" controlindex="1" onKeyUp={(event) => handleTabs(event)} onClick={(event) => handleTabs(event)}> */}
                                <div className="divType" tabIndex="1" controlindex="1">

                                    <div className={shownTabs & 1 ? "mark_arrow expanded" : "mark_arrow collapsed"} ></div>
                                    Custom Scan</div>
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
                                                {/* <li>
                                                {
                                                    deviceSetup.noUI ? "" : (
                                                        <label style={{ width: "32%", marginRight: "2%" }} ><input tabIndex="1" type="checkbox"
                                                            checked={deviceSetup.bShowUI}
                                                            onChange={(e) => handleScannerSetupChange(e, "bShowUI")}
                                                        />Show UI&nbsp;</label>
                                                    )
                                                }
                                                <label style={{ width: "32%", marginRight: "2%" }} ><input tabIndex="1" type="checkbox"
                                                    checked={deviceSetup.bADF}
                                                    onChange={(e) => handleScannerSetupChange(e, "bADF")}
                                                />Page Feeder&nbsp;</label>
                                                <label style={{ width: "32%" }}><input tabIndex="1" type="checkbox"
                                                    checked={deviceSetup.bDuplex}
                                                    onChange={(e) => handleScannerSetupChange(e, "bDuplex")}
                                                />Duplex</label>
                                            </li> */}
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
                                    </ul>
                                </div>
                            </li>
                        ) : ""}
                        {/* {props.features & 0b10 ? (
                        <li>
                            <div className="divType" tabIndex="2" controlindex="2" onClick={(event) => handleTabs(event)} onKeyUp={(event) => handleTabs(event)}>
                                <div className={shownTabs & 2 ? "mark_arrow expanded" : "mark_arrow collapsed"} ></div>
                                Use Webcams</div>
                            <div className="divTableStyle" style={shownTabs & 2 ? { display: "block" } : { display: "none" }}>
                                <ul>
                                    <li>
                                        <select tabIndex="2" value={deviceSetup.currentCamera} className="fullWidth" onChange={(e) => onCameraChange(e.target.value)}>
                                            {
                                                cameras.length > 0 ?
                                                    cameras.map((_name, _index) =>
                                                        <option value={_index} key={_index}>{_name}</option>
                                                    )
                                                    :
                                                    <option value="nocamera">Looking for devices..</option>
                                            }
                                        </select>
                                        {cameraSettings.length > 0 ? (
                                            <ValuePicker
                                                tabIndex="2"
                                                targetObject={deviceSetup.currentCamera}
                                                valuePacks={cameraSettings}
                                                current={"Resolution"}
                                                handleValuePicking={(valuePair) => playVideo(valuePair)}
                                            />
                                        ) : ""}
                                    </li>
                                    <li className="tc">
                                        <button tabIndex="2" className="majorButton enabled width_48p" onClick={() => toggleShowVideo()}>{deviceSetup.isVideoOn ? "Hide Video" : "Show Video"}</button>
                                        <button tabIndex="2" className={deviceSetup.isVideoOn ? "majorButton enabled width_48p marginL_2p" : "majorButton disabled width_48p marginL_2p"} onClick={() => captureImage()} disabled={deviceSetup.isVideoOn ? "" : "disabled"} > Capture</button>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    ) : ""} */}
                        {/* {props.features & 0b100 ? (
                        <li>
                            <div className="divType" tabIndex="3" controlindex="4" onClick={(event) => handleTabs(event)} onKeyUp={(event) => handleTabs(event)}>
                                <div className={shownTabs & 4 ? "mark_arrow expanded" : "mark_arrow collapsed"} ></div>
                                Load Images or PDFs</div>
                            <div className="divTableStyle" style={shownTabs & 4 ? { display: "block" } : { display: "none" }}>
                                <ul>
                                    <li className="tc">
                                        <button tabIndex="3" className="majorButton enabled" onClick={() => loadImagesOrPDFs()} style={{ width: "100%" }}>Load</button>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    ) : ""} */}
                        {(props.features & 0b1000) || (props.features & 0b10000) ? (
                            <li>
                                {/* <div className="divType" tabIndex="4" controlindex="8" onClick={(event) => handleTabs(event)} onKeyUp={(event) => handleTabs(event)}> */}
                                <div className="divType" tabIndex="4" controlindex="8" >
                                    <div className={shownTabs & 8 ? "mark_arrow expanded" : "mark_arrow collapsed"} ></div>
                                    Save Documents</div>
                                <div className="divTableStyle div_SaveImages" style={shownTabs & 8 ? { display: "block" } : { display: "none" }}>
                                    <ul>
                                        <li>
                                            <label className="fullWidth"><span style={{ width: "25%" }}>File Name:</span>
                                                <input tabIndex="4" style={{ width: "73%", marginLeft: "2%" }} type="text" size="20" value={saveFileName} onChange={(e) => handleFileNameChange(e)} /></label>
                                        </li>
                                        {/* <li>
                                        <label><input tabIndex="4" type="radio" value="bmp" name="ImageType" onClick={(e) => handleSaveConfigChange(e)} />BMP</label>
                                        <label><input tabIndex="4" type="radio" value="jpg" name="ImageType" defaultChecked onClick={(e) => handleSaveConfigChange(e)} />JPEG</label>
                                        <label><input tabIndex="4" type="radio" value="tif" name="ImageType" onClick={(e) => handleSaveConfigChange(e)} />TIFF</label>
                                        <label><input tabIndex="4" type="radio" value="png" name="ImageType" onClick={(e) => handleSaveConfigChange(e)} />PNG</label>
                                        <label><input tabIndex="4" type="radio" value="pdf" name="ImageType" onClick={(e) => handleSaveConfigChange(e)} />PDF</label>
                                    </li> */}
                                        {/* <li>
                                        <label><input tabIndex="4" type="checkbox"
                                            checked={(saveFileFormat === "pdf" || saveFileFormat === "tif") && (bMulti ? "checked" : "")}
                                            value="multiPage" disabled={(saveFileFormat === "pdf" || saveFileFormat === "tif") ? "" : "disabled"} onChange={(e) => handleSaveConfigChange(e)} />Upload Multiple Pages</label>
                                        {((props.features & 0b10000) && (props.features & 0b10000000))
                                            ? <label>
                                                <input tabIndex="4" title="Use Uploader" type="checkbox" onChange={(e) => toggleUseUploade(e)} />Use File Uploader</label>
                                            : ""}
                                    </li> */}
                                        <li className="tc">
                                            {(props.features & 0b1000) ? <button tabIndex="4" className={props.buffer.count === 0 ? "majorButton disabled width_48p" : "majorButton enabled width_48p"} disabled={props.buffer.count === 0 ? "disabled" : ""} onClick={() => saveOrUploadImage('local')} >Upload</button> : ""}
                                            {/* {(props.features & 0b10000) ? <button tabIndex="4" className={props.buffer.count === 0 ? "majorButton disabled width_48p marginL_2p" : "majorButton enabled width_4p marginL_2p"} disabled={props.buffer.count === 0 ? "disabled" : ""} onClick={() => saveOrUploadImage('server')} >Upload to Server</button> : ""} */}
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        ) : ""}
                        {/* {(props.features & 0b100000) || (props.features & 0b1000000) ? (
                        <li>
                            <div className="divType" tabIndex="5" controlindex="16" onClick={(event) => handleTabs(event)} onKeyUp={(event) => handleTabs(event)}>
                                <div className={shownTabs & 16 ? "mark_arrow expanded" : "mark_arrow collapsed"} ></div>
                                Recognize</div>
                            <div className="divTableStyle" style={shownTabs & 16 ? { display: "block" } : { display: "none" }}>
                                <ul>
                                    <li className="tc">
                                        {(props.features & 0b100000) ? <button tabIndex="5" className={props.buffer.count === 0 ? "majorButton disabled width_48p" : "majorButton enabled width_48p"} disabled={props.buffer.count === 0 || readingBarcode ? "disabled" : ""} onClick={() => readBarcode()} >{readingBarcode ? "Reading..." : "Read Barcode"}</button> : ""}
                                        {(props.features & 0b1000000) ? <button tabIndex="5" className={props.buffer.count === 0 ? "majorButton disabled width_48p marginL_2p" : "majorButton enabled width_48p marginL_2p"} disabled={props.buffer.count === 0 || ocring ? "disabled" : ""} onClick={() => ocr()}>{ocring ? "Ocring..." : "OCR (English)"}</button> : ""}
                                    </li>
                                    {props.barcodeRects.length > 0 &&
                                        (<li><button tabIndex="5" className="majorButton enabled fullWidth" onClick={() => props.handleBarcodeResults("clear")}>Clear Barcode Rects</button></li>)
                                    }
                                </ul>
                            </div>
                        </li>
                    ) : ""} */}
                    </ul>
                </div>}
                {/* {bShowRangePicker ? (
                <RangePicker tabIndex="2"
                    rangePicker={rangePicker}
                    handleRangeChange={(event) => handleRangeChange(event)}
                />
            ) : ""
            } */}
            </div >
        </div>

    );
}