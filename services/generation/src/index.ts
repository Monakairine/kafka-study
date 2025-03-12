import express, { Request, Response } from 'express';
import { sendMessageToKafka } from './kafka-producer';

const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('✅ Generation service is running. Use POST /generate to send a request.');
});


app.post('/generate', async (req: Request, res: Response) => {
  try {
    const { userId, prompt } = req.body;
    const message = { id: Date.now().toString(), userId, prompt };

    await sendMessageToKafka(message);
    res.status(200).json({ message: 'Request sent to Kafka', requestId: message.id });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Generation service running on port ${PORT}`));
