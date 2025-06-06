"use client";

import type React from "react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { sendEmail, type FormData } from "@/actions/send-email";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Имя должно содержать не менее 2 символов";
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Введите корректный email";
    }

    if (!formData.message || formData.message.length < 10) {
      newErrors.message = "Сообщение должно содержать не менее 10 символов";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const result = await sendEmail(formData);

      if (result.success) {
        setSubmitStatus("success");
        toast({
          title: "Заявка отправлена!",
          description: "Мы свяжемся с вами в ближайшее время.",
        });

        // Сбросить форму после успешной отправки
        setFormData({ name: "", email: "", phone: "", message: "" });

        // Закрыть модальное окно через 2 секунды
        setTimeout(() => {
          onClose();
          setSubmitStatus("idle");
        }, 2000);
      } else {
        setSubmitStatus("error");
        toast({
          title: "Ошибка отправки",
          description: result.message || "Произошла ошибка при отправке заявки",
          variant: "destructive",
        });
      }
    } catch (error) {
      setSubmitStatus("error");
      toast({
        title: "Ошибка отправки",
        description: "Произошла ошибка при отправке заявки",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value,
    }));

    // Очистить ошибку при изменении поля
    if (errors[name]) {
      setErrors((prev: Record<string, string>) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Оставить заявку
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {submitStatus === "success" ? (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Заявка отправлена!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Спасибо за обращение. Мы свяжемся с вами в ближайшее время.
                  </p>
                </motion.div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label
                    htmlFor="name"
                    className="flex items-center justify-between"
                  >
                    <span>Имя *</span>
                    {errors.name && (
                      <span className="text-xs text-red-500">
                        {errors.name}
                      </span>
                    )}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Ваше имя"
                    className={errors.name ? "border-red-500" : ""}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="flex items-center justify-between"
                  >
                    <span>Email *</span>
                    {errors.email && (
                      <span className="text-xs text-red-500">
                        {errors.email}
                      </span>
                    )}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className={errors.email ? "border-red-500" : ""}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+7 (999) 123-45-67"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="message"
                    className="flex items-center justify-between"
                  >
                    <span>Сообщение *</span>
                    {errors.message && (
                      <span className="text-xs text-red-500">
                        {errors.message}
                      </span>
                    )}
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Опишите ваш проект или задачу..."
                    rows={4}
                    className={errors.message ? "border-red-500" : ""}
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Отправка...
                    </>
                  ) : submitStatus === "error" ? (
                    <>
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Повторить отправку
                    </>
                  ) : (
                    <>
                      Отправить заявку
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                  Нажимая кнопку "Отправить заявку", вы соглашаетесь с нашей{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    политикой конфиденциальности
                  </a>
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
