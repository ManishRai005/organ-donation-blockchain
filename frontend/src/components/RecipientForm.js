import React, { useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory, canisterId } from "../../declarations/organ_donation";

const RecipientForm = () => {
  const [name, setName] = useState("");
  const [organNeeded, setOrganNeeded] = useState("");
  const [message, setMessage] = useState("");

  const registerRecipient = async () => {
    if (!name || !organNeeded) {
      setMessage("Please fill out all fields.");
      return;
    }

    try {
      const agent = new HttpAgent();
      const actor = Actor.createActor(idlFactory, { agent, canisterId });

      const recipientId = await actor.registerRecipient(name, organNeeded);
      setMessage(`Recipient registered successfully! ID: ${recipientId}`);

      // Clear the input fields after successful submission
      setName("");
      setOrganNeeded("");
    } catch (error) {
      setMessage(`Error registering recipient: ${error.message}`);
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Register as a Recipient</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Organ Needed"
        value={organNeeded}
        onChange={(e) => setOrganNeeded(e.target.value)}
      />
      <button onClick={registerRecipient}>Register</button>
      <p>{message}</p>
    </div>
  );
};

export default RecipientForm;
