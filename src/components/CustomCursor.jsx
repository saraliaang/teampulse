import { useEffect, useRef } from "react";
import "./CustomCursor.css";

export default function CustomCursor() {
    const cursorRef = useRef(null);

    useEffect(() => {
        const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
        if (isTouchDevice) {
            return;
        }

        const body = document.body;
        body.classList.add("custom-cursor-enabled");

        const handleMouseMove = (event) => {
            if (!cursorRef.current) return;
            cursorRef.current.style.opacity = "1";
            cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
        };

        const handleMouseLeave = () => {
            if (!cursorRef.current) return;
            cursorRef.current.style.opacity = "0";
        };

        window.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            body.classList.remove("custom-cursor-enabled");
            window.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return <div ref={cursorRef} className="custom-cursor-dot" aria-hidden="true" />;
}
