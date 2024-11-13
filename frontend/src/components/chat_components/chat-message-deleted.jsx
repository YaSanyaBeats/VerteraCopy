import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";

import { MESSAGE } from "../../apollo/queries";

import { franc } from "franc";

import "../../css/chat-message-sender.css";

import get_translation from "../../helpers/translation";

function ChatMessage({ id, message, sender, time, attachs }) {
  const [translatedText, setTranslatedText] = useState("");

  let isVisible;

  const isBuild = import.meta.env.DEV !== "build";

  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [language] = useState(localStorage.getItem("language"));

  const { data } = useQuery(MESSAGE, {
    variables: {
      token: user.token,
      id: id,
    },
  });

  const languageCode = {
    rus: ["RU", "/flags/ru.svg"],
    eng: ["EN", "/flags/en.svg"],
    spa: ["ES", "/flags/es.svg"],
    ces: ["CS", "/flags/cs.svg"],
    bul: ["BG", "/flags/bg.svg"],
    deu: ["DE", "/flags/de.svg"],
    hu: ["HU", "/flags/hu.svg"],
    kaz: ["KZ", "/flags/kz.svg"],
  };

  const languageCodeQuery = {
    RU: ["русский", "/flags/ru.svg"],
    EN: ["английский", "/flags/en.svg"],
    ES: ["испанский", "/flags/es.svg"],
    CS: ["чешский", "/flags/cs.svg"],
    BG: ["болгарский", "/flags/bg.svg"],
    DE: ["немецкий", "/flags/de.svg"],
    HU: ["венгерский", "/flags/hu.svg"],
    KZ: ["казахский", "/flags/kz.svg"],
  };

  if (attachs.length === 0) {
    isVisible = true;
  } else {
    isVisible = false;
  }

  const getFullName = (userData) => {
    let result = "";

    if (userData?.surname) {
      result += userData?.surname + " ";
    }

    if (userData?.name) {
      result += userData?.name + " ";
    }
    if (userData?.patronymic) {
      result += userData?.patronymic;
    }

    return result;
  };

  const handleTranslate = async (text, lang) => {
    // try {
    //   const translatedText = await Translater(text, lang);
    //   setTranslatedText(translatedText);
    //   // console.log(translatedText);
    // } catch (error) {
    //   console.error("Error during translation:", error.message);
    // }
  };

  useEffect(() => {
    const fetchData = async () => {
      // if (languageCode.hasOwnProperty(franc(message))) {
      //   if ((languageCode[franc(message)][0] || franc(message)) !== language) {
      //     handleTranslate(message, languageCodeQuery[language]);
      //     // console.log("franc ", franc(message));
      //     // console.log("orig", franc(message));
      //     // console.log("selected", languageCodeQuery[language]);
      //   }
      // } else {
      //   handleTranslate(message, languageCodeQuery[language]);
      //   // console.log("orig", franc(message));
      //   // console.log("selected", languageCodeQuery[language]);
      // }
      handleTranslate(message, languageCodeQuery[language]);
    };

    fetchData();
    setTranslatedText("");
  }, [data, message, language]);

  return (
    <>
      <div className="chat-message-sender__container">
        <div
          className="chat-message-sender__box"
          style={{ background: "rgb(0 0 0 / 9%)" }}
        >
          <h3 className="chat-message-sender__name">{getFullName(sender)}</h3>
          <div
            dangerouslySetInnerHTML={{ __html: message }}
            className="chat-message-sender__text"
            style={{ textDecoration: "line-through" }}
          ></div>
          {translatedText !== "" &&
            languageCode[franc(message)] !== language && (
              <>
                <div className="chat-message-translate">
                  <span>
                    {get_translation("INTERFACE_TRANSLATION_ON")}{" "}
                    <img
                      src={languageCodeQuery[language][1]}
                      className="language-menu__flag"
                      alt=""
                    />
                  </span>
                </div>
                <div className="chat-message-recipient__text">
                  <i dangerouslySetInnerHTML={{ __html: translatedText }}></i>
                </div>
              </>
            )}
          {!isVisible && (
            <>
              <span className="chat-message-sender__attachs-title">
                {get_translation("INTERFACE_ATTACHED_FILES")}:
              </span>
              <div className="chat-message-sender__attachs">
                {attachs &&
                  attachs.map((attach) => (
                    <div key={attach.id}>
                      <a
                        className="chat-message-sender__attach-link"
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        href={
                          `${import.meta.env.VITE_API_BASE_URL}/` + attach.path
                        }
                      >
                        <span className="chat-message-sender__attach">
                          {attach.name}
                        </span>
                      </a>
                    </div>
                  ))}
              </div>
            </>
          )}
          <div className="chat-message-deleted__delete-msg">
            <span>{get_translation("INTERFACE_MSG_DELETED")}</span>
            <span
              className="chat-message-sender__time"
              style={{ marginTop: "0" }}
            >
              {time}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
export default ChatMessage;
