// ReactJS component that can be placed into any React app to add a custom chat popup

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  OutlinedInput,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { createChatConversation } from "utils/chat"; // make sure to create this function

const useStyles = makeStyles(() => {
  return {
    chatForm: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: 80,
      maxWidth: "95%",
      margin: "0 auto",
    },
    chatInput: {
      flex: 1,
      marginRight: 10,
      fontSize: 14,
      width: "60%",
    },
    chatButton: {
      backgroundColor: "#004747",
      color: "#fff",
      border: "none",
      borderRadius: 20,
      padding: "10px 20px",
      cursor: "pointer",
      outline: "none",
      fontSize: 14,
      fontWeight: "bold",
      textTransform: "uppercase",
      "&:hover": {
        background: "#fff",
        color: "#004747",
        border: "1px solid #004747",
      },
    },
    chatMessage: {
      margin: "10px",
      padding: "8px 12px",
      borderRadius: 6,
      fontSize: 14,
      maxWidth: "80%",
    },
    userMessage: {
      backgroundColor: "#004747",
      color: "#fff",
      float: "right",
      clear: "both",
    },
    assistantMessage: {
      backgroundColor: "#F0F0F0",
      color: "#333333",
      float: "left",
      clear: "both",
    },
    typingIndicator: {
      display: "inline-block",
      width: 10,
      height: 10,
      borderRadius: "50%",
      backgroundColor: "#D8D8D8",
      marginRight: 5,
      animation: "$typing 1s infinite",
    },
    "@keyframes typing": {
      "0%": {
        opacity: 0.3,
      },
      "50%": {
        opacity: 1,
      },
      "100%": {
        opacity: 0.3,
      },
    },
  };
});

function ChatPopup() {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentChat, setCurrentChat] = useState();
  const chatHistoryRef = useRef(null);

  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSend = async () => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current?.scrollTo({
        top:
          chatHistoryRef.current.scrollHeight -
          chatHistoryRef.current.clientHeight,
        behavior: "smooth",
      });
    }

    setIsTyping(true);

    let chat;

    if (currentChat) {
      chat = currentChat.attributes.chat;
      chat.push({ role: "user", content: message });
    } else {
      chat = [{ role: "user", content: message }];
    }

    // Create a function that calls your API here
    createChatConversation({
      chat,
    }).then((res) => {
      setIsTyping(false);
      setCurrentChat(res.data);
    });

    setMessage("");
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const getWidth = () => {
    if (isOpen) {
      if (isSm) {
        return "90vw";
      }

      return "500px";
    }

    return "70px";
  };

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current?.scrollTo({
        top:
          chatHistoryRef.current.scrollHeight -
          chatHistoryRef.current.clientHeight,
        behavior: "smooth",
      });
    }
  }, [currentChat]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: isOpen ? "80px" : "10px",
        right: "20px",
        width: getWidth(),
        height: isOpen ? "500px" : "70px",
        backgroundColor: "#ffffff",
        color: "#004747",
        border: "1px solid #004747",
        borderRadius: "10px",
        boxShadow: "0 0 10px 1px rgba(0, 0, 0, 0.2)",
        transition: "all 0.3s ease-in-out",
        zIndex: 9999,
      }}
    >
      {isOpen ? (
        <>
          <div
            style={{
              height: "calc(88% - 20px)",
              padding: "10px",
              overflowY: "scroll",
            }}
            ref={chatHistoryRef}
          >
            <Box
              style={{
                position: "absolute",
                top: 0,
                left: 4,
                right: 4,
                borderRadius: "4px",
                background: "#fff",
                display: "flex",
                padding: "10px",
              }}
            >
              <Button style={{ color: "#004747" }} onClick={handleClose}>
                X
              </Button>

              <Typography variant="h6">Your AI Assistant</Typography>
            </Box>

            <Divider />

            <Box>
              <Box style={{ marginTop: "60px" }}>
                <Typography
                  className={clsx(
                    classes.chatMessage,
                    classes.assistantMessage
                  )}
                >
                  Hi there! I&apos;m an AI chatbot here to help with your
                  questions. While I can&apos;t promise 100% accuracy, I&apos;ll
                  do my best to assist you.
                  <br />
                  <br />
                  How can I help you today?
                </Typography>
              </Box>

              {currentChat?.attributes?.chat &&
                currentChat.attributes.chat.map((i) => {
                  return (
                    <Box
                      className={clsx(
                        classes.chatMessage,
                        i.role === "user"
                          ? classes.userMessage
                          : classes.assistantMessage
                      )}
                    >
                      <Typography>{i.content}</Typography>
                    </Box>
                  );
                })}
            </Box>

            {isTyping && (
              <Box
                className={`${classes.chatMessage} ${classes.assistantMessage}`}
              >
                <span className={classes.typingIndicator} />
                <span className={classes.typingIndicator} />
                <span className={classes.typingIndicator} />
              </Box>
            )}
          </div>

          <div className={classes.chatForm}>
            <OutlinedInput
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={classes.chatInput}
              placeholder="Type a message..."
            />
            <Button
              disabled={isTyping}
              className={classes.chatButton}
              onClick={handleSend}
            >
              Send
            </Button>
          </div>
        </>
      ) : (
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            cursor: "pointer",
          }}
          onClick={() => setIsOpen(true)}
        >
          <p>Chat</p>
        </Box>
      )}
    </div>
  );
}

export default ChatPopup;
