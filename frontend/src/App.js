import { createClient } from "@connect2ic/core";
import { Connect2ICProvider } from "@connect2ic/react";
import * as organDonation from "ic:canisters/organ_donation";

const client = createClient({
  canisters: {
    organ_donation
  },
  providers: [
    /* Add your wallet providers here */
  ]
});

function App() {
  return (
    <Connect2ICProvider client={client}>
      {/* Your components */}
    </Connect2ICProvider>
  );
}