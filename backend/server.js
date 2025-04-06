require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Define Quiz Schema
const QuizSchema = new mongoose.Schema({
  title: String,
  questions: Array,
});
const Quiz = mongoose.model("Quiz", QuizSchema);

// Configure Multer for file uploads
const upload = multer({ dest: "uploads/" });

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// **Generate Questions using AI**
async function generateQuestions(text) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
      Extract key concepts from this text and generate 5 multiple-choice questions. 
      Each question must have 4 answer choices with one correct answer marked. 
      Text: ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const data = await response.json();

    if (!data || !data.candidates || data.candidates.length === 0) {
      throw new Error("Invalid response from Gemini API");
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
}

// **File Upload & Quiz Generation Route**
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  // Read the uploaded file content
  const text = fs.readFileSync(req.file.path, "utf-8");
  fs.unlinkSync(req.file.path); // Delete the file after reading

  const questions = await generateQuestions(text);
  if (!questions) return res.status(500).json({ error: "Failed to generate quiz" });

  // Save the quiz to MongoDB
  const newQuiz = new Quiz({ title: req.file.originalname, questions });
  await newQuiz.save();

  res.json({ message: "Quiz generated successfully", quiz: newQuiz });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

