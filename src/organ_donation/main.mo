import HashMap "mo:base/HashMap";
import _Array "mo:base/Array";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Buffer "mo:base/Buffer";

actor OrganDonation {
  // Define types
  public type DonorId = Nat;
  public type RecipientId = Nat;
  public type OrganType = Text;
  public type Name = Text;

  // Donor record
  public type Donor = {
    id: DonorId;
    name: Name;
    organ: OrganType;
  };

  // Recipient record
  public type Recipient = {
    id: RecipientId;
    name: Name;
    organ: OrganType;
  };

  // Custom hash and equality functions for Nat keys
  private func natHash(n : Nat) : Nat32 { Nat32.fromNat(n) };
  private func natEqual(a : Nat, b : Nat) : Bool { a == b };

  // Define storage
  private var donors = HashMap.HashMap<DonorId, Donor>(10, natEqual, natHash);
  private var recipients = HashMap.HashMap<RecipientId, Recipient>(10, natEqual, natHash);
  private var organToDonors = HashMap.HashMap<OrganType, [DonorId]>(10, Text.equal, Text.hash);
  private var organToRecipients = HashMap.HashMap<OrganType, [RecipientId]>(10, Text.equal, Text.hash);
  private var nextDonorId : DonorId = 0;
  private var nextRecipientId : RecipientId = 0;
 
  // Helper function to generate unique Donor IDs
  private func generateDonorId() : DonorId {
    nextDonorId += 1;
    nextDonorId;
  };

  // Helper function to generate unique Recipient IDs
  private func generateRecipientId() : RecipientId {
    nextRecipientId += 1;
    nextRecipientId;
  };

  // Register a donor
  public func registerDonor(name : Name, organ : OrganType) : async DonorId {
    let id = generateDonorId();
    let donor : Donor = { id = id; name = name; organ = organ };

    donors.put(id, donor);

    switch (organToDonors.get(organ)) {
      case (?donorList) {
        let buffer = Buffer.fromArray<DonorId>(donorList);
        buffer.add(id);
        organToDonors.put(organ, Buffer.toArray(buffer));
      };
      case null {
        organToDonors.put(organ, [id]);
      };
    };

    id;
  };

  // Register a recipient
  public func registerRecipient(name : Name, organ : OrganType) : async RecipientId {
    let id = generateRecipientId();
    let recipient : Recipient = { id = id; name = name; organ = organ };

    recipients.put(id, recipient);

    switch (organToRecipients.get(organ)) {
      case (?recipientList) {
        let buffer = Buffer.fromArray<RecipientId>(recipientList);
        buffer.add(id);
        organToRecipients.put(organ, Buffer.toArray(buffer));
      };
      case null {
        organToRecipients.put(organ, [id]);
      };
    };

    id;
  };

  // Get all donors
  public func getDonors() : async [Donor] {
    Iter.toArray(donors.vals());
  };

  // Get all recipients
  public func getRecipients() : async [Recipient] {
    Iter.toArray(recipients.vals());
  };

  // Match organs
  public func matchOrgan(organ : OrganType) : async [(DonorId, RecipientId)] {
    let matches = Buffer.Buffer<(DonorId, RecipientId)>(0);

    switch (organToDonors.get(organ), organToRecipients.get(organ)) {
      case (?donorIds, ?recipientIds) {
        for (donorId in donorIds.vals()) {
          for (recipientId in recipientIds.vals()) {
            matches.add((donorId, recipientId));
          };
        };
      };
      case (_, _) {};
    };

    Buffer.toArray(matches);
  };
};