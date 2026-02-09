import { useEffect, useState } from "react";
import "./LandingAnimation.css";

export default function LandingAnimation({ onFinish }) {
    const [morph, setMorph] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const riseTimer = setTimeout(() => setMorph(true), 2200);
        const fadeTimer = setTimeout(() => setFadeOut(true), 3100);
        const endTimer = setTimeout(() => onFinish(), 3700);

        return () => {
            clearTimeout(riseTimer);
            clearTimeout(fadeTimer);
            clearTimeout(endTimer);
        };
    }, []);

    return (
        <div className={`intro-screen ${fadeOut ? "fade-out" : ""}`}>
            <div className="wave"></div>
            <div className={`sun ${morph ? "morph-dot" : ""}`}></div>
        </div>
    );
}
