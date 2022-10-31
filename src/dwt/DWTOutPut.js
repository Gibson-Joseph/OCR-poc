import React , {useEffect , useRef} from 'react';
import './DWTOutPut.css';

/**
 * @props
 * @prop {function} handleDoubleClick the behavior when the message box is double-clicked
 * @prop {string} note a note (like what happens when you double click)
 * @prop {string[]} messages the messages to print out
 * @prop {boolean} bNoScroll whether the message box should scroll to show the last message
 */
export default function DWTOutPut(props){

    const DWTOutPut_message = useRef();

    useEffect(() => {
        if (props.bNoScroll)
            DWTOutPut_message.current.scrollTop = 0;
        else
            DWTOutPut_message.current.scrollTop = DWTOutPut_message.current.scrollHeight
    })

    const handleKeyUp = (e) => {
        if (e.keyCode && e.keyCode === 46) {
            props.handleEvent("delete");
        }
    }
    
    return(
        <div className="DWTOutPut">Message: {props.note}<br />
                <div ref={DWTOutPut_message} tabIndex="8" className="message" onKeyUp={(e) => handleKeyUp(e)} onDoubleClick={() => props.handleEvent("doubleClick")}>
                    <ul>
                        {
                            props.messages.map((oneMsg) =>
                                <li key={oneMsg.time + "_" + Math.floor(Math.random(1) * 10000000)} className={oneMsg.type}>{oneMsg.text}</li>
                            )
                        }
                    </ul>
                </div>
            </div>
    )
}