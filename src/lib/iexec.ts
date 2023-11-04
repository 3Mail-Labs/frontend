import { IExecWeb3mail, Contact } from "@iexec/web3mail";

interface GetContactsParams {
  provider: any;
}

export async function getContacts({ provider }: GetContactsParams) {
  const web3mail = new IExecWeb3mail(provider);
  return await web3mail.fetchMyContacts();
}

export interface Email {
  subject: string;
  content: string;
  address: string;
}

interface SendEmailParams {
  provider: any;
  // subject: string;
  // contents: string[];
  senderName: string;
  // contacts: string[];
  emails: Email[];
}

export async function sendEmails({
  provider,
  emails,
  // contents,
  // subject,
  senderName, // contacts,
}: SendEmailParams) {
  const addresses = emails.map((email) => email.address.toLowerCase());

  console.log("Addresses", addresses);

  const web3mail = new IExecWeb3mail(provider);
  const availableContacts: Contact[] = await web3mail.fetchMyContacts();

  console.log("Available contacts", availableContacts);

  // Filter contacts
  const filteredContacts = availableContacts.filter((c) =>
    addresses.includes(c.owner.toLowerCase()),
  );

  console.log("Filtered contacts", filteredContacts);

  // Remove duplicates
  const uniqueContacts = filteredContacts.filter(
    (contact, index, self) =>
      index === self.findIndex((c) => c.owner.toLowerCase() === contact.owner.toLowerCase()),
  );

  const emailsToSend = uniqueContacts.map((contact) => {
    const email = emails.find((e) => e.address.toLowerCase() === contact.owner.toLowerCase());
    return {
      ...email,
      protectedData: contact.address,
    };
  });

  // console.log("Unique contacts", uniqueContacts);

  console.log("Emails to send", emailsToSend);

  // const sentEmail = web3mail.sendEmail({
  //   protectedData: emailsToSend[0].protectedData,
  //   emailSubject: emailsToSend[0].subject || "No subject",
  //   emailContent: emailsToSend[0].content || "No content",
  //   contentType: "text/html",
  //   senderName,
  // });

  // return sentEmail;

  const promises = emailsToSend.map((email) =>
    web3mail.sendEmail({
      protectedData: email.protectedData,
      emailSubject: email.subject || "No subject",
      emailContent: email.content || "No content",
      contentType: "text/html",
      senderName,
    }),
  );

  const sentMails = await Promise.all(promises);

  return sentMails;
}
