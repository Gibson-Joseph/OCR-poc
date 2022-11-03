import React, { Suspense, useEffect, useState, useRef } from 'react';
import './DWTUserInterface.css';
import DWTView from './DWTView';
const DWTController = React.lazy(() => import('./DWTController'));

/**
 * @props
 * @prop {object} Dynamsoft a namespace
 * @prop {number} features the features that are enabled
 * @prop {string} containerId the id of a DIV in which the view of Dynamic Web TWAIN will be built
 * @prop {number} startTime the time when initializing started
 * @prop {WebTwain} dwt the object to perform the magic of Dynamic Web TWAIN
 * @prop {string} status a message to indicate the status of the application
 * @prop {object} buffer the buffer status of data in memory (current & count)
 * @prop {number[]} selected the indices of the selected images
 * @prop {object[]} zones the zones on the current image that are selected by the user
 * @prop {object} runtimeInfo contains runtime information like the width & height of the current image 
 * @prop {function} handleBufferChange a function to call when the buffer may requires updating
 */
export default function DWTUserInterface(props) {

    console.log("props", props);
    const statusChangeText = (_status, _statusChange) => {
        let text = "Initializing...";
        if (_statusChange) {
            text = [];
            (_statusChange & 1) && text.push("Core module ");
            (_statusChange & 2) && text.push("Webcam module ");
            (_statusChange & 32) && text.push("Barcode Reader module ");
            (_statusChange & 64) && text.push("OCR module ");
            (_statusChange & 128) && text.push("File Uploader module ");
            if (text.length > 1)
                text = text.join(" & ");
            text += "ready...";
        }
        if (_status === 255) {
            if (_statusChange)
                text = "_ALLDONE_" + text;
            else
                text = "Ready...";
        }
        return text;
    }

    const [bNoNavigating, setBNoNavigating] = useState(false);
    const [barcodeRects, setBarcodeRects] = useState([]);
    const prevProps = usePrevious(props);
    //Skip first render
    const overMount = useRef(false)

    useEffect(() => {
        if (!overMount.current) {
            overMount.current = true;
            return;
        }
        if (prevProps.status !== props.status) {
            let _statusChange = props.status - prevProps.status;
            let _text = statusChangeText(props.status, _statusChange);
        }
        if ((prevProps.buffer.current !== props.buffer.current) || props.buffer.updated) {
            props.buffer.updated && props.handleBufferChange();
        }
    })


    const handleNavigating = (bAllow) => {
        setBNoNavigating(!bAllow)
    }
    return (
        <div id="DWTcontainer" className="container">
            <div style={{ textAlign: "left", position: "relative", float: "left", width: "980px" }} className="fullWidth clearfix">
                <DWTView
                    blocks={0b11} /** 1: navigate 2: quick edit */
                    dwt={props.dwt}
                    buffer={props.buffer}
                    zones={props.zones}
                    containerId={props.containerId}
                    runtimeInfo={props.runtimeInfo}
                    bNoNavigating={bNoNavigating}
                    barcodeRects={barcodeRects}
                    handleViewerSizeChange={(viewSize) => props.handleViewerSizeChange(viewSize)}
                    handleBufferChange={() => props.handleBufferChange()}
                />
                <Suspense>
                    <DWTController
                        setLoading={props.setLoading}
                        setBack={props.setBack}
                        setUserData={props.setUserData}
                        Dynamsoft={props.Dynamsoft}
                        startTime={props.startTime}
                        features={props.features}
                        dwt={props.dwt}
                        buffer={props.buffer}
                        selected={props.selected}
                        zones={props.zones}
                        runtimeInfo={props.runtimeInfo}
                        barcodeRects={barcodeRects}
                        handleStatusChange={(value) => props.handleStatusChange(value)}
                        handleNavigating={(bAllow) => handleNavigating(bAllow)}
                    />
                </Suspense>
            </div>
        </div >
    )
}

function usePrevious(value) {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}