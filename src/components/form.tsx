import { cp } from "fs";
import { FormEvent, useState } from "react";
import internal from "stream";

interface MessageType {
  id: number;
  context: string;
  sender: string;
}

export default function Form() {
  const [chatLog, setChatLog] = useState<MessageType[]>([]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const newId = chatLog.length > 0 ? chatLog[chatLog.length - 1].id + 1 : 1;
    const newUserMessage = {
      id: newId,
      context: formData.get("input"),
      sender: "user",
    };
    const updateMessage = [...chatLog, newUserMessage];


    const res = await fetch(`/api`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        userId: "test_user",
        prompt: formData.get("input"),
      }),
    });



    // Handle response if necessary
    const msg_json = await res.json();

    const newGPTId = newId + 1;
    const newGPTMessage = { id: newGPTId, context: msg_json.data.output, sender: "gpt" };
    setChatLog([...updateMessage, newGPTMessage]);

  }

  return (
    <div>
      {chatLog.map((message) => (
        <div key={message.id}>
          {message.sender}: {message.context}
        </div>
      ))}

      <form onSubmit={onSubmit}>
        <input type="text" name="input" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
