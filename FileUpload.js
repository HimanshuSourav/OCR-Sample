import React, { useState } from "react";
import Tesseract from "tesseract.js";
import "./FileUpload.css";

const FileUpload = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [categorizedText, setCategorizedText] = useState("");

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
    setText("");
    setStatus("");
    setProgress(0);
  };

  const handoverToTesseract = async () => {
    if (!image) {
      setStatus("Please select an image");
      return;
    }
    setStatus("Processing...");
    setProgress(0);
    try {
      const result = await Tesseract.recognize(image, "eng");
      if (!result.text) {
        setStatus("No text found in image");
        return;
      }
      setText(result.text);
      setStatus("OCR complete");
      setProgress(100);
      const categorized = categorizeText(result.text);
      setCategorizedText(categorized);
    } catch (error) {
      console.error(error);
      const errorMessage = error?.message || "Error processing image. Please try again later.";
      setStatus(errorMessage);
      return;
    }
    
  };
  

  const categorizeText = (text) => {
    // Add your categorization logic here
    // Here's an example that looks for the word "PASSPORT" and "NATIONALITY"
    let categorized = "";
    if (text && text.includes("PASSPORT")) {
      categorized += "This is a passport\n";
    }
    if (text && text.includes("NATIONALITY")) {
      categorized += "Nationality information found\n";
    }
    return categorized;
  };

  return (
    <div className="file-upload-container">
      <div className="file-upload">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handoverToTesseract}>Scan</button>
      </div>
      {status && <p className="status">{status}</p>}
      <progress value={progress} max="100" />
      {text && (
        <div>
          <h2>Text from Image</h2>
          <div className="text-container">{text}</div>
        </div>
      )}
      {categorizedText && (
        <div>
          <h2>Categorized Text</h2>
          <div className="text-container">{categorizedText}</div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
