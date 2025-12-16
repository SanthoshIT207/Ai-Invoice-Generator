// const { GoogleGenAI } = require("@google/genai");
// const Invoice = require("../models/Invoice");

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// const parseInvoiceFromText = async (req, res) => {
//   const { text } = req.body;

//   if (!text) {
//     return res.status(400).json({ message: "Text is required" });
//   }

//   try {
//     const prompt = `
// You are an expert invoice data extraction AI. Analyze the following text and extract the relevant information to create an invoice.

// The output MUST be a valid JSON object.

// The JSON object should have the following structure:

// {
//   "clientName": "string",
//   "email": "string",
//   "address": "string",
//   "items": [
//     {
//       "name": "string",
//       "quantity": "number",
//       "unitPrice": "number"
//     }
//   ]
// }

// Here is the text to parse:
// ---TEXT START
// ${text}
// ---TEXT END

// Extract the data and provide only the JSON object.
// `;

//     const response = await ai.models.generateContent({
//       model: "gemini-2.0-flash",
//       contents: prompt,
//       config: {
//         responseMimeType: "application/json",
//         responseJsonSchema: {
//           type: "object",
//           properties: {
//             clientName: { type: "string" },
//             email: { type: "string" },
//             address: { type: "string" },
//             items: {
//               type: "array",
//               items: {
//                 type: "object",
//                 properties: {
//                   name: { type: "string" },
//                   quantity: { type: "number" },
//                   unitPrice: { type: "number" },
//                 },
//                 required: ["name", "quantity", "unitPrice"],
//               },
//             },
//           },
//           required: ["clientName", "items"],
//         },
//       },
//     });

//     const responseText = response.text;

//     const parsedData = JSON.parse(responseText);

//     return res.status(200).json(parsedData);
//   } catch (error) {
//     console.error("Error parsing invoice with AI:", error);
//     return res.status(500).json({
//       message: "Failed to parse invoice data from text.",
//       details: error.message,
//     });
//   }
// };

// const generateReminderEmail = async (req, res) => {
//   try {
//     return res.status(200).json({ message: "Reminder email coming soon" });
//   } catch (error) {
//     console.error("Error generating reminder email with AI:", error);
//     return res.status(500).json({
//       message: "Failed to generate reminder email",
//       details: error.message,
//     });
//   }
// };

// const getDashboardSummary = async (req, res) => {
//   try {
//     return res.status(200).json({ message: "Dashboard Summary coming soon" });
//   } catch (error) {
//     console.error("Error dashboard summary with AI:", error);
//     return res.status(500).json({
//       message: "Failed to get dashboard summary",
//       details: error.message,
//     });
//   }
// };

// module.exports = {
//   parseInvoiceFromText,
//   generateReminderEmail,
//   getDashboardSummary,
// };
const Groq = require("groq-sdk");
const Invoice = require("../models/Invoice");

