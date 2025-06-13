import React, { useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory, canisterId } from "../../declarations/organ_donation";

const MatchOrgan = () => {
  const [organType, setOrganType] = useState("");
  const [matchResult, setMatchResult] = useState("");

  const matchDonorRecipient = async () => {
    try {
      const agent = new HttpAgent();
      const actor = Actor.createActor(idlFactory, { agent, canisterId });

      if (!organType) {
        setMatchResult("Please enter an organ type.");
        return;
      }

      const matches = await actor.matchOrgan(organType);

      if (matches && matches.length > 0) {
        const matchesFormatted = matches.map(
          ([donorId, recipientId]) => `Donor ID: ${donorId}, Recipient ID: ${recipientId}`
        ).join("\n");

        setMatchResult(`Matches found for ${organType}:\n${matchesFormatted}`);
      } else {
        setMatchResult(`No matches found for ${organType}.`);
      }
    } catch (error) {
      setMatchResult(`Error finding match: ${error.message}`);
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Find Organ Match</h2>
      <input
        type="text"
        placeholder="Enter Organ Type"
        value={organType}
        onChange={(e) => setOrganType(e.target.value)}
      />
      <button onClick={matchDonorRecipient}>Find Match</button>
      <p style={{ whiteSpace: "pre-line" }}>{matchResult}</p>
    </div>
  );
};

export default MatchOrgan;
