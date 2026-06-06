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

    const { email, botField } = body;

    // ── 1. SPAM PREVENTION (HONEYPOT) ──
    if (botField && botField.trim() !== "") {
      console.warn("Honeypot triggered by spam bot in newsletter. Silently ignoring.");
      return NextResponse.json(
        { success: true, message: "Subscribed successfully." },
        { status: 200 }
      );
    }

    // ── 2. INPUT SANITIZATION & VALIDATION ──
    const sanitizedEmail = sanitize(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!sanitizedEmail || !emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // ── 3. CONFIGURE NODEMAILER TRANSPORT ──
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
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const escapedEmail = escapeHtml(sanitizedEmail);

    // ── 4. EMAIL TO OWNER (ME) ──
    const ownerMailOptions = {
      from: `"Newsletter System" <${emailUser}>`,
      to: emailUser,
      replyTo: sanitizedEmail,
      subject: "New Newsletter Subscriber",
      html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title>New Newsletter Subscriber</title>
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
              .message-padding {
                padding: 24px 20px !important;
              }
            }
          </style>
        </head>
        <body style="background-color: #050505; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
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
                              New Subscriber
                            </h2>
                            <p style="font-size: 15px; color: #8e8e93; margin: 0; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                              Someone joined your newsletter.
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
                      
                      <!-- Subscriber Info Area -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0e0e11; border: 1px solid #1c1c1e; border-left: 3px solid #f04e00; border-radius: 12px;">
                        <tr>
                          <td class="message-padding" style="padding: 32px 36px;">
                            <div style="font-size: 11px; font-weight: 700; color: #8e8e93; letter-spacing: 0.08em; text-transform: uppercase; font-family: monospace; margin-bottom: 8px;">
                              Subscriber Email
                            </div>
                            <div style="font-size: 18px; line-height: 1.4; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 700; word-break: break-all;">
                              ${escapedEmail}
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
                            Newsletter Audience Growing
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

    // ── 5. EMAIL TO SUBSCRIBER (WELCOME) ──
    const subscriberMailOptions = {
      from: `"Prince Rawat" <${emailUser}>`,
      to: sanitizedEmail,
      subject: "Welcome to Prince",
      html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title>Welcome to Prince</title>
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
                              Welcome to Prince
                            </h2>
                            <p style="font-size: 15px; color: #8e8e93; margin: 0; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                              Thank you for subscribing.
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
                          <td style="font-size: 16px; line-height: 1.6; color: #ffffff; font-weight: 700; padding-bottom: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                            Hello,
                          </td>
                        </tr>
                        <tr>
                          <td style="font-size: 15px; line-height: 1.6; color: #a1a1aa; padding-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                            Thank you for subscribing and becoming part of the Prince community.
                          </td>
                        </tr>
                        <tr>
                          <td style="font-size: 15px; line-height: 1.6; color: #a1a1aa; padding-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                            I'm excited to share future projects, creative insights, ideas, and updates with you.
                          </td>
                        </tr>
                        <tr>
                          <td style="font-size: 15px; line-height: 1.6; color: #a1a1aa; padding-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                            You'll occasionally receive carefully curated content and portfolio updates.
                          </td>
                        </tr>
                        <tr>
                          <td style="font-size: 15px; line-height: 1.6; color: #a1a1aa; padding-bottom: 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                            I'm glad to have you here.
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
                            Sent via Prince Portfolio
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

    // ── 6. SEND EMAILS ──
    // Send critical email to owner (ME) first
    await transporter.sendMail(ownerMailOptions);

    // Send subscriber welcome email separately in a non-blocking try/catch
    try {
      await transporter.sendMail(subscriberMailOptions);
    } catch (subscriberEmailError) {
      console.error("Error sending Newsletter subscriber welcome email:", subscriberEmailError);
    }

    return NextResponse.json(
      { success: true, message: "Subscribed successfully!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Nodemailer service error caught in try/catch (newsletter):", error);
    return NextResponse.json(
      { success: false, message: "Failed to subscribe. Please try again later." },
      { status: 500 }
    );
  }
}
