import nodemailer from "nodemailer";

// NOTE: Bun is not loading the .env time and there was no time to debug, so we need to load it here for now 
const smtp_env = {
    SMTP_HOST:"smtp.ethereal.email",
    SMTP_PORT:"587",
    SMTP_USER:"euna.little45@ethereal.email",
    SMTP_PASS:"nBJz28bCU9NSnnXekg",
    SMTP_SECURE: "NOTLS",
}

interface mailAccount {
    user: string;
    pass: string;
    smtp: {
        host: string;
        port: number;
        secure: boolean;
    };
}

const account: mailAccount = {
    user: smtp_env.SMTP_USER || '',
    pass: smtp_env.SMTP_PASS || '',
    smtp: {
        host: smtp_env.SMTP_HOST || '',
        port: parseInt(smtp_env.SMTP_PORT || '587', 10),
        secure: smtp_env.SMTP_SECURE === 'STARTTLS',
    },
};

const transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    debug: true,
    auth: {
      user: account.user,
      pass: account.pass,
    },
    tls: {
        rejectUnauthorized: false // This disables SSL, remove for production
    },
    pool: true,
});

export async function processLine(line: string) {
    const splitted = line.split(",");
    const name = splitted[0];
    const governmentId = splitted[1];
    const email = splitted[2];
    const debtAmount = splitted[3];
    const debtDueDate = splitted[4];
    const debtId = splitted[5];

    if(!name ||!governmentId ||!email ||!debtAmount ||!debtDueDate ||!debtId) {
        console.log("Invalid line:", line);
        return false;
    }

    console.log(name, governmentId, email, debtAmount, debtDueDate, debtId);

    const html = boletoHtml(name, governmentId, email, debtAmount, debtDueDate, debtId);

    try {
        const info = await transporter.sendMail({
          from: `"Envio Boleto" <${account.user}>`,
          to: email,
          subject: "Seu Boleto",
          text: "Seu boleto chegou:",
          html: html,
        });
    
        console.log(`Message sent to ${email}, ID: ${info.messageId}`);
    
        return true;

      } catch (error) {
        console.error(`Error sending email to ${email}:`, error);
        return false;
      }
    // NOTE: You can go to https://ethereal.email/messages to see your email delivery status and preview
}

export const processContent = (lines: string[]) => {
    const total_lines = lines.length;
    console.log("Total lines:", total_lines);
    for (let i = 1; i < total_lines; i++) {
      console.log("Line:", i);
      processLine(lines[i]);
    }
}

function boletoHtml(
        name: string,
        governmentId: string,
        email: string,
        debtAmount: string,
        debtDueDate: string,
        debtId: string
    ): string {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Boleto - ${debtId}</title>
            <style>
            body { font-family: Arial, sans-serif; }
            .boleto-container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #000; }
            .boleto-header { text-align: center; margin-bottom: 20px; }
            .boleto-section { margin-bottom: 10px; }
            .boleto-section label { font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="boleto-container">
            <div class="boleto-header">
                <h1>Boleto Bancário</h1>
            </div>
            <div class="boleto-section">
                <label>Nome:</label>
                <span>${name}</span>
            </div>
            <div class="boleto-section">
                <label>CPF/CNPJ:</label>
                <span>${governmentId}</span>
            </div>
            <div class="boleto-section">
                <label>E-mail:</label>
                <span>${email}</span>
            </div>
            <div class="boleto-section">
                <label>Valor:</label>
                <span>R$ ${debtAmount}</span>
            </div>
            <div class="boleto-section">
                <label>Data de Vencimento:</label>
                <span>${debtDueDate}</span>
            </div>
            <div class="boleto-section">
                <label>ID do Título:</label>
                <span>${debtId}</span>
            </div>
            <div class="boleto-section">
                <label>Código de Barras:</label>
                <div></div>
            </div>
            </div>
        </body>
        </html>
    `;
}