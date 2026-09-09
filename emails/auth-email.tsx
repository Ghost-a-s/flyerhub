import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type AuthEmailProps = {
  actionLabel: string;
  appUrl: string;
  heading: string;
  preview: string;
  text: string;
  url: string;
};

export function AuthEmail({ actionLabel, appUrl, heading, preview, text, url }: AuthEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={brandSection}>
            <Img src={`${appUrl}/brand/at-logo.png`} alt="FlyerHub" width="82" height="48" style={logo} />
            <Text style={brandName}>FlyerHub</Text>
            <Text style={brandTagline}>Professional PSD Flyer Templates</Text>
          </Section>
          <Section style={content}>
            <Heading style={headingStyle}>{heading}</Heading>
            <Text style={copy}>{text}</Text>
            <Button href={url} style={button}>{actionLabel}</Button>
            <Text style={helper}>Or copy and paste this link into your browser:</Text>
            <Link href={url} style={link}>{url}</Link>
          </Section>
          <Section style={footer}>
            <Text style={footerText}>This email was requested for your FlyerHub account.</Text>
            <Text style={footerText}>If you did not request it, you can safely ignore this message.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = { backgroundColor: "#f4f7fb", fontFamily: "Arial, Helvetica, sans-serif", margin: "0", padding: "32px 12px" };
const container = { backgroundColor: "#ffffff", border: "1px solid #e5eaf2", borderRadius: "20px", margin: "0 auto", maxWidth: "600px", overflow: "hidden" };
const brandSection = { background: "linear-gradient(135deg, #3730a3 0%, #4f46e5 55%, #7c3aed 100%)", padding: "30px 40px", textAlign: "center" as const };
const logo = { display: "block", height: "48px", margin: "0 auto 14px", objectFit: "contain" as const, width: "82px" };
const brandName = { color: "#ffffff", fontSize: "22px", fontWeight: "700", lineHeight: "28px", margin: "0" };
const brandTagline = { color: "#dbeafe", fontSize: "13px", lineHeight: "20px", margin: "5px 0 0" };
const content = { padding: "38px 40px 34px" };
const headingStyle = { color: "#191725", fontSize: "28px", fontWeight: "700", letterSpacing: "-0.4px", lineHeight: "36px", margin: "0 0 16px" };
const copy = { color: "#475569", fontSize: "16px", lineHeight: "25px", margin: "0 0 28px" };
const button = { backgroundColor: "#4f46e5", borderRadius: "9px", color: "#ffffff", display: "inline-block", fontSize: "16px", fontWeight: "700", padding: "14px 22px", textDecoration: "none" };
const helper = { color: "#64748b", fontSize: "13px", lineHeight: "20px", margin: "30px 0 6px" };
const link = { color: "#4f46e5", fontSize: "12px", lineHeight: "18px", overflowWrap: "anywhere" as const, textDecoration: "underline" };
const footer = { backgroundColor: "#f8fafc", borderTop: "1px solid #e5eaf2", padding: "20px 40px" };
const footerText = { color: "#94a3b8", fontSize: "12px", lineHeight: "18px", margin: "0 0 4px" };