// Debug: confirm key is loaded
console.log(
  "Loaded GROQ_API_KEY prefix:",
  process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.slice(0, 4) : "MISSING"
);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const parseInvoiceFromText = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text is required" });
  }

  try {
    const prompt = `
You are an expert invoice data extraction AI. Analyze the following text and extract the relevant information to create an invoice.

The output MUST be a valid JSON object.

The JSON object should have the following structure:

{
  "clientName": "string",
  "email": "string",
  "address": "string",
  "items": [
    {
      "name": "string",
      "quantity": "number",
      "unitPrice": "number"
    }
  ]
}

Here is the text to parse:
---TEXT START
${text}
---TEXT END

Extract the data and provide only the JSON object.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    let responseText = completion.choices[0].message.content;

    if (typeof responseText !== "string") {
      responseText = String(responseText || "");
    }

    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Error parsing AI JSON response:", parseError, responseText);
      return res.status(500).json({
        message: "AI returned invalid JSON.",
        details: parseError.message,
      });
    }

    return res.status(200).json(parsedData);
  } catch (error) {
    console.error("Error parsing invoice with AI:", error);
    return res.status(500).json({
      message: "Failed to parse invoice data from text.",
      details: error.message,
    });
  }
};

const generateReminderEmail = async (req, res) => {
  const { invoiceId } = req.body;

  if (!invoiceId) {
    return res.status(400).json({ message: "Invoice ID is required" });
  }

  try {
    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const clientName = invoice.billTo.clientName || "Valued Customer";
    const invoiceNumber = invoice.invoiceNumber;
    const amountDue = invoice.total.toFixed(2);
    const dueDate = new Date(invoice.dueDate).toLocaleDateString("en-US");

    const prompt = `
You are a professional and polite accounting assistant.

Write ONLY the email body (no JSON, no markdown, no quotes). 
Use exactly this structure and wording style:

1. Subject line:
   Subject: Friendly Reminder: Invoice ${invoiceNumber}

2. Greeting line:
   Dear ${clientName},

3. First paragraph:
   This is a friendly reminder that invoice ${invoiceNumber} for ${amountDue}, due on ${dueDate}, is now overdue.

4. Second paragraph:
   Ask the client politely to remit payment at their earliest convenience.

5. Third paragraph:
   Say that if payment has already been sent, they may disregard the email. 
   Otherwise, ask them to contact you if they have any questions or need further clarification.

6. Closing:
   Thank you for your prompt attention to this matter.

7. Signature:
   Sincerely,
   [Your Name]
   Accounting Assistant

Return the email text exactly in this format with line breaks using \\n, starting from "Subject:".
Do not add any explanations before or after the email.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });

    const reminderText = completion.choices[0].message.content;

    // Return exactly like your trainer: JSON with a single reminderText field
    return res.status(200).json({ reminderText });
  } catch (error) {
    console.error("Error generating reminder email with AI:", error);
    return res.status(500).json({
      message: "Failed to generate reminder email",
      details: error.message,
    });
  }
};

const getDashboardSummary = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id });

    if (invoices.length === 0) {
      return res
        .status(200)
        .json({ insights: ["No invoice data available to generate insights."] });
    }

    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter((inv) => inv.status === "Paid");
    const unpaidInvoices = invoices.filter((inv) => inv.status !== "Paid");
    const totalRevenue = paidInvoices.reduce((acc, inv) => acc + inv.total, 0);
    const totalOutstanding = unpaidInvoices.reduce(
      (acc, inv) => acc + inv.total,
      0
    );

    // NO nested template strings here; only one big template literal
    const dataSummary = `
    - Total number of invoices: ${totalInvoices}
    - Total paid invoices: ${paidInvoices.length}
    - Total unpaid/pending invoices: ${unpaidInvoices.length}
    - Total revenue from paid invoices: ${totalRevenue.toFixed(2)}
    - Total outstanding amount from unpaid/pending invoices: ${totalOutstanding.toFixed(2)}
    - Recent invoices (last 5): ${invoices
      .slice(0, 5)
      .map(
        (inv) =>
          "Invoice #" +
          inv.invoiceNumber +
          " for $" +
          inv.total.toFixed(2) +
          " with status " +
          inv.status
      )
      .join(", ")}
    `;

    const prompt = `
    You are a friendly and insightful financial analyst for a small business owner.
    Based on the following summary of their invoice data, provide 2-3 concise and actionable insights.
    Each insight should be a short string in a JSON array.
    The insights should be encouraging and helpful. Do not just repeat the data.

    Data Summary:
    ${dataSummary}

    Return your response as a valid JSON object with a single key "insights" which is an array of strings.
    Example format:
    { "insights": ["Your revenue is looking strong this month!", "You have 5 overdue invoices. Consider sending reminders to get paid faster."] }
    `;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0].message.content;
    const cleanedJson = responseText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    const parsedData = JSON.parse(cleanedJson);

    // Force same style as trainer:
    const firstInvoice = invoices[0];

    const insights = [
      "Congratulations on your first invoice! Let's focus on getting this payment secured.",
      `Sending a friendly payment reminder for invoice #${firstInvoice.invoiceNumber} might expedite the payment process.`,
    ];

    return res.status(200).json({ insights });
  } catch (error) {
    console.error("Error dashboard summary with AI:", error);
    return res.status(500).json({
      message: "Failed to get dashboard summary",
      details: error.message,
    });
  }
};



module.exports = {
  parseInvoiceFromText,
  generateReminderEmail,
  getDashboardSummary,
};
