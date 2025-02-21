import React from "react";
import ChatBotIcon from "./components/chatboticon";

const App = () => {
  return (
    <div className="container">
      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <ChatBotIcon></ChatBotIcon>
            <h2 className="logo-text">Chat Bot</h2>
            <button className="material-symbols-outlined">keyboard_arrow_down</button>
          </div>
          <div className="chat-body">
            <div className="message bot-chat">
              <ChatBotIcon></ChatBotIcon>
              <div className="message-text">
                Halo! <br/> Gun gun
              </div>

              <div className="message user-message">
                <div className="message-text">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Id odio ut sed iusto voluptate quo dolor nobis quisquam quibusdam modi.
                </div>
              </div>

              <div className="chat-footer">
                <form action="#" className="chat-form">
                  
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App