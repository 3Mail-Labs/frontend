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
}

export async function sendEmails({ provider, content, subject, senderName }: SendEmailParams) {
  const web3mail = new IExecWeb3mail(provider);

  const contacts: Contact[] = await web3mail.fetchMyContacts();

  console.log("Contacts", contacts);

  const promises = contacts.map((contact) =>
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
