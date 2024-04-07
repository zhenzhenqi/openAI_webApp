import express from 'express';
import path from 'path';
import {
	fileURLToPath
} from 'url';

const app = express();
const port = 3000;

const __filename = fileURLToPath(
	import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI();

async function processWithOpenAI(userInput) {
	const completion = await openai.chat.completions.create({
		messages: [
			{
				role: "system",
				content: "You are a helpful assistant."
			},
			{
				role: "user",
				content: userInput
			},
        ],
		model: "gpt-3.5-turbo",
	});

	return completion.choices[0].message.content; // Return the generated text
}





// Enable parsing JSON in request bodies
app.use(express.json());

// Route for the root path
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Route to handle data from the form
app.post('/process-data', (req, res) => {
	const userData = req.body.data; // Access the data sent from the clien

	try {
		// Process the data: Do something with userData (e.g., save to database, calculate)
		//		let processedData = userData.toUpperCase(); // Example: Transform to uppercase 
		const processedData = await processWithOpenAI(userData);
		// Send the response
		res.json({
			result: processedData
		});
	} catch (error) {
		console.error("Error processing data:", error);
		res.status(500).send("Internal Server Error");
	}
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})