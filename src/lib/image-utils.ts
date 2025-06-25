import type { ProjectImage } from "@/src/types/project";
import imageMetadata from "@/src/lib/image-metadata";

export const processImages = (imageFiles: string[]): ProjectImage[] => {
  return imageFiles.map((filePath) => {
    // Извлекаем имя файла без расширения
    const fileName = filePath
      .split("/")
      .pop()
      ?.replace(/\.(png|jpe?g|svg|webp)$/i, "");

    // Получаем ключ для поиска в метаданных (например, "LB1", "PB2", "HF1")
    const key = fileName || "";

    // Ищем метаданные по ключу
    const metadata = imageMetadata[key] || {
      title: `Проект ${key}`,
      description: `Описание проекта ${key} временно недоступно`,
    };

    // Определяем категорию по пути к файлу
    const category = getCategoryFromPath(filePath);

    return {
      src: filePath,
      title: metadata.title,
      description: metadata.description,
      category: category,
    };
  });
};

export const getCategoryFromPath = (path: string): string => {
  const categoryMap: Record<string, string> = {
    AgriculturalFacilities: "Сельскохозяйственные объекты",
    HealthFacilities: "Медицинские учреждения",
    LivingBuilding: "Жилые здания",
    GeneralPlans: "Генеральные планы",
    SportBuildings: "Спортивные сооружения",
    SchoolInstitutions: "Образовательные учреждения",
    PublicBuildings: "Общественные здания",
  };

  for (const [key, value] of Object.entries(categoryMap)) {
    if (path.includes(key)) {
      return value;
    }
  }

  return "Другие проекты";
};
