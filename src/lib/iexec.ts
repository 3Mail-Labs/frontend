import { IExecWeb3mail, Contact } from "@iexec/web3mail";

interface GetContactsParams {
  provider: any;
}

export async function getContacts({ provider }: GetContactsParams) {
  const web3mail = new IExecWeb3mail(provider);
  return await web3mail.fetchMyContacts();
}

interface SendEmailParams {
  provider: any;
  subject: string;
  content: string;
  senderName: string;
  contacts: string[];
}

export async function sendEmails({
  provider,
  content,
  subject,
  senderName,
  contacts,
}: SendEmailParams) {
  const lowercaseContacts = contacts.map((contact) => contact.toLowerCase());

  const web3mail = new IExecWeb3mail(provider);
  const currentContacts: Contact[] = await web3mail.fetchMyContacts();
  // console.log("Contacts", currentContacts);

  // Filter contacts
  const filteredContacts = currentContacts.filter((contact) =>
    lowercaseContacts.includes(contact.owner.toLowerCase()),
  );

  // console.log("Filtered contacts", filteredContacts);

  // Remove duplicates
  const uniqueContacts = filteredContacts.filter(
    (contact, index, self) =>
      index === self.findIndex((c) => c.owner.toLowerCase() === contact.owner.toLowerCase()),
  );

  // console.log("Unique contacts", uniqueContacts);

  const promises = uniqueContacts.map((contact) =>
    web3mail.sendEmail({
      protectedData: contact.address,
      emailSubject: subject,
      emailContent: content,
      contentType: "text/html",
      senderName,
    }),
  );

  const sentMails = await Promise.all(promises);

  return sentMails;
}
