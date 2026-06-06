import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Simple helper to sanitize HTML tags and escape characters
function sanitize(val: string): string {
  if (typeof val !== "string") return "";
  return val
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .trim();
}

// Simple helper to escape HTML characters for email templates
function escapeHtml(val: string): string {
  if (typeof val !== "string") return "";
  return val
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { success: false, message: "Invalid request body." },
        { status: 400 }
      );
    }

    const { name, email, message, botField } = body;

    // ── 1. SPAM PREVENTION (HONEYPOT) ──
    // If the hidden bot field is filled, silently ignore the email but return 200 (Success)
    // to confuse the spam bot.
    if (botField && botField.trim() !== "") {
      console.warn("Honeypot triggered by spam bot. Silently ignoring.");
      return NextResponse.json(
        { success: true, message: "Message sent successfully." },
        { status: 200 }
      );
    }

    // ── 2. INPUT SANITIZATION ──
    const sanitizedName = sanitize(name);
    const sanitizedEmail = sanitize(email);
    const sanitizedMessage = sanitize(message);

    // ── 3. BACKEND VALIDATION ──
    if (!sanitizedName) {
      return NextResponse.json(
        { success: false, message: "Name is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!sanitizedEmail || !emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!sanitizedMessage) {
      return NextResponse.json(
        { success: false, message: "Message is required." },
        { status: 400 }
      );
    }

    // ── 4. CONFIGURE NODEMAILER TRANSPORT ──
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      console.error("Missing environment variables: EMAIL_USER or EMAIL_PASS is not defined.");
      return NextResponse.json(
        { success: false, message: "Email service is not configured on the server." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", {
      timeZone: "Asia/Kolkata",
      month: "long",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const timestamp = `${formattedDate}, ${formattedTime}`; // e.g., "June 5, 9:48 PM"

    const avatarLetter = sanitizedName.trim().charAt(0).toUpperCase() || "?";

    // Escape values for safe inclusion in HTML templates
    const escapedName = escapeHtml(sanitizedName);
    const escapedEmail = escapeHtml(sanitizedEmail);
    const escapedMessage = escapeHtml(sanitizedMessage).replace(/\n/g, "<br />");

    // ── 5. EMAIL TO ADMIN (ME) ──
    const adminMailOptions = {
      from: `"Portfolio Contact" <${emailUser}>`,
      to: emailUser, // Deliver to my inbox
      replyTo: sanitizedEmail, // Clicking reply goes to visitor
      subject: "New Portfolio Contact Request",
      headers: {
        "X-Entity-Ref-ID": Date.now().toString(),
      },
      html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title>New Project Inquiry</title>
          <style>
            body {
              background-color: #050505;
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              -webkit-text-size-adjust: none;
              -ms-text-size-adjust: none;
            }
            a {
              text-decoration: none;
              color: #f04e00;
            }
            @media only screen and (max-width: 600px) {
              .container-table {
                width: 100% !important;
                max-width: 100% !important;
                border-radius: 12px !important;
              }
              .body-padding {
                padding: 16px 8px !important;
              }
              .card-padding {
                padding: 32px 20px !important;
              }
              .stack-mobile {
                display: block !important;
                width: 100% !important;
                text-align: left !important;
                padding-bottom: 12px !important;
              }
              .mobile-align-left {
                text-align: left !important;
              }
              .message-padding {
                padding: 24px 20px !important;
              }
            }
          </style>
        </head>
        <body style="background-color: #050505; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <span style="display:none;visibility:hidden;mso-hide:all;font-size:1px;color:#050505;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
            Message ID: ${Date.now()}
          </span>
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050505; width: 100%;">
            <tr>
              <td align="center" style="padding: 40px 16px;" class="body-padding">
                <!-- Main Container Card -->
                <table class="container-table" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 680px; width: 100%; background-color: #0b0b0c; border: 1px solid #1c1c1e; border-top: 3px solid #f04e00; border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.8); text-align: left;">
                  <tr>
                    <td class="card-padding" style="padding: 48px 40px;">
                      
                      <!-- Header Section -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td>
                            <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 800; letter-spacing: 0.25em; color: #ffffff; text-transform: uppercase;">
                              Prince<span style="color: #f04e00;">.</span>
                            </span>
                            <h2 style="font-size: 26px; font-weight: 800; color: #ffffff; margin: 20px 0 8px 0; letter-spacing: -0.02em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                              New Project Inquiry
                            </h2>
                            <p style="font-size: 15px; color: #8e8e93; margin: 0; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                              Someone reached out through your portfolio.
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Divider -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
                        <tr>
                          <td style="border-top: 1px solid #1c1c1e; height: 1px;"></td>
                        </tr>
                      </table>
                      
                      <!-- Sender Details Section -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td valign="middle" class="stack-mobile" style="padding: 0 0 10px 0;">
                            <table border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td width="48" valign="middle" style="width: 48px; padding-right: 12px;">
                                  <div style="width: 38px; height: 38px; background-color: #1a1a1e; border: 1px solid #2c2c30; border-radius: 50%; text-align: center; line-height: 38px; font-size: 15px; font-weight: 700; color: #f04e00; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                    ${avatarLetter}
                                  </div>
                                </td>
                                <td valign="middle">
                                  <div style="font-size: 15px; font-weight: 700; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                    ${escapedName}
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td valign="middle" class="stack-mobile" style="padding: 0 16px 10px 0;">
                            <a href="mailto:${escapedEmail}" style="color: #f04e00; text-decoration: none; font-size: 14px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; word-break: break-all;">
                              ${escapedEmail}
                            </a>
                          </td>
                          <td valign="middle" align="right" class="stack-mobile mobile-align-left" style="padding: 0 0 10px 0; font-size: 13px; color: #8e8e93; font-family: monospace; white-space: nowrap;">
                            ${timestamp}
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Spacing -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="height: 24px;">
                        <tr>
                          <td></td>
                        </tr>
                      </table>
                      
                      <!-- Message Area (Chat Bubble Style) -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0e0e11; border: 1px solid #1c1c1e; border-left: 3px solid #f04e00; border-radius: 12px;">
                        <tr>
                          <td class="message-padding" style="padding: 32px 36px;">
                            <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 16px;">
                              <tr>
                                <td style="padding-right: 8px; line-height: 0;">
                                  <!-- Lucide Message Icon -->
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f04e00" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle;">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                  </svg>
                                </td>
                                <td style="font-size: 11px; font-weight: 700; color: #8e8e93; letter-spacing: 0.08em; text-transform: uppercase; font-family: monospace;">
                                  Message
                                </td>
                              </tr>
                            </table>
                            <div style="font-size: 16px; line-height: 1.7; color: #e4e4e7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 400; word-break: break-word;">
                              ${escapedMessage}
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Divider -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0 24px 0;">
                        <tr>
                          <td style="border-top: 1px solid #1c1c1e; height: 1px;"></td>
                        </tr>
                      </table>
                      
                      <!-- Footer Section -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td align="center" style="font-size: 11px; font-weight: 700; color: #52525b; text-transform: uppercase; letter-spacing: 0.2em; font-family: monospace;">
                            Sent via Prince Portfolio &bull; ${timestamp}
                          </td>
                        </tr>
                      </table>
                      
                    </td>
                  </tr>
                </table>
                
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    // ── 6. AUTO-REPLY EMAIL TO VISITOR ──
    const userMailOptions = {
      from: `"Prince Verma" <${emailUser}>`,
      to: sanitizedEmail,
      subject: "Thank You For Reaching Out",
      headers: {
        "X-Entity-Ref-ID": Date.now().toString(),
      },
      html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title>Thank You For Reaching Out</title>
          <style>
            body {
              background-color: #050505;
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              -webkit-text-size-adjust: none;
              -ms-text-size-adjust: none;
            }
            a {
              text-decoration: none;
              color: #f04e00;
            }
            @media only screen and (max-width: 600px) {
              .container-table {
                width: 100% !important;
                max-width: 100% !important;
                border-radius: 12px !important;
              }
              .body-padding {
                padding: 16px 8px !important;
              }
              .card-padding {
                padding: 32px 20px !important;
              }
            }
          </style>
        </head>
        <body style="background-color: #050505; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <span style="display:none;visibility:hidden;mso-hide:all;font-size:1px;color:#050505;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
            Message ID: ${Date.now()}
          </span>
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050505; width: 100%;">
            <tr>
              <td align="center" style="padding: 40px 16px;" class="body-padding">
                <!-- Main Container Card -->
                <table class="container-table" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 680px; width: 100%; background-color: #0b0b0c; border: 1px solid #1c1c1e; border-top: 3px solid #f04e00; border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.8); text-align: left;">
                  <tr>
                    <td class="card-padding" style="padding: 48px 40px;">
                      
                      <!-- Header Section -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td>
                            <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 800; letter-spacing: 0.25em; color: #ffffff; text-transform: uppercase;">
                              Prince<span style="color: #f04e00;">.</span>
                            </span>
                            <h2 style="font-size: 26px; font-weight: 800; color: #ffffff; margin: 20px 0 8px 0; letter-spacing: -0.02em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                              Thank You For Reaching Out
                            </h2>
                            <p style="font-size: 15px; color: #8e8e93; margin: 0; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                              We have received your message.
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Divider -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
                        <tr>
                          <td style="border-top: 1px solid #1c1c1e; height: 1px;"></td>
                        </tr>
                      </table>
                      
                      <!-- Message Body -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="font-size: 16px; line-height: 1.6; color: #ffffff; font-weight: 700; padding-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                            Hi ${escapedName},
                          </td>
                        </tr>
                        <tr>
                          <td style="font-size: 15px; line-height: 1.6; color: #a1a1aa; padding-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                            Thank you for reaching out through my portfolio.
                          </td>
                        </tr>
                        <tr>
                          <td style="font-size: 15px; line-height: 1.6; color: #a1a1aa; padding-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                            I have successfully received your message and appreciate you taking the time to connect.
                          </td>
                        </tr>
                        <tr>
                          <td style="font-size: 15px; line-height: 1.6; color: #a1a1aa; padding-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                            I will review your inquiry and get back to you as soon as possible.
                          </td>
                        </tr>
                        <tr>
                          <td style="font-size: 15px; line-height: 1.6; color: #a1a1aa; padding-bottom: 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                            In the meantime, I hope you're having a wonderful day.
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Signature Block Card -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0e0e11; border: 1px solid #1c1c1e; border-radius: 12px; padding: 24px;">
                        <tr>
                          <td>
                            <div style="font-size: 13px; font-weight: 700; color: #8e8e93; text-transform: uppercase; letter-spacing: 0.05em; font-family: monospace; margin-bottom: 12px;">
                              Warm regards,
                            </div>
                            <div style="font-size: 18px; font-weight: 800; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.2;">
                              Prince
                            </div>
                            <div style="font-size: 12px; color: #f04e00; margin-top: 4px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-transform: uppercase; letter-spacing: 0.1em;">
                              Portfolio Website
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Divider -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0 24px 0;">
                        <tr>
                          <td style="border-top: 1px solid #1c1c1e; height: 1px;"></td>
                        </tr>
                      </table>
                      
                      <!-- Footer Section -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td align="center" style="font-size: 11px; font-weight: 700; color: #52525b; text-transform: uppercase; letter-spacing: 0.2em; font-family: monospace;">
                            Sent via Prince Portfolio &bull; ${timestamp}
                          </td>
                        </tr>
                      </table>
                      
                    </td>
                  </tr>
                </table>
                
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    // ── 7. SEND EMAILS ──
    // Send email to owner (ME) first
    await transporter.sendMail(adminMailOptions);

    // Send user acknowledgement email separately in a non-blocking try/catch
    try {
      await transporter.sendMail(userMailOptions);
    } catch (userEmailError) {
      console.error("Error sending Contact Form user acknowledgement email:", userEmailError);
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Nodemailer service error caught in try/catch:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}
