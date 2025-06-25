"use client";

import { useState, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Ruler,
  FileSpreadsheet,
  Compass,
  Lightbulb,
  Workflow,
  X,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { GlassCard } from "@/src/components/common/glass-card";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogClose,
  MorphingDialogDescription,
  MorphingDialogContainer,
} from "@/src/components/ui/morphing-dialog";

const services = [
  {
    icon: <Building2 className="h-8 w-8 text-blue-600" />,
    title: "Архитектурное проектирование",
    description:
      "Разработка архитектурных концепций и проектной документации для зданий различного назначения",
    details:
      "Наша команда архитекторов разрабатывает уникальные проекты, учитывающие все пожелания заказчика, особенности участка и климатические условия региона. Мы создаем функциональные и эстетически привлекательные решения для жилых, общественных и промышленных зданий.",
  },
  {
    icon: <Ruler className="h-8 w-8 text-blue-600" />,
    title: "Конструктивные решения",
    description:
      "Проектирование конструктивных элементов зданий с учетом климатических и сейсмических особенностей",
    details:
      "Наши инженеры-конструкторы разрабатывают надежные и экономичные конструктивные решения, учитывающие особенности вечной мерзлоты и сейсмической активности региона. Мы используем современные методы расчета и моделирования для обеспечения безопасности и долговечности зданий.",
  },
  {
    icon: <FileSpreadsheet className="h-8 w-8 text-blue-600" />,
    title: "Инженерные системы",
    description:
      "Проектирование инженерных сетей: отопление, вентиляция, водоснабжение, канализация, электроснабжение",
    details:
      "Мы проектируем все виды инженерных систем для зданий и сооружений: отопление, вентиляцию и кондиционирование, водоснабжение и канализацию, электроснабжение и освещение, слаботочные системы. Наши решения обеспечивают комфорт, энергоэффективность и надежность.",
  },
  {
    icon: <Compass className="h-8 w-8 text-blue-600" />,
    title: "Генеральное планирование",
    description:
      "Разработка генеральных планов территорий, планировка земельных участков",
    details:
      "Наши специалисты разрабатывают генеральные планы территорий различного назначения, от частных участков до крупных промышленных комплексов. Мы учитываем особенности рельефа, инженерно-геологические условия, существующую застройку и инфраструктуру.",
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-blue-600" />,
    title: "Энергоэффективность",
    description:
      "Проектирование с учетом современных требований энергоэффективности и экологичности",
    details:
      "Мы разрабатываем энергоэффективные решения, позволяющие снизить эксплуатационные расходы и уменьшить негативное воздействие на окружающую среду. Наши проекты соответствуют современным требованиям по энергосбережению и могут быть сертифицированы по стандартам зеленого строительства.",
  },
  {
    icon: <Workflow className="h-8 w-8 text-blue-600" />,
    title: "Авторский надзор",
    description:
      "Контроль соответствия выполняемых строительных работ проектной документации",
    details:
      "Наши специалисты осуществляют авторский надзор на всех этапах строительства, контролируя соответствие выполняемых работ проектной документации. Мы оперативно решаем возникающие вопросы, вносим необходимые корректировки и обеспечиваем высокое качество реализации проекта.",
  },
];

const AllServicesModal = memo(
  ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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
              className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-10 bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      Наши услуги
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      Полный комплекс услуг по проектированию объектов
                      различного назначения
                    </p>
                  </div>

                  <div className="overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                    <div className="space-y-8">
                      {services.map((service, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0"
                        >
                          <div className="flex items-start gap-4">
                            <div className="mt-1">{service.icon}</div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-2">
                                {service.title}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-300 mb-3">
                                {service.description}
                              </p>
                              <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                                {service.details}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

const OptimizedParticles = memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 15 }, (_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-purple-400 dark:bg-purple-500 rounded-full opacity-60 will-change-transform"
        animate={{
          x: [Math.random() * 1920, Math.random() * 1920],
          y: [Math.random() * 1080, Math.random() * 1080],
          scale: [0, 1, 0],
          opacity: [0, 0.8, 0],
        }}
        transition={{
          duration: Math.random() * 3 + 2,
          repeat: Number.POSITIVE_INFINITY,
          delay: Math.random() * 2,
          ease: "linear",
        }}
      />
    ))}
  </div>
));

export const Services = memo(() => {
  const [isAllServicesOpen, setIsAllServicesOpen] = useState(false);

  const handleMoreServicesClick = useCallback(() => {
    setIsAllServicesOpen(true);
  }, []);

  const handleCloseAllServicesModal = useCallback(() => {
    setIsAllServicesOpen(false);
  }, []);

  return (
    <section id="services" className="relative py-20 overflow-hidden">
      <OptimizedParticles />

      {/* Декор */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-[15%] -right-[15%] w-[50%] h-[50%] rounded-full border-2 border-purple-200/30 dark:border-purple-500/20 will-change-transform"
          animate={{ rotate: 360 }}
          transition={{
            duration: 120,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full border-2 border-pink-200/30 dark:border-pink-500/20 will-change-transform"
          animate={{ rotate: -360 }}
          transition={{
            duration: 100,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Наши услуги
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Предоставляем полный комплекс услуг по проектированию объектов
            различного назначения, от концепции до реализации
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => (
            <MorphingDialog
              key={index}
              transition={{
                type: "spring",
                bounce: 0.05,
                duration: 0.25,
              }}
            >
              <MorphingDialogTrigger
                style={{
                  borderRadius: "16px",
                }}
              >
                <GlassCard
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  index={index}
                  variant="purple"
                >
                  <div />
                </GlassCard>
              </MorphingDialogTrigger>
              <MorphingDialogContainer>
                <MorphingDialogContent
                  style={{
                    borderRadius: "24px",
                  }}
                  className="pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-300/40 dark:border-white/10 sm:w-[600px] max-w-[90vw]"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 flex-shrink-0">
                        {service.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <MorphingDialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight break-words hyphens-auto pr-8">
                          {service.title}
                        </MorphingDialogTitle>
                        <MorphingDialogSubtitle className="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base leading-relaxed">
                          {service.description}
                        </MorphingDialogSubtitle>
                      </div>
                    </div>
                    <MorphingDialogDescription
                      disableLayoutAnimation
                      variants={{
                        initial: { opacity: 0, scale: 0.8, y: 100 },
                        animate: { opacity: 1, scale: 1, y: 0 },
                        exit: { opacity: 0, scale: 0.8, y: 100 },
                      }}
                    >
                      <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                        <p>{service.details}</p>
                      </div>
                    </MorphingDialogDescription>
                  </div>
                  <MorphingDialogClose className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" />
                </MorphingDialogContent>
              </MorphingDialogContainer>
            </MorphingDialog>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button size="lg" variant="outline" onClick={handleMoreServicesClick}>
            Узнать больше о наших услугах
          </Button>
        </motion.div>
      </div>

      <AllServicesModal
        isOpen={isAllServicesOpen}
        onClose={handleCloseAllServicesModal}
      />
    </section>
  );
});

Services.displayName = "Services";