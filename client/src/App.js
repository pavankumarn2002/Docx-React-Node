import React from "react";
import axios from "axios";

const App = () => {
    const handleDownload = async () => {
        const offerDetails = {
            name: "John Doe",
            position: "Software Engineer",
            salary: "$100,000",
            date: "2024-06-01",
        };

        try {
            const response = await axios.post("http://localhost:3001/generate-pdf", offerDetails, {
                responseType: "blob",
            });

            // Create a URL from the blob
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // Create a link element and simulate a click to download the PDF
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "offer-letter.doc");
            document.body.appendChild(link);
            link.click();

            // Clean up by revoking the object URL and removing the link
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };
    const handleDownload1 = async () => {
      const offerDetails = {
          name: 'John Doe',
          position: 'Software Engineer',
          salary: '$100,000',
          date: '2024-06-01'
      };

      try {
          const response = await axios.post('http://localhost:3001/generate-docx', offerDetails, {
              responseType: 'blob'
          });

          if (response.status !== 200) {
              throw new Error(`Error: Received status code ${response.status}`);
          }

          // Create a URL from the blob
          const url = window.URL.createObjectURL(new Blob([response.data]));

          // Create a link element and simulate a click to download the DOCX file
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'offer-letter.docx');
          document.body.appendChild(link);
          link.click();

          // Clean up by revoking the object URL and removing the link
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
      } catch (error) {
          console.error('Error generating DOCX:', error);
      }
  };

  const handleGenerateClick = async () => {
    const name = "John Doe";
    const position = "Software Engineer";
    const date = "2024-06-01";
    const salary = "$100,000";
    const companyName = "Tech Corp";

    const response = await axios.post('http://localhost:3001/generate-offer-letter', {
        name,
        position,
        date,
        salary,
        companyName
    }, { responseType: 'blob' });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `offer_letter_${name}.docx`);
    document.body.appendChild(link);
    link.click();
};

    return (
        <div>
            <h1>Download Offer Letter</h1>
            <button onClick={handleGenerateClick}>Download Offer Letter</button>
        </div>
    );
};

export default App;
