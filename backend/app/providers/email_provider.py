import smtplib
from email.mime.text import MIMEText

from app.config.settings import settings
from app.core.exceptions import (
    IntegrationNotConfiguredException,
    IntegrationRequestException,
)


class EmailProvider:
    """
    Email delivery client using an SMTP server via Python's stdlib smtplib.

    Works with any standard SMTP provider (e.g. Gmail SMTP, SendGrid SMTP
    relay, Amazon SES SMTP, Mailgun SMTP, a corporate mail server, etc.) -
    the specific provider is determined entirely by which SMTP_HOST/creds are
    configured in the environment.
    """

    @classmethod
    def send_email(cls, to: str, subject: str, body: str) -> None:

        if not settings.SMTP_HOST or not settings.SMTP_USER or not settings.SMTP_PASSWORD:
            raise IntegrationNotConfiguredException("Email (SMTP)")

        from_email = settings.SMTP_FROM_EMAIL or settings.SMTP_USER

        message = MIMEText(body, "plain")
        message["Subject"] = subject
        message["From"] = from_email
        message["To"] = to

        try:
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as server:

                server.starttls()

                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)

                server.send_message(message)

        except smtplib.SMTPException as exc:
            raise IntegrationRequestException("Email (SMTP)", str(exc))
        except OSError as exc:
            raise IntegrationRequestException("Email (SMTP)", str(exc))
