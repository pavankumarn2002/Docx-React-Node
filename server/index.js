const express = require("express");
const PDFDocument = require("pdfkit");
const { Document, Packer, Paragraph, TextRun, ImageRun, Header, Footer } = require("docx");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors()); // Enable CORS
app.use(express.json());

app.post("/generate-pdf", (req, res) => {
    const { name, position, salary, date } = req.body;

    // Create a document
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, "offer-letter.doc");
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    // Add logo to the document
    doc.image(path.join(__dirname, "public", "accentiqa.jpg"), {
        fit: [150, 150],
        // align: "center",
        // valign: "center",
    });

    // Add content to the document
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.fontSize(25).text("Offer Letter", { align: "center" });
    doc.moveDown();
    doc.fontSize(16).text(`Dear ${name},`);
    doc.moveDown();
    doc.text(`We are pleased to offer you the position of ${position} with a salary of ${salary} starting on ${date}.`);
    doc.moveDown();
    doc.text("Sincerely,");
    doc.text("Your Company Name");

    // Add footer
    doc.moveDown();
    doc.fontSize(12).text("This is a confidential document. Please do not share.", {
        align: "center",
        baseline: "bottom",
    });

    // Finalize the PDF and end the stream
    doc.end();

    writeStream.on("finish", () => {
        res.sendFile(filePath, (err) => {
            if (err) {
                res.status(500).send({ message: "Error downloading the file" });
            }
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Error deleting the file:", err);
                }
            });
        });
    });
});

app.post("/generate-docx", async (req, res) => {
    try {
        const { name, position, salary, date } = req.body;
        console.log("Received data:", { name, position, salary, date });

        const logoPath = path.join(__dirname, "public", "accentiqa.jpg");
        if (!fs.existsSync(logoPath)) {
            console.error("Logo file not found at path:", logoPath);
            throw new Error("Logo file not found");
        }

        const logoImage = fs.readFileSync(logoPath);

        const doc = new Document({
            sections: [
                {
                    properties: {},
                    // headers: {
                    //     default: new Paragraph({
                    //         children: [
                    //             new ImageRun({
                    //                 data: logoImage,
                    //                 transformation: {
                    //                     width: 150,
                    //                     height: 150,
                    //                 },
                    //             }),
                    //         ],
                    //     }),
                    // },
                    //   footers: {
                    //     default: new Footer({
                    //         children: [
                    //             new Paragraph({
                    //                 children: [
                    //                     new TextRun('This is a confidential document. Please do not share.'),
                    //                 ],
                    //                 alignment: 'center',
                    //             }),
                    //         ],
                    //     }),
                    // },
                    headers: {
                      default: new Header({
                          children: [new Paragraph("Header text")],
                      }),
                  },
                  footers: {
                      default: new Footer({
                          children: [new Paragraph("Footer text")],
                      }),
                  },

                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Offer Letter",
                                    bold: true,
                                    size: 50,
                                }),
                            ],
                            alignment: "center",
                        }),
                        new Paragraph({
                            children: [new TextRun(`Dear ${name},`)],
                        }),
                        new Paragraph({
                            children: [new TextRun(`We are pleased to offer you the position of ${position} with a salary of ${salary} starting on ${date}.`)],
                        }),
                        new Paragraph({
                            children: [new TextRun("Sincerely,")],
                        }),
                        new Paragraph({
                            children: [new TextRun("Your Company Name")],
                        }),
                        // Add more paragraphs as needed
                    ],
                },
            ],
        });

       
        console.log("Document created successfully");

        const buffer = await Packer.toBuffer(doc);

        res.set({
            "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "Content-Disposition": "attachment; filename=offer-letter.docx",
            "Content-Length": buffer.length,
        });

        res.send(buffer);
    } catch (error) {
        console.error("Error generating DOCX:", error);
        res.status(500).send({ message: "Error generating DOCX", error: error.message });
    }
});

app.post('/generate-offer-letter', async (req, res) => {
    const { name, position, date, salary, companyName } = req.body;

    // Read the image file
    const imagePath = path.join(__dirname, 'public', 'accentiqa.jpg');
    const imageBuffer = fs.readFileSync(imagePath);

    const doc = new Document({
        sections: [{
            properties: {},
            headers: {
                default: new Header({
                    children: [
                        new Paragraph({
                            children: [
                                new ImageRun({
                                    data: imageBuffer,
                                    transformation: {
                                        width: 100,
                                        height: 50,
                                    },
                                }),
                            ],
                        }),
                    ],
                }),
            },
            footers: {
                default: new Footer({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "© 2024 Tech Corp. All rights reserved.",
                                    size: 24,
                                }),
                            ],
                        }),
                    ],
                }),
            },
            children: [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Offer Letter",
                            bold: true,
                            size: 48,
                        }),
                        new TextRun("\n\n"),
                    ],
                }),
                new Paragraph(`Dear ${name},`),
                new Paragraph("\n"),
                new Paragraph(`We are pleased to offer you the position of ${position} at our company.`),
                new Paragraph(`Your start date will be ${date}. Your annual salary will be ${salary}.`),
                new Paragraph("\n"),
                new Paragraph("We look forward to working with you."),
                new Paragraph("\n\n"),
                new Paragraph("Best regards,"),
                new Paragraph(`${companyName}`),
            ],
        }],
    });

    const b64string = await Packer.toBase64String(doc);
    const filename = `offer_letter_${name}.docx`;

    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(Buffer.from(b64string, 'base64'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
