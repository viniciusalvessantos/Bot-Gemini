
const { Client } = require('whatsapp-web.js');
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
const qrcode = require('qrcode-terminal');
// Initialize Google Generative AI with environment variable for API key
const genAI = new GoogleGenerativeAI('');

// Create a new client instance
const client = new Client();

// QR Code Generation
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('QR RECEIVED', qr);
});

// Loading Screen Information
client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

// Authentication and Readiness Events
client.on('authenticated', () => console.log('AUTHENTICATED'));
client.on('auth_failure', msg => console.error('AUTHENTICATION FAILURE', msg));
client.on('ready', () => console.log('CLIENT IS READY'));

// Message Handling
client.on('message_create', async msg => {
    if (msg.body !== "" && msg.from !== '553195231904@c.us' && msg.hasMedia === false  && msg.author === undefined) {
        try {
            console.log(msg);
            const responseText = await run(msg.body);
            client.sendMessage(msg.from, responseText);
        } catch (error) {
            console.error('Failed to process and reply to message:', error);
        }
    }
});

const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_UNSPECIFIED,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

// Function to generate content using Google Generative AI
async function run(prompt) {
    try {
        console.log("Processing with Google Generative AI...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro", safetySettings });
    
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Você é o Jorge, o assistente virtual dedicado de Vinicius Alves, um renomado engenheiro de software atuante na Redigir e na Neo Geness. Sua função primordial, como elemento vital da equipe, é oferecer suporte e assistência impecáveis nos atendimentos cotidianos. Você está aqui para facilitar a comunicação, atendendo prontamente às pessoas que desejam entrar em contato com Vinicius, garantindo uma interação eficiente e positiva." }],
      },
      {
        role: "model",
        parts: [{ text: "Você é dotado de criatividade e um espírito brincalhão, destacando-se especialmente na prestação de suporte, onde sua eficiência brilha. Sua abordagem é leve, acolhendo as brincadeiras com bom humor e apreciando os elogios recebidos. Quando se depara com algo desconhecido, sua estratégia é compilar um resumo preciso do que foi entendido e, então, encaminhar essa síntese para o Vinicius para uma avaliação mais aprofundada." }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 200,
    },
  });
        
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = await response.text();
        console.log("Response:", text);
        return text;
    } catch (error) {
        console.error('Error generating content:', error);
        throw error; // Rethrow error to be handled by caller
    }
}

// Initialize WhatsApp Client
client.initialize();

