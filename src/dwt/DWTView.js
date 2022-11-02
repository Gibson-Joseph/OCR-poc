import React, { useState, useEffect, useRef } from 'react';
import './DWTView.css';

/**
 * @props
 * @prop {WebTwain} dwt the object to perform the magic of Dynamic Web TWAIN
 * @prop {object} buffer the buffer status of data in memory (current & count)
 * @prop {object[]} zones the zones on the current image that are selected by the user
 * @prop {string} containerId the id of a DIV in which the view of Dynamic Web TWAIN will be built
 * @prop {object} runtimeInfo contains runtime information like the width & height of the current image
 * @prop {boolean} bNoNavigating whether navigation buttons will function (no if a time consuming operation like barcode reading is underway)
 * @prop {object[]} barcodeRects the rects that indicate where barcodes are found
 * @prop {function} handleBufferChange a function to call when the buffer may requires updating
 * @prop {function} handleOutPutMessage a function to call a message needs to be printed out
 */

let DWObject = null;
let width = "583px"
let height = "513px";
let navigatorRight = "60px";
let navigatorWidth = "585px";

export default function DWTView(props) {

    if (props.blocks !== undefined) {
        switch (props.blocks) {
            default: break;
            case 0: /** No navigate, no quick edit */
                width = "100%"; height = "100%"; break;
            case 1: /** No quick edit */
                width = "100%"; navigatorWidth = "100%"; navigatorRight = "0px"; break;
            case 2: /** No navigate */
                height = "100%"; break;
        }
    }
    const [viewReady, setViewReady] = useState(false);
    // const [previewMode, setPreviewMode] = useState("1")
    // const prevViewReady = usePrevious(viewReady)

    useEffect(() => {
        DWObject = props.dwt
        setViewReady({ viewReady: true })
    }, [props.dwt])
    useEffect(() => {
        // if (DWObject !== null && viewReady && !prevViewReady) {
        //     DWObject.Viewer.width = width;
        //     DWObject.Viewer.height = height;
        // }
        // if (props.barcodeRects.length !== 0) {
        //     !props.bNoNavigating && handlePreviewModeChange("1");
        // }
        if (document.getElementById(props.containerId).offsetWidth !== 0) {
            props.handleViewerSizeChange({
                width: document.getElementById(props.containerId).offsetWidth,
                height: document.getElementById(props.containerId).offsetHeight
            });
        }
    })
    useEffect(() => {
    }, [props.runtimeInfo.ImageHeight])
    useEffect(() => {
    }, [props.runtimeInfo.ImageWidth])


    // const handleNavigation = (action) => {
    //     switch (action) {
    //         default://viewModeChange, removeAll
    //             break;
    //         case "first":
    //             DWObject.CurrentImageIndexInBuffer = 0; break;
    //         case "last":
    //             DWObject.CurrentImageIndexInBuffer = props.buffer.count - 1; break;
    //         case "previous":
    //             DWObject.CurrentImageIndexInBuffer = (props.buffer.current > 0) && (props.buffer.current - 1); break;
    //         case "next":
    //             DWObject.CurrentImageIndexInBuffer = (props.buffer.current < props.buffer.count - 1) && (props.buffer.current + 1); break;
    //     }
    //     props.handleBufferChange();
    // }
    // const handlePreviewModeChange = (event) => {
    //     let _newMode = "";
    //     if (event && event.target) {
    //         _newMode = event.target.value
    //     }
    //     else {
    //         if (parseInt(event) > 0 && (parseInt(event) < 6)) _newMode = parseInt(event).toString();
    //     }
    //     if (_newMode !== previewMode) {
    //         if (props.bNoNavigating) {
    //             console.log(props.barcodeRects.length);
    //             // props.handleOutPutMessage("Navigation not allowed!", "error");
    //             return;
    //         }
    //         if (previewMode === "1" && props.barcodeRects.length > 0) {
    //             // props.handleOutPutMessage("Can't change view mode when barcode rects are on display!", "error");
    //             return;
    //         }
    //         setPreviewMode(_newMode)
    //         DWObject.Viewer.setViewMode(parseInt(_newMode), parseInt(_newMode));
    //         DWObject.MouseShape = (parseInt(_newMode) > 1);
    //         handleNavigation("viewModeChange");
    //     }
    // }
    return (
        <>
            <div style={{ display: viewReady ? "none" : "block" }} className="DWTcontainerTop"></div>
            <div style={(props.blocks & 2 && viewReady) ? { display: "block" } : { display: "none" }} className="divEdit">

            </div>
            <div style={{ position: "relative", float: "left", width: width, height: height }} id={props.containerId}>
                {props.barcodeRects.map((_rect, _index) => (
                    <div key={_index} className="barcodeInfoRect" style={{ left: _rect.x + "px", top: _rect.y + "px", width: _rect.w + "px", height: _rect.h + "px" }} >
                        <div className="spanContainer"><span>[{_index + 1}]</span>
                        </div>
                    </div>
                ))}
            </div >
        </>
    );
}

// function usePrevious(value) {
//     const ref = useRef();

//     useEffect(() => {
//         ref.current = value;
//     }, [value]);

//     return ref.current;
// }