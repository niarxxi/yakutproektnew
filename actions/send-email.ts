"use server";
import { z } from "zod";
import nodemailer from "nodemailer";

// Схема валидации для формы
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Имя должно содержать не менее 2 символов" }),
  email: z.string().email({ message: "Введите корректный email" }),
  phone: z.string().optional(),
  message: z
    .string()
    .min(10, { message: "Сообщение должно содержать не менее 10 символов" }),
});

export type FormData = z.infer<typeof formSchema>;

// Создание транспортера для отправки email
const createTransporter = () => {
  // Проверяем наличие переменных окружения
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      "EMAIL_USER и EMAIL_PASS должны быть установлены в переменных окружения"
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export async function sendEmail(formData: FormData) {
  try {
    // Валидация данных формы
    const validatedData = formSchema.parse(formData);

    // Создание транспортера
    const transporter = createTransporter();

    // Настройка письма
    const mailOptions = {
      from: `"Заявка с сайта" <${process.env.EMAIL_USER}>`,
      to: "yakutproekt@mail.ru",
      subject: `Новая заявка от ${validatedData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px; background-color: #ffffff;">
            <h2 style="color: #333; margin-bottom: 20px; text-align: center;">
              📧 Новая заявка с сайта
            </h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">
                    <strong style="color: #495057;">👤 Имя:</strong>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; text-align: right;">
                    ${validatedData.name}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">
                    <strong style="color: #495057;">📧 Email:</strong>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; text-align: right;">
                    <a href="mailto:${
                      validatedData.email
                    }" style="color: #007bff; text-decoration: none;">
                      ${validatedData.email}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">
                    <strong style="color: #495057;">📱 Телефон:</strong>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; text-align: right;">
                    ${validatedData.phone || "Не указан"}
                  </td>
                </tr>
              </table>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #495057; margin-bottom: 10px;">💬 Сообщение:</h3>
              <div style="background: #ffffff; border: 1px solid #dee2e6; border-radius: 4px; padding: 15px; white-space: pre-wrap;">
${validatedData.message}
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
              <p style="color: #6c757d; font-size: 14px; margin: 0;">
                🕐 Письмо отправлено: ${new Date().toLocaleString("ru-RU", {
                  timeZone: "Europe/Moscow",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
Новая заявка с сайта

Имя: ${validatedData.name}
Email: ${validatedData.email}
Телефон: ${validatedData.phone || "Не указан"}

Сообщение:
${validatedData.message}

Отправлено: ${new Date().toLocaleString("ru-RU")}
      `,
    };

    // Отправка письма
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Письмо успешно отправлено на yakutproekt@mail.ru");
    console.log("Message ID:", info.messageId);

    return {
      success: true,
      message:
        "Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.",
    };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path}: ${err.message}`)
        .join(", ");
      console.error("❌ Ошибка валидации:", errorMessages);
      return { success: false, message: `Ошибка валидации: ${errorMessages}` };
    }

    console.error("❌ Ошибка отправки email:", error);
    return {
      success: false,
      message:
        "Произошла ошибка при отправке заявки. Попробуйте позже или свяжитесь с нами напрямую.",
    };
  }
}
