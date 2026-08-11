import "@babel/register";
import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`🚀 NoteMe API is running on http://localhost:${PORT}`);
});
