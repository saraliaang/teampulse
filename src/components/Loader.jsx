import React from "react";
import "./Loader.css";

export default function Loader() {
    return (
        <div className="tp-loader-wrapper">
            <div className="tp-loader">
                <div className="tp-orbe" style={{ "--index": 0 }} />
                <div className="tp-orbe" style={{ "--index": 1 }} />
                <div className="tp-orbe" style={{ "--index": 2 }} />
                <div className="tp-orbe" style={{ "--index": 3 }} />
                <div className="tp-orbe" style={{ "--index": 4 }} />
            </div>
        </div>
    );
}
