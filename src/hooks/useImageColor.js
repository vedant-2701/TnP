import { useState, useEffect, useRef } from "react";
import ColorThief from "colorthief";

/**
 * Custom hook to extract the dominant color from an image
 * @param imageSrc - URL of the image to analyze
 * @param opacity - Optional opacity value (0-1) for the returned color
 * @returns An object with the dominant color as a hex string with opacity and the image ref
 */
export function useImageColor(imageSrc, opacity = 0.8, setGeneralColor) {
    const [color, setColor] = useState(""); // Default color with transparency
    const imgRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Helper function to convert RGB to Hex with opacity
    const rgbToHex = (r, g, b, alpha = opacity) => {
        const hex =
            "#" +
            [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
        // Convert opacity to hex and append it (0-1 to 00-FF)
        const alphaHex = Math.round(alpha * 255)
            .toString(16)
            .padStart(2, "0");
        return hex;
    };

    // Function to calculate the dominant color using simple averaging
    // This is a fallback if ColorThief isn't available or fails
    const calculateAverageColor = (img) => {
        try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return "#e6f3ffcc";

            // Resize to small dimensions for faster processing
            canvas.width = 50;
            canvas.height = 50;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );
            const data = imageData.data;

            let r = 0,
                g = 0,
                b = 0,
                count = 0;

            // Sum all pixel values
            for (let i = 0; i < data.length; i += 4) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
                count++;
            }

            // Calculate average
            r = Math.floor(r / count);
            g = Math.floor(g / count);
            b = Math.floor(b / count);

            return rgbToHex(r, g, b);
        } catch (error) {
            console.error("Error calculating average color:", error);
            return "#e6f3ffcc"; // Fallback color
        }
    };

    useEffect(() => {
        // If no image source is provided, use the default color
        if (!imageSrc) {
            setColor("#e6f3ffcc");
            return;
        }

        console.log(imageSrc);

        const img = new Image();
        img.crossOrigin = "anonymous";
        imgRef.current = img;
        console.dir(img);

        img.onload = () => {
            setIsLoaded(true);
            try {
                // Try to use ColorThief if available in the global scope
                if (typeof ColorThief !== "undefined") {
                    const colorThief = new ColorThief();
                    const dominantColor = colorThief.getColor(img);
                    console.log(dominantColor);
                    const hexColor = rgbToHex(
                        dominantColor[0],
                        dominantColor[1],
                        dominantColor[2]
                    );
                    console.log(hexColor);
                    setGeneralColor && setGeneralColor(hexColor);
                    setColor(hexColor);
                } else {
                    // Fallback to average color calculation
                    const avgColor = calculateAverageColor(img);
                    setColor(avgColor);
                }
            } catch (error) {
                console.error("Error extracting color:", error);
                // Fallback to average color calculation
                const avgColor = calculateAverageColor(img);
                setColor(avgColor);
            }
        };

        img.onerror = () => {
            console.error("Error loading image:", imageSrc);
            setColor("#e6f3ffcc"); // Fallback color on error
        };

        img.src = imageSrc;

        // Cleanup function
        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [imageSrc, opacity]);

    return { color, imgRef, isLoaded };
}
