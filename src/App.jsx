import { useEffect, useRef, useState } from "react";
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { companyInfo, botIntroduction } from "./companyInfo";

const App = () => {
  const chatBodyRef = useRef();
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: "model", text: companyInfo, hideInChat: true },
    { role: "model", text: botIntroduction },
  ]);

  // Fungsi untuk memeriksa apakah pesan masih dalam topik budaya Indonesia
  const isTopicRelevant = (message) => {
    const keywords = [
      "budaya", "tradisi", "adat", "upacara", "ritual", "kepercayaan", "mitos", "legenda", "cerita rakyat", "folklore", "filosofi",
      "seni", "tari", "wayang", "gamelan", "angklung", "sasando", "reog", "kuda lumping", "jaipong", "ketoprak", "ludruk",
      "batik", "tenun", "songket", "kebaya", "blangkon", "sarung", "baju bodo", "ulos", "ikat kepala",
      "rumah adat", "rumah gadang", "joglo", "tongkonan", "masjid kuno", "candi", "prasasti",
      "makanan khas", "jajanan pasar", "rendang", "sate", "soto", "pempek", "gudeg", "tempe", "ketupat", "klepon", "cendol",
      "sejarah", "kerajaan", "majapahit", "sriwijaya", "mataram", "singasari", "kutai", "prabu", "sultan", "pahlawan nasional",
      "bahasa daerah", "aksara jawa", "aksara sunda", "pantun", "syair", "gurindam", "hikayat",
      "kejawen", "animisme", "dinamisme", "dukun", "mantra", "pesugihan", "sesajen", "nyi roro kidul", "tuyul", "genderuwo",
      "gotong royong", "pancasila", "bhinneka tunggal ika", "halo", "selamat pagi", "selamat siang", "selamat sore", "selamat malam",
      "terima kasih", "sama-sama", "maaf", "permisi", "salam", "hi", "hey", "hei", "hello"
    ];
  
    return keywords.some((keyword) => message.toLowerCase().includes(keyword));
  };
  

  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text, isError },
      ]);
    };

    const lastUserMessage = history.findLast((msg) => msg.role === "user")?.text;

    // Cek apakah pesan masih relevan dengan budaya Indonesia
    if (lastUserMessage && !isTopicRelevant(lastUserMessage)) {
      updateHistory("Maaf, saya hanya bisa membahas budaya Indonesia. Silakan tanyakan tentang tradisi, seni, kuliner, atau sejarah budaya Nusantara.");
      return;
    }

    const requestBody = {
      contents: history
        .filter(msg => !msg.hideInChat)
        .map(({ role, text }) => ({ role, parts: [{ text }] })),
    };

    try {
      const apiUrl = `${import.meta.env.VITE_GEMINI_API_URL}?key=${import.meta.env.VITE_GEMINI_API_KEY}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data?.error?.message || "Something went wrong!");

      const apiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "No response.";
      updateHistory(apiResponseText);
    } catch (error) {
      updateHistory(error.message, true);
    }
  };

  useEffect(() => {
    chatBodyRef.current?.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <button onClick={() => setShowChatbot((prev) => !prev)} id="chatbot-toggler">
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">close</span>
      </button>
      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button onClick={() => setShowChatbot((prev) => !prev)} className="material-symbols-rounded">
            keyboard_arrow_down
          </button>
        </div>
        <div ref={chatBodyRef} className="chat-body">
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>
        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
        </div>
      </div>
    </div>
  );
};

export default App;
